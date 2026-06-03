import React from 'react';
import { Card } from '../ui/Card.jsx';

export function WorkspaceProgressTracker({ buildProgress }) {
  const bp = buildProgress || { progressPercent: 0, completedRuns: [], totalRuns: 0, activeRun: null, blockedRuns: [] };
  const pct = bp.progressPercent || 0;

  return (
    <Card variant="default">
      <div className="card-title">Build Progress</div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Overall Progress</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>{pct}%</span>
        </div>
        <div style={{ background: '#222', borderRadius: 4, height: 8, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#22c55e' : 'var(--gold)', borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: '#111', borderRadius: 6, padding: 8 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Completed</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>{(bp.completedRuns || []).length}</div>
        </div>
        <div style={{ background: '#111', borderRadius: 6, padding: 8 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Total</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{bp.totalRuns || 0}</div>
        </div>
        {bp.activeRun && (
          <div style={{ background: '#111', borderRadius: 6, padding: 8, gridColumn: '1/-1' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Active Run</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>{bp.activeRun}</div>
          </div>
        )}
        {(bp.blockedRuns || []).length > 0 && (
          <div style={{ background: '#1a0505', borderRadius: 6, padding: 8, gridColumn: '1/-1' }}>
            <div style={{ fontSize: 10, color: '#ef4444' }}>Blocked Runs</div>
            <div style={{ fontSize: 12, color: '#ef4444' }}>{bp.blockedRuns.join(', ')}</div>
          </div>
        )}
      </div>

      {(bp.completedRuns || []).length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>Completed Runs</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {bp.completedRuns.map((r) => (
              <span key={r} style={{ background: '#14532d', color: '#22c55e', borderRadius: 4, padding: '2px 8px', fontSize: 11 }}>✓ {r}</span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
export default WorkspaceProgressTracker;
