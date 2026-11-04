#!/usr/bin/env node
// Stop hook. 1) records tokens and an estimate of human/machine time for this session from the transcript,
// 2) runs the framework checks and, when code changed, the project checks; on failure exit 2 so Claude fixes them,
// 3) regenerates work/BOARD.md.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { flow, kitBase, readInput, readJson } from './lib.mjs';

const input = await readInput();
const base = kitBase(input.cwd);
const cfg = readJson(path.join(base, '.flow', 'config.json'), {});

// ---- 1. effort from the transcript (JSONL) ----
const HUMAN_GAP_CAP_MIN = 20; // a gap longer than this is a break, not review time
try {
  const lines = fs.readFileSync(input.transcript_path, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const seen = new Set();
  let tokens = 0, model = '', humanMs = 0, machineMs = 0;
  let lastAssistant = null, turnStart = null;
  const isHumanPrompt = (e) => e.type === 'user' && !e.isMeta && !(Array.isArray(e.message?.content) && e.message.content.some((c) => c.type === 'tool_result'));
  for (const e of lines) {
    const ts = Date.parse(e.timestamp || '');
    if (e.type === 'assistant') {
      const id = e.message?.id || e.uuid;
      const u = e.message?.usage;
      if (u && !seen.has(id)) {
        seen.add(id);
        tokens += (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.output_tokens || 0);
        model = e.message?.model || model;
      }
      if (ts) lastAssistant = ts;
    } else if (isHumanPrompt(e) && ts) {
      if (lastAssistant && turnStart) machineMs += Math.max(0, lastAssistant - turnStart);
      if (lastAssistant) humanMs += Math.min(Math.max(0, ts - lastAssistant), HUMAN_GAP_CAP_MIN * 60_000);
      turnStart = ts;
      lastAssistant = null;
    }
  }
  if (lastAssistant && turnStart) machineMs += Math.max(0, lastAssistant - turnStart);
  if (input.session_id) flow(base, 'effort', 'session', input.session_id, String(tokens), String(Math.round(humanMs / 60_000)), String(Math.round(machineMs / 60_000)), model);
  const cap = (cfg.budget?.session_tokens_m || 0) * 1e6;
  if (cap && tokens > cap && !input.stop_hook_active) process.stderr.write(`Note: this session used ${(tokens / 1e6).toFixed(1)}M tokens (budget ${cfg.budget.session_tokens_m}M). Tell the human and suggest /compact or a fresh session for the next step.\n`);
} catch { /* no transcript: nothing to record */ }

// avoid loops: when Claude is already continuing because of this hook, let it stop
if (input.stop_hook_active) { flow(base, 'board'); process.exit(0); }

// ---- 2. checks ----
const problems = [];
const fc = flow(base, 'check');
if (fc.status !== 0) problems.push((fc.stdout || '') + (fc.stderr || ''));

const codeDirs = (cfg.code_dirs || ['apps', 'packages', 'src']).filter((d) => fs.existsSync(path.join(base, d)));
const changed = codeDirs.length && (spawnSync('git', ['status', '--porcelain', '--', ...codeDirs], { cwd: base, encoding: 'utf8' }).stdout || '').trim();
if (changed) {
  for (const c of cfg.checks || []) {
    const r = spawnSync(c, { cwd: base, shell: true, encoding: 'utf8', timeout: 600_000 });
    if (r.status !== 0) { problems.push(`$ ${c}\n` + ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-25).join('\n')); break; }
  }
}
flow(base, 'board');
if (problems.length) {
  process.stderr.write('Checks failed. Fix these before stopping (or explain to the human why they cannot be fixed now):\n\n' + problems.join('\n\n') + '\n');
  process.exit(2);
}
process.exit(0);
