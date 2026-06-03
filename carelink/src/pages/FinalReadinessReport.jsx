import React, { useState } from 'react';
import { useAppState } from '../state/useAppState.js';
import { exportFinalReadinessReport } from '../state/storage.js';
import { FinalReadinessSummary }     from '../components/audit/FinalReadinessSummary.jsx';
import { AuditBlockerPanel }         from '../components/audit/AuditBlockerPanel.jsx';
import { AuditWarningPanel }         from '../components/audit/AuditWarningPanel.jsx';
import { Card }  from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
  exportFinalReadinessReportToText,
  downloadAuditReportJson,
  downloadAuditReportText,
  copyAuditReportText,
} from '../utils/auditExport.js';

export function FinalReadinessReport({ onNavigate }) {
  const state   = useAppState();
  const fa      = state.finalAudit || {};
  const app     = state.app || {};
  const lock    = fa.finalLock || {};
  const h       = fa.hardening || {};
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const report = exportFinalReadinessReport();
    const text   = exportFinalReadinessReportToText(report);
    await copyAuditReportText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const report = exportFinalReadinessReport();
    downloadAuditReportJson(report);
  };

  const handleDownloadText = () => {
    const report = exportFinalReadinessReport();
    downloadAuditReportText(report);
  };

  const canStart = lock.canStartVariantBuilds;
  const score    = fa.overallScore || 0;
  const latestRun = (fa.auditRuns || []).slice(-1)[0] || null;
  const cats = latestRun?.categories || {};

  const catScores = Object.values(cats).map(c => ({ label: c?.label || c?.id, score: c?.score || 0 })).sort((a, b) => a.score - b.score);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Final Readiness Report</h1>
            <Badge variant="gold">Run 8</Badge>
          </div>
          <p className="page-subtitle">Complete export-ready report confirming whether the base is safe for real product variant builds.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={handleDownloadJson}>⬇ JSON</button>
          <button className="btn btn-ghost btn-sm" onClick={handleDownloadText}>⬇ TXT</button>
          <button className="btn btn-primary btn-sm" onClick={handleCopy}>
            {copied ? '✓ Copied!' : '⎘ Copy Report'}
          </button>
        </div>
      </div>

      <div style={{ background: '#0a1200', border: '1px solid #1a2e00', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#a3e635' }}>
        ℹ This report contains no raw API keys, backend secrets, or deployment instructions. Export is safe.
      </div>

      {!fa.lastRunAt && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14 }}>No audit report available yet.</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Run the Final System Audit first.</div>
          {onNavigate && <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={() => onNavigate('/final-system-audit')}>→ Go to Final System Audit</button>}
        </div>
      )}

      {fa.lastRunAt && (
        <>
          {/* Identity */}
          <Card variant="gold">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>APP</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>4P3X Reusable Base Structure™</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Powered by 4P3X Intelligent AI · Created by Kyzel Kreates</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>AUDIT DATE</div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{new Date(fa.lastRunAt).toLocaleString()}</div>
              </div>
            </div>
          </Card>

          {/* Final summary */}
          <div style={{ marginTop: 12 }}>
            <FinalReadinessSummary finalAudit={fa} onNavigate={onNavigate} />
          </div>

          {/* Architecture confirmation */}
          <Card variant="default" style={{ marginTop: 12 }}>
            <div className="card-title" style={{ marginBottom: 8 }}>Architecture Confirmations</div>
            {[
              { label: 'Dashboard + Connected PWA Pattern', ok: h.dashboardPwaReady  },
              { label: 'PWA Manifest Ready',                ok: h.pwaReady           },
              { label: 'SSOT Integrity',                    ok: h.ssotVerified        },
              { label: 'Secret Safety',                     ok: h.secretsCleared      },
              { label: 'Agent Safety Boundaries',           ok: h.agentsSafe          },
              { label: 'Transformation Non-Destructive',    ok: h.transformationSafe  },
              { label: 'Workspace Isolation',               ok: h.workspacesSafe      },
              { label: 'Export / Handoff Safety',           ok: h.exportsSafe         },
              { label: 'Prompt Manual-Only Execution',      ok: h.promptsSafe         },
            ].map(({ label, ok }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #0f0f0f', fontSize: 12 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 700, color: ok ? '#22c55e' : '#ef4444' }}>{ok ? '✓ Confirmed' : '✗ Not confirmed'}</span>
              </div>
            ))}
          </Card>

          {/* Category scores */}
          {catScores.length > 0 && (
            <Card variant="default" style={{ marginTop: 12 }}>
              <div className="card-title" style={{ marginBottom: 8 }}>Category Scores</div>
              {catScores.map(({ label, score: s }) => (
                <div key={label} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ color: s >= 90 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{s}/100</span>
                  </div>
                  <div style={{ height: 4, background: '#1e1e1e', borderRadius: 2 }}>
                    <div style={{ height: 4, borderRadius: 2, width: `${s}%`, background: s >= 90 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#ef4444', transition: 'width 0.4s' }} />
                  </div>
                </div>
              ))}
            </Card>
          )}

          <div style={{ marginTop: 12 }}>
            <AuditBlockerPanel blockers={fa.blockers} />
          </div>
          <div style={{ marginTop: 10 }}>
            <AuditWarningPanel warnings={fa.warnings} />
          </div>

          {/* Final verdict */}
          <div style={{ marginTop: 16, background: canStart ? '#0f1a0f' : '#1a0505', border: `2px solid ${canStart ? '#22c55e' : '#ef4444'}`, borderRadius: 10, padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: canStart ? '#22c55e' : '#ef4444', marginBottom: 6 }}>
              {canStart ? '✅ Safe to begin real product variant builds.' : '⛔ Not safe yet — fix blockers first.'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {canStart
                ? 'Export the base zip, use the handoff pack, and begin your selected variant build.'
                : 'Resolve all critical blockers, re-run the Final System Audit, then lock the base.'}
            </div>
          </div>

          <div style={{ marginTop: 10, background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 6, padding: '8px 12px', fontSize: 10, color: 'var(--text-muted)' }}>
            SAFETY: This report contains no raw API keys, backend secrets, deployment credentials, or auto-execution instructions.
            Exports are sanitised. This is a local readiness assessment only.
          </div>
        </>
      )}
    </div>
  );
}
export default FinalReadinessReport;
