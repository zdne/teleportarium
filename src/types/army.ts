export const BUCKETS = [
  { id: 'hammer', name: 'Hammer', description: 'Primary damage dealers' },
  { id: 'workhorse', name: 'Workhorse', description: 'Leaders & mainline units' },
  { id: 'utility', name: 'Utility', description: 'Scoring, screening & support' },
  { id: 'enhancements', name: 'Enhancements & Upgrades', description: 'Detachment enhancements & upgrades' },
] as const;
export type BucketId = typeof BUCKETS[number]['id'];
// Buckets from before the Hammer/Workhorse/Utility split, mapped by role when old saves load.
export const LEGACY_BUCKETS: Record<string, BucketId> = { characters: 'workhorse', shooting: 'hammer', melee: 'hammer', support: 'utility' };
export type ArmyEntry = { instanceId: string; unitId: string; optionId: string; bucket: BucketId; upgrades?: { upgradeId: string; quantity: number }[] };
export type ArmyList = { targetPoints: number; munitorumId: string; entries: ArmyEntry[] };
export const DEFAULT_POINTS_LIMIT = 2000;
export const STORAGE_KEY = 'warhammer-list-builder:v1';
