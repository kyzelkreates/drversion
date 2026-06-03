import React from 'react';
import { Card } from '../ui/Card.jsx';

const rowStyle = (ok) => ({
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '6px 0', borderBottom: '1px solid #0f0f0f', fontSize: 12,
});

function StatusBadge({ ok }) {
  return (
    <span style={{ fontWeight: 700, color: ok ? '#22c55e' : '#ef4444', fontSize: 12 }}>
      {ok ? 'YES ✓' : 'NO ✗'}
    </span>
  );
}

export function FinalReadinessSummary({ finalAudit = {}, onNavigate }) {
  const lock       = finalAudit.finalLock || {};
  const canStart   = lock.canStartVariantBuilds;
  const score      = finalAudit.overallScore || 0;
  const level      = (finalAudit.readinessLevel || 'not_ready').replace(/_/g, ' ').toUpperCase();

  const safeColor  = canStart ? '#22c55e' : '#ef4444';
  const safeMsg    = canStart
    ? '✅ Safe to begin real product variant builds.'
    : '⛔ Not safe yet — resolve blockers and re-run the audit first.';

  return (
    <Card variant="gold">
      <div className="card-title" style={{ marginBottom: 12 }}>Final Readiness Summary</div>

      <div style={{ ...rowStyle(true) }}>
        <span style={{ color: 'var(--text-secondary)' }}>Overall Score</span>
        <span style={{ fontWeight: 800, fontSize: 18, color: score >= 90 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444' }}>{score}/100</span>
      </div>
      <div style={{ ...rowStyle(true) }}>
        <span style={{ color: 'var(--text-secondary)' }}>Readiness Level</span>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{level}</span>
      </div>
      <div style={{ ...rowStyle(finalAudit.baseReadyForVariants) }}>
        <span style={{ color: 'var(--text-secondary)' }}>Base Ready for Variants</span>
        <StatusBadge ok={finalAudit.baseReadyForVariants} />
      </div>
      <div style={{ ...rowStyle(finalAudit.exportReady) }}>
        <span style={{ color: 'var(--text-secondary)' }}>Export Ready</span>
        <StatusBadge ok={finalAudit.exportReady} />
      </div>
      <div style={{ ...rowStyle(finalAudit.zipHandoffReady) }}>
        <span style={{ color: 'var(--text-secondary)' }}>Zip Handoff Ready</span>
        <StatusBadge ok={finalAudit.zipHandoffReady} />
      </div>
      <div style={{ ...rowStyle(canStart) }}>
        <span style={{ color: 'var(--text-secondary)' }}>Transformation Lock</span>
        <span style={{ fontWeight: 700, color: lock.status === 'locked' ? '#22c55e' : '#ef4444' }}>
          {lock.status?.toUpperCase() || 'UNLOCKED'}
        </span>
      </div>
      <div style={{ ...rowStyle(canStart) }}>
        <span style={{ color: 'var(--text-secondary)' }}>Can Start Variant Builds</span>
        <StatusBadge ok={canStart} />
      </div>

      <div style={{ marginTop: 14, background: canStart ? '#0f1a0f' : '#1a0505', border: `1px solid ${safeColor}`, borderRadius: 8, padding: '12px 14px', fontSize: 13, fontWeight: 700, color: safeColor, textAlign: 'center' }}>
        {safeMsg}
      </div>

      {!canStart && (finalAudit.blockers || []).length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 4 }}>Blockers to resolve:</div>
          {(finalAudit.blockers || []).slice(0, 5).map((b, i) => (
            <div key={i} style={{ fontSize: 11, color: '#f87171', padding: '2px 0' }}>⛔ {b}</div>
          ))}
        </div>
      )}

      {onNavigate && (
        <div style={{ marginTop: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/transformation-readiness-lock')}>
            → View Transformation Readiness Lock
          </button>
        </div>
      )}
    </Card>
  );
}
export default FinalReadinessSummary;
