// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// FinalBaseCompletionPanel.jsx — Run 10
import { canCompleteBase, explainBaseCompletionStatus } from '../../logic/masterLauncher/finalBaseCompletionLock.js';

export default function FinalBaseCompletionPanel({ state, onComplete, onUnlock }) {
  const ml        = state?.masterLauncher || {};
  const isComplete = ml.finalBaseComplete;
  const readiness  = canCompleteBase(state);
  const statusText = explainBaseCompletionStatus(state);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="card-title" style={{ margin: 0 }}>Final Base Completion</div>
        <span style={{
          fontSize: 12,
          padding: '4px 12px',
          borderRadius: 6,
          fontWeight: 700,
          background: isComplete ? '#052e16' : readiness.canComplete ? '#1e1b4b' : '#450a0a',
          color: isComplete ? '#4ade80' : readiness.canComplete ? '#a5b4fc' : '#ef4444',
        }}>
          {isComplete ? '✓ COMPLETE' : readiness.canComplete ? 'READY TO COMPLETE' : 'BLOCKERS EXIST'}
        </span>
      </div>

      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>{statusText}</div>

      {/* Score bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
          <span>Completion Readiness</span>
          <span>{readiness.score}%</span>
        </div>
        <div style={{ background: '#0f172a', borderRadius: 6, height: 8, overflow: 'hidden' }}>
          <div style={{
            height: 8,
            width: `${readiness.score}%`,
            background: readiness.score >= 90 ? '#22c55e' : readiness.score >= 60 ? '#f59e0b' : '#ef4444',
            borderRadius: 6,
            transition: 'width 0.4s',
          }} />
        </div>
      </div>

      {/* Checks */}
      <div style={{ marginBottom: 16 }}>
        {readiness.checks.map((c) => (
          <div key={c.ruleId} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '6px 0',
            borderBottom: '1px solid #1e293b',
          }}>
            <span style={{ fontSize: 14, color: c.passed ? '#22c55e' : (c.blockingLevel === 'critical' ? '#ef4444' : '#f59e0b'), flexShrink: 0 }}>
              {c.passed ? '✓' : c.blockingLevel === 'critical' ? '✗' : '⚠'}
            </span>
            <div>
              <div style={{ fontSize: 12, color: '#e2e8f0' }}>{c.rule}</div>
              {!c.passed && (
                <div style={{ fontSize: 11, color: '#64748b' }}>{c.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      {!isComplete && (
        <button
          className="btn btn-primary"
          onClick={onComplete}
          disabled={!readiness.canComplete}
          style={{ opacity: readiness.canComplete ? 1 : 0.4, marginRight: 8 }}
        >
          Complete Base
        </button>
      )}
      {isComplete && (
        <button
          className="btn btn-ghost"
          onClick={onUnlock}
          style={{ color: '#f59e0b', borderColor: '#f59e0b44', marginRight: 8 }}
        >
          Unlock for Emergency Fix
        </button>
      )}
    </div>
  );
}
