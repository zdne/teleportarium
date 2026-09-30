import { BUCKETS, type ArmyEntry, type BucketId } from '../types/army';
import type { Munitorum } from '../types/munitorum';
import { calculateBucketPoints } from '../utils/points';
import { SelectedUnitRow } from './SelectedUnitRow';
import { EnhancementRow } from './EnhancementRow';
import type { SetUpgrade } from './UnitUpgrades';
type Props = { data: Munitorum; bucket: typeof BUCKETS[number]; entries: ArmyEntry[]; detachmentId?: string; add: (bucket: BucketId) => void; duplicate: (id: string) => void; remove: (id: string) => void; move: (id: string, bucket: BucketId) => void; setUpgrade: SetUpgrade; setQuantity: (id: string, quantity: number) => void };
export function Bucket({ data, bucket, entries, detachmentId, add, duplicate, remove, move, setUpgrade, setQuantity }: Props) {
  const selected = entries.filter(entry => entry.bucket === bucket.id);
  const isEnhancements = bucket.id === 'enhancements';
  const detachment = data.detachments?.find(detachment => detachment.id === detachmentId);
  return <section className="bucket" aria-labelledby={`heading-${bucket.id}`}><header className="bucket-header"><div><h2 id={`heading-${bucket.id}`}>{bucket.name}</h2>{isEnhancements && detachment && <p className="bucket-dp">{detachment.name} · {detachment.dp}DP</p>}</div><div className="bucket-subtotal"><strong>{calculateBucketPoints(entries, bucket.id, data)}</strong><span>pts</span></div></header>
    {selected.length
      ? <ul className="unit-list">{selected.map(entry => isEnhancements
        ? <EnhancementRow key={entry.instanceId} data={data} entry={entry} setQuantity={setQuantity} remove={remove}/>
        : <SelectedUnitRow key={entry.instanceId} data={data} entry={entry} duplicate={duplicate} remove={remove} move={move} setUpgrade={setUpgrade}/>)}</ul>
      : <div className="bucket-empty"><p>{isEnhancements ? (detachment ? 'No enhancements selected' : 'Select a detachment to choose enhancements') : 'No units assigned'}</p></div>}
    <button className="add-button" disabled={isEnhancements && !detachment} onClick={() => add(bucket.id)} aria-label={isEnhancements ? `Add enhancement to ${bucket.name}` : `Add unit to ${bucket.name}`}><span aria-hidden="true">+</span> {isEnhancements ? 'Add enhancement' : 'Add unit'}</button>
  </section>;
}
