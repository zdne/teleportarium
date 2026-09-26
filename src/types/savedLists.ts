import type { ArmyList } from './army';
export type SavedList = { id: string; name: string; army: ArmyList };
export type SavedLists = { selectedId: string; lists: SavedList[] };
export const SAVED_LISTS_KEY = 'warhammer-saved-lists:v1';
