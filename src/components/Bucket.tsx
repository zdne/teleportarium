import { BUCKETS, type ArmyEntry, type BucketId } from '../types/army';
import type { Munitorum } from '../types/munitorum';
import { calculateBucketPoints } from '../utils/points';
import { SelectedUnitRow } from './SelectedUnitRow';
import type { SetUpgrade } from './UnitUpgrades';
type Props = { data: Munitorum; bucket: typeof BUCKETS[number]; entries: ArmyEntry[]; add: (bucket: BucketId) => void; duplicate: (id: string) => void; remove: (id: string) => void; move: (id: string, bucket: BucketId) => void; setUpgrade: SetUpgrade };
export function Bucket({ data, bucket, entries, add, duplicate, remove, move, setUpgrade }: Props) {
  const selected = entries.filter(entry => entry.bucket === bucket.id);
  const isDetachments = bucket.id === 'enhancements';
  return <section className="bucket" aria-labelledby={`heading-${bucket.id}`}><header className="bucket-header"><h2 id={`heading-${bucket.id}`}>{bucket.name}</h2><div className="bucket-subtotal"><strong>{calculateBucketPoints(entries, bucket.id, data)}</strong><span>pts</span></div></header>
    {selected.length ? <ul className="unit-list">{selected.map(entry => <SelectedUnitRow key={entry.instanceId} data={data} entry={entry} duplicate={duplicate} remove={remove} move={move} setUpgrade={setUpgrade}/>)}</ul> : <div className="bucket-empty"><p>{isDetachments ? 'No detachments assigned' : 'No units assigned'}</p></div>}
    <button className="add-button" onClick={() => add(bucket.id)} aria-label={isDetachments ? `Add detachment to ${bucket.name}` : `Add unit to ${bucket.name}`}><span aria-hidden="true">+</span> {isDetachments ? 'Add detachment' : 'Add unit'}</button>
  </section>;
}
