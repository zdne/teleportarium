import { useRef, useState } from 'react';
import type { ArmyEntry } from '../types/army';
import type { MunitorumUnit } from '../types/munitorum';
export type SetUpgrade = (instanceId: string, upgradeId: string, quantity: number) => void;
export function UnitUpgrades({ unit, entry, setUpgrade, kind = 'wargear' }: { unit: MunitorumUnit; entry: ArmyEntry; setUpgrade: SetUpgrade; kind?: 'wargear' | 'enhancement' }) {
  const [picking, setPicking] = useState(false);
  const addButton = useRef<HTMLButtonElement>(null);
  const selected = entry.upgrades ?? [];
  const available = (unit.upgrades ?? []).filter(upgrade => !selected.some(item => item.upgradeId === upgrade.id));
  if (!available.length && !selected.length) return null;
  const noun = kind === 'enhancement' ? 'enhancement' : 'wargear';
  const label = kind === 'enhancement' ? 'Enhancement' : 'Wargear';
  return <div className="unit-upgrades" onKeyDown={event => { if (event.key === 'Escape' && picking) { event.stopPropagation(); setPicking(false); addButton.current?.focus(); } }}>
    {selected.map(item => {
      const upgrade = unit.upgrades?.find(upgrade => upgrade.id === item.upgradeId);
      return <div className="upgrade-row" key={item.upgradeId}>
        <span className="upgrade-name">{upgrade?.label ?? `Unavailable ${noun}`}</span>
        <label className="upgrade-quantity"><span className="sr-only">Quantity of {upgrade?.label ?? item.upgradeId} for {unit.name}</span><input type="number" min="1" step="1" value={item.quantity} onChange={event => { const quantity = Number(event.target.value); if (Number.isSafeInteger(quantity) && quantity > 0) setUpgrade(entry.instanceId, item.upgradeId, quantity); }}/><span>× {upgrade?.points ?? '—'} pts</span></label>
        <span className="upgrade-points">{upgrade ? upgrade.points * item.quantity : '—'} pts</span>
        <button className="remove-button" aria-label={`Remove ${upgrade?.label ?? `unavailable ${noun}`}`} onClick={() => setUpgrade(entry.instanceId, item.upgradeId, 0)}>×</button>
      </div>;
    })}
    {!!available.length && <button ref={addButton} className="add-button add-wargear-button" aria-label={`Add ${noun} to ${unit.name}`} aria-expanded={picking} onClick={() => setPicking(previous => !previous)}><span aria-hidden="true">{picking ? '−' : '+'}</span> {picking ? `Close ${noun}` : `Add ${noun}`}</button>}
    {picking && !!available.length && <ul className="wargear-picker picker-list" aria-label={`${label} for ${unit.name}`}>{available.map(wargear => <li key={wargear.id}><button onClick={() => { setUpgrade(entry.instanceId, wargear.id, 1); setPicking(false); addButton.current?.focus(); }}><span>{wargear.label}</span><strong>{wargear.points}<small> pts each</small></strong></button></li>)}</ul>}
  </div>;
}
