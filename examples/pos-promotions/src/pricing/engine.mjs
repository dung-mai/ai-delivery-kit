// STK: apply promotions to a basket. Pure function, no I/O: the same code runs on the server and offline on the terminal.
import { allocate, mulDivRound } from './money.mjs';
import { inScope, isEligible } from './eligibility.mjs';

const ITEM_TYPES = new Set(['percent', 'amount', 'special', 'buyxgety', 'bundle']);

/**
 * @param {{store:string, at:string, customerGroup?:string|null, lines:Array<{sku,name,price,qty,category,brand}>}} basket
 *   `at` = the moment the cashier pressed total (STK-R12).
 * @param {{id:string, syncedAt:string, promotions:Array<object>}} promoSet  the promotion set on this terminal (STK-R14)
 * @param {{vat:Array<{from:string, rate:number}>}} config
 */
export function price(basket, promoSet, config) {
  const ctx = { store: basket.store, at: basket.at, customerGroup: basket.customerGroup ?? null };
  const lines = basket.lines.map((l, index) => ({ ...l, index, gross: l.price * l.qty, net: l.price * l.qty, discounts: [] }));
  const promos = promoSet.promotions
    .filter((p) => p.approvedAt <= promoSet.syncedAt) // STK-R14: only what was synced
    .filter((p) => isEligible(p, ctx));

  applyItemPromotions(lines, promos.filter((p) => ITEM_TYPES.has(p.type))); // STK-R01: item level first
  const basketPromo = applyBasketPromotion(lines, promos.filter((p) => p.type === 'basket'));

  const gross = sum(lines.map((l) => l.gross));
  const net = sum(lines.map((l) => l.net));
  const vatRate = vatRateAt(config, basket.at);
  const vat = mulDivRound(net, vatRate, 100 + vatRate); // STK-R11: once, on the receipt total
  return {
    lines: lines.map(({ index, sku, name, qty, price: unit, gross: g, net: n, discounts }) => ({ index, sku, name, qty, price: unit, gross: g, net: n, discounts })),
    basketPromotion: basketPromo,
    gross, discount: gross - net, net, vat, vatRate, exVat: net - vat,
    promoSetId: promoSet.id, evaluatedAt: basket.at,
  };
}

// ---------- item level (STK-R02..R05) ----------
function applyItemPromotions(lines, promos) {
  const exclusive = promos.filter((p) => p.exclusive);
  const stackable = promos.filter((p) => !p.exclusive).sort(byPriority);
  const claimed = new Set();

  // STK-R05: best deal. Candidates sorted by value for the customer, then priority, then approval time.
  const candidates = exclusive
    .map((p) => ({ p, d: discountFor(p, lines, lines.map((l) => l.gross)) }))
    .filter((c) => total(c.d) > 0)
    .sort((a, b) => total(b.d) - total(a.d) || byPriority(a.p, b.p));
  for (const c of candidates) {
    const touched = [...c.d.keys()];
    if (touched.some((i) => claimed.has(i))) continue; // units already taken by a better exclusive deal
    const stack = stackDiscounts(lines.filter((l) => touched.includes(l.index)), stackable);
    const stackTotal = sum(stack.map((s) => s.amount));
    const stackBest = Math.min(...stack.map((s) => s.promo.priority), Infinity);
    const exclusiveWins = total(c.d) > stackTotal || (total(c.d) === stackTotal && c.p.priority < stackBest);
    if (!exclusiveWins) continue;
    for (const [i, amount] of c.d) { addDiscount(lines[i], c.p, amount); claimed.add(i); } // STK-R03
  }
  // Lines without an exclusive deal: stackable promotions in priority order, each on the running price (STK-R04).
  for (const s of stackDiscounts(lines.filter((l) => !claimed.has(l.index)), stackable)) addDiscount(lines[s.index], s.promo, s.amount);
}

function stackDiscounts(subset, stackable) {
  const running = new Map(subset.map((l) => [l.index, l.net]));
  const out = [];
  for (const p of stackable) {
    const d = discountFor(p, subset, subset.map((l) => running.get(l.index)));
    for (const [i, amount] of d) {
      if (!amount) continue;
      out.push({ index: i, promo: p, amount });
      running.set(i, running.get(i) - amount);
    }
  }
  return out;
}

