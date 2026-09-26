import snapshot from './space-marines-2026-09.json';
import interim from './space-marines-interim-2026-09.json';
import type { Munitorum } from '../../types/munitorum';
export const munitorum: Munitorum = snapshot;
// Register snapshots here, with provisional sources clearly labelled.
export const munitorums: Munitorum[] = [munitorum, interim];
export function findMunitorum(id: string) { return munitorums.find(data => data.id === id); }
