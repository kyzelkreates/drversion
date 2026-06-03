import React from 'react';
import { Card } from '../ui/Card.jsx';

export function StateSchemaAuditPanel({ result }) {
  if (!result) return null;
  const ok = (result.blockers || []).length === 0;
  const presentKeys = result.details?.presentKeys || [];
  return (
    <Card variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="card-title">State Schema</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: ok ? '#22c55e' : '#ef4444' }}>
          {ok ? '✓ PASS' : '⛔ FAIL'} — {result.score}/100
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
        Top-level keys present: {presentKeys.length}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {presentKeys.slice(0, 20).map(k => (
          <span key={k} style={{ background: '#0f1a0f', border: '1px solid #166534', borderRadius: 4, padding: '1px 6px', fontSize: 10, color: '#22c55e' }}>{k}</span>
        ))}
      </div>
      {(result.blockers || []).map((b, i) => <div key={i} style={{ fontSize: 11, color: '#ef4444', marginBottom: 3 }}>⛔ {b}</div>)}
      {(result.warnings || []).map((w, i) => <div key={i} style={{ fontSize: 11, color: '#f59e0b', marginBottom: 3 }}>⚠ {w}</div>)}
      {(result.passed  || []).map((p, i) => <div key={i} style={{ fontSize: 11, color: '#22c55e', marginBottom: 3 }}>✓ {p}</div>)}
    </Card>
  );
}
export default StateSchemaAuditPanel;
