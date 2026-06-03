import React from 'react';
import { Card } from '../ui/Card.jsx';

export function TransformationAuditPanel({ result }) {
  if (!result) return null;
  const ok = (result.blockers || []).length === 0;
  return (
    <Card variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="card-title">Transformation System</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: ok ? '#22c55e' : '#ef4444' }}>
          {ok ? '✓ PASS' : '⛔ FAIL'} — {result.score}/100
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
        Plans: {result.details?.planCount || 0} · Compiler is non-destructive · Skeleton plans do not write files.
      </div>
      {(result.blockers || []).map((b, i) => <div key={i} style={{ fontSize: 11, color: '#ef4444', marginBottom: 3 }}>⛔ {b}</div>)}
      {(result.warnings || []).map((w, i) => <div key={i} style={{ fontSize: 11, color: '#f59e0b', marginBottom: 3 }}>⚠ {w}</div>)}
      {(result.passed  || []).map((p, i) => <div key={i} style={{ fontSize: 11, color: '#22c55e', marginBottom: 3 }}>✓ {p}</div>)}
    </Card>
  );
}
export default TransformationAuditPanel;
