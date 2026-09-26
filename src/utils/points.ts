import type { ArmyEntry, BucketId } from '../types/army';
import type { Munitorum } from '../types/munitorum';
export function resolveEntry(entry: ArmyEntry, data: Munitorum) {
  const unit = data.units.find(unit => unit.id === entry.unitId);
  let option = unit?.options.find(option => option.id === entry.optionId) ?? unit?.upgrades?.find(option => option.id === entry.optionId);
  // Flat interim prices can replace an official pricing tier for the same size.
  // Never choose automatically when the target has multiple prices for that size.
  if (!option && unit) {
    const size = entry.optionId.match(/^(\d+-models?)(?:-|$)/)?.[1];
    const candidates = size ? unit.options.filter(candidate => candidate.id === size || candidate.id.startsWith(`${size}-`)) : [];
    if (candidates.length === 1) option = candidates[0];
  }
  return { unit, option };
}
export function calculateTotalPoints(entries: ArmyEntry[], data: Munitorum) {
  return entries.reduce((sum, entry) => sum + calculateEntryPoints(entry, data), 0);
}
export function calculateEntryPoints(entry: ArmyEntry, data: Munitorum) {
  const { unit, option } = resolveEntry(entry, data);
  if (!option) return 0;
  return option.points + (entry.upgrades ?? []).reduce((sum, selected) =>
    sum + (unit?.upgrades?.find(upgrade => upgrade.id === selected.upgradeId)?.points ?? 0) * selected.quantity, 0);
}
export function calculateBucketPoints(entries: ArmyEntry[], bucket: BucketId, data: Munitorum) {
  return calculateTotalPoints(entries.filter(entry => entry.bucket === bucket), data);
}
export function calculateRemainingPoints(total: number, limit: number) { return limit - total; }
