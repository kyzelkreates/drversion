import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';

export function WorkspaceRunTracker({ workspace, onMarkInProgress, onMarkComplete, onMarkBlocked, onResetProgress }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const bp = workspace?.buildProgress || {};
  const runs = [];

  // Build a list of all expected runs from Run 6 upward
  for (let i = 6; i <= 6 + (bp.totalRuns || 3) - 1; i++) {
    runs.push(`Run ${i}`);
  }

  function getRunStatus(run) {
    if ((bp.completedRuns || []).includes(run)) return 'complete';
    if ((bp.blockedRuns || []).includes(run))   return 'blocked';
    if (bp.activeRun === run)                    return 'in_progress';
    return 'planned';
  }

  const statusColors = { complete: '#22c55e', blocked: '#ef4444', in_progress: '#f59e0b', planned: '#6b7280' };

  return (
    <Card variant="default">
      <div className="card-title">Run Status Tracker</div>
      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 12 }}>
        Manual-only. These controls track progress — they do not execute any build runs.
      </div>

      {runs.map((run) => {
        const st = getRunStatus(run);
        return (
          <div key={run} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: statusColors[st] }}>{run}</span>
              <span style={{ fontSize: 10, color: statusColors[st], textTransform: 'uppercase' }}>{st.replace(/_/g, ' ')}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {st !== 'in_progress' && st !== 'complete' && (
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => onMarkInProgress(run)}>▶ Start</button>
              )}
              {st === 'in_progress' && (
                <button className="btn btn-primary btn-sm" style={{ fontSize: 10 }} onClick={() => onMarkComplete(run)}>✓ Complete</button>
              )}
              {st !== 'blocked' && st !== 'complete' && (
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, color: '#ef4444' }} onClick={() => onMarkBlocked(run)}>⛔ Block</button>
              )}
              {st === 'blocked' && (
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => onMarkInProgress(run)}>↩ Unblock</button>
              )}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 12 }}>
        {!confirmReset ? (
          <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => setConfirmReset(true)}>
            Reset All Progress
          </button>
        ) : (
          <div style={{ background: '#1a0505', borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 8 }}>Reset all run progress? This cannot be undone.</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={() => { onResetProgress(); setConfirmReset(false); }}>Yes, Reset</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
export default WorkspaceRunTracker;
