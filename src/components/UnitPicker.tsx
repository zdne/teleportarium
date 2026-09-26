import { useEffect, useMemo, useRef, useState } from 'react';
import { BUCKETS, type BucketId } from '../types/army';
import type { Munitorum, MunitorumUnit } from '../types/munitorum';
import { UnitOptionPicker } from './UnitOptionPicker';
export function UnitPicker({ data, bucket, close, add }: { data: Munitorum; bucket: BucketId; close: () => void; add: (unitId: string, optionId: string, bucket: BucketId) => void }) {
  const sortedUnits = useMemo(() => [...data.units].sort((a, b) => a.name.localeCompare(b.name)), [data]);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MunitorumUnit | null>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const modal = dialog.current!;
    modal.showModal();
    search.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { modal.close(); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, []);
  function select(unit: MunitorumUnit, optionId: string) { add(unit.id, optionId, bucket); close(); }
  const matches = sortedUnits.filter(unit => unit.name.toLowerCase().includes(query.toLowerCase().trim()));
  return <dialog ref={dialog} className="unit-picker" onCancel={event => { event.preventDefault(); close(); }} aria-labelledby="picker-heading" onClick={event => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
    <header className="picker-header"><p className="eyebrow">Unit register / Space Marines</p><button className="close-button" onClick={close} aria-label="Close unit picker">×</button><h2 id="picker-heading">Add to {BUCKETS.find(item => item.id === bucket)?.name}</h2></header>
    {selected ? <><div className="option-heading"><button onClick={() => { setSelected(null); requestAnimationFrame(() => search.current?.focus()); }}>← Back to register</button><h3>{selected.name}</h3></div><div className="picker-results"><UnitOptionPicker unit={selected} select={id => select(selected, id)}/></div></> : <><div className="search-block"><label htmlFor="unit-search">Search units</label><input ref={search} id="unit-search" placeholder="Search Space Marines…" value={query} onChange={event => setQuery(event.target.value)} autoComplete="off"/><span className="result-count">{matches.length} units in register</span></div><div className="picker-results"><ul className="picker-list">{matches.map(unit => <li key={unit.id}><button onClick={() => unit.options.length === 1 ? select(unit, unit.options[0].id) : setSelected(unit)}><span>{unit.name}</span>{unit.options.length === 1 ? <strong>{unit.options[0].points}<small> pts</small></strong> : <span className="option-indicator">{unit.options.length} options <b>›</b></span>}</button></li>)}</ul>{!matches.length && <p className="no-results">No matching units. Try another name.</p>}</div></>}
    <footer className="picker-footer">Choose any unit for any role. No legality restrictions.</footer>
  </dialog>;
}
