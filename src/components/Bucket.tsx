import { BUCKETS, type ArmyEntry, type BucketId } from '../types/army';
import type { Munitorum } from '../types/munitorum';
import { calculateBucketPoints } from '../utils/points';
import { SelectedUnitRow } from './SelectedUnitRow';
import type { SetUpgrade } from './UnitUpgrades';
type Props = { data: Munitorum; bucket: typeof BUCKETS[number]; entries: ArmyEntry[]; add: (bucket: BucketId) => void; duplicate: (id: string) => void; remove: (id: string) => void; move: (id: string, bucket: BucketId) => void; setUpgrade: SetUpgrade };
export function Bucket({ data, bucket, entries, add, duplicate, remove, move, setUpgrade }: Props) {
  const selected = entries.filter(entry => entry.bucket === bucket.id);
  return <section className="bucket" aria-labelledby={`heading-${bucket.id}`}><header className="bucket-header"><h2 id={`heading-${bucket.id}`}>{bucket.name}</h2><div className="bucket-subtotal"><strong>{calculateBucketPoints(entries, bucket.id, data)}</strong><span>pts</span></div></header>
    {selected.length ? <ul className="unit-list">{selected.map(entry => <SelectedUnitRow key={entry.instanceId} data={data} entry={entry} duplicate={duplicate} remove={remove} move={move} setUpgrade={setUpgrade}/>)}</ul> : <div className="bucket-empty"><p>No units assigned</p></div>}
    <button className="add-button" onClick={() => add(bucket.id)} aria-label={`Add unit to ${bucket.name}`}><span aria-hidden="true">+</span> Add unit</button>
  </section>;
}
