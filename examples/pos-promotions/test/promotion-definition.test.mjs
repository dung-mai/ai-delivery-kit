// QA tests for PRM, one per example id in product/specs/promotion-definition/examples.md. Frozen after review.
// Approval and field validation examples belong to slice S2 (not tested here yet).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { price } from '../src/pricing/engine.mjs';
import { inScope } from '../src/pricing/eligibility.mjs';
import { PRODUCTS as X, P, item, custom, promo, promoSet, basket, CONFIG, discountsOf } from './fixtures.mjs';

const run = (lines, promos, o = {}) => price(basket(lines, o), promoSet(promos), CONFIG);
const milk10 = promo({ id: 'M10', name: 'Sữa −10%', type: 'percent', value: 10, scope: { skus: ['MK01'] } });

test('PRM-EX-01 PRM-S01 inside the window (PRM-R02)', () => {
  assert.equal(discountsOf(run([item(X.milk, 2)], [milk10], { at: '2026-12-15T10:00:00' }), 'M10'), 900);
});
test('PRM-EX-02 start is included (PRM-R02)', () => {
  assert.equal(discountsOf(run([item(X.milk)], [milk10], { at: '2026-12-01T00:00:00' }), 'M10'), 450);
});
test('PRM-EX-03 end is excluded (PRM-R02)', () => {
  assert.equal(discountsOf(run([item(X.milk)], [milk10], { at: '2027-01-01T00:00:00' }), 'M10'), 0);
});
test('PRM-EX-04 store not in the list (PRM-R03)', () => {
  const p = promo({ ...milk10, stores: ['S01', 'S02'] });
  assert.equal(discountsOf(run([item(X.milk)], [p], { store: 'S03' }), 'M10'), 0);
});
test('PRM-EX-05 empty store list means every store (PRM-R03)', () => {
  assert.equal(discountsOf(run([item(X.milk)], [milk10], { store: 'S03' }), 'M10'), 450);
});
test('PRM-EX-06 PRM-S02 members only, customer not identified (PRM-R04)', () => {
  const p = promo({ ...milk10, customerGroup: 'member' });
  assert.equal(discountsOf(run([item(X.milk)], [p]), 'M10'), 0);
});
test('PRM-EX-07 members only, member identified (PRM-R04)', () => {
  const p = promo({ ...milk10, customerGroup: 'member' });
  assert.equal(discountsOf(run([item(X.milk)], [p], { customerGroup: 'member' }), 'M10'), 450);
});
test('PRM-EX-08 PRM-S03 exclusion wins over category (PRM-R05)', () => {
  const scope = { categories: ['drinks'], exclude: ['CL01'] };
  assert.equal(inScope(item(X.milk), scope), true);
  assert.equal(inScope(item(X.cola), scope), false);
});
test('PRM-EX-09 amount threshold reached exactly (PRM-R06)', () => {
  const p = promo({ id: 'T5', name: '−5% từ 500', type: 'percent', value: 5, minAmount: 50000, scope: { categories: ['misc'] } });
  assert.equal(discountsOf(run([custom('A', 50000)], [p]), 'T5'), 2500);
});
test('PRM-EX-10 one satang under the threshold (PRM-R06)', () => {
  const p = promo({ id: 'T5', name: '−5% từ 500', type: 'percent', value: 5, minAmount: 50000, scope: { categories: ['misc'] } });
  assert.equal(discountsOf(run([custom('A', 49999)], [p]), 'T5'), 0);
});
test('PRM-EX-11 buy 2 get 1, 7 cans: applied twice (PRM-R07)', () => {
  assert.equal(discountsOf(run([item(X.cola, 7)], [P.P6]), 'P6'), 4000);
});
test('PRM-EX-12 buy 2 get 1, max once per sale (PRM-R07)', () => {
  assert.equal(discountsOf(run([item(X.cola, 7)], [promo({ ...P.P6, maxTimes: 1 })]), 'P6'), 2000);
});
test('PRM-EX-13 buy 2 get 1 with 2 cans: not applied (PRM-R07)', () => {
  assert.equal(discountsOf(run([item(X.cola, 2)], [P.P6]), 'P6'), 0);
});
test('PRM-EX-14 pending promotion never applies (PRM-R08)', () => {
  assert.equal(discountsOf(run([item(X.shampoo)], [promo({ ...P.P1, status: 'pending' })]), 'P1'), 0);
});
test('PRM-EX-16 PRM-S05 version 1 keeps running while version 2 waits; sale records the version (PRM-R09)', () => {
  const v2 = promo({ ...P.P1, version: 2, value: 15, status: 'pending' });
  const r = run([item(X.shampoo)], [P.P1, v2]);
  const d = r.lines[0].discounts;
  assert.equal(d.length, 1);
  assert.equal(d[0].amount, 1590);
  assert.equal(d[0].version, 1);
});
test('PRM-EX-17 fixed amount bigger than the price (PRM-R10)', () => {
  const p = promo({ id: 'S40', name: 'Snack giảm 40', type: 'amount', value: 4000, scope: { skus: ['SN01'] } });
  assert.equal(discountsOf(run([item(X.snack)], [p]), 'S40'), 3500);
});
test('PRM-EX-18 maximum discount per promotion (PRM-R11)', () => {
  const p = promo({ id: 'C20', name: '−20% tối đa 100', type: 'percent', value: 20, maxDiscount: 10000, scope: { categories: ['misc'] } });
  assert.equal(discountsOf(run([custom('A', 60000)], [p]), 'C20'), 10000);
});
test('PRM-EX-19 percent off an item (PRM-R01)', () => {
  const r = run([item(X.shampoo)], [P.P1]);
  assert.equal(discountsOf(r, 'P1'), 1590);
  assert.equal(r.net, 14310);
});
test('PRM-EX-20 special price (PRM-R01)', () => {
  const p = promo({ id: 'R169', name: 'Gạo 169', type: 'special', value: 16900, scope: { skus: ['RC01'] } });
  assert.equal(discountsOf(run([item(X.rice)], [p]), 'R169'), 2000);
});
test('PRM-EX-21 bundle at a fixed price, split pro rata (PRM-R01)', () => {
  const p = promo({ id: 'CB49', name: 'Combo Snack + Cola 49', type: 'bundle', items: ['SN01', 'CL01'], bundlePrice: 4900, scope: { skus: ['SN01', 'CL01'] } });
  const r = run([item(X.snack), item(X.cola)], [p]);
  assert.equal(discountsOf(r, 'CB49'), 600);
  assert.equal(r.lines[0].discounts[0].amount, 382);
  assert.equal(r.lines[1].discounts[0].amount, 218);
});
test('PRM-EX-23 buy 2 get 1 gives away the cheapest unit (PRM-R01, PRM-R07)', () => {
  const p = promo({ id: 'D21', name: 'Đồ uống mua 2 tặng 1', type: 'buyxgety', x: 2, y: 1, scope: { categories: ['drinks'] } });
  assert.equal(discountsOf(run([item(X.milk), item(X.cola, 2)], [p]), 'D21'), 2000);
});
