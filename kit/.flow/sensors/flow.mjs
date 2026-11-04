#!/usr/bin/env node
// AI Delivery Kit v2 — deterministic helpers for the conductor, the hooks and the humans. No dependencies, Node >= 20.
//
//   node .flow/sensors/flow.mjs <command> [...]
//
//   start <recipe> "<goal>"        begin a piece of work (writes .flow/state/flow.json)
//   phase <step>                   record the current step
//   gate <name> <approved|changes|rejected> "<who>" ["note"]
//   board                          regenerate work/BOARD.md
//   check                          framework checks (ids, examples, frozen files, cards); exit 1 on problems
//   examples                       product/specs/*/examples.md tables -> examples.json
//   trace [--ids A,B]              requirement id -> tests (and, with --ids, every file that mentions them)
//   freeze add <paths..> | check | release <path> | list
//   effort log <minutes> "<note>" [--item X] | machine <engine> <tokens> "<note>" | done <item> [percent] | report
//   review-pack [--mark-approved] [--no-pdf]
import { execSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

// ---------- paths ----------
const root = (() => {
  try { return execSync('git rev-parse --show-toplevel', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return process.cwd(); }
})();
// the kit may live in a sub-folder of a git repo (e.g. pos/): use the folder that holds .flow/
const base = findBase(process.cwd()) || root;
process.chdir(base);
function findBase(dir) {
  for (let d = path.resolve(dir); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.flow', 'config.json'))) return d;
    if (path.dirname(d) === d) return null;
  }
}
const P = {
  config: '.flow/config.json',
  state: '.flow/state/flow.json',
  frozen: '.flow/state/frozen.json',
  effort: '.flow/state/effort.json',
  approved: '.flow/state/approved.json',
  board: 'work/BOARD.md',
  ledger: 'work/effort-ledger.md',
  specs: 'product/specs',
  decisions: 'product/decisions',
  changes: 'product/changes',
  map: 'product/map.md',
  slices: 'product/plan/slices.md',
};
const cfg = readJson(P.config, {});
const ID_RE = /\b([A-Z]{2,5})-(R|S)(\d{2,3})\b|\b([A-Z]{2,5})-EX-(\d{2,3})\b/g;

// ---------- small utils ----------
function readJson(f, dflt) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return dflt; } }
function writeJson(f, v) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v, null, 2) + '\n'); }
function read(f) { try { return fs.readFileSync(f, 'utf8'); } catch { return ''; } }
function write(f, s) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); }
function now() { return new Date().toISOString(); }
function local(iso) { return new Date(iso).toLocaleString('vi-VN', { hour12: false }); }
function sha(f) { return createHash('sha256').update(fs.readFileSync(f)).digest('hex'); }
function rel(f) { return path.relative(base, path.resolve(f)).split(path.sep).join('/'); }
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', 'dist', 'build', 'coverage', 'test-results', 'playwright-report', '.flow', 'work'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
function idsIn(text) {
  const out = [];
  for (const m of text.matchAll(ID_RE)) out.push(m[1] ? `${m[1]}-${m[2]}${m[3]}` : `${m[4]}-EX-${m[5]}`);
  return out;
}
function mdTables(text) {
  // every GitHub-style table: [{ headers, rows: [ {header: cell} ] }]
  const lines = text.split(/\r?\n/);
  const tables = [];
  for (let i = 0; i < lines.length - 1; i++) {
    if (!/^\s*\|/.test(lines[i]) || !/^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) continue;
    const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    const headers = cells(lines[i]);
    const rows = [];
    let j = i + 2;
    for (; j < lines.length && /^\s*\|/.test(lines[j]); j++) {
      const c = cells(lines[j]);
      rows.push(Object.fromEntries(headers.map((h, k) => [h, (c[k] ?? '').replace(/\\\|/g, '|')])));
    }
    tables.push({ headers, rows });
    i = j - 1;
  }
  return tables;
}
function codeFiles() {
  const dirs = cfg.code_dirs?.length ? cfg.code_dirs : ['apps', 'packages', 'src'];
  return dirs.flatMap((d) => walk(d)).filter((f) => /\.(m?[jt]sx?|cs|kt|java|py|go|rb|php|vue|svelte)$/.test(f));
}
function isTest(f) {
  const r = rel(f);
  return /\.(test|spec)\.[a-z]+$/.test(r) || /(^|\/)(test|tests|e2e|__tests__)\//.test(r);
}
function flag(name) { const i = args.indexOf(name); return i >= 0 ? (args[i + 1] ?? true) : null; }

