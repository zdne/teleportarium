export const BUCKETS = [
  { id: 'characters', name: 'Characters', description: 'Command & leadership' },
  { id: 'shooting', name: 'Shooting', description: 'Ranged firepower' },
  { id: 'melee', name: 'Melee', description: 'Close combat' },
  { id: 'support', name: 'Support', description: 'Utility & reinforcement' },
] as const;
export type BucketId = typeof BUCKETS[number]['id'];
export type ArmyEntry = { instanceId: string; unitId: string; optionId: string; bucket: BucketId; upgrades?: { upgradeId: string; quantity: number }[] };
export type ArmyList = { targetPoints: number; munitorumId: string; entries: ArmyEntry[] };
export const DEFAULT_POINTS_LIMIT = 2000;
export const STORAGE_KEY = 'warhammer-list-builder:v1';
