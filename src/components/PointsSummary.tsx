import { calculateRemainingPoints } from '../utils/points';
export function PointsSummary({ total, limit }: { total: number; limit: number }) {
  const remaining = calculateRemainingPoints(total, limit);
  return <section className={`points-summary ${remaining < 0 ? 'over-limit' : remaining <= 100 ? 'near-limit' : ''}`} aria-label="Army points">
    <div className="summary-label"><span className="eyebrow">Force strength</span><span className="summary-status">{remaining < 0 ? 'Over target' : remaining === 0 ? 'Target reached' : 'Assembly in progress'}</span></div>
    <div className="stat"><strong>{total.toLocaleString()}</strong><span>Used <small>pts</small></span></div>
    <div className="stat remaining"><strong>{remaining.toLocaleString()}</strong><span>Remaining <small>pts</small></span></div>
    <div className="stat limit"><strong>{limit.toLocaleString()}</strong><span>Limit <small>pts</small></span></div>
    <div className="points-track" aria-hidden="true"><span style={{ width: `${Math.min(100, total / limit * 100)}%` }}/></div>
  </section>;
}
