import { BUCKETS, type ArmyEntry, type BucketId } from '../types/army';
import { Bucket } from './Bucket';
import type { SetUpgrade } from './UnitUpgrades';
import type { Munitorum } from '../types/munitorum';
export function BucketGrid(props: { data: Munitorum; entries: ArmyEntry[]; add: (bucket: BucketId) => void; duplicate: (id: string) => void; remove: (id: string) => void; move: (id: string, bucket: BucketId) => void; setUpgrade: SetUpgrade }) {
  return <div className="bucket-grid">{BUCKETS.map(bucket => <Bucket key={bucket.id} bucket={bucket} {...props}/>)}</div>;
}
