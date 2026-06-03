import React, { useState } from 'react';
import { useAppState } from '../state/useAppState.js';
import { runFinalSystemAudit, resolveAuditFinding, acceptAuditRisk, clearAuditHistory, exportFinalReadinessReport } from '../state/storage.js';
import { AuditScoreCard }            from '../components/audit/AuditScoreCard.jsx';
import { AuditBlockerPanel }         from '../components/audit/AuditBlockerPanel.jsx';
import { AuditWarningPanel }         from '../components/audit/AuditWarningPanel.jsx';
import { AuditFindingList }          from '../components/audit/AuditFindingList.jsx';
import { AuditCategoryPanel }        from '../components/audit/AuditCategoryPanel.jsx';
import { RouteAuditPanel }           from '../components/audit/RouteAuditPanel.jsx';
import { ModuleRegistryAuditPanel }  from '../components/audit/ModuleRegistryAuditPanel.jsx';
import { SsotAuditPanel }            from '../components/audit/SsotAuditPanel.jsx';
import { StateSchemaAuditPanel }     from '../components/audit/StateSchemaAuditPanel.jsx';
import { SecretExposureAuditPanel }  from '../components/audit/SecretExposureAuditPanel.jsx';
import { NoDemoLanguageAuditPanel }  from '../components/audit/NoDemoLanguageAuditPanel.jsx';
import { AgentSafetyAuditPanel }     from '../components/audit/AgentSafetyAuditPanel.jsx';
import { TransformationAuditPanel }  from '../components/audit/TransformationAuditPanel.jsx';
import { PromptGeneratorAuditPanel } from '../components/audit/PromptGeneratorAuditPanel.jsx';
import { WorkspaceIsolationAuditPanel } from '../components/audit/WorkspaceIsolationAuditPanel.jsx';
import { ExportHandoffAuditPanel }   from '../components/audit/ExportHandoffAuditPanel.jsx';
import { DashboardPwaAuditPanel }    from '../components/audit/DashboardPwaAuditPanel.jsx';
import { PwaReadinessAuditPanel }    from '../components/audit/PwaReadinessAuditPanel.jsx';
import { downloadAuditReportJson }   from '../utils/auditExport.js';
import { Badge } from '../components/ui/Badge.jsx';

export function FinalSystemAudit() {
  const state   = useAppState();
  const fa      = state.finalAudit || {};
  const latestRun = (fa.auditRuns || []).slice(-1)[0] || null;
  const cats    = latestRun?.categories || {};
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');

  const handleRunAudit = async () => {
    setRunning(true);
    setMessage('');
    try {
      const result = runFinalSystemAudit();
      setMessage(result.ok ? '✓ Audit complete.' : `Error: ${result.error}`);
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleExport = () => {
    const report = exportFinalReadinessReport();
    downloadAuditReportJson(report);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Final System Audit</h1>
            <Badge variant="gold">Run 8</Badge>
          </div>
          <p className="page-subtitle">
            Runs complete checks across routes, modules, SSOT, state, agents, transformation, exports, and readiness.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleRunAudit} disabled={running}>
            {running ? 'Running…' : '▶ Run Final Audit'}
          </button>
          {latestRun && (
            <button className="btn btn-ghost" onClick={handleExport}>⬇ Export Report</button>
          )}
          {fa.auditRuns?.length > 0 && (
            <button className="btn btn-ghost" onClick={clearAuditHistory} style={{ fontSize: 11 }}>Clear History</button>
          )}
        </div>
      </div>

      <div style={{ background: '#0a1a0a', border: '1px solid #14532d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#86efac' }}>
        ℹ The audit checks readiness only. It does not build variants, deploy, execute prompts, or write generated files.
      </div>

      {message && (
        <div style={{ background: message.startsWith('✓') ? '#0f1a0f' : '#1a0505', border: `1px solid ${message.startsWith('✓') ? '#166534' : '#7f1d1d'}`, borderRadius: 6, padding: '8px 14px', fontSize: 12, color: message.startsWith('✓') ? '#22c55e' : '#ef4444', marginBottom: 12 }}>
          {message}
        </div>
      )}

      {!latestRun && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14 }}>No audit has been run yet.</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Click "Run Final Audit" to begin.</div>
        </div>
      )}

      {latestRun && (
        <>
          <AuditScoreCard
            score={latestRun.overallScore}
            readinessLevel={latestRun.readinessLevel}
            lastRunAt={latestRun.completedAt}
            passedCount={(latestRun.passedChecks || []).length}
            failedCount={(latestRun.failedChecks || []).length}
            warningCount={(latestRun.warnings || []).length}
          />

          {(latestRun.finalRecommendation) && (
            <div style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 8, padding: '10px 14px', margin: '12px 0', fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              → {latestRun.finalRecommendation}
            </div>
          )}

          <AuditBlockerPanel blockers={latestRun.blockers} />
          <div style={{ marginTop: 10 }}>
            <AuditWarningPanel warnings={latestRun.warnings} />
          </div>

          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>AUDIT CATEGORIES</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
              <RouteAuditPanel           result={cats.routes} />
              <ModuleRegistryAuditPanel  result={cats.moduleRegistry} />
              <SsotAuditPanel            result={cats.ssot} />
              <StateSchemaAuditPanel     result={cats.stateSchema} />
              <AuditCategoryPanel        result={cats.localStorage} />
              <AuditCategoryPanel        result={cats.exportImport} />
              <SecretExposureAuditPanel  result={cats.secretExposure} />
              <NoDemoLanguageAuditPanel  result={cats.noDemoLanguage} />
              <AgentSafetyAuditPanel     result={cats.agentSafety} />
              <TransformationAuditPanel  result={cats.transformation} />
              <PromptGeneratorAuditPanel result={cats.promptGenerator} />
              <WorkspaceIsolationAuditPanel result={cats.workspaces} />
              <ExportHandoffAuditPanel   result={cats.exportHandoff} />
              <DashboardPwaAuditPanel    result={cats.dashboardPwa} />
              <PwaReadinessAuditPanel    result={cats.pwa} />
              <AuditCategoryPanel        result={cats.buildReadiness} />
            </div>
          </div>

          {(fa.latestFindings || []).length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>ALL FINDINGS</h3>
              <AuditFindingList
                findings={fa.latestFindings}
                onResolve={(id) => resolveAuditFinding(id)}
                onAcceptRisk={(id) => acceptAuditRisk(id)}
              />
            </div>
          )}

          {fa.auditRuns?.length > 1 && (
            <div style={{ marginTop: 16, background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Audit History ({fa.auditRuns.length} runs)</div>
              {(fa.auditRuns || []).slice().reverse().slice(0, 5).map((run, i) => (
                <div key={run.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '3px 0', borderBottom: '1px solid #0f0f0f', color: 'var(--text-muted)' }}>
                  <span>{run.status?.toUpperCase()} — {run.overallScore}/100</span>
                  <span>{new Date(run.completedAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default FinalSystemAudit;
