import React from 'react';
import { Card } from '../ui/Card.jsx';

export function AuditWarningPanel({ warnings = [] }) {
  if (!warnings.length) return (
    <Card variant="default">
      <div style={{ fontSize: 12, color: '#22c55e' }}>✓ No warnings.</div>
    </Card>
  );
  return (
    <Card variant="default">
      <div className="card-title">Warnings ({warnings.length})</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
        Non-blocking issues worth reviewing before starting variant builds.
      </div>
      {warnings.map((w, i) => (
        <div key={i} style={{ background: '#1a1100', border: '1px solid #78350f', borderRadius: 6, padding: '7px 12px', marginBottom: 5, fontSize: 12, color: '#f59e0b' }}>
          ⚠ {w}
        </div>
      ))}
    </Card>
  );
}
export default AuditWarningPanel;
