import type { ArmyEntry, BucketId } from '../types/army';
import type { Munitorum } from '../types/munitorum';
export function resolveEntry(entry: ArmyEntry, data: Munitorum) {
  const unit = data.units.find(unit => unit.id === entry.unitId);
  const option = unit?.options.find(option => option.id === entry.optionId) ?? unit?.upgrades?.find(option => option.id === entry.optionId);
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
