#!/usr/bin/env node
// Claude Code status line: always-visible flow state under the prompt. Must be fast: reads small JSON files only.
//   line 1: project · recipe › phase · slice · needs you
//   line 2: running subagents and jobs · Claude 5h quota · context
// Also saves the rate-limit numbers to .flow/state/usage.json so the conductor and `flow.mjs watch` can see them.
import fs from 'node:fs';
import path from 'node:path';
import { kitBase, readInput, readJson } from './lib.mjs';

const input = await readInput();
const base = kitBase(input.workspace?.project_dir || input.cwd);
const st = path.join(base, '.flow', 'state');
const sum = readJson(path.join(st, 'summary.json'), {});
const cfg = readJson(path.join(base, '.flow', 'config.json'), {});
const tty = !process.env.NO_COLOR;
const c = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);

const rl = input.rate_limits || {};
if (rl.five_hour || rl.seven_day) {
  try {
    fs.mkdirSync(st, { recursive: true });
    fs.writeFileSync(path.join(st, 'usage.json'), JSON.stringify({ at: new Date().toISOString(), five_hour: rl.five_hour?.used_percentage ?? null, resets_at: rl.five_hour?.resets_at ?? null, seven_day: rl.seven_day?.used_percentage ?? null }));
  } catch {}
}

const list = (dir) => { try { return fs.readdirSync(path.join(st, dir)).filter((f) => f.endsWith('.json')).map((f) => readJson(path.join(st, dir, f), {})); } catch { return []; } };
const mins = (iso) => Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };

const agents = list('agents').filter((a) => a.status === 'running' && mins(a.started) < 180);
const jobs = list('jobs').filter((j) => j.status === 'running' && alive(j.runner));

const l1 = [c('1', `◆ ${cfg.project || path.basename(base)}`)];
l1.push(sum.recipe ? `${sum.recipe} › ${c('36', sum.phase || '-')}` : c('2', 'chưa bắt đầu: /flow "…"'));
if (sum.slices?.total) l1.push(`slice ${sum.slices.done}/${sum.slices.total}`);
if (sum.needYou) l1.push(c('33', `cần bạn: ${sum.needYou}${sum.blocking ? ` (⛔${sum.blocking})` : ''}`));
if (sum.checks) l1.push(c('31', `check: ${sum.checks}`));

const l2 = [];
if (agents.length) l2.push('⏳ ' + agents.map((a) => `${a.type || 'agent'} ${mins(a.started)}m`).join(', '));
if (jobs.length) l2.push('⚙ ' + jobs.map((j) => `${j.name} ${mins(j.started)}m`).join(', '));
if (!agents.length && !jobs.length) l2.push(c('2', 'không có việc nền'));
const five = rl.five_hour?.used_percentage;
if (five != null) l2.push((five >= 85 ? (s) => c('31', s) : five >= 60 ? (s) => c('33', s) : (s) => s)(`Claude 5h ${Math.round(five)}%`));
const ctx = input.context_window?.used_percentage;
if (ctx != null) l2.push(`context ${Math.round(ctx)}%`);

process.stdout.write(l1.join(' · ') + '\n' + l2.join(' · ') + '\n');
