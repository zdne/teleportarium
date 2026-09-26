import { BUCKETS, type ArmyEntry, type BucketId } from '../types/army';
import { munitorum } from '../data/munitorum';
import { calculateBucketPoints } from '../utils/points';
import { SelectedUnitRow } from './SelectedUnitRow';
type Props = { bucket: typeof BUCKETS[number]; index: number; entries: ArmyEntry[]; add: (bucket: BucketId) => void; remove: (id: string) => void; move: (id: string, bucket: BucketId) => void };
export function Bucket({ bucket, index, entries, add, remove, move }: Props) {
  const selected = entries.filter(entry => entry.bucket === bucket.id);
  return <section className="bucket" aria-labelledby={`heading-${bucket.id}`}><header className="bucket-header"><div className="bucket-heading"><span className="bucket-number">0{index + 1}</span><div><h2 id={`heading-${bucket.id}`}>{bucket.name}</h2><p>{bucket.description}</p></div></div><div className="bucket-subtotal"><strong>{calculateBucketPoints(entries, bucket.id, munitorum)}</strong><span>pts</span></div></header>
    {selected.length ? <ul className="unit-list">{selected.map(entry => <SelectedUnitRow key={entry.instanceId} entry={entry} remove={remove} move={move}/>)}</ul> : <div className="bucket-empty"><span className="empty-rule"/><p>No units assigned</p><small>Build this role to suit your strategy.</small></div>}
    <button className="add-button" onClick={() => add(bucket.id)} aria-label={`Add unit to ${bucket.name}`}><span aria-hidden="true">+</span> Add unit <span className="add-arrow" aria-hidden="true">↗</span></button>
  </section>;
}
