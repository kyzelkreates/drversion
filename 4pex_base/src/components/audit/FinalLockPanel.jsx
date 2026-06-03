import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';

const lockColors = { locked: '#22c55e', unlocked: '#8b5cf6', blocked: '#ef4444', ready_to_lock: '#f59e0b' };
const lockLabels = { locked: '🔒 LOCKED', unlocked: '🔓 UNLOCKED', blocked: '⛔ BLOCKED', ready_to_lock: '⚠ READY TO LOCK' };

export function FinalLockPanel({ finalLock = {}, canLock = false, onLock, onUnlock }) {
  const [confirmUnlock, setConfirmUnlock] = useState(false);
  const status = finalLock.status || 'unlocked';
  const color  = lockColors[status] || '#6b7280';
  const label  = lockLabels[status]  || status;

  return (
    <Card variant="gold">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div className="card-title">Transformation Readiness Lock</div>
          <div style={{ fontSize: 20, fontWeight: 800, color, marginTop: 4 }}>{label}</div>
        </div>
        <div style={{ fontSize: 28 }}>{status === 'locked' ? '🔒' : status === 'blocked' ? '⛔' : '🔓'}</div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 6, padding: '8px 12px' }}>
        {finalLock.reason || 'Run the final audit first.'}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {status !== 'locked' && (
          <button
            className="btn btn-primary btn-sm"
            disabled={!canLock}
            onClick={onLock}
            title={canLock ? 'Lock base for transformation' : 'Resolve all blockers first'}
          >
            🔒 Lock Base for Transformation
          </button>
        )}
        {status === 'locked' && !confirmUnlock && (
          <button className="btn btn-ghost btn-sm" onClick={() => setConfirmUnlock(true)}>
            🔓 Unlock for Fixes
          </button>
        )}
        {confirmUnlock && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#f59e0b' }}>Confirm unlock?</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setConfirmUnlock(false); onUnlock && onUnlock(); }}>Yes, Unlock</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmUnlock(false)}>Cancel</button>
          </div>
        )}
      </div>

      {!canLock && status !== 'locked' && (
        <div style={{ fontSize: 11, color: '#ef4444', marginTop: 8 }}>
          ⛔ Lock requires: no critical blockers + audit score ≥ 85.
        </div>
      )}

      <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid #1e1e1e', paddingTop: 8 }}>
        The base should be locked only when all critical checks pass. The lock enables real product variant builds.
      </div>
    </Card>
  );
}
export default FinalLockPanel;
