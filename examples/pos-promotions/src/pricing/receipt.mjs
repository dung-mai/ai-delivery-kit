// STK-R13: receipt text (42 columns, thermal printer). Amounts in THB with a dot.
import { formatTHB } from './money.mjs';

const WIDTH = 42;
const row = (left, right = '') => {
  const space = WIDTH - left.length - right.length;
  return space >= 1 ? left + ' '.repeat(space) + right : `${left}\n${' '.repeat(WIDTH - right.length)}${right}`;
};

export function renderReceipt(result, { store = '' } = {}) {
  const out = [];
  if (store) out.push(row(store, result.evaluatedAt.replace('T', ' ')));
  out.push('-'.repeat(WIDTH));
  for (const l of result.lines) {
    out.push(row(`${l.name} x${l.qty}`, formatTHB(l.gross)));
    for (const d of l.discounts) {
      if (result.basketPromotion && d.promoId === result.basketPromotion.promoId) continue; // shown once below
      out.push(row(`  ${d.name}`, formatTHB(-d.amount)));
    }
  }
  if (result.basketPromotion) out.push(row(result.basketPromotion.name, formatTHB(-result.basketPromotion.amount)));
  out.push('-'.repeat(WIDTH));
  out.push(row('TOTAL', formatTHB(result.net)));
  out.push(row(`VAT ${result.vatRate}% (included)`, formatTHB(result.vat)));
  out.push(`Promo set: ${result.promoSetId}`);
  return out.join('\n');
}
