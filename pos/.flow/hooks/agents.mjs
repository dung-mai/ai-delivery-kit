#!/usr/bin/env node
// SubagentStart / SubagentStop hooks: record which subagents run and for how long (.flow/state/agents/<id>.json).
// Used by the status line, `flow.mjs watch` and `flow.mjs timeline`. Never blocks.
import fs from 'node:fs';
import path from 'node:path';
import { kitBase, readInput, readJson } from './lib.mjs';

const input = await readInput();
const base = kitBase(input.cwd);
const id = String(input.agent_id || '').replace(/[^\w-]/g, '');
if (!id) process.exit(0);
const dir = path.join(base, '.flow', 'state', 'agents');
fs.mkdirSync(dir, { recursive: true });
const f = path.join(dir, `${id}.json`);
const now = new Date().toISOString();
if (process.argv[2] === 'start') {
  fs.writeFileSync(f, JSON.stringify({ type: input.agent_type || 'agent', session: input.session_id || '', started: now, status: 'running' }));
} else {
  const a = readJson(f, { type: input.agent_type || 'agent', started: now });
  fs.writeFileSync(f, JSON.stringify({ ...a, status: 'done', ended: now }));
}
// keep the folder small: drop finished entries older than 7 days
for (const x of fs.readdirSync(dir)) {
  const a = readJson(path.join(dir, x), null);
  if (a?.ended && Date.now() - Date.parse(a.ended) > 7 * 86400_000) fs.rmSync(path.join(dir, x), { force: true });
}
