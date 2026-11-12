import { test } from 'node:test';
import assert from 'node:assert/strict';
import { approve, edit, forTerminals, reject, submit, validate } from '../src/promotions/lifecycle.mjs';

const draft = { id: 'P1', version: 1, status: 'draft', createdBy: 'mkt-a', name: 'Dầu gội −10%', type: 'percent', value: 10, start: '2026-12-01T00:00:00', end: '2027-01-01T00:00:00', scope: { skus: ['SH01'] } };

test('PRM-EX-15 PRM-S04 the creator cannot approve their own promotion (PRM-R08)', () => {
  const p = submit(draft, 'mkt-a');
  assert.throws(() => approve(p, 'mkt-a', '2026-11-20T09:00:00'), /khác người tạo/);
  assert.equal(approve(p, 'boss-b', '2026-11-20T09:00:00').status, 'approved');
});

test('PRM-EX-22 cannot submit with missing fields, each one is listed (PRM-R12)', () => {
  const p = { ...draft, end: '', scope: {} };
  assert.deepEqual(validate(p), ['end', 'scope']);
  assert.throws(() => submit(p, 'mkt-a'), (e) => e.missing.length === 2);
});

test('PRM-R08 only approved promotions reach the terminals', () => {
  const approved = approve(submit(draft, 'mkt-a'), 'boss-b', '2026-11-20T09:00:00');
  assert.deepEqual(forTerminals([draft, approved]).map((p) => p.status), ['approved']);
});

test('PRM-R08 reject needs a reason and goes back to draft', () => {
  const p = submit(draft, 'mkt-a');
  assert.throws(() => reject(p, 'boss-b', ''), /lý do/);
  assert.equal(reject(p, 'boss-b', 'sai phạm vi').status, 'draft');
});

test('PRM-R09 editing an approved promotion creates version 2 pending, version 1 keeps running', () => {
  const v1 = approve(submit(draft, 'mkt-a'), 'boss-b', '2026-11-20T09:00:00');
  const { current, next } = edit(v1, { value: 15 }, 'mkt-a');
  assert.equal(current.status, 'approved');
  assert.equal(next.version, 2);
  assert.equal(next.status, 'pending');
  assert.deepEqual(forTerminals([current, next]).map((p) => p.version), [1]);
});
