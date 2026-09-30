import { useState } from 'react';
import type { BucketId } from './types/army';
import { useArmyList } from './hooks/useArmyList';
import { munitorum, findMunitorum } from './data/munitorum';
import { calculateTotalPoints } from './utils/points';
import { ArmyHeader } from './components/ArmyHeader';
import { PointsSummary } from './components/PointsSummary';
import { BucketGrid } from './components/BucketGrid';
import { UnitPicker } from './components/UnitPicker';
import { useSavedLists } from './hooks/useSavedLists';
import { ListManager } from './components/ListManager';
export default function App() {
  const { army, warning, add, duplicate, remove, move, setUpgrade, clear, load, switchMunitorum } = useArmyList();
  const source = findMunitorum(army.munitorumId);
  const data = source ?? { ...munitorum, id: army.munitorumId, label: 'Unavailable MFM', units: [] };
  const saved = useSavedLists(army, load);
  const storageWarning = warning || saved.warning;
  const [picker, setPicker] = useState<BucketId | null>(null);
  return <main className="app-shell"><ArmyHeader data={data} switchMunitorum={switchMunitorum}/><PointsSummary total={calculateTotalPoints(army.entries, data)} limit={army.targetPoints}/>
    <ListManager saved={saved}/>
    {storageWarning && <p className="storage-warning" role="alert">{storageWarning}</p>}
    {!source && <p className="storage-warning" role="alert">This list’s MFM is unavailable. Choose a points source to calculate its totals.</p>}
    <div className="register-bar"><p><span className="eyebrow">Tactical allocation</span><span className="entry-count">{army.entries.length} {army.entries.length === 1 ? 'unit' : 'units'} assigned</span></p><button className="clear-button" disabled={!army.entries.length} onClick={() => { if (window.confirm('Clear all units from this army? This cannot be undone.')) clear(); }}>Clear list <span aria-hidden="true">×</span></button></div>
    <BucketGrid data={data} entries={army.entries} add={setPicker} duplicate={duplicate} remove={remove} move={move} setUpgrade={setUpgrade}/>
    <footer className="app-footer"><div><span className="footer-brand">Teleportarium</span><span>Independent army scratchpad · No legality validation</span></div>{source && <a href={data.sourceUrl} target="_blank" rel="noreferrer">Munitorum source · {data.sourceVersion} ↗</a>}<span className="save-status">{storageWarning ? 'Session only' : 'Draft saved in this browser'}</span></footer>
    {picker && <UnitPicker key={data.id} data={data} bucket={picker} close={() => setPicker(null)} add={add}/>}
  </main>;
}
