import type { ArmyEntry } from '../types/army';
import type { Munitorum } from '../types/munitorum';
import { resolveEnhancement } from '../utils/points';
export function EnhancementRow({ data, entry, setQuantity, remove }: { data: Munitorum; entry: ArmyEntry; setQuantity: (id: string, quantity: number) => void; remove: (id: string) => void }) {
  const { enhancement } = resolveEnhancement(entry, data);
  const quantity = entry.quantity ?? 1;
  const name = enhancement?.label ?? entry.optionId;
  return <li className="unit-row"><div className="upgrade-row">
    <span className={`upgrade-name${enhancement ? '' : ' unavailable'}`}>{enhancement?.label ?? 'Unavailable in this snapshot'}</span>
    <label className="upgrade-quantity"><span className="sr-only">Quantity of {name}</span>
      <input type="number" min="1" step="1" value={quantity} onChange={event => { const next = Number(event.target.value); if (Number.isSafeInteger(next) && next > 0) setQuantity(entry.instanceId, next); }}/>
      <span>× {enhancement?.points ?? '—'} pts</span>
    </label>
    <span className="upgrade-points">{enhancement ? enhancement.points * quantity : '—'} pts</span>
    <button className="remove-button" aria-label={`Remove ${name}`} onClick={() => remove(entry.instanceId)}>×</button>
  </div></li>;
}
