import { useEffect, useRef, useState } from 'react';
import type { Munitorum } from '../types/munitorum';
export function EnhancementPicker({ data, detachmentId, close, add }: { data: Munitorum; detachmentId: string | undefined; close: () => void; add: (detachmentId: string, enhancementId: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const detachment = data.detachments?.find(detachment => detachment.id === detachmentId);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const modal = dialog.current!;
    modal.showModal();
    search.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { modal.close(); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, []);
  const matches = (detachment?.enhancements ?? []).filter(enhancement => enhancement.label.toLowerCase().includes(query.toLowerCase().trim()));
  return <dialog ref={dialog} className="unit-picker" onCancel={event => { event.preventDefault(); close(); }} aria-labelledby="enhancement-picker-heading" onClick={event => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
    <header className="picker-header"><p className="eyebrow">Detachment enhancements{detachment ? ` / ${detachment.name}` : ''}</p><button className="close-button" onClick={close} aria-label="Close enhancement picker">×</button><h2 id="enhancement-picker-heading">Add enhancement</h2></header>
    {detachment ? <><div className="search-block"><label htmlFor="enhancement-search">Search enhancements</label><input ref={search} id="enhancement-search" placeholder={`Search ${detachment.name}…`} value={query} onChange={event => setQuery(event.target.value)} autoComplete="off"/><span className="result-count">{matches.length} enhancements in register</span></div>
    <div className="picker-results"><ul className="picker-list">{matches.map(enhancement => <li key={enhancement.id}><button onClick={() => { add(detachment.id, enhancement.id); close(); }}><span>{enhancement.label}</span><strong>{enhancement.points}<small> pts</small></strong></button></li>)}</ul>{!matches.length && <p className="no-results">No matching enhancements. Try another name.</p>}</div></>
    : <div className="picker-results"><p className="no-results">Select a detachment first.</p></div>}
    <footer className="picker-footer">Choose any enhancement. No legality restrictions.</footer>
  </dialog>;
}
