#!/usr/bin/env node
// SessionStart hook: regenerate the board and print its top part, so the conductor starts with the current state.
import fs from 'node:fs';
import path from 'node:path';
import { flow, kitBase, readInput } from './lib.mjs';

const input = await readInput();
const base = kitBase(input.cwd);
flow(base, 'board');
const board = (() => { try { return fs.readFileSync(path.join(base, 'work', 'BOARD.md'), 'utf8'); } catch { return ''; } })();
const top = board.split('\n').slice(0, 40).join('\n');
process.stdout.write(`AI Delivery Kit v2 is active in ${base}. Current board (work/BOARD.md):\n\n${top}\n\nUse the flow skill (/flow) to continue.\n`);
