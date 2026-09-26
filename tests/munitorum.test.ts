import { test } from 'node:test';
import assert from 'node:assert/strict';
import { munitorum, munitorums } from '../src/data/munitorum/index.ts';
import { decodeArmy } from '../src/utils/storage.ts';
import { decodeSavedLists, armyFingerprint } from '../src/utils/savedLists.ts';
import { calculateBucketPoints, calculateTotalPoints } from '../src/utils/points.ts';
import type { ArmyList } from '../src/types/army.ts';
test('switching source reprices the same entries and restores the saved MFM', () => {
  // Synthetic test fixture only; never shipped as a points source.
  const alternative = structuredClone(munitorum);
  alternative.id = 'test-alternative';
  const unit = alternative.units.find(unit => unit.id === 'victrix-honour-guard')!;
  unit.options.find(option => option.id === '3-models-1st')!.points = 120;
  unit.upgrades!.find(upgrade => upgrade.id === 'per-banner-of-macragge-upgrade-only')!.points = 20;
  munitorums.push(alternative);
  try {
    const original: ArmyList = { targetPoints: 2000, munitorumId: munitorum.id, entries: [{ instanceId: 'guard', unitId: unit.id, optionId: '3-models-1st', bucket: 'melee', upgrades: [{ upgradeId: 'per-banner-of-macragge-upgrade-only', quantity: 1 }] }] };
    const switched = { ...original, munitorumId: alternative.id };
    assert.equal(calculateTotalPoints(original.entries, munitorum), 125);
    assert.equal(calculateTotalPoints(switched.entries, alternative), 140);
    assert.equal(calculateBucketPoints(switched.entries, 'melee', alternative), 140);
    assert.notEqual(armyFingerprint(original), armyFingerprint(switched));
    assert.equal(decodeArmy(JSON.stringify(switched), munitorum.id).munitorumId, alternative.id);
    const restored = decodeSavedLists(JSON.stringify({ selectedId: 'a', lists: [{ id: 'a', name: 'Alternative force', army: switched }] }), munitorum.id);
    assert.equal(restored.lists[0].army.munitorumId, alternative.id);
    assert.deepEqual(restored.lists[0].army.entries, switched.entries);
    assert.equal(calculateTotalPoints(switched.entries, { ...alternative, units: [] }), 0);
  } finally { munitorums.pop(); }
});
test('unavailable MFM identifiers are retained instead of silently replacing the source', () => {
  const restored = decodeArmy(JSON.stringify({ munitorumId: 'missing-edition', entries: [] }), munitorum.id);
  assert.equal(restored.munitorumId, 'missing-edition');
});
