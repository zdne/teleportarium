import { STORAGE_KEY, type BucketId } from '../types/army';
import { munitorum } from '../data/munitorum';
import { decodeArmy, emptyArmy } from '../utils/storage';
import { useLocalStorage } from './useLocalStorage';
export function useArmyList() {
  const { value: army, setValue: setArmy, warning } = useLocalStorage(STORAGE_KEY, raw => decodeArmy(raw, munitorum.id));
  return {
    army, warning,
    add: (unitId: string, optionId: string, bucket: BucketId) => setArmy(previous => ({
      ...previous, entries: [...previous.entries, { instanceId: crypto.randomUUID(), unitId, optionId, bucket }],
    })),
    duplicate: (id: string) => setArmy(previous => {
      const index = previous.entries.findIndex(entry => entry.instanceId === id);
      if (index < 0) return previous;
      const entries = [...previous.entries];
      entries.splice(index + 1, 0, { ...entries[index], instanceId: crypto.randomUUID() });
      return { ...previous, entries };
    }),
    remove: (id: string) => setArmy(previous => ({ ...previous, entries: previous.entries.filter(entry => entry.instanceId !== id) })),
    setUpgrade: (id: string, upgradeId: string, quantity: number) => setArmy(previous => ({ ...previous,
      entries: previous.entries.map(entry => entry.instanceId === id ? { ...entry,
        upgrades: [...(entry.upgrades ?? []).filter(upgrade => upgrade.upgradeId !== upgradeId),
          ...(Number.isSafeInteger(quantity) && quantity > 0 ? [{ upgradeId, quantity }] : [])],
      } : entry),
    })),
    move: (id: string, bucket: BucketId) => setArmy(previous => ({ ...previous, entries: previous.entries.map(entry => entry.instanceId === id ? { ...entry, bucket } : entry) })),
    clear: () => setArmy(emptyArmy(munitorum.id)),
  };
}
