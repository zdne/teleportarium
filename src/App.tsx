import { useState } from 'react';
import type { BucketId } from './types/army';
import { useArmyList } from './hooks/useArmyList';
import { munitorum } from './data/munitorum';
import { calculateTotalPoints } from './utils/points';
import { ArmyHeader } from './components/ArmyHeader';
import { PointsSummary } from './components/PointsSummary';
import { BucketGrid } from './components/BucketGrid';
import { UnitPicker } from './components/UnitPicker';
export default function App() {
  const { army, warning, add, remove, move, clear } = useArmyList();
  const [picker, setPicker] = useState<BucketId | null>(null);
  return <main className="app-shell"><ArmyHeader/><PointsSummary total={calculateTotalPoints(army.entries, munitorum)} limit={army.targetPoints}/>
    {warning && <p className="storage-warning" role="alert">{warning}</p>}
    <div className="register-bar"><p><span className="eyebrow">Tactical allocation</span><span className="entry-count">{army.entries.length} {army.entries.length === 1 ? 'unit' : 'units'} assigned</span></p><button className="clear-button" disabled={!army.entries.length} onClick={() => { if (window.confirm('Clear all units from this army? This cannot be undone.')) clear(); }}>Clear list <span aria-hidden="true">×</span></button></div>
    <BucketGrid entries={army.entries} add={setPicker} remove={remove} move={move}/>
    <footer className="app-footer"><div><span className="footer-brand">Teleportarium</span><span>Independent army scratchpad · No legality validation</span></div><a href={munitorum.sourceUrl} target="_blank" rel="noreferrer">Munitorum source · {munitorum.sourceVersion} ↗</a><span className="save-status">{warning ? 'Session only' : 'Saved in this browser'}</span></footer>
    {picker && <UnitPicker bucket={picker} close={() => setPicker(null)} add={add}/>}
  </main>;
}