/** Discount of one promotion per line index, given the running net of each line in `subset`. */
function discountFor(p, subset, running) {
  const scoped = subset.map((l, k) => ({ l, net: running[k] })).filter(({ l }) => inScope(l, p.scope));
  const out = new Map();
  if (!scoped.length) return out;
  const qty = sum(scoped.map(({ l }) => l.qty));
  const amount = sum(scoped.map(({ net }) => net));
  if (p.minQty && qty < p.minQty) return out; // PRM-R06
  if (p.minAmount && amount < p.minAmount) return out; // PRM-R06

  if (p.type === 'percent') for (const { l, net } of scoped) out.set(l.index, mulDivRound(net, p.value, 100));
  if (p.type === 'amount') for (const { l } of scoped) out.set(l.index, p.value * Math.floor(l.qty / (p.per || 1)));
  if (p.type === 'special') for (const { l } of scoped) out.set(l.index, Math.max(0, l.price - p.value) * l.qty);
  if (p.type === 'buyxgety') {
    // PRM-R01, PRM-R07: give away the cheapest units, floor(n / (x + y)) times, capped by maxTimes.
    let times = Math.floor(qty / (p.x + p.y));
    if (p.maxTimes) times = Math.min(times, p.maxTimes);
    const units = scoped.flatMap(({ l }) => Array.from({ length: l.qty }, () => ({ index: l.index, price: l.price })));
    units.sort((a, b) => a.price - b.price || a.index - b.index); // PRM-R01: the cheapest units are free
    for (const u of units.slice(0, times * p.y)) out.set(u.index, (out.get(u.index) || 0) + u.price);
  }
  if (p.type === 'bundle') {
    // PRM-R01: one unit of each sku in p.items forms a set sold at p.bundlePrice; split by STK-R07.
    const bySku = (sku) => scoped.filter(({ l }) => l.sku === sku);
    const times = Math.min(...p.items.map((sku) => sum(bySku(sku).map(({ l }) => l.qty))));
    if (times > 0) {
      const members = p.items.map((sku) => bySku(sku)[0].l);
      const setGross = sum(members.map((l) => l.price));
      const shares = allocate((setGross - p.bundlePrice) * times, members.map((l) => l.price * times));
      members.forEach((l, k) => out.set(l.index, (out.get(l.index) || 0) + shares[k]));
    }
  }
  // PRM-R10: never more than the line; PRM-R11: cap per promotion.
  for (const { l, net } of scoped) if (out.has(l.index)) out.set(l.index, Math.min(out.get(l.index), net));
  if (p.maxDiscount && total(out) > p.maxDiscount) {
    const keys = [...out.keys()];
    const shares = allocate(p.maxDiscount, keys.map((k) => out.get(k)));
    keys.forEach((k, j) => out.set(k, shares[j]));
  }
  return out;
}

// ---------- basket level (STK-R06, R07, R15) ----------
function applyBasketPromotion(lines, promos) {
  const subtotal = sum(lines.map((l) => l.net)); // STK-R06: after item-level discounts
  const options = promos
    .filter((p) => !p.minAmount || subtotal >= p.minAmount)
    .map((p) => {
      let d = p.basketType === 'percent' ? mulDivRound(subtotal, p.value, 100) : Math.min(p.value, subtotal);
      if (p.maxDiscount) d = Math.min(d, p.maxDiscount);
      return { p, d };
    })
    .filter((o) => o.d > 0)
    .sort((a, b) => b.d - a.d || byPriority(a.p, b.p)); // STK-R15: only one, the biggest
  if (!options.length) return null;
  const { p, d } = options[0];
  const shares = allocate(d, lines.map((l) => l.net)); // STK-R07
  lines.forEach((l, k) => { if (shares[k]) addDiscount(l, p, shares[k]); });
  return { promoId: p.id, version: p.version, name: p.name, amount: d };
}

// ---------- helpers ----------
function addDiscount(line, p, amount) {
  const a = Math.min(amount, line.net); // STK-R09
  if (!a) return;
  line.discounts.push({ promoId: p.id, version: p.version, name: p.name, amount: a });
  line.net -= a;
}
function vatRateAt(config, at) {
  const rates = [...(config?.vat || [])].sort((a, b) => (a.from < b.from ? -1 : 1)).filter((r) => r.from <= at);
  if (!rates.length) throw new Error(`No VAT rate configured for ${at}`);
  return rates.at(-1).rate;
}
const byPriority = (a, b) => a.priority - b.priority || (a.approvedAt < b.approvedAt ? -1 : a.approvedAt > b.approvedAt ? 1 : 0);
const sum = (xs) => xs.reduce((a, x) => a + x, 0);
const total = (m) => sum([...m.values()]);
