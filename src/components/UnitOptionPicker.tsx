import type { MunitorumUnit } from '../types/munitorum';
export function UnitOptionPicker({ unit, select }: { unit: MunitorumUnit; select: (optionId: string) => void }) {
  return <div><p className="picker-instruction">Select a points option. Pricing conditions are your choice.</p><ul className="picker-list">{unit.options.map(option => <li key={option.id}><button onClick={() => select(option.id)}><span>{option.label}</span><strong>{option.points}<small> pts</small></strong></button></li>)}</ul></div>;
}
