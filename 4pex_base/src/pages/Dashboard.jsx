// 4P3X Dashboard — RUN 1 + RUN 2
// Run 1 cards preserved. Run 2 blueprint cards added.

import React, { useState, useEffect } from 'react';
import { getState, subscribe } from '../state/storage.js';
import { getReservedModules, getActiveModules } from '../config/moduleRegistry.js';
import appConfig from '../config/appConfig.js';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';
import { formatDisplay } from '../utils/date.js';

function HealthRow({ label, status }) {
  const isOk   = ['ready', 'connected', 'configured'].includes(status);
  const isWarn = ['not_configured', 'not_connected'].includes(status);
  const dotClass = isOk ? 'health-dot-ok' : isWarn ? 'health-dot-warn' : 'health-dot-neutral';
  const badgeVariant = isOk ? 'active' : isWarn ? 'warn' : 'neutral';
  return (
    <div className="row-between" style={{ padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{label}</span>
      <Badge variant={badgeVariant}>
        <span className={`health-dot ${dotClass}`} style={{ marginRight: 4 }} />
        {status}
      </Badge>
    </div>
  );
}

const READINESS_COLOR = {
  not_ready:           'var(--text-muted)',
  partial:             'var(--gold-bright)',
  ready_with_warnings: '#4a9eff',
  ready:               'var(--green-bright)',
};

export function Dashboard({ onNavigate }) {
  const [state, setState] = useState(() => getState());

  useEffect(() => {
    const unsub = subscribe((s) => setState({ ...s }));
    return unsub;
  }, []);

  const reserved = getReservedModules();
  const active   = getActiveModules();

  const blueprints    = state.blueprints || {};
  const bpItems       = blueprints.items || [];
  const activeBpId    = blueprints.activeBlueprintId;
  const activeBp      = activeBpId ? bpItems.find((b) => b.id === activeBpId) : null;
  const transState    = state.transformation || {};
  const agentSys      = state.agentSystem   || {};
  const compiler      = state.transformationCompiler || {};
  const compilerPlans = compiler.plans || [];
  const activePlanId  = compiler.activePlanId;
  const activePlan    = compilerPlans.find(p => p.id === activePlanId) || null;
  const openRecs      = (agentSys.recommendationQueue || []).filter(r => r.status === 'open');
  const criticalRecs  = openRecs.filter(r => r.priority === 'critical');
  const criticalRisks = (activePlan?.risks || []).filter(r => r.severity === 'critical');

  // Run 6
  const wsState       = state.variantWorkspaces || {};
  const workspaces    = wsState.workspaces || [];
  const activeWs      = workspaces.find(w => w.id === wsState.activeWorkspaceId) || null;

  // Run 8
  const finalAudit    = state.finalAudit || {};
  // Run 9
  const basePackage   = state.basePackage || {};
  // Run 10
  const masterLauncher = state.masterLauncher || {};
  const finalLock     = finalAudit.finalLock || {};
  // Run 7
  const exportSys     = state.exportSystem || {};
  const exportPacks   = exportSys.exportPacks || [];
  const activeEP      = exportPacks.find(ep => ep.id === exportSys.activeExportPackId) || null;
  const readyPacks    = exportPacks.filter(ep => ep.readiness?.level === 'ready' || ep.readiness?.level === 'ready_with_warnings');

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-subtitle">System overview — {appConfig.name}</div>
      </div>

      {/* Welcome */}
      <Card variant="gold" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold-bright)', marginBottom: 6 }}>
          {appConfig.name}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 10 }}>
          {appConfig.tagline}
        </div>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          <Badge variant="gold">Run 10 Complete</Badge>
          <Badge variant="active">Blueprint Engine</Badge>
          <Badge variant="info">Local-First</Badge>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Created by {appConfig.createdBy} · {appConfig.ecosystem}
          </span>
        </div>
      </Card>

      {/* Run 1 + Run 2 grid */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* System Identity */}
        <Card>
          <div className="card-title">System Identity</div>
          {[
            ['Product', state.app?.name],
            ['Version', state.app?.version],
            ['Mode', state.app?.mode],
            ['Powered By', state.app?.poweredBy],
            ['Creator', state.app?.createdBy],
            ['Ecosystem', state.app?.ecosystem],
          ].map(([k, v]) => (
            <div key={k} className="row-between" style={{ padding: '5px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontSize: 12, color: 'var(--silver-bright)', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </Card>

        {/* Active Variant */}
        <Card variant="purple">
          <div className="card-title">Active Variant Profile</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--purple-bright)', marginBottom: 4 }}>
            {state.activeVariant?.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Type: <strong>{state.activeVariant?.type}</strong>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/variant-profile')}>
            Change Profile →
          </button>
        </Card>

        {/* Foundation Health */}
        <Card>
          <div className="card-title">Foundation Health</div>
          {Object.entries(state.health || {}).map(([k, v]) => (
            <HealthRow key={k} label={k} status={v} />
          ))}
        </Card>

        {/* AI Config */}
        <Card variant="green">
          <div className="card-title">AI Configuration</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              Provider:{' '}
              <span style={{ color: state.aiSettings?.provider !== 'none' ? 'var(--green-bright)' : 'var(--text-muted)' }}>
                {state.aiSettings?.provider || 'none'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Key: {state.aiSettings?.apiKeyConfigured
                ? <span style={{ color: 'var(--green-bright)' }}>Configured ({state.aiSettings.apiKeyMasked})</span>
                : <span style={{ color: 'var(--text-muted)' }}>Not set</span>}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/ai-config')}>Configure AI →</button>
        </Card>

        {/* ─── Run 2 Cards ─── */}

        {/* Blueprint count */}
        <Card variant="gold">
          <div className="card-title">Product Blueprints</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gold-bright)', marginBottom: 4 }}>
            {bpItems.length}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {activeBp
              ? <>Active: <strong>{activeBp.name}</strong></>
              : 'No active blueprint selected.'}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/blueprints')}>
            Blueprint Engine →
          </button>
        </Card>

        {/* Transformation readiness */}
        <Card>
          <div className="card-title">Transformation Readiness</div>
          <div style={{
            fontSize: 28, fontWeight: 800,
            color: READINESS_COLOR[transState.readinessLevel || 'not_ready'],
            marginBottom: 4,
          }}>
            {transState.readinessScore || 0}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>/100</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Level: <Badge variant={
              transState.readinessLevel === 'ready' ? 'active'
              : transState.readinessLevel === 'ready_with_warnings' ? 'info'
              : transState.readinessLevel === 'partial' ? 'warn'
              : 'neutral'
            }>{(transState.readinessLevel || 'not_ready').replace(/_/g, ' ')}</Badge>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
            Recommended next run: {transState.recommendedNextRun || 'Run 3'}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/readiness')}>
            View Readiness →
          </button>
        </Card>
      </div>

      {/* Active modules */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header">Active Modules ({active.length})</div>
        <div className="grid-3">
          {active.map((mod) => (
            <Card key={mod.id} style={{ cursor: 'pointer' }} onClick={() => onNavigate(mod.route)}>
              <div className="row-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{mod.label}</span>
                <Badge variant={mod.runToBuild <= 1 ? 'neutral' : 'info'}>Run {mod.runToBuild}</Badge>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{mod.description}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Reserved preview */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header">Reserved Modules ({reserved.length})</div>
        <div className="grid-3">
          {reserved.map((mod) => (
            <Card key={mod.id} style={{ opacity: 0.6 }}>
              <div className="row-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{mod.label}</span>
                <Badge variant="reserved">Run {mod.runToBuild}</Badge>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{mod.description}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Run 3 — Agent System summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
        <Card>
          <div className="card-title" style={{ fontSize: 12 }}>Active Advisory Agents</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)' }}>7</div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/ai-agents')}>View Agents →</button>
        </Card>
        <Card>
          <div className="card-title" style={{ fontSize: 12 }}>Open Recommendations</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: openRecs.length > 0 ? 'var(--gold)' : 'var(--text-muted)' }}>{openRecs.length}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/agent-recommendations')}>View Queue →</button>
        </Card>
        {criticalRecs.length > 0 && (
          <Card variant="danger">
            <div className="card-title" style={{ fontSize: 12 }}>Critical Recommendations</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{criticalRecs.length}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/agent-recommendations')}>Resolve →</button>
          </Card>
        )}
      </div>

      {/* Run 4 — Transformation Compiler summary */}
      <Card variant="gold" style={{ marginBottom: 12 }}>
        <div className="card-title">Run 4 — Transformation Compiler</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Variant Transformation Compiler + Safe Product Skeleton Generator
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 6, padding: '10px 12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Plans Compiled</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>{compilerPlans.length}</div>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 6, padding: '10px 12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Active Plan</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: activePlan ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {activePlan?.blueprintName || 'None'}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 6, padding: '10px 12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Critical Risks</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: criticalRisks.length > 0 ? '#ef4444' : '#22c55e' }}>
              {criticalRisks.length}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 6, padding: '10px 12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Plan Status</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: activePlan?.status === 'ready_for_variant_run' ? '#22c55e' : activePlan?.status === 'blocked' ? '#ef4444' : 'var(--text-secondary)' }}>
              {activePlan?.status?.replace(/_/g, ' ') || '—'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/transformation-compiler')}>Open Compiler →</button>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/product-skeleton-generator')}>Skeleton Generator →</button>
          {activePlan && <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/transformation-plan-detail')}>Plan Detail →</button>}
        </div>
      </Card>

      {/* Run 6 — Variant Workspaces */}
      <Card variant="default" style={{ marginBottom: 16 }}>
        <div className="card-title">Run 6 — Variant Workspace Manager</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <div style={{ background: '#111', borderRadius: 6, padding: '8px 14px', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Workspaces</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>{workspaces.length}</div>
          </div>
          <div style={{ background: '#111', borderRadius: 6, padding: '8px 14px', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Active Workspace</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: activeWs ? '#22c55e' : 'var(--text-muted)' }}>
              {activeWs?.name || 'None'}
            </div>
          </div>
          <div style={{ background: '#111', borderRadius: 6, padding: '8px 14px', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Status</div>
            <div style={{ fontSize: 12, color: wsState.status === 'ready' ? '#22c55e' : '#f59e0b' }}>{wsState.status || 'ready'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/variant-workspaces')}>Open Workspaces →</button>
          {activeWs && <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/workspace-detail')}>Workspace Detail →</button>}
          {workspaces.length >= 2 && <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/workspace-comparison')}>Compare →</button>}
        </div>
      </Card>

      {/* Run 7 — Export System */}
      <Card variant="gold" style={{ marginBottom: 16 }}>
        <div className="card-title">Run 7 — Export &amp; Handoff System</div>
        <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 10 }}>
          Prepares safe manual handoff only. Does not deploy, push code, execute prompts, or write product files.
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <div style={{ background: '#111', borderRadius: 6, padding: '8px 14px', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Export Packs</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>{exportPacks.length}</div>
          </div>
          <div style={{ background: '#111', borderRadius: 6, padding: '8px 14px', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Ready to Export</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: readyPacks.length > 0 ? '#22c55e' : 'var(--text-muted)' }}>{readyPacks.length}</div>
          </div>
          <div style={{ background: '#111', borderRadius: 6, padding: '8px 14px', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Active Pack</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: activeEP ? '#22c55e' : 'var(--text-muted)' }}>
              {activeEP?.name || 'None'}
            </div>
          </div>
          <div style={{ background: '#111', borderRadius: 6, padding: '8px 14px', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 3 }}>Locks Active</div>
            <div style={{ fontSize: 12, color: '#22c55e' }}>✓ All</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/export-centre')}>Export Centre →</button>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/handoff-pack-builder')}>Handoff Builder →</button>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/deployment-readiness')}>Deployment Readiness →</button>
          {activeEP && <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/export-pack-detail')}>Pack Detail →</button>}
        </div>
      </Card>


      {/* Run 8 — Final Audit */}
      <div className="card" style={{ border: '1px solid var(--gold)' }}>
        <div className="card-title">Run 8 — Final System Audit</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div style={{ background: '#0a0a0a', borderRadius: 6, padding: '8px 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>AUDIT SCORE</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: (finalAudit.overallScore||0) >= 90 ? '#22c55e' : (finalAudit.overallScore||0) >= 70 ? '#f59e0b' : '#ef4444' }}>
              {finalAudit.overallScore || 0}<span style={{ fontSize: 11 }}>/100</span>
            </div>
          </div>
          <div style={{ background: '#0a0a0a', borderRadius: 6, padding: '8px 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>READINESS</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: finalAudit.readinessLevel === 'ready' ? '#22c55e' : '#f59e0b', marginTop: 2 }}>
              {(finalAudit.readinessLevel||'not_ready').replace(/_/g,' ').toUpperCase()}
            </div>
          </div>
          <div style={{ background: '#0a0a0a', borderRadius: 6, padding: '8px 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>LOCK STATUS</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: finalLock.status === 'locked' ? '#22c55e' : '#8b5cf6', marginTop: 2 }}>
              {(finalLock.status||'unlocked').toUpperCase()}
            </div>
          </div>
          <div style={{ background: '#0a0a0a', borderRadius: 6, padding: '8px 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>VARIANTS ALLOWED</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: finalLock.canStartVariantBuilds ? '#22c55e' : '#ef4444', marginTop: 2 }}>
              {finalLock.canStartVariantBuilds ? 'YES ✓' : 'NOT YET'}
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
            <span style={{ color: 'var(--text-muted)' }}>Critical Blockers</span>
            <span style={{ color: (finalAudit.blockers||[]).length === 0 ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{(finalAudit.blockers||[]).length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--text-muted)' }}>Base Ready for Variants</span>
            <span style={{ color: finalAudit.baseReadyForVariants ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{finalAudit.baseReadyForVariants ? 'YES ✓' : 'NO'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/final-system-audit')}>→ Final Audit</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/transformation-readiness-lock')}>→ Lock</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/final-readiness-report')}>→ Report</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/production-hardening')}>→ Hardening</button>
        </div>
      </div>

      {/* Run 9 — Base Package Builder */}
      <div className="run-section">
        <div className="run-label">Run 9 — Base ZIP / Project Package Builder</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 8 }}>
          <div className="stat-card">
            <div className="stat-label">Package Status</div>
            <div className="stat-value" style={{ color: basePackage.zipReady ? '#22c55e' : basePackage.status === 'blocked' ? '#ef4444' : '#94a3b8', fontSize: 13 }}>
              {basePackage.zipReady ? 'READY TO ZIP' : (basePackage.status || 'NOT CHECKED').toUpperCase().replace(/_/g,' ')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Zip Ready</div>
            <div className="stat-value" style={{ color: basePackage.zipReady ? '#22c55e' : '#ef4444' }}>
              {basePackage.zipReady ? 'YES ✓' : 'NO'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Builder Attachment</div>
            <div className="stat-value" style={{ color: basePackage.builderAttachmentReady ? '#22c55e' : '#94a3b8', fontSize: 13 }}>
              {basePackage.builderAttachmentReady ? 'READY ✓' : 'PENDING'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Package Blockers</div>
            <div className="stat-value" style={{ color: (basePackage.latestValidation?.blockers||[]).length === 0 && basePackage.latestValidation ? '#22c55e' : '#94a3b8' }}>
              {basePackage.latestValidation ? (basePackage.latestValidation?.blockers||[]).length : '—'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/base-package-builder')}>→ Package Builder</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/package-validation')}>→ Package Validation</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/package-manifest')}>→ Package Manifest</button>
        </div>
      </div>


      {/* Run 10 — Master Variant Launcher */}
      <div className="run-section" style={{ marginBottom: 16 }}>
        <div className="run-label">Run 10 — Master Variant Transformation Launcher</div>
        <div className="grid-3">
          <div className="stat-card">
            <div className="stat-label">Base Completion</div>
            <div className="stat-value" style={{ color: masterLauncher.finalBaseComplete ? '#22c55e' : '#94a3b8', fontSize: 13 }}>
              {masterLauncher.finalBaseComplete ? 'COMPLETE ✓' : 'NOT YET LOCKED'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Ready to Build Variants</div>
            <div className="stat-value" style={{ color: masterLauncher.readyToBuildVariants ? '#22c55e' : '#94a3b8', fontSize: 13 }}>
              {masterLauncher.readyToBuildVariants ? 'YES ✓' : 'NO'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Generated Prompts</div>
            <div className="stat-value" style={{ fontSize: 13 }}>
              {(masterLauncher.generatedMasterPrompts || []).length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Selected Variant</div>
            <div className="stat-value" style={{ fontSize: 12, color: masterLauncher.selectedVariantType ? '#a5b4fc' : '#64748b' }}>
              {masterLauncher.selectedVariantType
                ? masterLauncher.selectedVariantType.replace(/([A-Z])/g, ' $1').trim()
                : 'None selected'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/master-variant-launcher')}>→ Master Variant Launcher</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/variant-transformation-prompt-builder')}>→ Prompt Builder</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/final-base-completion')}>→ Final Base Completion</button>
        </div>
      </div>

      {/* System Status — All Runs */}
      <Card variant="default" style={{ marginBottom: 16 }}>
        <div className="card-title">System Status — Run 10 Complete</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
          All 10 runs of the 4P3X Reusable Base Structure™ are built and operational.
          Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
        </div>
        {[
          'Run 1: Core foundations, state, storage, modules, layout',
          'Run 2: Blueprint Engine',
          'Run 3: AI Agents + Safety System',
          'Run 4: Transformation Compiler + Skeleton Generator',
          'Run 5: Variant Build Launcher + Run Prompt Generator',
          'Run 6: Variant Workspace Manager',
          'Run 7: Export Centre + Handoff Pack Builder + Deployment Readiness',
          'Run 8: Final System Audit + Production Hardening + Readiness Lock',
          'Run 8.5: Final Patch / Drift Removal / Transformation Lock Hardening',
          'Run 9: Base ZIP / Project Package Builder',
          'Run 10: Master Variant Transformation Launcher + Final Base Completion Lock',
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 700 }}>✓</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{step}</span>
          </div>
        ))}
        <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(34,197,94,0.08)', borderRadius: 6, border: '1px solid rgba(34,197,94,0.2)' }}>
          <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
            ✓ BASE COMPLETE — Ready for real product variant builds. Stop building the base.
          </span>
        </div>
      </Card>

      <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
        Last updated: {formatDisplay(state.audit?.updatedAt)}
      </div>
    </div>
  );
}

export default Dashboard;
