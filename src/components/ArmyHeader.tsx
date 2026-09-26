import { munitorums } from '../data/munitorum';
import type { Munitorum } from '../types/munitorum';
export function ArmyHeader({ data, switchMunitorum }: { data: Munitorum; switchMunitorum: (id: string) => void }) {
  return <header className="army-header">
    <div className="title-block"><div><p className="eyebrow">Adeptus Astartes / {data.faction}</p><h1>Teleportarium<span className="title-dot">.</span></h1><p className="subtitle">Four roles. One force. Your tactics.</p></div><div className="edition"><label htmlFor="mfm-source">Points source / MFM</label><select id="mfm-source" value={data.id} onChange={event => switchMunitorum(event.target.value)}>{!munitorums.some(source => source.id === data.id) && <option value={data.id}>Unavailable MFM</option>}{munitorums.map(source => <option key={source.id} value={source.id}>{source.label}</option>)}</select><small>Personal tactical classifications</small></div></div>
  </header>;
}
