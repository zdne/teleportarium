import { test } from 'node:test';
import assert from 'node:assert/strict';
import { munitorum } from '../src/data/munitorum/index.ts';
import { calculateTotalPoints, calculateBucketPoints, calculateRemainingPoints } from '../src/utils/points.ts';
import { decodeArmy } from '../src/utils/storage.ts';
import type { ArmyEntry } from '../src/types/army.ts';
test('duplicates, bucket movement, removals and over-limit totals are derived independently', () => {
  const unit = munitorum.units.find(unit => unit.id === 'captain')!;
  const entries: ArmyEntry[] = Array.from({ length: 26 }, (_, i) => ({ instanceId: String(i), unitId: unit.id, optionId: unit.options[0].id, bucket: i ? 'shooting' : 'characters' }));
  assert.equal(calculateTotalPoints(entries, munitorum), 2080);
  assert.equal(calculateBucketPoints(entries, 'characters', munitorum), 80);
  assert.equal(calculateRemainingPoints(2080, 2000), -80);
  entries[0].bucket = 'support';
  assert.equal(calculateBucketPoints(entries, 'characters', munitorum), 0);
  assert.equal(calculateBucketPoints(entries, 'support', munitorum), 80);
  assert.equal(calculateTotalPoints(entries.slice(1), munitorum), 2000);
});
test('corrupt saves reset; valid entries survive while malformed rows are discarded', () => {
  assert.deepEqual(decodeArmy('{bad', munitorum.id).entries, []);
  assert.deepEqual(decodeArmy('null', munitorum.id).entries, []);
  const entry = { instanceId: 'a', unitId: 'missing-unit', optionId: 'missing-option', bucket: 'support' };
  const army = decodeArmy(JSON.stringify({ munitorumId: 'old', targetPoints: 'bad', entries: [null, entry, entry, { ...entry, instanceId: 'b', bucket: 'invalid' }] }), munitorum.id);
  assert.equal(army.entries.length, 1);
  assert.equal(army.targetPoints, 2000);
  assert.equal(army.munitorumId, munitorum.id);
  assert.equal(calculateTotalPoints(army.entries, munitorum), 0);
});
test('dataset has unique identifiers and source-backed nonnegative options', () => {
  assert.equal(munitorum.units.length, 103);
  assert.equal(new Set(munitorum.units.map(unit => unit.id)).size, munitorum.units.length);
  for (const unit of munitorum.units) {
    assert.ok(unit.options.length);
    assert.equal(new Set(unit.options.map(option => option.id)).size, unit.options.length);
    for (const option of unit.options) assert.ok(Number.isInteger(option.points) && option.points >= 0);
  }
});
