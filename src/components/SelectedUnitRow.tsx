import { BUCKETS, type ArmyEntry, type BucketId } from '../types/army';
import { munitorum } from '../data/munitorum';
import { resolveEntry } from '../utils/points';
export function SelectedUnitRow({ entry, remove, move }: { entry: ArmyEntry; remove: (id: string) => void; move: (id: string, bucket: BucketId) => void }) {
  const { unit, option } = resolveEntry(entry, munitorum);
  const name = unit?.name ?? entry.unitId;
  return <li className="unit-row"><div className="unit-info"><span className="unit-name">{name}</span>{option ? option.label !== '1 model' && <small>{option.label}</small> : <small className="unavailable">Unavailable in this snapshot · excluded from totals</small>}</div>
    <strong className="unit-points">{option?.points ?? '—'}</strong>
    <select className="move-select" aria-label={`Move ${name}`} value={entry.bucket} onChange={event => move(entry.instanceId, event.target.value as BucketId)}>{BUCKETS.map(bucket => <option key={bucket.id} value={bucket.id}>Move to {bucket.name}</option>)}</select>
    <button className="remove-button" aria-label={`Remove ${name}`} onClick={() => remove(entry.instanceId)}>×</button>
  </li>;
}
