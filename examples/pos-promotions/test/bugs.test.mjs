// Regression tests for defects found after S1. One test per defect, named after the rule it breaks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { price } from '../src/pricing/engine.mjs';
import { PRODUCTS as X, item, promo, promoSet, basket, CONFIG, discountsOf } from './fixtures.mjs';

test('PRM-R01 PRM-R07 buy 2 get 1 gives away the cheapest unit whatever the scan order', () => {
  const p = promo({ id: 'D21', name: 'Đồ uống mua 2 tặng 1', type: 'buyxgety', x: 2, y: 1, scope: { categories: ['drinks'] } });
  const r = price(basket([item(X.cola, 2), item(X.milk)]), promoSet([p]), CONFIG);
  assert.equal(discountsOf(r, 'D21'), 2000);
});
