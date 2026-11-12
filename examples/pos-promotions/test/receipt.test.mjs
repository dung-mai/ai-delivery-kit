import { test } from 'node:test';
import assert from 'node:assert/strict';
import { price } from '../src/pricing/engine.mjs';
import { renderReceipt } from '../src/pricing/receipt.mjs';
import { formatTHB } from '../src/pricing/money.mjs';
import { PRODUCTS as X, P, item, promoSet, basket, CONFIG } from './fixtures.mjs';

test('STK-EX-15 receipt shows each promotion, the basket discount once, and the total (STK-R13)', () => {
  const r = price(basket([item(X.shampoo), item(X.milk, 2), item(X.cola, 4)]), promoSet([P.P1, P.P9]), CONFIG);
  const text = renderReceipt(r, { store: 'S01' });
  assert.match(text, /Dầu gội −10%\s+-15\.90/);
  assert.equal(text.match(/Giỏ từ 300 giảm 5%/g).length, 1);
  assert.match(text, /TOTAL\s+297\.44/);
  assert.match(text, /VAT 7% \(included\)\s+19\.46/);
  assert.match(text, /Promo set: PS-1130/);
  for (const line of text.split('\n')) assert.ok(line.length <= 42, `line longer than 42: ${line}`);
});

test('money format', () => {
  assert.equal(formatTHB(29744), '297.44');
  assert.equal(formatTHB(123456), '1,234.56');
  assert.equal(formatTHB(-1590), '-15.90');
});
