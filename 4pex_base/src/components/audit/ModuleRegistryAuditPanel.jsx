import React from 'react';
import { Card } from '../ui/Card.jsx';

export function ModuleRegistryAuditPanel({ result }) {
  if (!result) return null;
  const ok = (result.blockers || []).length === 0;
  const d  = result.details || {};
  return (
    <Card variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="card-title">Module Registry</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: ok ? '#22c55e' : '#ef4444' }}>
          {ok ? '✓ PASS' : '⛔ FAIL'} — {result.score}/100
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total: {d.totalModules || 0}</span>
        <span style={{ fontSize: 11, color: '#22c55e'           }}>Active: {d.activeModules || 0}</span>
        <span style={{ fontSize: 11, color: '#8b5cf6'           }}>Reserved: {d.reservedModules || 0}</span>
      </div>
      {(result.blockers || []).map((b, i) => <div key={i} style={{ fontSize: 11, color: '#ef4444', marginBottom: 3 }}>⛔ {b}</div>)}
      {(result.warnings || []).map((w, i) => <div key={i} style={{ fontSize: 11, color: '#f59e0b', marginBottom: 3 }}>⚠ {w}</div>)}
      {(result.passed  || []).map((p, i) => <div key={i} style={{ fontSize: 11, color: '#22c55e', marginBottom: 3 }}>✓ {p}</div>)}
    </Card>
  );
}
export default ModuleRegistryAuditPanel;
