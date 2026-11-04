#!/usr/bin/env node
// PostToolUse hook (Edit|Write|MultiEdit): format and lint ONLY the file that was just changed.
// Commands come from .flow/config.json -> post_edit.format / post_edit.lint, with {file} replaced by the path.
// Empty commands = the hook does nothing (fast no-op). Formatting never blocks; a lint error is sent back to
// Claude (exit 2) so it fixes it while it still remembers the edit. Each command has a short timeout.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { kitBase, readInput, readJson } from './lib.mjs';

const input = await readInput();
const base = kitBase(input.cwd);
const cfg = readJson(path.join(base, '.flow', 'config.json'), {});
const pe = cfg.post_edit || {};
const file = input.tool_input?.file_path || '';
if (!file || !fs.existsSync(file) || (!pe.format && !pe.lint)) process.exit(0);

const r = path.relative(base, path.resolve(file)).split(path.sep).join('/');
const exts = pe.extensions || ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.json'];
if (r.startsWith('..') || r.startsWith('product/') || r.startsWith('work/') || r.startsWith('.flow/') || !exts.includes(path.extname(r))) process.exit(0);

const run = (tpl, timeout) => spawnSync(tpl.replaceAll('{file}', JSON.stringify(r)), { cwd: base, shell: true, encoding: 'utf8', timeout });
if (pe.format) run(pe.format, (pe.timeout_s || 15) * 1000); // best effort: a formatter failure is not the agent's problem
if (pe.lint) {
  const l = run(pe.lint, (pe.timeout_s || 15) * 1000);
  if (l.error?.code === 'ETIMEDOUT') process.exit(0); // too slow: the Stop hook runs the full checks anyway
  if (l.status !== 0) {
    const out = ((l.stdout || '') + (l.stderr || '')).trim().split('\n').slice(-20).join('\n');
    process.stderr.write(`Lint errors in ${r} (fix them now, before moving on):\n${out}\n`);
    process.exit(2);
  }
}
process.exit(0);
