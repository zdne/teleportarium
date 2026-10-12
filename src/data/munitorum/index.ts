import snapshot from './space-marines-2026-09.json';
import interim from './space-marines-interim-2026-09.json';
import bloodAngels from './blood-angels-2026-09.json';
import october from './space-marines-2026-10.json';
import type { Munitorum } from '../../types/munitorum';
export const munitorum: Munitorum = october;
// Register snapshots here, with provisional sources clearly labelled. First entry is the default.
export const munitorums: Munitorum[] = [munitorum, bloodAngels, snapshot, interim];
export function findMunitorum(id: string) { return munitorums.find(data => data.id === id); }
