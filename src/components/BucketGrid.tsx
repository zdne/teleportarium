import { BUCKETS, type ArmyEntry, type BucketId } from '../types/army';
import { Bucket } from './Bucket';
export function BucketGrid(props: { entries: ArmyEntry[]; add: (bucket: BucketId) => void; duplicate: (id: string) => void; remove: (id: string) => void; move: (id: string, bucket: BucketId) => void }) {
  return <div className="bucket-grid">{BUCKETS.map(bucket => <Bucket key={bucket.id} bucket={bucket} {...props}/>)}</div>;
}
