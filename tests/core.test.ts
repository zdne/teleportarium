import { test } from 'node:test';
import assert from 'node:assert/strict';
import { munitorum } from '../src/data/munitorum/index.ts';
import { calculateTotalPoints, calculateBucketPoints, calculateRemainingPoints, calculateEntryPoints } from '../src/utils/points.ts';
import { decodeArmy } from '../src/utils/storage.ts';
import type { ArmyEntry } from '../src/types/army.ts';
test('duplicates, bucket movement, removals and over-limit totals are derived independently', () => {
  const unit = munitorum.units.find(unit => unit.id === 'captain')!;
  const entries: ArmyEntry[] = Array.from({ length: 26 }, (_, i) => ({ instanceId: String(i), unitId: unit.id, optionId: unit.options[0].id, bucket: i ? 'shooting' : 'characters' }));
  assert.equal(calculateTotalPoints(entries, munitorum), 2340);
  assert.equal(calculateBucketPoints(entries, 'characters', munitorum), 90);
  assert.equal(calculateRemainingPoints(2340, 2000), -340);
  entries[0].bucket = 'support';
  assert.equal(calculateBucketPoints(entries, 'characters', munitorum), 0);
  assert.equal(calculateBucketPoints(entries, 'support', munitorum), 90);
  assert.equal(calculateTotalPoints(entries.slice(1), munitorum), 2250);
});
test('corrupt saves reset; valid entries survive while malformed rows are discarded', () => {
  assert.deepEqual(decodeArmy('{bad', munitorum.id).entries, []);
  assert.deepEqual(decodeArmy('null', munitorum.id).entries, []);
  const entry = { instanceId: 'a', unitId: 'missing-unit', optionId: 'missing-option', bucket: 'support' };
  const army = decodeArmy(JSON.stringify({ munitorumId: 'old', targetPoints: 'bad', entries: [null, entry, entry, { ...entry, instanceId: 'b', bucket: 'invalid' }] }), munitorum.id);
  assert.equal(army.entries.length, 1);
  assert.equal(army.targetPoints, 2000);
  assert.equal(army.munitorumId, 'old');
  assert.equal(calculateTotalPoints(army.entries, munitorum), 0);
});
test('dataset has unique identifiers and source-backed nonnegative options', () => {
  assert.equal(munitorum.units.length, 101);
  assert.equal(new Set(munitorum.units.map(unit => unit.id)).size, munitorum.units.length);
  for (const unit of munitorum.units) {
    assert.ok(unit.options.length);
    assert.equal(new Set(unit.options.map(option => option.id)).size, unit.options.length);
    for (const option of [...unit.options, ...(unit.upgrades ?? [])]) assert.ok(Number.isInteger(option.points) && option.points >= 0);
  }
  assert.equal(munitorum.detachments?.length, 25);
  assert.equal(new Set(munitorum.detachments!.map(detachment => detachment.id)).size, munitorum.detachments!.length);
  for (const detachment of munitorum.detachments!) {
    assert.ok(Number.isInteger(detachment.dp) && detachment.dp > 0);
    assert.ok(detachment.enhancements.length);
    assert.equal(new Set(detachment.enhancements.map(enhancement => enhancement.id)).size, detachment.enhancements.length);
    for (const enhancement of detachment.enhancements) assert.ok(Number.isInteger(enhancement.points) && enhancement.points >= 0);
  }
});
test('attached upgrade quantities contribute to unit, bucket and army totals', () => {
  const entry: ArmyEntry = { instanceId: 'guard', unitId: 'terminator-squad', optionId: '5-models-1st-to-2nd', bucket: 'melee', upgrades: [
    { upgradeId: 'cyclone-missile-launcher', quantity: 2 },
    { upgradeId: 'missing', quantity: 1 },
  ] };
  assert.equal(calculateEntryPoints(entry, munitorum), 215);
  assert.equal(calculateBucketPoints([entry], 'melee', munitorum), 215);
  assert.equal(calculateTotalPoints([entry, { ...entry, instanceId: 'copy' }], munitorum), 430);
  const restored = decodeArmy(JSON.stringify({ munitorumId: munitorum.id, entries: [entry] }), munitorum.id);
  assert.deepEqual(restored.entries[0].upgrades, entry.upgrades);
  assert.equal(calculateTotalPoints(restored.entries, munitorum), 215);
});
test('old standalone upgrades migrate only when the matching parent is unambiguous', () => {
  const parent = { instanceId: 'guard', unitId: 'terminator-squad', optionId: '5-models-1st-to-2nd', bucket: 'melee' };
  const banner = { ...parent, instanceId: 'banner', optionId: 'cyclone-missile-launcher' };
  const saved = (entries: unknown[]) => JSON.stringify({ munitorumId: munitorum.id, entries });
  const migrated = decodeArmy(saved([parent, banner]), munitorum.id);
  assert.equal(migrated.entries.length, 1);
  assert.equal(calculateTotalPoints(migrated.entries, munitorum), 205);
  assert.deepEqual(migrated.entries[0].upgrades, [{ upgradeId: banner.optionId, quantity: 1 }]);
  const ambiguous = decodeArmy(saved([parent, { ...parent, instanceId: 'second' }, banner]), munitorum.id);
  assert.equal(ambiguous.entries.length, 3);
  assert.equal(calculateTotalPoints(ambiguous.entries, munitorum), 400);
});
test('invalid upgrade quantities are discarded and duplicate upgrade ids normalized', () => {
  const restored = decodeArmy(JSON.stringify({ munitorumId: munitorum.id, entries: [{ instanceId: 'a', unitId: 'captain', optionId: '1-model', bucket: 'characters', upgrades: [null, { upgradeId: 'a', quantity: -1 }, { upgradeId: 'b', quantity: 1.5 }, { upgradeId: 'c', quantity: 1 }, { upgradeId: 'c', quantity: 2 }] }] }), munitorum.id);
  assert.deepEqual(restored.entries[0].upgrades, [{ upgradeId: 'c', quantity: 2 }]);
});
