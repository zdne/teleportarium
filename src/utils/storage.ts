import { BUCKETS, DEFAULT_POINTS_LIMIT, type ArmyList } from '../types/army';
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
    const entries = value.entries.filter((entry: unknown) => {
      if (!entry || typeof entry !== 'object') return false;
      const e = entry as Record<string, unknown>;
      if (typeof e.instanceId !== 'string' || !e.instanceId || seen.has(e.instanceId) ||
          typeof e.unitId !== 'string' || typeof e.optionId !== 'string' ||
          !BUCKETS.some(bucket => bucket.id === e.bucket)) return false;
      seen.add(e.instanceId);
      return true;
    }).map((e: Record<string, string>) => ({ instanceId: e.instanceId, unitId: e.unitId, optionId: e.optionId, bucket: e.bucket }));
    return { ...fallback, entries } as ArmyList;
  } catch { return fallback; }
}
