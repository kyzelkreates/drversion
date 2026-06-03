import React from 'react';
import { Card } from '../ui/Card.jsx';

export function AuditBlockerPanel({ blockers = [] }) {
  if (!blockers.length) return (
    <Card variant="default">
      <div style={{ fontSize: 12, color: '#22c55e' }}>✓ No critical blockers.</div>
    </Card>
  );
  return (
    <Card variant="red">
      <div className="card-title" style={{ color: '#ef4444' }}>Critical Blockers ({blockers.length})</div>
      <div style={{ fontSize: 12, color: '#f87171', marginBottom: 8 }}>
        These must be resolved before the base can be locked for transformation.
      </div>
      {blockers.map((b, i) => (
        <div key={i} style={{ background: '#1a0505', border: '1px solid #7f1d1d', borderRadius: 6, padding: '7px 12px', marginBottom: 6, fontSize: 12, color: '#ef4444' }}>
          ⛔ {b}
        </div>
      ))}
    </Card>
  );
}
export default AuditBlockerPanel;
