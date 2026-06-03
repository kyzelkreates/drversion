// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// FinalBaseCompletion.jsx — Run 10
import { useAppState } from '../state/useAppState.js';
import FinalBaseCompletionPanel from '../components/masterLauncher/FinalBaseCompletionPanel.jsx';
import ReadyToBuildVariantsPanel from '../components/masterLauncher/ReadyToBuildVariantsPanel.jsx';
import {
  completeReusableBase,
  unlockReusableBaseForEmergencyFix,
  getReusableBaseCompletionStatus,
} from '../state/storage.js';

export default function FinalBaseCompletion({ navigate, onNavigate }) {
  navigate = navigate || onNavigate || (() => {});
  const { state } = useAppState();
  const ml         = state?.masterLauncher || {};
  const isComplete = ml.finalBaseComplete;
  const status     = getReusableBaseCompletionStatus();

  const handleComplete = () => {
    const result = completeReusableBase();
    if (!result.success) {
      alert(`Cannot complete base:\n${result.blockers?.map((b) => b.rule).join('\n')}`);
    }
  };

  const handleUnlock = () => {
    const confirmed = window.confirm(
      'Unlock the base for an emergency fix?\n\nOnly fix the specific confirmed issue.\nRe-lock immediately after.\nDo NOT add new features.'
    );
    if (confirmed) unlockReusableBaseForEmergencyFix();
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Final Base Completion</div>
        <div className="page-subtitle">
          Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
        </div>
      </div>

      {/* Status summary */}
      <div style={{
        background: isComplete ? '#052e16' : '#1e293b',
        border: `1px solid ${isComplete ? '#166534' : '#334155'}`,
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: isComplete ? '#4ade80' : '#e2e8f0', marginBottom: 4 }}>
          {isComplete
            ? '🎉 4P3X Reusable Base Structure™ — COMPLETE'
            : '4P3X Reusable Base Structure™ — In Progress'
          }
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>
          {status?.message || (isComplete
            ? 'Stop building the base. Begin real product variant builds from the exported zip.'
            : 'Complete all critical checks before locking the base.'
          )}
        </div>
      </div>

      {/* Completion message */}
      {!isComplete && (
        <div style={{
          background: '#1e1b4b',
          border: '1px solid #4338ca',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 24,
          fontSize: 12,
          color: '#a5b4fc',
        }}>
          After completion, stop building the base and begin real product variant builds from the exported zip.
          Each variant is a separate isolated project. Do not add more features to this base.
        </div>
      )}

      {/* Completion checklist */}
      <FinalBaseCompletionPanel
        state={state}
        onComplete={handleComplete}
        onUnlock={handleUnlock}
      />

      <div style={{ marginTop: 24 }} />

      {/* Ready to build variants panel */}
      <ReadyToBuildVariantsPanel isComplete={isComplete} />

      <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/master-variant-launcher')}>
          ← Master Variant Launcher
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/final-readiness-report')}>
          ← Final Readiness Report
        </button>
        {!isComplete && (
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/transformation-readiness-lock')}>
            ← Transformation Readiness Lock
          </button>
        )}
      </div>
    </div>
  );
}
