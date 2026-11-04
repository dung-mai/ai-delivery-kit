#!/usr/bin/env node
// Notification hook: Claude Code is waiting for you (permission, question, idle). Toast + bell (+ ntfy if configured).
import { kitBase, notify, readInput } from './lib.mjs';

const input = await readInput();
notify(kitBase(input.cwd), 'Claude Code cần bạn', String(input.message || 'đang chờ').slice(0, 120));
