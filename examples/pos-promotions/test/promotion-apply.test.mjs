// QA tests for STK, one per example id in product/specs/promotion-apply/examples.md. Frozen after review.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { price } from '../src/pricing/engine.mjs';
import { PRODUCTS as X, P, item, custom, promo, promoSet, basket, CONFIG, discountsOf, lineDiscount } from './fixtures.mjs';

const run = (lines, promos, o = {}, setOpts = {}) => price(basket(lines, o), promoSet(promos, setOpts), CONFIG);
const cart1 = [item(X.shampoo), item(X.milk, 2), item(X.cola, 3)];
const cart2 = [item(X.shampoo), item(X.milk, 2), item(X.cola, 4)];

test('STK-EX-01 STK-S03 item promotions first, basket threshold after them (STK-R01, STK-R06)', () => {
  const r = run(cart1, [P.P1, P.P9]);
  assert.equal(r.gross, 30900);
  assert.equal(discountsOf(r, 'P1'), 1590);
  assert.equal(r.basketPromotion, null);
  assert.equal(r.net, 29310);
});

test('STK-EX-02 basket 5% rounds half up to the satang (STK-R06, STK-R08)', () => {
  const r = run(cart2, [P.P1, P.P9]);
  assert.equal(discountsOf(r, 'P1'), 1590);
  assert.equal(r.basketPromotion.amount, 1566);
  assert.equal(r.net, 29744);
});

test('STK-EX-03 STK-S01 exclusive promotion blocks stackable ones on the same unit (STK-R02, STK-R03)', () => {
  const r = run([item(X.shampoo)], [P.P1, P.P3], { customerGroup: 'member' });
  assert.equal(discountsOf(r, 'P1'), 1590);
  assert.equal(discountsOf(r, 'P3'), 0);
});

test('STK-EX-04 STK-S02 stackable percentages apply one after another (STK-R04, STK-R08)', () => {
  const r = run([item(X.milk)], [P.P4, P.P5]);
  assert.equal(discountsOf(r, 'P4'), 450);
  assert.equal(discountsOf(r, 'P5'), 203);
  assert.equal(r.net, 3847);
});

test('STK-EX-05 best deal for the customer among exclusive promotions (STK-R05)', () => {
  const r = run([item(X.cola, 3)], [P.P6, P.P7]);
  assert.equal(discountsOf(r, 'P7'), 2400);
  assert.equal(discountsOf(r, 'P6'), 0);
});

test('STK-EX-06 tie on value: higher priority wins (STK-R05)', () => {
  const r = run([item(X.cola, 3)], [P.P6, P.P8]);
  assert.equal(discountsOf(r, 'P8'), 2000);
  assert.equal(discountsOf(r, 'P6'), 0);
});

test('STK-EX-07 STK-S04 basket discount split pro rata (STK-R07)', () => {
  const r = run([item(X.rice), item(X.shampoo)], [P.P10]);
  assert.equal(lineDiscount(r, 0), 2716);
  assert.equal(lineDiscount(r, 1), 2284);
  assert.equal(lineDiscount(r, 0) + lineDiscount(r, 1), 5000);
});

test('STK-EX-08 rounding remainder goes to the first of equal lines (STK-R07, STK-R08)', () => {
  const p = promo({ id: 'B10', name: 'Giảm giỏ 10', type: 'basket', basketType: 'amount', value: 1000, scope: {} });
  const r = run([custom('A', 10000), custom('B', 10000), custom('C', 10000)], [p]);
  assert.deepEqual([0, 1, 2].map((i) => lineDiscount(r, i)), [334, 333, 333]);
});

test('STK-EX-09 discount never makes a line negative (STK-R09)', () => {
  const p = promo({ id: 'S40', name: 'Snack giảm 40', type: 'amount', value: 4000, scope: { skus: ['SN01'] } });
  const r = run([item(X.snack)], [p]);
  assert.equal(lineDiscount(r, 0), 3500);
  assert.equal(r.lines[0].net, 0);
});

test('STK-EX-10 identifying a member recalculates the basket (STK-R10)', () => {
  assert.equal(discountsOf(run([item(X.shampoo)], [P.P3]), 'P3'), 0);
  assert.equal(discountsOf(run([item(X.shampoo)], [P.P3], { customerGroup: 'member' }), 'P3'), 795);
});

test('STK-EX-11 VAT once on the total after discounts (STK-R11)', () => {
  const r = run(cart2, [P.P1, P.P9]);
  assert.equal(r.vat, 1946);
  assert.equal(r.exVat, 27798);
});

test('STK-EX-12 VAT rate comes from configuration by sale date (STK-R11)', () => {
  const line = [custom('V', 10700)];
  assert.equal(run(line, [], { at: '2027-09-30T23:59:00' }).vat, 700);
  assert.equal(run(line, [], { at: '2027-10-01T00:00:00' }).vat, 973);
});

test('STK-EX-13 promotion is checked when total is pressed, not when scanned (STK-R12)', () => {
  const p = promo({ ...P.P1, end: '2026-12-15T18:00:00' });
  assert.equal(discountsOf(run([item(X.shampoo)], [p], { at: '2026-12-15T18:01:00' }), 'P1'), 0);
});

test('STK-EX-14 total pressed one second before the end still gets it (STK-R12)', () => {
  const p = promo({ ...P.P1, end: '2026-12-15T18:00:00' });
  assert.equal(discountsOf(run([item(X.shampoo)], [p], { at: '2026-12-15T17:59:59' }), 'P1'), 1590);
});

test('STK-EX-16 STK-S06 offline terminal uses the last synced set (STK-R14)', () => {
  const late = promo({ ...P.P1, approvedAt: '2026-12-15T10:00:00' });
  const r = run([item(X.shampoo)], [late], { at: '2026-12-15T10:30:00' }, { id: 'PS-0900', syncedAt: '2026-12-15T09:00:00' });
  assert.equal(discountsOf(r, 'P1'), 0);
  assert.equal(r.promoSetId, 'PS-0900');
});

test('STK-EX-17 offline: end time is exclusive by the terminal clock (STK-R14)', () => {
  const p = promo({ ...P.P1, end: '2026-12-15T18:00:00' });
  assert.equal(discountsOf(run([item(X.shampoo)], [p], { at: '2026-12-15T18:00:00' }), 'P1'), 0);
});

test('STK-EX-18 only one basket promotion, the biggest (STK-R15)', () => {
  const r = run(cart2, [P.P1, P.P9, P.P10]);
  assert.equal(r.basketPromotion.promoId, 'P10');
  assert.equal(r.basketPromotion.amount, 5000);
});
