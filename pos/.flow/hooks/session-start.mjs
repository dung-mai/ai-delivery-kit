#!/usr/bin/env node
// SessionStart hook: mark what was interrupted, regenerate the board and print the top of it,
// so the conductor starts every session (new, resumed, after /clear or compaction) with the current state.
import fs from 'node:fs';
import path from 'node:path';
import { flow, kitBase, readInput } from './lib.mjs';

const input = await readInput();
const base = kitBase(input.cwd);
const rr = flow(base, 'resume-report', '--fix', '--at-start');
flow(base, 'board');
const board = (() => { try { return fs.readFileSync(path.join(base, 'work', 'BOARD.md'), 'utf8'); } catch { return ''; } })();
const top = board.split('\n').slice(0, 40).join('\n');
const interrupted = (rr.stdout || '').includes('Bị dừng giữa chừng') ? `\n\n${rr.stdout.trim()}\nHandle these first (see the flow skill, "resume").` : '';
process.stdout.write(`AI Delivery Kit v2 is active in ${base}. Current board (work/BOARD.md):\n\n${top}${interrupted}\n\nUse the flow skill (/flow) to continue.\n`);
