#!/usr/bin/env node
// Stop hook. 1) records tokens and an estimate of human/machine time for this session from the transcript,
// 2) runs the framework checks and, when code changed, the project checks; on failure exit 2 so Claude fixes them,
// 3) regenerates work/BOARD.md.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
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
  let tokens = 0, cacheRead = 0, peakCtx = 0, model = '', humanMs = 0, machineMs = 0;
  let lastAssistant = null, turnStart = null;
  const isHumanPrompt = (e) => e.type === 'user' && !e.isMeta && !(Array.isArray(e.message?.content) && e.message.content.some((c) => c.type === 'tool_result'));
  for (const e of lines) {
    const ts = Date.parse(e.timestamp || '');
    if (e.type === 'assistant') {
      const id = e.message?.id || e.uuid;
      const u = e.message?.usage;
      if (u && !seen.has(id)) {
        seen.add(id);
        // fresh = what really costs quota; cache reads are re-reads of the same context at a fraction of the price
        tokens += (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.output_tokens || 0);
        cacheRead += u.cache_read_input_tokens || 0;
        peakCtx = Math.max(peakCtx, (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0));
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
  if (input.session_id) flow(base, 'effort', 'session', input.session_id, String(tokens), String(Math.round(humanMs / 60_000)), String(Math.round(machineMs / 60_000)), model, String(cacheRead), String(peakCtx));
  // The real quota is the 5h % on the status line. What we can control is context size: every turn re-reads it.
  const ctxCap = (cfg.budget?.context_k || 120) * 1000;
  if (peakCtx > ctxCap && !input.stop_hook_active) process.stderr.write(`Note: the context of this session reached ${Math.round(peakCtx / 1000)}k tokens; every turn re-reads it. Checkpoint the current step and continue in a fresh session (/clear): the state is in the repo files.\n`);
} catch { /* no transcript: nothing to record */ }

// avoid loops: when Claude is already continuing because of this hook, let it stop
if (input.stop_hook_active) { flow(base, 'board'); process.exit(0); }

// ---- 2. checks ----
const problems = [];
const fc = flow(base, 'check');
if (fc.status !== 0) problems.push((fc.stdout || '') + (fc.stderr || ''));

// Project checks only when code changed AND that exact state has not passed before: a chat turn that only
// discusses or edits docs, or a second stop on the same code, costs nothing.
const codeDirs = (cfg.code_dirs || ['apps', 'packages', 'src']).filter((d) => fs.existsSync(path.join(base, d)));
const git = (...a) => spawnSync('git', a, { cwd: base, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).stdout || '';
const changed = codeDirs.length && git('status', '--porcelain', '--untracked-files=all', '--', ...codeDirs).trim();
// untracked files are not in `git diff`: fingerprint them by size + mtime
const untracked = () => changed.split('\n').filter((l) => l.startsWith('??')).map((l) => { const f = l.slice(3); try { const s = fs.statSync(path.join(base, f)); return `${f}:${s.size}:${s.mtimeMs}`; } catch { return f; } }).join('|');
if (changed && (cfg.checks || []).length) {
  const fp = createHash('sha1').update(git('rev-parse', 'HEAD') + changed + untracked() + git('diff', 'HEAD', '--', ...codeDirs)).digest('hex');
  const lastFile = path.join(base, '.flow', 'state', 'last-check.json');
  const last = readJson(lastFile, {});
  if (last.fp !== fp || !last.ok) {
    let ok = true;
    for (const c of cfg.checks) {
      const r = spawnSync(c, { cwd: base, shell: true, encoding: 'utf8', timeout: 600_000 });
      if (r.status !== 0) { ok = false; problems.push(`$ ${c}\n` + ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-25).join('\n')); break; }
    }
    fs.writeFileSync(lastFile, JSON.stringify({ fp, ok, at: new Date().toISOString() }));
  }
}
flow(base, 'board');
if (problems.length) {
  process.stderr.write('Checks failed. Fix these before stopping (or explain to the human why they cannot be fixed now):\n\n' + problems.join('\n\n') + '\n');
  process.exit(2);
}
process.exit(0);
