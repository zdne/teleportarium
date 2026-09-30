import { test } from 'node:test';
import assert from 'node:assert/strict';
import { munitorum } from '../src/data/munitorum/index.ts';
import { calculateEntryPoints, calculateBucketPoints, resolveEntry, detachmentAsUnit, DETACHMENT_OPTION_ID } from '../src/utils/points.ts';
import { decodeArmy } from '../src/utils/storage.ts';
import type { ArmyEntry } from '../src/types/army.ts';

const detachment = munitorum.detachments!.find(detachment => detachment.id === 'gladius-task-force')!;
const enhancement = detachment.enhancements.find(enhancement => enhancement.id === 'artificer-armour')!;

test('a detachment resolves as a zero-point unit whose "wargear" is its enhancement list', () => {
  const entry: ArmyEntry = { instanceId: 'd1', unitId: detachment.id, optionId: DETACHMENT_OPTION_ID, bucket: 'enhancements' };
  const { unit, option } = resolveEntry(entry, munitorum);
  assert.equal(unit?.name, detachment.name);
  assert.equal(option?.points, 0);
  assert.equal(option?.label, `${detachment.dp}DP`);
  assert.equal(calculateEntryPoints(entry, munitorum), 0);
  assert.deepEqual(unit?.upgrades, detachment.enhancements);
});

test('enhancements attach to a detachment entry exactly like wargear attaches to a unit', () => {
  const entry: ArmyEntry = { instanceId: 'd1', unitId: detachment.id, optionId: DETACHMENT_OPTION_ID, bucket: 'enhancements',
    upgrades: [{ upgradeId: enhancement.id, quantity: 2 }] };
  assert.equal(calculateEntryPoints(entry, munitorum), enhancement.points * 2);
  assert.equal(calculateBucketPoints([entry], 'enhancements', munitorum), enhancement.points * 2);
});

test('an unknown detachment or enhancement resolves as unavailable rather than crashing', () => {
  assert.equal(resolveEntry({ instanceId: 'a', unitId: 'missing-detachment', optionId: DETACHMENT_OPTION_ID, bucket: 'enhancements' }, munitorum).option, undefined);
  const entry: ArmyEntry = { instanceId: 'a', unitId: detachment.id, optionId: DETACHMENT_OPTION_ID, bucket: 'enhancements',
    upgrades: [{ upgradeId: 'missing-enhancement', quantity: 1 }] };
  assert.equal(calculateEntryPoints(entry, munitorum), 0);
});

test('multiple detachments can be added to the same army with no uniqueness check', () => {
  const other = munitorum.detachments!.find(candidate => candidate.id !== detachment.id)!;
  const entries: ArmyEntry[] = [
    { instanceId: 'd1', unitId: detachment.id, optionId: DETACHMENT_OPTION_ID, bucket: 'enhancements' },
    { instanceId: 'd2', unitId: detachment.id, optionId: DETACHMENT_OPTION_ID, bucket: 'enhancements' },
    { instanceId: 'd3', unitId: other.id, optionId: DETACHMENT_OPTION_ID, bucket: 'enhancements' },
  ];
  assert.equal(calculateBucketPoints(entries, 'enhancements', munitorum), 0);
  for (const entry of entries) assert.ok(resolveEntry(entry, munitorum).option);
});

test('detachment entries and their enhancements survive a decodeArmy round trip', () => {
  const saved = JSON.stringify({ munitorumId: munitorum.id, entries: [
    { instanceId: 'd1', unitId: detachment.id, optionId: DETACHMENT_OPTION_ID, bucket: 'enhancements', upgrades: [{ upgradeId: enhancement.id, quantity: 3 }] },
  ] });
  const army = decodeArmy(saved, munitorum.id);
  assert.equal(army.entries.length, 1);
  assert.deepEqual(army.entries[0].upgrades, [{ upgradeId: enhancement.id, quantity: 3 }]);
  assert.equal(calculateEntryPoints(army.entries[0], munitorum), enhancement.points * 3);
});

test('detachmentAsUnit shapes the register entry for the unit picker', () => {
  const unit = detachmentAsUnit(detachment);
  assert.equal(unit.id, detachment.id);
  assert.equal(unit.name, detachment.name);
  assert.equal(unit.options.length, 1);
  assert.equal(unit.options[0].id, DETACHMENT_OPTION_ID);
  assert.equal(unit.upgrades, detachment.enhancements);
});
