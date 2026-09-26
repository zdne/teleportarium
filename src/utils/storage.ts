import { BUCKETS, DEFAULT_POINTS_LIMIT, type ArmyList, type ArmyEntry } from '../types/army';
import { munitorum } from '../data/munitorum';
export function emptyArmy(munitorumId: string): ArmyList {
  return { targetPoints: DEFAULT_POINTS_LIMIT, munitorumId, entries: [] };
}
export function decodeArmy(raw: string | null, munitorumId: string): ArmyList {
  const fallback = emptyArmy(munitorumId);
  if (!raw) return fallback;
  try {
    const value = JSON.parse(raw);
    if (!value || !Array.isArray(value.entries) || typeof value.munitorumId !== 'string') return fallback;
    const seen = new Set<string>();
    const entries: (ArmyEntry & { upgrades: NonNullable<ArmyEntry['upgrades']> })[] = value.entries.filter((entry: unknown) => {
      if (!entry || typeof entry !== 'object') return false;
      const e = entry as Record<string, unknown>;
      if (typeof e.instanceId !== 'string' || !e.instanceId || seen.has(e.instanceId) ||
          typeof e.unitId !== 'string' || typeof e.optionId !== 'string' ||
          !BUCKETS.some(bucket => bucket.id === e.bucket)) return false;
      seen.add(e.instanceId);
      return true;
    }).map((e: ArmyEntry) => {
      const upgrades = new Map<string, number>();
      for (const item of Array.isArray(e.upgrades) ? e.upgrades : []) {
        if (item && typeof item.upgradeId === 'string' && Number.isSafeInteger(item.quantity) && item.quantity > 0) {
          upgrades.set(item.upgradeId, item.quantity);
        }
      }
      return { instanceId: e.instanceId, unitId: e.unitId, optionId: e.optionId, bucket: e.bucket,
        upgrades: [...upgrades].map(([upgradeId, quantity]) => ({ upgradeId, quantity })) };
    });
    // Only attach old standalone upgrades when the parent is unambiguous.
    const migrated = new Set<string>();
    for (const entry of entries) {
      const unit = munitorum.units.find(unit => unit.id === entry.unitId);
      if (!unit?.upgrades?.some(upgrade => upgrade.id === entry.optionId)) continue;
      const parents = entries.filter(candidate => candidate.unitId === entry.unitId && candidate.bucket === entry.bucket && unit.options.some(option => option.id === candidate.optionId));
      if (parents.length !== 1) continue;
      const parent = parents[0];
      const selected = parent.upgrades.find(upgrade => upgrade.upgradeId === entry.optionId);
      if (selected) selected.quantity += 1;
      else parent.upgrades.push({ upgradeId: entry.optionId, quantity: 1 });
      migrated.add(entry.instanceId);
    }
    return { ...fallback, entries: entries.filter(entry => !migrated.has(entry.instanceId)) } as ArmyList;
  } catch { return fallback; }
}
