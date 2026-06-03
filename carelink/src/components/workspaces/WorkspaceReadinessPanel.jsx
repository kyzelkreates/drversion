import React from 'react';
import { Card } from '../ui/Card.jsx';

export function WorkspaceReadinessPanel({ readiness }) {
  const r = readiness || { score: 0, level: 'not_ready', blockers: [], warnings: [], nextAction: '' };
  const levelColors = { ready: '#22c55e', ready_with_warnings: '#f59e0b', partial: '#8b5cf6', not_ready: '#ef4444' };
  const color = levelColors[r.level] || '#9ca3af';

  return (
    <Card variant="default">
      <div className="card-title">Workspace Readiness</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color }}>{r.score}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color }}>
            {r.level?.replace(/_/g, ' ').toUpperCase()}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>out of 100</div>
        </div>
      </div>

      {r.nextAction && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', background: '#111', borderRadius: 6, padding: '8px 12px', marginBottom: 10 }}>
          → {r.nextAction}
        </div>
      )}

      {r.blockers?.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>BLOCKERS</div>
          {r.blockers.map((b, i) => (
            <div key={i} style={{ fontSize: 11, color: '#ef4444', padding: '2px 0' }}>⛔ {b}</div>
          ))}
        </div>
      )}

      {r.warnings?.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>WARNINGS</div>
          {r.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 11, color: '#f59e0b', padding: '2px 0' }}>⚠ {w}</div>
          ))}
        </div>
      )}

      {r.blockers?.length === 0 && r.warnings?.length === 0 && (
        <div style={{ fontSize: 12, color: '#22c55e' }}>✓ No blockers or warnings</div>
      )}
    </Card>
  );
}
export default WorkspaceReadinessPanel;
