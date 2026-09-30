import { munitorums } from '../data/munitorum';
import type { Munitorum } from '../types/munitorum';
export function ArmyHeader({ data, detachmentId, switchMunitorum, switchDetachment }: { data: Munitorum; detachmentId?: string; switchMunitorum: (id: string) => void; switchDetachment: (id: string) => void }) {
  const detachments = data.detachments ?? [];
  const detachmentAvailable = !detachmentId || detachments.some(detachment => detachment.id === detachmentId);
  return <header className="army-header">
    <div className="title-block"><div><p className="eyebrow">Adeptus Astartes / {data.faction}</p><h1>Teleportarium<span className="title-dot">.</span></h1><p className="subtitle">Four roles. One force. Your tactics.</p></div><div className="edition-group">
      <div className="edition"><label htmlFor="mfm-source">Points source / MFM</label><select id="mfm-source" value={data.id} onChange={event => switchMunitorum(event.target.value)}>{!munitorums.some(source => source.id === data.id) && <option value={data.id}>Unavailable MFM</option>}{munitorums.map(source => <option key={source.id} value={source.id}>{source.label}</option>)}</select><small>Personal tactical classifications</small></div>
      <div className="edition"><label htmlFor="detachment-source">Detachment</label><select id="detachment-source" value={detachmentId ?? ''} onChange={event => switchDetachment(event.target.value)} disabled={!detachments.length}><option value="">— Select detachment —</option>{!detachmentAvailable && <option value={detachmentId}>Unavailable detachment</option>}{detachments.map(detachment => <option key={detachment.id} value={detachment.id}>{detachment.name} · {detachment.dp}DP</option>)}</select><small>{detachments.length ? 'Unlocks enhancements & upgrades' : 'No detachments for this MFM'}</small></div>
    </div></div>
  </header>;
}
