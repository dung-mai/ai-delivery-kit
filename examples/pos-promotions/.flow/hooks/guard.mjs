#!/usr/bin/env node
// PreToolUse hook (Edit|Write|MultiEdit|NotebookEdit|Bash). Exit 2 = block the call; stderr goes back to Claude.
// Blocks: edits to frozen files, edits/reads of .env, destructive shell commands, shell writes to frozen files.
import path from 'node:path';
import { kitBase, readInput, readJson } from './lib.mjs';

const input = await readInput();
const base = kitBase(input.cwd);
const tool = input.tool_name || '';
const ti = input.tool_input || {};
const frozen = readJson(path.join(base, '.flow', 'state', 'frozen.json'), {});
const relTo = (p) => path.relative(base, path.resolve(input.cwd || base, p)).split(path.sep).join('/');
const block = (msg) => { process.stderr.write(msg + '\n'); process.exit(2); };

if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(tool)) {
  const file = ti.file_path || ti.notebook_path || '';
  if (!file) process.exit(0);
  const r = relTo(file);
  if (frozen[r]) block(`Blocked: ${r} is frozen (QA-owned test or approved file). Do not change it to make code pass. If the file itself is wrong, explain why to the human; they can release it with: node .flow/sensors/flow.mjs freeze release ${r}`);
  if (/(^|\/)\.env(\.[\w-]+)?$/.test(r) && !/\.env\.example$/.test(r)) block(`Blocked: do not edit ${r}. Put new settings in .env.example and tell the human.`);
  if (/^work\/BOARD\.md$/.test(r) || /^work\/effort-ledger\.md$/.test(r)) block(`Blocked: ${r} is generated. Run node .flow/sensors/flow.mjs board (or effort ...) instead.`);
  if (/^\.flow\/state\//.test(r)) block(`Blocked: ${r} is flow state. Change it through node .flow/sensors/flow.mjs (phase, gate, freeze, effort).`);
  process.exit(0);
}

if (tool === 'Bash') {
  const cmd = String(ti.command || '');
  const dangerous = [
    [/git\s+push\s+.*(--force\b|\s-f\b)/, 'force push'],
    [/git\s+reset\s+--hard/, 'git reset --hard'],
    [/git\s+clean\s+-\w*f/, 'git clean -f'],
    [/\brm\s+-\w*r\w*\s+(\/|~|\.|\*)(\s|$)/, 'recursive delete of a root, home or current folder'],
    [/prisma\s+migrate\s+reset/, 'prisma migrate reset'],
    [/docker\s+compose\s+down\s+.*-v\b/, 'docker compose down -v (deletes volumes)'],
    [/(^|[\s;&|])(cat|less|more|head|tail|type)\s+[^|;&]*\.env(\s|$)/, 'reading .env'],
  ];
  for (const [re, what] of dangerous) if (re.test(cmd)) block(`Blocked by .flow/hooks/guard.mjs: ${what}. If it is really needed, ask the human to run it.`);
  const writes = /(>|\btee\b|\bsed\s+-i|\bperl\s+-pi|\bmv\b|\bcp\b|\brm\b|\btruncate\b|Set-Content|Out-File)/;
  for (const f of Object.keys(frozen)) {
    if (cmd.includes(f) && writes.test(cmd)) block(`Blocked: this command may change the frozen file ${f}. Frozen files can only be released by the human (flow.mjs freeze release).`);
  }
}
process.exit(0);
