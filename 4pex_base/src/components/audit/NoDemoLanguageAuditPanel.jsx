import React from 'react';
import { Card } from '../ui/Card.jsx';

export function NoDemoLanguageAuditPanel({ result }) {
  if (!result) return null;
  const ok = (result.blockers || []).length === 0 && (result.warnings || []).length === 0;
  const findings = result.details?.allFindings || [];

  return (
    <Card variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="card-title">No-Demo Language</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: ok ? '#22c55e' : '#f59e0b' }}>
          {ok ? '✓ PASS' : '⚠ REVIEW'} — {result.score}/100
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
        Scans product-facing content for forbidden demo/mock/fake wording.
      </div>
      {findings.length === 0
        ? <div style={{ fontSize: 12, color: '#22c55e' }}>✓ No forbidden terms detected in product-facing areas.</div>
        : findings.slice(0, 10).map((f, i) => (
          <div key={i} style={{ fontSize: 11, color: '#f59e0b', marginBottom: 4 }}>
            ⚠ [{f.area}] "{f.term}" → suggest: <em style={{ color: '#22c55e' }}>"{f.replacement}"</em>
          </div>
        ))
      }
      {findings.length > 10 && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>… and {findings.length - 10} more</div>}
      {(result.warnings || []).map((w, i) => <div key={i} style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>⚠ {w}</div>)}
      {(result.passed  || []).map((p, i) => <div key={i} style={{ fontSize: 11, color: '#22c55e', marginTop: 2 }}>✓ {p}</div>)}
    </Card>
  );
}
export default NoDemoLanguageAuditPanel;
