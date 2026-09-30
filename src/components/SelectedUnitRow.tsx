import { BUCKETS, type ArmyEntry, type BucketId } from '../types/army';
import type { Munitorum } from '../types/munitorum';
import { resolveEntry } from '../utils/points';
import { UnitUpgrades, type SetUpgrade } from './UnitUpgrades';
export function SelectedUnitRow({ data, entry, duplicate, remove, move, setUpgrade }: { data: Munitorum; entry: ArmyEntry; duplicate: (id: string) => void; remove: (id: string) => void; move: (id: string, bucket: BucketId) => void; setUpgrade: SetUpgrade }) {
  const { unit, option } = resolveEntry(entry, data);
  const name = unit?.name ?? entry.unitId;
  const legacyUpgrade = unit?.upgrades?.some(upgrade => upgrade.id === entry.optionId);
  return <li className="unit-row"><div className="unit-title-bar"><span className="unit-name">{name.toUpperCase()}</span><div className="unit-actions">
    <button className="duplicate-button" aria-label={`Duplicate ${name}`} title="Duplicate unit" onClick={() => duplicate(entry.instanceId)}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 6V3h11v11h-3"/><rect x="3" y="6" width="11" height="11"/></svg></button>
    <select className="move-select" aria-label={`Move ${name}`} value={entry.bucket} onChange={event => move(entry.instanceId, event.target.value as BucketId)}>{BUCKETS.filter(bucket => bucket.id !== 'enhancements').map(bucket => <option key={bucket.id} value={bucket.id}>Move to {bucket.name}</option>)}</select>
    <button className="remove-button" aria-label={`Remove ${name}`} onClick={() => remove(entry.instanceId)}>×</button>
    </div></div><div className="unit-cost-line"><span className={option ? undefined : 'unavailable'}>{option?.label ?? 'Unavailable in this snapshot · excluded from totals'}</span><span className="unit-leader" aria-hidden="true"/><span className="unit-points">{option?.points ?? '—'} <span>pts</span></span></div>
    {legacyUpgrade ? <p className="legacy-upgrade-note">Saved standalone wargear. Remove and add beneath the intended unit.</p> : unit && option && <UnitUpgrades unit={unit} entry={entry} setUpgrade={setUpgrade}/>}
    </li>;
}
