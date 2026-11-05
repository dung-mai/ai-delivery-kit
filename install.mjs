#!/usr/bin/env node
// Install or update AI Delivery Kit v2 into a project folder.
//
//   node install.mjs <target-folder> [--project <name>] [--update]
//
// First install copies everything from kit/. --update refreshes only the framework parts
// (skills, subagents, recipes, templates, hooks, sensors) and never touches product/, work/,
// .flow/state/, .flow/config.json, AGENTS.md, CLAUDE.md or .claude/settings.json if they exist.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const kit = path.join(here, 'kit');
const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--project');
const project = args.includes('--project') ? args[args.indexOf('--project') + 1] : null;
const update = args.includes('--update');
if (!target) { console.log('Usage: node install.mjs <target-folder> [--project <name>] [--update]'); process.exit(1); }

const FRAMEWORK = ['.claude/skills', '.claude/agents', '.flow/recipes', '.flow/templates', '.flow/hooks', '.flow/sensors'];
const KEEP_IF_EXISTS = ['AGENTS.md', 'CLAUDE.md', '.claude/settings.json', '.flow/config.json'];
let copied = 0, kept = 0;

function copy(src, dst, overwrite) {
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const e of fs.readdirSync(src)) copy(path.join(src, e), path.join(dst, e), overwrite);
    return;
  }
  if (fs.existsSync(dst) && !overwrite) { kept++; return; }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  copied++;
}

const dst = path.resolve(target);
fs.mkdirSync(dst, { recursive: true });
if (update) {
  for (const p of FRAMEWORK) { fs.rmSync(path.join(dst, p), { recursive: true, force: true }); copy(path.join(kit, p), path.join(dst, p), true); }
  for (const p of KEEP_IF_EXISTS) copy(path.join(kit, p), path.join(dst, p), false);
  for (const p of ['product', 'work']) copy(path.join(kit, p), path.join(dst, p), false); // only adds missing skeleton files
  // new settings in the kit's config are added to the project's config; existing values are never changed
  const cf = path.join(dst, '.flow', 'config.json');
  const mine = JSON.parse(fs.readFileSync(cf, 'utf8'));
  const added = [];
  const merge = (a, b, pre) => { for (const [k, v] of Object.entries(b)) { if (!(k in a)) { a[k] = v; added.push(pre + k); } else if (v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) merge(a[k], v, `${pre}${k}.`); } };
  merge(mine, JSON.parse(fs.readFileSync(path.join(kit, '.flow', 'config.json'), 'utf8')), '');
  if (added.length) { fs.writeFileSync(cf, JSON.stringify(mine, null, 2) + '\n'); console.log(`config.json: added ${added.join(', ')}`); }
  // hooks the project does not have yet are added to .claude/settings.json the same way
  const sf = path.join(dst, '.claude', 'settings.json');
  const st = JSON.parse(fs.readFileSync(sf, 'utf8'));
  const kitSettings = JSON.parse(fs.readFileSync(path.join(kit, '.claude', 'settings.json'), 'utf8'));
  const kh = kitSettings.hooks || {};
  const newHooks = Object.keys(kh).filter((ev) => !(st.hooks || {})[ev]);
  if (!st.statusLine && kitSettings.statusLine) { st.statusLine = kitSettings.statusLine; console.log('settings.json: added statusLine'); }
  const allowAdd = (kitSettings.permissions?.allow || []).filter((x) => !(st.permissions?.allow || []).includes(x));
  if (allowAdd.length) { st.permissions = { ...(st.permissions || {}), allow: [...(st.permissions?.allow || []), ...allowAdd] }; console.log(`settings.json: allowed ${allowAdd.join(', ')}`); }
  if (newHooks.length) { st.hooks = { ...(st.hooks || {}), ...Object.fromEntries(newHooks.map((ev) => [ev, kh[ev]])) }; console.log(`settings.json: added hooks ${newHooks.join(', ')}`); }
  fs.writeFileSync(sf, JSON.stringify(st, null, 2) + '\n');
} else {
  copy(kit, dst, false);
}

if (project) {
  const f = path.join(dst, '.flow', 'config.json');
  const c = JSON.parse(fs.readFileSync(f, 'utf8'));
  c.project = project;
  fs.writeFileSync(f, JSON.stringify(c, null, 2) + '\n');
}
fs.mkdirSync(path.join(dst, '.flow', 'state'), { recursive: true });
const gi = path.join(dst, '.gitignore');
const want = ['work/review-pack/', 'work/jobs/', '.worktrees/', '.flow/config.local.json', '.flow/state/agents/', '.flow/state/usage.json', '.flow/state/summary.json', '.flow/state/last-check.json', 'node_modules/'];
const cur = fs.existsSync(gi) ? fs.readFileSync(gi, 'utf8') : '';
const add = want.filter((l) => !cur.split('\n').includes(l));
if (add.length) fs.appendFileSync(gi, (cur && !cur.endsWith('\n') ? '\n' : '') + add.join('\n') + '\n');

console.log(`${update ? 'Updated' : 'Installed'} AI Delivery Kit v2 in ${dst}: ${copied} file copied, ${kept} kept.`);
console.log('Next: open Claude Code in that folder and type  /flow "<what you want to build>"');
