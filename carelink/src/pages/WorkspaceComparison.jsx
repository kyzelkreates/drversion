import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { WorkspaceComparisonTable } from '../components/workspaces/WorkspaceComparisonTable.jsx';
import { getState } from '../state/storage.js';

export function WorkspaceComparison({ navigate }) {
  const state = getState();
  const workspaces = (state.variantWorkspaces?.workspaces || []).filter((w) => w.status !== 'archived');
  const [selected, setSelected] = useState([]);

  function toggleSelect(id) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workspace Comparison</h1>
          <p className="page-subtitle">Comparison is read-only and never merges workspace state.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/variant-workspaces')}>← Workspaces</button>
      </div>

      {workspaces.length < 2 ? (
        <EmptyState title="Not enough workspaces" description="Create at least two workspaces to compare them." action={{ label: 'Go to Workspaces', onClick: () => navigate('/variant-workspaces') }} />
      ) : (
        <>
          <Card variant="default" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Select workspaces to compare (minimum 2):</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  className={`btn btn-sm ${selected.includes(ws.id) ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => toggleSelect(ws.id)}
                >
                  {selected.includes(ws.id) ? '✓ ' : ''}{ws.name}
                </button>
              ))}
            </div>
          </Card>

          {selected.length >= 2 ? (
            <Card variant="default">
              <WorkspaceComparisonTable workspaceIds={selected} state={state} />
            </Card>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>
              Select at least 2 workspaces above to see comparison.
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default WorkspaceComparison;
