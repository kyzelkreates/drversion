import React from 'react';
import { Card } from '../ui/Card.jsx';

export function SecretExposureAuditPanel({ result }) {
  if (!result) return null;
  const ok = (result.blockers || []).length === 0;
  const masked = result.details?.maskedFindings || [];

  return (
    <Card variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="card-title">Secret Exposure</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: ok ? '#22c55e' : '#ef4444' }}>
          {ok ? '✓ PASS' : '⛔ FAIL'} — {result.score}/100
        </span>
      </div>
      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 8, background: '#1a0f00', border: '1px solid #78350f', borderRadius: 6, padding: '6px 10px' }}>
        ⚠ Only masked findings are shown here. Raw secret values are never displayed.
      </div>
      {masked.length === 0
        ? <div style={{ fontSize: 12, color: '#22c55e' }}>✓ No secret-like values detected.</div>
        : masked.map((f, i) => (
          <div key={i} style={{ fontSize: 11, color: '#ef4444', marginBottom: 4 }}>
            ⛔ [{f.area}] {f.id || ''} — <code style={{ color: '#6b7280' }}>***MASKED***</code>
          </div>
        ))
      }
      {(result.blockers || []).map((b, i) => <div key={i} style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>⛔ {b}</div>)}
      {(result.passed  || []).map((p, i) => <div key={i} style={{ fontSize: 11, color: '#22c55e', marginTop: 2 }}>✓ {p}</div>)}
    </Card>
  );
}
export default SecretExposureAuditPanel;
