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
    remove: (id: string) => setArmy(previous => ({ ...previous, entries: previous.entries.filter(entry => entry.instanceId !== id) })),
    move: (id: string, bucket: BucketId) => setArmy(previous => ({ ...previous, entries: previous.entries.map(entry => entry.instanceId === id ? { ...entry, bucket } : entry) })),
    clear: () => setArmy(emptyArmy(munitorum.id)),
  };
}
