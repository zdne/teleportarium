import type { ArmyList } from '../types/army';
import type { SavedLists, SavedList } from '../types/savedLists';
import { decodeArmy } from './storage';
export function decodeSavedLists(raw: string | null, munitorumId: string): SavedLists {
  const fallback: SavedLists = { selectedId: '', lists: [] };
  try {
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    if (!value || !Array.isArray(value.lists)) return fallback;
    const seen = new Set<string>();
    const lists: SavedList[] = [];
    for (const item of value.lists) {
      if (!item || typeof item.id !== 'string' || !item.id || seen.has(item.id) || typeof item.name !== 'string' || !item.name.trim() || !item.army || !Array.isArray(item.army.entries) || typeof item.army.munitorumId !== 'string') continue;
      seen.add(item.id);
      lists.push({ id: item.id, name: item.name.trim(), army: decodeArmy(JSON.stringify(item.army), munitorumId) });
    }
    return { lists, selectedId: lists.some(list => list.id === value.selectedId) ? value.selectedId : '' };
  } catch { return fallback; }
}
export function armyFingerprint(army: ArmyList): string {
  return JSON.stringify({ ...army, entries: army.entries.map(entry => ({ ...entry, upgrades: [...(entry.upgrades ?? [])].sort((a, b) => a.upgradeId.localeCompare(b.upgradeId)) })) });
}
