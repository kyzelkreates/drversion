import React from 'react';
import { Card } from '../ui/Card.jsx';
import { detectWorkspaceLockViolations } from '../../logic/workspaces/workspaceLocks.js';

export function WorkspaceLocksPanel({ workspace }) {
  const locks      = workspace?.locks || {};
  const violations = detectWorkspaceLockViolations(workspace, null);

  const lockItems = [
    { key: 'preserveBaseFoundation',       label: 'Preserve Base Foundation',       critical: true  },
    { key: 'isolateFromOtherWorkspaces',   label: 'Isolate From Other Workspaces',  critical: true  },
    { key: 'manualPromptExecutionOnly',    label: 'Manual Prompt Execution Only',   critical: true  },
    { key: 'allowAutoBuild',               label: 'Auto-Build Disabled',            critical: true, expectFalse: true },
    { key: 'allowBaseOverwrite',           label: 'Base Overwrite Disabled',        critical: true, expectFalse: true },
    { key: 'allowCrossWorkspaceMutation',  label: 'Cross-Workspace Mutation Disabled', critical: true, expectFalse: true },
  ];

  function isLocked(item) {
    const val = locks[item.key];
    return item.expectFalse ? val === false : val === true;
  }

  return (
    <Card variant={violations.length > 0 ? 'red' : 'default'}>
      <div className="card-title">Workspace Locks</div>

      {violations.length > 0 && (
        <div style={{ background: '#1a0505', border: '1px solid #7f1d1d', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
          {violations.map((v, i) => <div key={i} style={{ fontSize: 12, color: '#ef4444' }}>⛔ {v}</div>)}
        </div>
      )}

      {lockItems.map((item) => (
        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1a1a1a' }}>
          <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{item.label}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: isLocked(item) ? '#22c55e' : '#ef4444' }}>
            {isLocked(item) ? '✓ ENFORCED' : '⛔ VIOLATED'}
          </span>
        </div>
      ))}

      {violations.length === 0 && (
        <div style={{ marginTop: 8, fontSize: 11, color: '#22c55e' }}>✓ All locks enforced correctly.</div>
      )}
    </Card>
  );
}
export default WorkspaceLocksPanel;
