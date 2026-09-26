import type { ArmyList } from '../types/army';
import { SAVED_LISTS_KEY } from '../types/savedLists';
import { munitorum } from '../data/munitorum';
import { armyFingerprint, decodeSavedLists } from '../utils/savedLists';
import { emptyArmy } from '../utils/storage';
import { useLocalStorage } from './useLocalStorage';
export function useSavedLists(army: ArmyList, load: (army: ArmyList) => void) {
  const { value: library, setValue: setLibrary, warning } = useLocalStorage(SAVED_LISTS_KEY, raw => decodeSavedLists(raw, munitorum.id));
  const selected = library.lists.find(list => list.id === library.selectedId);
  const dirty = selected ? armyFingerprint(army) !== armyFingerprint(selected.army) : army.entries.length > 0;
  function saveAsNew() {
    const name = window.prompt('Name this list:', selected ? `${selected.name} copy` : `List ${library.lists.length + 1}`)?.trim();
    if (!name) return;
    const id = crypto.randomUUID();
    setLibrary(previous => ({ selectedId: id, lists: [...previous.lists, { id, name, army: structuredClone(army) }] }));
  }
  return {
    library, selected, dirty, warning, saveAsNew,
    save: () => {
      if (!selected) { saveAsNew(); return; }
      setLibrary(previous => ({ ...previous, lists: previous.lists.map(list => list.id === selected.id ? { ...list, army: structuredClone(army) } : list) }));
    },
    choose: (id: string) => {
      if (id === library.selectedId) return;
      const target = library.lists.find(list => list.id === id);
      if (id && !target) return;
      if (dirty && !window.confirm('Replace the current draft? Changes not saved to a named list will be lost.')) return;
      load(target ? structuredClone(target.army) : emptyArmy(munitorum.id));
      setLibrary(previous => ({ ...previous, selectedId: id }));
    },
    deleteSelected: () => {
      if (!selected || !window.confirm(`Delete saved list “${selected.name}”? Your current draft will remain.`)) return;
      setLibrary(previous => ({ selectedId: '', lists: previous.lists.filter(list => list.id !== selected.id) }));
    },
  };
}