// ---------- product model ----------
function capabilities() {
  const caps = [];
  if (!fs.existsSync(P.specs)) return caps;
  for (const d of fs.readdirSync(P.specs, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const dir = path.join(P.specs, d.name);
    const spec = read(path.join(dir, 'spec.md'));
    const ex = read(path.join(dir, 'examples.md'));
    const title = (spec.match(/^#\s+(.+)$/m) || [])[1] || d.name;
    const code = (title.match(/\(([A-Z]{2,5})\)/) || [])[1] || (idsIn(spec)[0] || '').split('-')[0] || '';
    const ids = [...new Set(idsIn(spec))];
    const rules = ids.filter((i) => /-R\d/.test(i));
    const scenarios = ids.filter((i) => /-S\d/.test(i));
    const examples = [];
    for (const t of mdTables(ex)) {
      const idCol = t.headers.find((h) => /^(mã|ma|id|code)$/i.test(h)) || t.headers[0];
      const ruleCol = t.headers.find((h) => /^(luật|luat|rule)s?$/i.test(h));
      for (const r of t.rows) if (/-EX-\d/.test(r[idCol])) examples.push({ id: r[idCol].replace(/\*/g, ''), rules: ruleCol ? idsIn(r[ruleCol]) : [], row: r });
    }
    const manual = [...spec.matchAll(/\*{0,2}([A-Z]{2,5}-S\d{2,3})\*{0,2}[^\n]*\[(manual|semi)\]/g)].map((m) => m[1]);
    const unmarked = [...spec.matchAll(/^\s*[-*]\s*\*{0,2}([A-Z]{2,5}-S\d{2,3})\*{0,2}(?![^\n]*\[(auto|semi|manual)\])/gm)].map((m) => m[1]);
    caps.push({ dir: rel(dir), slug: d.name, title, code, rules, scenarios, examples, manual, unmarked, specText: spec });
  }
  return caps;
}
function decisions() {
  const out = [];
  if (!fs.existsSync(P.decisions)) return out;
  for (const f of fs.readdirSync(P.decisions).filter((x) => x.endsWith('.md')).sort()) {
    const t = read(path.join(P.decisions, f));
    const field = (k) => (t.match(new RegExp(`^-\\s*${k}\\s*:\\s*(.*)$`, 'mi')) || [])[1]?.trim() || '';
    out.push({
      file: rel(path.join(P.decisions, f)),
      title: (t.match(/^#\s+(.+)$/m) || [])[1] || f,
      status: field('Trạng thái') || field('Status'),
      kind: field('Loại') || field('Class'),
      blocks: field('Chặn') || field('Blocks'),
    });
  }
  return out;
}
const isOpen = (d) => /^(mở|open)/i.test(d.status);
function changesList() {
  if (!fs.existsSync(P.changes)) return [];
  return fs.readdirSync(P.changes, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'archive').map((d) => {
    const t = read(path.join(P.changes, d.name, 'proposal.md')) || read(path.join(P.changes, d.name, 'change.md'));
    return { name: d.name, status: (t.match(/Trạng thái\s*:\s*([^·\n]+)/i) || [])[1]?.trim() || '?' };
  });
}
function testIndex() {
  const tests = codeFiles().filter(isTest);
  const byId = new Map();
  const loads = new Map(); // capability slug -> tests that load its examples.json
  for (const f of tests) {
    const t = read(f);
    for (const id of new Set(idsIn(t))) { if (!byId.has(id)) byId.set(id, []); byId.get(id).push(rel(f)); }
    for (const m of t.matchAll(/specs\/([a-z0-9-]+)\/examples\.json/g)) { if (!loads.has(m[1])) loads.set(m[1], []); loads.get(m[1]).push(rel(f)); }
  }
  return { tests: tests.map(rel), byId, loads };
}
function coverage(caps = capabilities()) {
  const ti = testIndex();
  return caps.map((c) => {
    const testsFor = (id) => ti.byId.get(id) || [];
    const loaders = ti.loads.get(c.slug) || [];
    const rules = c.rules.map((id) => ({ id, tests: testsFor(id) }));
    const scen = c.scenarios.map((id) => ({ id, tests: testsFor(id), manual: c.manual.includes(id) }));
    const ex = c.examples.map((e) => ({ id: e.id, tests: testsFor(e.id).length ? testsFor(e.id) : loaders }));
    const need = [...rules, ...scen.filter((s) => !s.manual), ...ex];
    const covered = need.filter((x) => x.tests.length).length;
    return { ...c, cov: { rules, scen, ex, covered, total: need.length } };
  });
}

// ---------- commands ----------
const [cmd, ...args] = process.argv.slice(2);

function start() {
  const [recipe, goal = ''] = args;
  if (!recipe || !fs.existsSync(`.flow/recipes/${recipe}.md`)) die(`Unknown recipe. Available: ${fs.readdirSync('.flow/recipes').map((f) => f.replace('.md', '')).join(', ')}`);
  const s = readJson(P.state, {});
  writeJson(P.state, { ...s, recipe, goal, phase: 'triage', started: s.started || now(), gates: s.gates || {}, history: [...(s.history || []), { at: now(), event: `start ${recipe}` }] });
  board(); console.log(`Started recipe ${recipe}.`);
}
function phase() {
  const [step] = args; if (!step) die('phase <step>');
  const s = readJson(P.state, {});
  s.phase = step; (s.history ||= []).push({ at: now(), event: `phase ${step}` });
  writeJson(P.state, s); board(); console.log(`Phase: ${step}`);
}
function gate() {
  const [name, result, who = '?', note = ''] = args;
  if (!name || !['approved', 'changes', 'rejected'].includes(result)) die('gate <name> <approved|changes|rejected> "<who>" ["note"]');
  const s = readJson(P.state, {});
  (s.gates ||= {})[name] = { result, who, note, at: now() };
  (s.history ||= []).push({ at: now(), event: `gate ${name} ${result} by ${who}${note ? `: ${note}` : ''}` });
  writeJson(P.state, s); board(); console.log(`Gate ${name}: ${result}`);
}

function recipeGates(recipe) {
  const t = read(`.flow/recipes/${recipe}.md`);
  return [...new Set([...t.matchAll(/\*\*([a-zà-ỹ-]+)\*\*/gi)].map((m) => m[1].toLowerCase()))];
}
function mapRows() {
  for (const t of mdTables(read(P.map))) if (t.headers.some((h) => /năng lực|capability/i.test(h))) return t.rows;
  return [];
}
function sliceRows() {
  return [...read(P.slices).matchAll(/^\s*-\s*\[([ xX])\]\s*\*\*([^*]+)\*\*/gm)].map((m) => ({ done: m[1] !== ' ', name: m[2].trim() }));
}

function board() {
  const s = readJson(P.state, {});
  const caps = coverage();
  const decs = decisions();
  const open = decs.filter(isOpen);
  const blocking = open.filter((d) => d.blocks && !/^(không|none|-)?$/i.test(d.blocks));
  const ask = open.filter((d) => /ask|hỏi/i.test(d.kind));
  const ch = changesList().filter((c) => !/gộp|merged|từ chối|rejected/i.test(c.status));
  const e = effortTotals();
  const issues = runChecks();
  const gates = s.recipe ? recipeGates(s.recipe) : [];
  const out = [
    `# BOARD — ${cfg.project || path.basename(base)}`,
    '',
    `_Tự sinh bởi \`flow.mjs board\` lúc ${local(now())}. Không sửa tay._`,
    '',
    '## Đang ở đâu',
    s.recipe ? `- Công thức: **${s.recipe}** · Bước: **${s.phase || '?'}** · Mục tiêu: ${s.goal || '-'}` : '- Chưa bắt đầu. Gõ `/flow "<yêu cầu>"`.',
    '',
    '## Cổng',
    gates.length ? ['| Cổng | Kết quả | Người | Lúc |', '|---|---|---|---|', ...gates.map((g) => { const r = s.gates?.[g]; return `| ${g} | ${r ? r.result : 'chưa'} | ${r?.who || ''} | ${r ? local(r.at) : ''} |`; })].join('\n') : '- (chưa có)',
    '',
    '## Cần bạn',
    ...(blocking.length ? blocking.map((d) => `- ⛔ ${d.title} (chặn: ${d.blocks}) — \`${d.file}\``) : []),
    ...(ask.length ? [`- ${ask.length} câu hỏi cho khách: ${ask.map((d) => d.title.split('·')[0].trim()).join(', ')}`] : []),
    ...(open.length - ask.length - blocking.filter((d) => !ask.includes(d)).length > 0 ? [`- ${open.length} thẻ quyết định đang mở (\`/flow decide\`)`] : []),
    ...ch.map((c) => `- Change request ${c.name}: ${c.status}`),
    ...(issues.length ? [`- ${issues.length} vấn đề từ \`flow.mjs check\` (xem cuối trang)`] : []),
    ...(!blocking.length && !ask.length && !open.length && !ch.length && !issues.length ? ['- Không có gì đang chờ.'] : []),
    '',
    '## Năng lực',
  ];
  const mrows = mapRows();
  if (mrows.length || caps.length) {
    out.push('| Mã | Năng lực | Độ sâu | Luật | Kịch bản | Ví dụ | Có test |', '|---|---|---|---|---|---|---|');
    const seen = new Set();
    for (const r of mrows) {
      const code = (r['Mã'] || r['Code'] || '').trim();
      const c = caps.find((x) => x.code === code);
      if (c) seen.add(c.slug);
      out.push(`| ${code} | ${r['Năng lực'] || r['Capability'] || ''} | ${r['Độ sâu lần này'] || r['Độ sâu'] || ''} | ${c ? c.rules.length : '-'} | ${c ? c.scenarios.length : '-'} | ${c ? c.examples.length : '-'} | ${c ? `${c.cov.covered}/${c.cov.total}` : 'chưa có spec'} |`);
    }
    for (const c of caps.filter((x) => !seen.has(x.slug))) out.push(`| ${c.code} | ${c.title} | | ${c.rules.length} | ${c.scenarios.length} | ${c.examples.length} | ${c.cov.covered}/${c.cov.total} |`);
  } else out.push('- (chưa có `product/map.md`)');
  const sl = sliceRows();
  out.push('', '## Slice', sl.length ? sl.map((x) => `- [${x.done ? 'x' : ' '}] ${x.name}`).join('\n') : '- (chưa có kế hoạch)');
  out.push('', '## Effort', `- Giờ người: ${(e.humanMin / 60).toFixed(1)} h (${e.humanSessionsMin ? `${(e.humanSessionsMin / 60).toFixed(1)} h ước tính từ phiên chat, ` : ''}${(e.humanLoggedMin / 60).toFixed(1)} h ghi tay)`, `- Máy: ${fmtTok(e.tokens)} token · ${(e.machineMin / 60).toFixed(1)} h chạy`, '- Chi tiết: `work/effort-ledger.md`');
  if (issues.length) out.push('', '## Kiểm tra', ...issues.map((i) => `- ${i}`));
  if (s.history?.length) out.push('', '## Gần đây', ...s.history.slice(-6).reverse().map((h) => `- ${local(h.at)} · ${h.event}`));
  write(P.board, out.join('\n') + '\n');
  if (cmd === 'board') console.log(`Wrote ${P.board}`);
}

function runChecks() {
  const issues = [];
  const caps = capabilities();
  const seen = new Map();
  for (const c of caps) {
    if (!fs.existsSync(path.join(c.dir, 'spec.md'))) { issues.push(`${c.dir}: thiếu spec.md`); continue; }
    if (!c.code) issues.push(`${c.dir}/spec.md: tiêu đề nên có mã năng lực dạng "(PRC)"`);
    const defined = [...c.specText.matchAll(/^\s*(?:[-*]\s*\**|\|\s*)([A-Z]{2,5}-[RS]\d{2,3})\b/gm)].map((m) => m[1]);
    for (const id of [...defined, ...c.examples.map((e) => e.id)]) {
      if (seen.has(id) && seen.get(id) !== c.dir) issues.push(`${id} định nghĩa ở cả ${seen.get(id)} và ${c.dir}`);
      seen.set(id, c.dir);
    }
    const dupEx = c.examples.map((e) => e.id).filter((v, i, a) => a.indexOf(v) !== i);
    if (dupEx.length) issues.push(`${c.dir}/examples.md: mã trùng ${[...new Set(dupEx)].join(', ')}`);
    const exRules = new Set(c.examples.flatMap((e) => e.rules));
    const noEx = c.rules.filter((r) => !exRules.has(r));
    if (c.examples.length && noEx.length) issues.push(`${c.dir}: luật chưa có ví dụ: ${noEx.join(', ')}`);
    if (!c.examples.length && c.rules.length) issues.push(`${c.dir}: có ${c.rules.length} luật nhưng chưa có examples.md`);
    if (c.unmarked.length) issues.push(`${c.dir}: kịch bản chưa gắn [auto|semi|manual]: ${c.unmarked.join(', ')}`);
    const json = path.join(c.dir, 'examples.json');
    if (c.examples.length && (!fs.existsSync(json) || fs.statSync(json).mtimeMs < fs.statSync(path.join(c.dir, 'examples.md')).mtimeMs)) issues.push(`${c.dir}: examples.json cũ hơn examples.md, chạy \`flow.mjs examples\``);
  }
  for (const d of decisions()) {
    if (!d.status) issues.push(`${d.file}: thiếu dòng "- Trạng thái:"`);
    if (isOpen(d) && !d.kind) issues.push(`${d.file}: thẻ mở cần "- Loại:" (assume/research/ask client/spike/defer)`);
  }
  for (const f of frozenProblems()) issues.push(f);
  return issues;
}
function check() {
  const issues = runChecks();
  if (!issues.length) { console.log('flow check: ok'); return; }
  console.log('flow check: cần sửa');
  for (const i of issues) console.log(`  - ${i}`);
  process.exit(1);
}

function examples() {
  let n = 0;
  for (const c of capabilities()) {
    if (!c.examples.length) continue;
    const rows = c.examples.map((e) => ({ id: e.id, rules: e.rules, ...e.row }));
    writeJson(path.join(c.dir, 'examples.json'), { capability: c.code, source: `${c.dir}/examples.md`, generated: now(), examples: rows });
    n += rows.length;
    console.log(`${c.dir}/examples.json: ${rows.length} ví dụ`);
  }
  if (!n) console.log('Không có bảng ví dụ nào (cột đầu là mã dạng XXX-EX-01).');
}

function trace() {
  const ids = flag('--ids');
  if (ids && ids !== true) {
    const want = String(ids).split(',').map((x) => x.trim()).filter(Boolean);
    const files = [...walk('product'), ...codeFiles(), ...walk('work').filter((f) => f.endsWith('.md'))];
    console.log(`Ảnh hưởng của ${want.join(', ')}:`);
    for (const id of want) {
      const hits = files.filter((f) => read(f).includes(id)).map(rel);
      console.log(`\n${id}`);
      for (const h of hits) console.log(`  ${isTest(h) ? 'test ' : h.startsWith('product/') ? 'spec ' : 'code '} ${h}`);
      if (!hits.length) console.log('  (không file nào nhắc tới)');
    }
    return;
  }
  const caps = coverage();
  if (!caps.length) { console.log('Chưa có spec trong product/specs/.'); return; }
  for (const c of caps) {
    console.log(`\n${c.code || c.slug} · ${c.title}: ${c.cov.covered}/${c.cov.total} mục có test`);
    for (const x of [...c.cov.rules, ...c.cov.scen, ...c.cov.ex]) {
      const mark = x.manual ? '(manual)' : x.tests.length ? '✓' : '✗';
      console.log(`  ${mark.padEnd(8)} ${x.id.padEnd(12)} ${x.tests.slice(0, 2).join(', ')}${x.tests.length > 2 ? ' …' : ''}`);
    }
  }
}

// ---------- frozen files ----------
function frozenProblems() {
  const fz = readJson(P.frozen, {});
  const out = [];
  for (const [f, h] of Object.entries(fz)) {
    if (!fs.existsSync(f)) out.push(`file đã chốt bị xoá: ${f}`);
    else if (sha(f) !== h.sha) out.push(`file đã chốt bị sửa: ${f} (chốt lúc ${local(h.at)})`);
  }
  return out;
}
function freeze() {
  const [sub, ...rest] = args;
  const fz = readJson(P.frozen, {});
  if (sub === 'add') {
    const files = rest.flatMap((p) => (fs.existsSync(p) && fs.statSync(p).isDirectory() ? walk(p) : [p])).filter((f) => fs.existsSync(f));
    if (!files.length) die('freeze add <files or folders>: nothing found');
    for (const f of files) fz[rel(f)] = { sha: sha(f), at: now() };
    writeJson(P.frozen, fz); console.log(`Đã chốt ${files.length} file.`);
  } else if (sub === 'release') {
    for (const p of rest) { delete fz[rel(p)]; }
    writeJson(P.frozen, fz); console.log(`Đã mở chốt: ${rest.join(', ')}`);
  } else if (sub === 'check') {
    const probs = frozenProblems();
    if (probs.length) { for (const p of probs) console.log(p); process.exit(1); }
    console.log(`freeze check: ok (${Object.keys(fz).length} file)`);
  } else if (sub === 'list') {
    for (const [f, h] of Object.entries(fz)) console.log(`${f}  (${local(h.at)})`);
  } else die('freeze add <paths..> | check | release <path> | list');
}

// ---------- effort ----------
function effortTotals() {
  const e = readJson(P.effort, { human: [], machine: [], sessions: {}, done: {} });
  const humanLoggedMin = (e.human || []).reduce((a, x) => a + x.minutes, 0);
  const sessions = Object.values(e.sessions || {});
  const humanSessionsMin = sessions.reduce((a, x) => a + (x.humanMin || 0), 0);
  const tokens = sessions.reduce((a, x) => a + (x.tokens || 0), 0) + (e.machine || []).reduce((a, x) => a + (x.tokens || 0), 0);
  const machineMin = sessions.reduce((a, x) => a + (x.machineMin || 0), 0) + (e.machine || []).reduce((a, x) => a + (x.minutes || 0), 0);
  return { e, humanLoggedMin, humanSessionsMin, humanMin: humanLoggedMin + humanSessionsMin, tokens, machineMin };
}
function fmtTok(n) { return n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'k' : String(n || 0); }
function baselineItems() {
  const f = cfg.baseline || 'product/baseline-effort.md';
  for (const t of mdTables(read(f))) {
    if (t.headers.includes('#') && t.headers.some((h) => /^md$/i.test(h))) {
      return t.rows.filter((r) => /^[A-Z]$/.test(r['#'])).map((r) => ({ item: r['#'], name: r['Hạng mục'] || r['Item'] || '', md: Number(String(r['md'] || r['MD']).replace(',', '.')) || 0 }));
    }
  }
  return [];
}
function effort() {
  const [sub, ...rest] = args;
  const e = readJson(P.effort, { human: [], machine: [], sessions: {}, done: {} });
  if (sub === 'log') {
    const minutes = Number(rest[0]); if (!minutes) die('effort log <minutes> "<note>" [--item X]');
    e.human.push({ at: now(), minutes, note: rest[1] || '', item: flag('--item') || null });
  } else if (sub === 'machine') {
    const [engine, tokens, note = ''] = rest; if (!engine) die('effort machine <engine> <tokens> "<note>"');
    e.machine.push({ at: now(), engine, tokens: Number(String(tokens).replace(/[,.]/g, '')) || 0, minutes: Number(flag('--minutes')) || 0, note });
  } else if (sub === 'session') { // used by the Stop hook
    const [id, tokens, humanMin, machineMin, model = ''] = rest;
    e.sessions[id] = { tokens: Number(tokens) || 0, humanMin: Number(humanMin) || 0, machineMin: Number(machineMin) || 0, model, phase: readJson(P.state, {}).phase || '', at: now() };
  } else if (sub === 'done') {
    const [item, pct = '100'] = rest; if (!item) die('effort done <item> [percent]');
    e.done[item] = Number(pct);
  } else if (sub !== 'report') die('effort log | machine | done | report');
  writeJson(P.effort, e);
  renderLedger();
  if (sub !== 'session') board();
  if (sub === 'report') console.log(read(P.ledger));
  else console.log('Đã ghi.');
}
function renderLedger() {
  const t = effortTotals();
  const e = t.e;
  const items = baselineItems();
  const out = ['# Sổ effort', '', `_Tự sinh bởi \`flow.mjs effort\` lúc ${local(now())}. Ghi thêm bằng \`/flow effort <phút> "<việc>"\`._`, '',
    '## Tổng', `- Giờ người: **${(t.humanMin / 60).toFixed(1)} h** (ước tính từ phiên chat ${(t.humanSessionsMin / 60).toFixed(1)} h + ghi tay ${(t.humanLoggedMin / 60).toFixed(1)} h)`,
    `- Máy: ${fmtTok(t.tokens)} token, ${(t.machineMin / 60).toFixed(1)} h chạy`, ''];
  if (items.length) {
    const doneMd = items.reduce((a, i) => a + i.md * ((e.done[i.item] || 0) / 100), 0);
    const total = items.reduce((a, i) => a + i.md, 0);
    out.push('## So với mốc (cách làm truyền thống)', '| # | Hạng mục | md mốc | Đạt | md đã đạt |', '|---|---|---:|---:|---:|',
      ...items.map((i) => `| ${i.item} | ${i.name.slice(0, 60)} | ${i.md} | ${e.done[i.item] || 0}% | ${(i.md * (e.done[i.item] || 0) / 100).toFixed(1)} |`),
      `| | **Tổng** | **${total}** | | **${doneMd.toFixed(1)}** |`, '',
      doneMd ? `Giờ người thực tế / giờ mốc của phần đã đạt: **${(t.humanMin / 60).toFixed(1)} h / ${(doneMd * 8).toFixed(0)} h = ${((t.humanMin / 60) / (doneMd * 8) * 100).toFixed(1)}%**` : 'Chưa có hạng mục nào được đánh dấu đạt (`flow.mjs effort done <#> [phần trăm]`).', '');
  }
  out.push('## Giờ người ghi tay', '| Lúc | Phút | Hạng mục | Việc |', '|---|---:|---|---|', ...e.human.map((h) => `| ${local(h.at)} | ${h.minutes} | ${h.item || ''} | ${h.note} |`), '');
  out.push('## Phiên Claude Code (tự ghi khi dừng)', '| Phiên | Bước | Model | Token | Giờ người ước tính (phút) | Máy chạy (phút) |', '|---|---|---|---:|---:|---:|',
    ...Object.entries(e.sessions).map(([id, s]) => `| ${id.slice(0, 8)} | ${s.phase} | ${s.model} | ${fmtTok(s.tokens)} | ${s.humanMin} | ${s.machineMin} |`), '');
  out.push('## Engine khác', '| Lúc | Engine | Token | Việc |', '|---|---|---:|---|', ...e.machine.map((m) => `| ${local(m.at)} | ${m.engine} | ${fmtTok(m.tokens)} | ${m.note} |`), '');
  write(P.ledger, out.join('\n'));
}

// ---------- review pack ----------
async function reviewPack() {
  const approved = readJson(P.approved, null);
  if (args.includes('--mark-approved')) {
    const head = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
    writeJson(P.approved, { sha: head, at: now() });
    console.log(`Đánh dấu đã duyệt ở ${head.slice(0, 8)}. Gói sau chỉ tô phần đổi sau mốc này.`);
    return;
  }
  const changed = new Set();
  if (approved?.sha) {
    const d = spawnSync('git', ['diff', '--name-only', approved.sha, '--', 'product'], { encoding: 'utf8' }).stdout || '';
    const u = spawnSync('git', ['ls-files', '--others', '--exclude-standard', '--', 'product'], { encoding: 'utf8' }).stdout || '';
    // git prints paths relative to the repo root; the kit may live in a sub-folder
    for (const f of d.split('\n').filter(Boolean)) changed.add(path.relative(base, path.join(root, f)).split(path.sep).join('/'));
    for (const f of u.split('\n').filter(Boolean)) changed.add(f); // ls-files prints paths relative to the cwd (= base)
  }
  const order = [];
  const add = (f, group) => { if (fs.existsSync(f) && !order.some((o) => o.f === f)) order.push({ f, group }); };
  add('product/map.md', 'Tổng quan'); add('product/context.md', 'Tổng quan');
  for (const c of capabilities()) { add(path.join(c.dir, 'spec.md'), 'Spec'); add(path.join(c.dir, 'examples.md'), 'Spec'); }
  const decs = decisions().sort((a, b) => Number(isOpen(b)) - Number(isOpen(a)));
  for (const d of decs) add(d.file, 'Quyết định');
  for (const c of changesList()) for (const f of ['proposal.md', 'delta.md', 'change.md']) add(path.join(P.changes, c.name, f), 'Thay đổi');
  for (const f of walk('product/architecture').filter((x) => x.endsWith('.md')).sort()) add(rel(f), 'Kiến trúc');
  add('product/ux/design-system.md', 'UX');
  add(P.slices, 'Kế hoạch');
  for (const f of walk('product/research').filter((x) => x.endsWith('.md')).sort()) add(rel(f), 'Research');
  const caps = coverage();
  const open = decs.filter(isOpen);
  const exTotal = caps.reduce((a, c) => a + c.examples.length, 0);
  const sections = order.map(({ f, group }, i) => ({ id: `s${i}`, f: rel(f), group, title: (read(f).match(/^#\s+(.+)$/m) || [])[1] || rel(f), html: md2html(read(f)), changed: changed.has(rel(f)) }));
  const nav = [...new Set(sections.map((s) => s.group))].map((g) => `<div class="g">${esc(g)}</div>` + sections.filter((s) => s.group === g).map((s) => `<a href="#${s.id}">${s.changed ? '<b class="new">mới</b> ' : ''}${esc(s.title)}</a>`).join('')).join('');
  const uxIndex = fs.existsSync('product/ux/options/index.html') ? '<p>Phương án UI: <a href="../../product/ux/options/index.html">product/ux/options/index.html</a></p>' : '';
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Review pack · ${esc(cfg.project || '')}</title><style>${CSS}</style></head><body>
<nav>${nav}</nav><main>
<header><h1>Review pack · ${esc(cfg.project || path.basename(base))}</h1>
<p class="meta">Sinh lúc ${esc(local(now()))}${approved ? ` · phần <b class="new">mới</b> là thay đổi sau lần duyệt ${esc(local(approved.at))}` : ' · lần đầu, chưa có mốc duyệt'}</p>
<div class="cards"><div><b>${caps.length}</b>năng lực có spec</div><div><b>${exTotal}</b>ví dụ cần kiểm</div><div><b>${open.length}</b>quyết định đang mở</div><div><b>${changed.size}</b>file đổi từ lần duyệt trước</div></div>
<p class="hint">Cách đọc: xem <i>Bản đồ sản phẩm</i>, rồi bảng <i>Ví dụ</i> của từng năng lực (sai dòng nào ghi lại mã dòng đó), rồi các <i>Quyết định</i> đang mở.</p>${uxIndex}</header>
${sections.map((s) => `<section id="${s.id}" class="${s.changed ? 'changed' : ''}"><div class="path">${esc(s.f)}${s.changed ? ' · <b class="new">mới / đổi</b>' : ''}</div>${s.html}</section>`).join('\n')}
</main><script type="module">import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.esm.min.mjs';mermaid.initialize({startOnLoad:true});</script></body></html>`;
  write('work/review-pack/index.html', html);
  console.log(`Wrote work/review-pack/index.html (${sections.length} mục, ${changed.size} đổi)`);
  if (args.includes('--no-pdf')) return;
  try {
    let pw;
    try { pw = await import('playwright'); } catch { pw = createRequire(path.join(base, 'noop.js'))('playwright'); } // global installs resolve through NODE_PATH
    const { chromium } = pw;
    const b = await chromium.launch();
    const pg = await b.newPage();
    await pg.goto('file://' + path.resolve('work/review-pack/index.html'));
    await pg.waitForTimeout(1500);
    await pg.emulateMedia({ media: 'print' });
    await pg.pdf({ path: 'work/review-pack/index.pdf', format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
    await b.close();
    console.log('Wrote work/review-pack/index.pdf');
  } catch { console.log('(Không có Playwright nên bỏ qua PDF. Mở index.html trong trình duyệt và in ra PDF nếu cần.)'); }
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\b([A-Z]{2,5}-(?:R|S)\d{2,3}|[A-Z]{2,5}-EX-\d{2,3}|D-\d{2,3}|CR-\d{2,3})\b/g, '<span class="id">$1</span>');
}
function md2html(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  const isTableStart = (k) => /^\s*\|/.test(lines[k] || '') && /^\s*\|?\s*:?-{3,}/.test(lines[k + 1] || '');
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const lang = l.slice(3).trim(); const buf = [];
      for (i++; i < lines.length && !/^```/.test(lines[i]); i++) buf.push(lines[i]);
      i++;
      out.push(lang === 'mermaid' ? `<pre class="mermaid">${esc(buf.join('\n'))}</pre>` : `<pre><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    if (/^#{1,6}\s/.test(l)) { const n = l.match(/^#+/)[0].length; out.push(`<h${n + 1}>${inline(l.replace(/^#+\s*/, ''))}</h${n + 1}>`); i++; continue; }
    if (isTableStart(i)) {
      const t = mdTables(lines.slice(i).join('\n'))[0];
      let k = i + 2; while (k < lines.length && /^\s*\|/.test(lines[k])) k++;
      out.push(`<table><thead><tr>${t.headers.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${t.headers.map((h) => `<td>${inline(r[h])}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      i = k; continue;
    }
    if (/^\s*([-*]|\d+\.)\s/.test(l)) {
      const ordered = /^\s*\d+\./.test(l); const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s/.test(lines[i])) {
        const depth = lines[i].match(/^\s*/)[0].length >= 2 ? 1 : 0;
        items.push(`<li class="d${depth}">${inline(lines[i].replace(/^\s*([-*]|\d+\.)\s/, '').replace(/^\[ \]\s/, '☐ ').replace(/^\[[xX]\]\s/, '☑ '))}</li>`); i++;
      }
      out.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`); continue;
    }
    if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, '')); out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`); continue; }
    if (!l.trim()) { i++; continue; }
    const buf = []; while (i < lines.length && lines[i].trim() && !/^(#|```|\s*\||\s*([-*]|\d+\.)\s|>)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}
const CSS = `:root{--ink:#171c28;--muted:#5a6376;--line:#dde2ec;--soft:#f5f7fb;--blue:#2f64e8;--amber:#c47f00}*{box-sizing:border-box}
body{margin:0;font:15px/1.55 Inter,system-ui,sans-serif;color:var(--ink);background:#fff;display:flex}
nav{position:sticky;top:0;height:100vh;overflow:auto;width:270px;flex:none;border-right:1px solid var(--line);padding:16px 12px;background:var(--soft);font-size:13px}
nav .g{font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.06em;color:var(--muted);margin:14px 0 4px}nav a{display:block;color:var(--ink);text-decoration:none;padding:3px 6px;border-radius:6px}nav a:hover{background:#e8edf7}
main{flex:1;min-width:0;padding:24px 40px;max-width:1100px}header h1{margin:0 0 4px;font-size:26px}.meta{color:var(--muted);margin:0 0 14px}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:10px 0}.cards div{border:1px solid var(--line);border-radius:10px;padding:10px;color:var(--muted);font-size:13px}.cards b{display:block;font-size:24px;color:var(--blue)}
.hint{background:#eaf0ff;border-left:3px solid var(--blue);padding:8px 12px;border-radius:0 8px 8px 0}
section{border-top:1px solid var(--line);padding:18px 0}section.changed{border-left:4px solid var(--amber);padding-left:14px;background:linear-gradient(90deg,#fff8e6,#fff 30%)}
.path{font:12px ui-monospace,monospace;color:var(--muted)}.new{background:#fff3d6;color:var(--amber);border-radius:6px;padding:0 6px;font-size:11px}
h2{font-size:21px;margin:6px 0 8px}h3{font-size:17px;margin:16px 0 6px}h4{font-size:15px}
table{border-collapse:collapse;width:100%;margin:8px 0 14px;font-size:14px}th,td{border:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}th{background:var(--soft)}tr:nth-child(even) td{background:#fbfcfe}
code{background:var(--soft);border:1px solid var(--line);border-radius:4px;padding:0 4px;font-size:.9em}pre{background:var(--soft);border:1px solid var(--line);border-radius:8px;padding:10px;overflow:auto}pre.mermaid{background:#fff;text-align:center}
.id{font:600 12px ui-monospace,monospace;background:#eef3ff;color:#1f4fc4;border-radius:5px;padding:0 5px}li.d1{margin-left:22px}blockquote{border-left:3px solid var(--line);margin:8px 0;padding:2px 12px;color:var(--muted)}
@media print{nav{display:none}main{padding:0;max-width:none}section{break-inside:auto}table,pre{break-inside:avoid}}
@media (max-width:800px){body{display:block}nav{position:static;height:auto;width:auto}main{padding:16px}.cards{grid-template-columns:repeat(2,1fr)}}`;

function die(m) { console.error(m); process.exit(1); }

// ---------- dispatch (last, so every const above is initialised) ----------
const commands = { start, phase, gate, board, check, examples, trace, freeze, effort, 'review-pack': reviewPack, state: () => console.log(JSON.stringify(readJson(P.state, {}), null, 2)) };
if (!commands[cmd]) { console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 16).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(cmd ? 1 : 0); }
await commands[cmd]();
