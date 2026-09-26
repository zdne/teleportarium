import type { ArmyEntry, BucketId } from '../types/army';
import type { Munitorum } from '../types/munitorum';
export function resolveEntry(entry: ArmyEntry, data: Munitorum) {
  const unit = data.units.find(unit => unit.id === entry.unitId);
  const option = unit?.options.find(option => option.id === entry.optionId);
  return { unit, option };
}
export function calculateTotalPoints(entries: ArmyEntry[], data: Munitorum) {
  return entries.reduce((sum, entry) => sum + (resolveEntry(entry, data).option?.points ?? 0), 0);
}
export function calculateBucketPoints(entries: ArmyEntry[], bucket: BucketId, data: Munitorum) {
  return calculateTotalPoints(entries.filter(entry => entry.bucket === bucket), data);
}
export function calculateRemainingPoints(total: number, limit: number) { return limit - total; }
