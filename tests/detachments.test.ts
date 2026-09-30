import { test } from 'node:test';
import assert from 'node:assert/strict';
import { munitorum } from '../src/data/munitorum/index.ts';
import { calculateEntryPoints, calculateBucketPoints, resolveEnhancement } from '../src/utils/points.ts';
import { decodeArmy } from '../src/utils/storage.ts';
import type { ArmyEntry } from '../src/types/army.ts';

const detachment = munitorum.detachments!.find(detachment => detachment.id === 'gladius-task-force')!;
const enhancement = detachment.enhancements.find(enhancement => enhancement.id === 'artificer-armour')!;

test('enhancement entries default to quantity 1 and scale with quantity', () => {
  const entry: ArmyEntry = { instanceId: 'e1', unitId: detachment.id, optionId: enhancement.id, bucket: 'enhancements' };
  assert.equal(calculateEntryPoints(entry, munitorum), enhancement.points);
  assert.equal(calculateEntryPoints({ ...entry, quantity: 3 }, munitorum), enhancement.points * 3);
  assert.equal(calculateBucketPoints([entry, { ...entry, instanceId: 'e2', quantity: 2 }], 'enhancements', munitorum), enhancement.points * 3);
});

test('resolveEnhancement returns undefined for an unknown detachment or enhancement', () => {
  assert.equal(resolveEnhancement({ instanceId: 'a', unitId: 'missing-detachment', optionId: enhancement.id, bucket: 'enhancements' }, munitorum).enhancement, undefined);
  assert.equal(resolveEnhancement({ instanceId: 'a', unitId: detachment.id, optionId: 'missing-enhancement', bucket: 'enhancements' }, munitorum).enhancement, undefined);
  assert.equal(calculateEntryPoints({ instanceId: 'a', unitId: 'missing-detachment', optionId: enhancement.id, bucket: 'enhancements' }, munitorum), 0);
});

test('decodeArmy preserves detachmentId and per-entry quantity across a round trip', () => {
  const saved = JSON.stringify({
    munitorumId: munitorum.id, detachmentId: detachment.id,
    entries: [{ instanceId: 'e1', unitId: detachment.id, optionId: enhancement.id, bucket: 'enhancements', quantity: 4 }],
  });
  const army = decodeArmy(saved, munitorum.id);
  assert.equal(army.detachmentId, detachment.id);
  assert.equal(army.entries[0].quantity, 4);
  assert.equal(calculateEntryPoints(army.entries[0], munitorum), enhancement.points * 4);
});

test('decodeArmy discards a nonpositive or fractional quantity, leaving it to default to 1', () => {
  for (const quantity of [0, -1, 1.5, 'three']) {
    const saved = JSON.stringify({ munitorumId: munitorum.id, entries: [{ instanceId: 'e1', unitId: detachment.id, optionId: enhancement.id, bucket: 'enhancements', quantity }] });
    const army = decodeArmy(saved, munitorum.id);
    assert.equal(army.entries[0].quantity, undefined);
    assert.equal(calculateEntryPoints(army.entries[0], munitorum), enhancement.points);
  }
});

test('an empty or missing detachmentId is not persisted', () => {
  assert.equal(decodeArmy(JSON.stringify({ munitorumId: munitorum.id, entries: [] }), munitorum.id).detachmentId, undefined);
  assert.equal(decodeArmy(JSON.stringify({ munitorumId: munitorum.id, detachmentId: '', entries: [] }), munitorum.id).detachmentId, undefined);
});
