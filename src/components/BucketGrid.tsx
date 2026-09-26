import { BUCKETS, type ArmyEntry, type BucketId } from '../types/army';
import { Bucket } from './Bucket';
export function BucketGrid(props: { entries: ArmyEntry[]; add: (bucket: BucketId) => void; remove: (id: string) => void; move: (id: string, bucket: BucketId) => void }) {
  return <div className="bucket-grid">{BUCKETS.map((bucket, index) => <Bucket key={bucket.id} bucket={bucket} index={index} {...props}/>)}</div>;
}
