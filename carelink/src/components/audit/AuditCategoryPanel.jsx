import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';

const scoreColor = (s) => s >= 90 ? '#22c55e' : s >= 75 ? '#f59e0b' : '#ef4444';

export function AuditCategoryPanel({ result }) {
  const [expanded, setExpanded] = useState(false);
  if (!result) return null;
  const c = scoreColor(result.score || 0);

  return (
    <Card variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{result.label}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: c }}>{result.score || 0}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', alignSelf: 'flex-end', marginBottom: 3 }}>/100</span>
            {(result.blockers || []).length > 0 && <span style={{ fontSize: 11, color: '#ef4444' }}>⛔ {result.blockers.length}</span>}
            {(result.warnings || []).length > 0 && <span style={{ fontSize: 11, color: '#f59e0b' }}>⚠ {result.warnings.length}</span>}
            {(result.passed  || []).length > 0 && <span style={{ fontSize: 11, color: '#22c55e' }}>✓ {result.passed.length}</span>}
          </div>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 10, borderTop: '1px solid #1e1e1e', paddingTop: 10 }}>
          {(result.blockers || []).map((b, i) => <div key={i} style={{ fontSize: 11, color: '#ef4444', padding: '2px 0' }}>⛔ {b}</div>)}
          {(result.warnings || []).map((w, i) => <div key={i} style={{ fontSize: 11, color: '#f59e0b', padding: '2px 0' }}>⚠ {w}</div>)}
          {(result.passed   || []).map((p, i) => <div key={i} style={{ fontSize: 11, color: '#22c55e', padding: '2px 0' }}>✓ {p}</div>)}
        </div>
      )}
    </Card>
  );
}
export default AuditCategoryPanel;
