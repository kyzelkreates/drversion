import React from 'react';
import { Card } from '../ui/Card.jsx';
import { explainWorkspaceIsolation } from '../../logic/workspaces/workspaceIsolation.js';

export function WorkspaceIsolationPanel({ workspace }) {
  const rules = explainWorkspaceIsolation(workspace);
  return (
    <Card variant="default">
      <div className="card-title">Isolation Boundaries</div>
      <div style={{ fontSize: 11, color: '#22c55e', marginBottom: 8 }}>
        This workspace is fully isolated from other workspaces and the base foundation.
      </div>
      {rules.map((r, i) => (
        <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0', display: 'flex', gap: 8 }}>
          <span style={{ color: '#22c55e' }}>⊡</span><span>{r}</span>
        </div>
      ))}
    </Card>
  );
}
export default WorkspaceIsolationPanel;
