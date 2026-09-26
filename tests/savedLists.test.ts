import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeSavedLists, armyFingerprint } from '../src/utils/savedLists.ts';
import { emptyArmy } from '../src/utils/storage.ts';
import { munitorum } from '../src/data/munitorum/index.ts';
import type { ArmyList } from '../src/types/army.ts';
test('saved list library restores names, selection and attached wargear', () => {
  const army: ArmyList = { ...emptyArmy(munitorum.id), entries: [{ instanceId: 'guard', unitId: 'victrix-honour-guard', optionId: '3-models-1st', bucket: 'melee', upgrades: [{ upgradeId: 'per-banner-of-macragge-upgrade-only', quantity: 1 }] }] };
  const library = decodeSavedLists(JSON.stringify({ selectedId: 'a', lists: [{ id: 'a', name: 'My force', army }, { id: 'b', name: 'Empty', army: emptyArmy(munitorum.id) }] }), munitorum.id);
  assert.equal(library.selectedId, 'a');
  assert.equal(library.lists.length, 2);
  assert.deepEqual(library.lists[0].army, army);
  const draft = structuredClone(library.lists[0].army);
  draft.entries[0].upgrades![0].quantity = 3;
  assert.equal(library.lists[0].army.entries[0].upgrades![0].quantity, 1);
  assert.notEqual(armyFingerprint(draft), armyFingerprint(library.lists[0].army));
});
test('malformed library rows and duplicate IDs are discarded without losing valid lists', () => {
  assert.deepEqual(decodeSavedLists('{bad', munitorum.id), { selectedId: '', lists: [] });
  const army = emptyArmy(munitorum.id);
  const restored = decodeSavedLists(JSON.stringify({ selectedId: 'missing', lists: [null, { id: 'a', name: ' Force ', army }, { id: 'a', name: 'Duplicate', army }, { id: 'bad', name: '', army }, { id: 'bad2', name: 'Invalid army', army: {} }] }), munitorum.id);
  assert.equal(restored.selectedId, '');
  assert.deepEqual(restored.lists.map(list => list.name), ['Force']);
});
test('draft comparison ignores normalized empty wargear and detects moves', () => {
  const army: ArmyList = { ...emptyArmy(munitorum.id), entries: [{ instanceId: 'a', unitId: 'captain', optionId: '1-model', bucket: 'characters' }] };
  const loaded = decodeSavedLists(JSON.stringify({ lists: [{ id: 'a', name: 'Force', army }] }), munitorum.id).lists[0].army;
  assert.equal(armyFingerprint(army), armyFingerprint(loaded));
  loaded.entries[0].bucket = 'support';
  assert.notEqual(armyFingerprint(army), armyFingerprint(loaded));
});
