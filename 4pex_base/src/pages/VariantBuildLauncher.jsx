import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { getState, checkVariantLaunchReadiness, setActiveWorkspaceStorage } from '../state/storage.js';

export function VariantBuildLauncher({ navigate }) {
  const [state, setLocalState] = useState(() => getState());

  function refresh() { setLocalState(getState()); }

  const launcher    = state.variantLauncher || {};
  const finalAudit  = state.finalAudit || {};
  const finalLock   = finalAudit.finalLock || {};
  const auditBlocked = !finalLock.canStartVariantBuilds;
  const plans       = state.transformationCompiler?.plans || [];
  const activePlan  = plans.find((p) => p.id === launcher.selectedTransformationPlanId)
    || plans.find((p) => p.id === state.transformationCompiler?.activePlanId)
    || null;
  const prompts     = launcher.generatedPrompts || [];
  const readiness   = launcher.launchReadiness   || {};
  const workspaces  = state.variantWorkspaces?.workspaces || [];
  const activeWS    = workspaces.find((w) => w.id === state.variantWorkspaces?.activeWorkspaceId) || null;

  function handleCheckReadiness() {
    checkVariantLaunchReadiness();
    refresh();
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Variant Build Launcher</h1>
          <p className="page-subtitle">Validates readiness and prepares product variant builds for manual execution using generated run prompts.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCheckReadiness}>Check Readiness</button>
      </div>

      <div style={{ background: '#0a1a0a', border: '1px solid #14532d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#22c55e' }}>
        ⊡ Variant Build Launcher — manual copy-paste only. No build runs are executed automatically.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>

        {/* Active Workspace */}
        <Card variant="default">
          <div className="card-title">Active Workspace</div>
          {activeWS ? (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>{activeWS.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{activeWS.productType} · {activeWS.status}</div>
              <div style={{ fontSize: 12, color: activeWS.readiness?.score >= 70 ? '#22c55e' : '#f59e0b' }}>
                Readiness: {activeWS.readiness?.score ?? 0}/100
              </div>
              {(activeWS.readiness?.blockers || []).length > 0 && (
                <div style={{ marginTop: 6 }}>
                  {activeWS.readiness.blockers.map((b, i) => <div key={i} style={{ fontSize: 11, color: '#ef4444' }}>⛔ {b}</div>)}
                </div>
              )}
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => navigate('/workspace-detail')}>View Workspace →</button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>No active workspace selected.</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/variant-workspaces')}>Open Workspaces →</button>
            </div>
          )}
        </Card>

        {/* Active Transformation Plan */}
        <Card variant="default">
          <div className="card-title">Transformation Plan</div>
          {activePlan ? (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{activePlan.name || activePlan.title || 'Plan'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{activePlan.productType} · {activePlan.status}</div>
              <div style={{ fontSize: 12, color: ['ready_for_variant_run','ready_with_warnings'].includes(activePlan.status) ? '#22c55e' : '#ef4444' }}>
                {['ready_for_variant_run','ready_with_warnings'].includes(activePlan.status) ? '✓ Ready for prompts' : '⛔ Not ready'}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => navigate('/transformation-plan-detail')}>View Plan →</button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>No transformation plan selected.</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/transformation-compiler')}>Open Compiler →</button>
            </div>
          )}
        </Card>

        {/* Final Audit Lock Check */}
        {auditBlocked && (
          <div style={{ background: '#1a0505', border: '2px solid #ef4444', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>⛔ Variant Build Blocked — Final Audit Not Passed</div>
            <div style={{ fontSize: 12, color: '#f87171', marginBottom: 8 }}>
              The Transformation Readiness Lock must be set before launching real product variant builds.
            </div>
            {(finalAudit.blockers || []).slice(0, 3).map((b, i) => (
              <div key={i} style={{ fontSize: 11, color: '#ef4444' }}>⛔ {b}</div>
            ))}
          </div>
        )}
        {!auditBlocked && (
          <div style={{ background: '#0f1a0f', border: '1px solid #166534', borderRadius: 6, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#22c55e' }}>
            ✅ Final audit lock confirmed. Variant builds are permitted.
          </div>
        )}
        {/* Launch Readiness */}
        <Card variant={readiness.ready ? 'gold' : 'default'}>
          <div className="card-title">Launch Readiness</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: readiness.ready ? '#22c55e' : '#ef4444', marginBottom: 6 }}>
            {readiness.ready ? '✓ READY' : '⛔ NOT READY'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Prompts: {readiness.promptCount || 0} generated, {readiness.validatedPromptCount || 0} validated</div>
          {(readiness.blockers || []).map((b, i) => <div key={i} style={{ fontSize: 11, color: '#ef4444' }}>⛔ {b}</div>)}
          {(readiness.warnings || []).map((w, i) => <div key={i} style={{ fontSize: 11, color: '#f59e0b' }}>⚠ {w}</div>)}
          {readiness.nextRecommendedAction && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>→ {readiness.nextRecommendedAction}</div>
          )}
        </Card>

        {/* Generated Prompts */}
        <Card variant="default">
          <div className="card-title">Generated Prompts ({prompts.length})</div>
          {prompts.length === 0 ? (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>No prompts generated yet.</div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/run-prompt-generator')}>Generate Prompts →</button>
            </div>
          ) : (
            <>
              {prompts.slice(-3).map((p) => (
                <div key={p.id} style={{ padding: '6px 0', borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: p.safety?.passed ? '#22c55e' : '#ef4444' }}>
                    {p.safety?.passed ? '✓ Safe' : '⛔ Review'} · Completeness: {p.completeness?.score || 0}/100
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => navigate('/run-prompt-generator')}>Manage Prompts →</button>
            </>
          )}
        </Card>

        {/* Export/Handoff */}
        <Card variant="default">
          <div className="card-title">Handoff & Export</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
            Create an export pack for safe handoff to builder tools before starting product builds.
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/export-centre')}>Export Centre →</button>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }} onClick={() => navigate('/deployment-readiness')}>Deployment Readiness →</button>
        </Card>
      </div>
    </div>
  );
}
export default VariantBuildLauncher;
