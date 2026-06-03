import React from 'react';
import { useAppState } from '../state/useAppState.js';
import { lockBaseForTransformation, unlockBaseForFixes } from '../state/storage.js';
import { FinalLockPanel }       from '../components/audit/FinalLockPanel.jsx';
import { FinalReadinessSummary } from '../components/audit/FinalReadinessSummary.jsx';
import { AuditBlockerPanel }    from '../components/audit/AuditBlockerPanel.jsx';
import { Card }  from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';

function StatusRow({ label, value, ok }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #0f0f0f', fontSize: 12 }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 700, color: ok ? '#22c55e' : '#ef4444' }}>{value}</span>
    </div>
  );
}

export function TransformationReadinessLock({ onNavigate }) {
  const state  = useAppState();
  const fa     = state.finalAudit || {};
  const lock   = fa.finalLock || { status: 'unlocked', canStartVariantBuilds: false };
  const h      = fa.hardening || {};

  const canLock = (fa.blockers || []).length === 0 && fa.overallScore >= 85;

  const handleLock = () => {
    const result = lockBaseForTransformation();
    if (!result.ok) alert(result.error);
  };

  const handleUnlock = () => {
    unlockBaseForFixes();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Transformation Readiness Lock</h1>
            <Badge variant="gold">Run 8</Badge>
          </div>
          <p className="page-subtitle">Locks or blocks the base from real variant transformation based on final audit results.</p>
        </div>
      </div>

      <div style={{ background: '#0a1a0a', border: '1px solid #14532d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#86efac' }}>
        ℹ The base should be locked only when all critical checks pass. The lock does not build, deploy, or execute anything — it confirms readiness.
      </div>

      {!fa.lastRunAt && (
        <div style={{ background: '#1a0f00', border: '1px solid #78350f', borderRadius: 8, padding: '12px 14px', marginBottom: 14, fontSize: 12, color: '#f59e0b' }}>
          ⚠ No audit has been run yet. Run the Final System Audit first to unlock the lock controls.
        </div>
      )}

      <FinalLockPanel
        finalLock={lock}
        canLock={canLock && !!fa.lastRunAt}
        onLock={handleLock}
        onUnlock={handleUnlock}
      />

      <div style={{ marginTop: 14 }}>
        <Card variant="default">
          <div className="card-title" style={{ marginBottom: 10 }}>Readiness Requirements</div>
          <StatusRow label="Final Audit Run"           value={fa.lastRunAt ? new Date(fa.lastRunAt).toLocaleString() : 'Not run'} ok={!!fa.lastRunAt} />
          <StatusRow label="Overall Score ≥ 85"        value={`${fa.overallScore || 0}/100`} ok={(fa.overallScore || 0) >= 85} />
          <StatusRow label="No Critical Blockers"      value={(fa.blockers || []).length === 0 ? 'None ✓' : `${(fa.blockers||[]).length} blockers`} ok={(fa.blockers||[]).length === 0} />
          <StatusRow label="SSOT Verified"             value={h.ssotVerified            ? 'Yes' : 'No'} ok={h.ssotVerified} />
          <StatusRow label="Secrets Cleared"           value={h.secretsCleared          ? 'Yes' : 'No'} ok={h.secretsCleared} />
          <StatusRow label="Transformation Safe"       value={h.transformationSafe      ? 'Yes' : 'No'} ok={h.transformationSafe} />
          <StatusRow label="Workspace Isolation Safe"  value={h.workspacesSafe          ? 'Yes' : 'No'} ok={h.workspacesSafe} />
          <StatusRow label="Export / Handoff Safe"     value={h.exportsSafe             ? 'Yes' : 'No'} ok={h.exportsSafe} />
          <StatusRow label="Can Start Variant Builds"  value={lock.canStartVariantBuilds ? 'YES ✓' : 'NOT YET'} ok={lock.canStartVariantBuilds} />
        </Card>
      </div>

      {(fa.blockers || []).length > 0 && (
        <div style={{ marginTop: 14 }}>
          <AuditBlockerPanel blockers={fa.blockers} />
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <FinalReadinessSummary finalAudit={fa} onNavigate={onNavigate} />
      </div>

      {lock.canStartVariantBuilds && (
        <div style={{ marginTop: 14, background: '#0f1a0f', border: '1px solid #166534', borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>✅ Base is locked and ready for real variant builds.</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            You may now begin product-specific variant builds from the exported base zip. Suggested starting points:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {['Four Paws LMS + Learner PWA', 'Fleet Control Dashboard + Driver PWA', 'Patient Monitoring Dashboard + Patient PWA', 'Coach Training Dashboard + Training PWA', 'Project Control OS'].map(v => (
              <span key={v} style={{ background: '#0a0f0a', border: '1px solid #166534', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#86efac' }}>{v}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default TransformationReadinessLock;
