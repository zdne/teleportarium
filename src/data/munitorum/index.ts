import snapshot from './space-marines-2026-09.json';
import type { Munitorum } from '../../types/munitorum';
export const munitorum: Munitorum = snapshot;
// Register additional verified snapshots here. No runtime downloads.
export const munitorums: Munitorum[] = [munitorum];
export function findMunitorum(id: string) { return munitorums.find(data => data.id === id); }
