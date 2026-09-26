import type { useSavedLists } from '../hooks/useSavedLists';
export function ListManager({ saved }: { saved: ReturnType<typeof useSavedLists> }) {
  return <section className="list-manager" aria-label="Saved army lists">
    <label className="sr-only" htmlFor="saved-list">Load saved list</label>
    <select id="saved-list" value={saved.library.selectedId} onChange={event => saved.choose(event.target.value)}><option value="">{saved.selected ? 'New empty list' : 'Current draft'}</option>{saved.library.lists.map(list => <option key={list.id} value={list.id}>{list.name}</option>)}</select>
    <button onClick={saved.save}>Save</button>
    <button onClick={saved.saveAsNew}>Save as new</button>
    {saved.selected && <button className="delete-list" onClick={saved.deleteSelected}>Delete</button>}
    <span className="list-status" role="status">{saved.warning ? 'Session only' : saved.selected ? saved.dirty ? 'Unsaved changes' : 'Saved' : 'Draft'}</span>
  </section>;
}
