// 4P3X — Transformation Plan Detail Page — RUN 4
import React, { useState } from 'react';
import { getState, deleteTransformationPlan, setActiveTransformationPlan } from '../state/storage.js';
import { canProceedToVariantRun } from '../logic/transformer/transformationLocks.js';
import FileStructurePlan        from '../components/transformer/FileStructurePlan.jsx';
import ModuleActivationPlan     from '../components/transformer/ModuleActivationPlan.jsx';
import DataModelPlan            from '../components/transformer/DataModelPlan.jsx';
import UIComponentPlan          from '../components/transformer/UIComponentPlan.jsx';
import StateTransitionPlan      from '../components/transformer/StateTransitionPlan.jsx';
import ApiIntegrationPlan       from '../components/transformer/ApiIntegrationPlan.jsx';
import AgentCapabilityPlan      from '../components/transformer/AgentCapabilityPlan.jsx';
import SafetyCompliancePlan     from '../components/transformer/SafetyCompliancePlan.jsx';
import FutureRunSequence        from '../components/transformer/FutureRunSequence.jsx';
import TransformationRiskPanel  from '../components/transformer/TransformationRiskPanel.jsx';
import TransformationLockPanel  from '../components/transformer/TransformationLockPanel.jsx';
import TransformationExportPanel from '../components/transformer/TransformationExportPanel.jsx';

const STATUS_COLOR = { draft: '#9ca3af', compiled: '#60a5fa', blocked: '#ef4444', ready_for_variant_run: '#22c55e' };

export default function TransformationPlanDetail({ onNavigate }) {
  const [refresh,  setRefresh]  = useState(0);
  const [deleted,  setDeleted]  = useState(false);

  const state    = getState();
  const compiler = state?.transformationCompiler || {};
  const plans    = compiler.plans || [];
  const plan     = plans.find(p => p.id === compiler.activePlanId) || plans[0] || null;

  const { ok: canProceed, reasons: proceedReasons } = plan ? canProceedToVariantRun(plan) : { ok: false, reasons: ['No plan loaded.'] };

  function handleDelete() {
    if (!plan) return;
    if (window.confirm(`Delete plan "${plan.blueprintName}"? This cannot be undone.`)) {
      deleteTransformationPlan(plan.id);
      setDeleted(true);
      setRefresh(r => r + 1);
    }
  }

  if (deleted || !plan) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>📋 Transformation Plan Detail</h1>
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <p>No transformation plan loaded.</p>
          <button onClick={() => onNavigate?.('/transformation-compiler')} style={styles.link}>← Go to Compiler</button>
        </div>
      </div>
    );
  }

  const sc      = STATUS_COLOR[plan.status] || '#9ca3af';
  const criticals = (plan.risks || []).filter(r => r.severity === 'critical');

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h1 style={styles.title}>📋 Transformation Plan Detail</h1>
          <button onClick={handleDelete} style={styles.deleteBtn}>🗑 Delete Plan</button>
        </div>
        <p style={styles.subtitle}>Read-only plan view. No files are created from this plan.</p>
      </div>

      {/* Plan summary bar */}
      <div style={styles.summaryBar}>
        <div style={styles.summaryItem}><span style={styles.sLabel}>Blueprint</span><span style={styles.sVal}>{plan.blueprintName}</span></div>
        <div style={styles.summaryItem}><span style={styles.sLabel}>Product Type</span><span style={styles.sVal}>{plan.productType}</span></div>
        <div style={styles.summaryItem}><span style={styles.sLabel}>Status</span><span style={{ ...styles.sVal, color: sc }}>{plan.status?.replace(/_/g, ' ')}</span></div>
        <div style={styles.summaryItem}><span style={styles.sLabel}>Readiness</span><span style={{ ...styles.sVal, color: '#d4a843' }}>{plan.readiness?.score ?? 0}/100</span></div>
        <div style={styles.summaryItem}><span style={styles.sLabel}>Compile Mode</span><span style={{ ...styles.sVal, color: '#22c55e' }}>{plan.compileMode}</span></div>
        <div style={styles.summaryItem}><span style={styles.sLabel}>Compiled</span><span style={styles.sVal}>{plan.audit?.compiledAt ? new Date(plan.audit.compiledAt).toLocaleString() : '—'}</span></div>
      </div>

      {/* Variant run readiness */}
      <div style={{ ...styles.readinessBox, borderColor: canProceed ? '#166534' : '#7f1d1d', background: canProceed ? '#0a1a0a' : '#1f0000' }}>
        <strong style={{ color: canProceed ? '#22c55e' : '#ef4444' }}>
          {canProceed ? '✅ Ready for Variant Run' : '⛔ Not Ready for Variant Run'}
        </strong>
        {!canProceed && proceedReasons.map((r, i) => <div key={i} style={styles.proceedReason}>{r}</div>)}
        {canProceed && <div style={{ color: '#86efac', fontSize: 12, marginTop: 4 }}>This plan has passed all readiness checks. Proceed to Run 5 when ready.</div>}
      </div>

      {/* Blockers + Warnings */}
      {(plan.blockers || []).length > 0 && (
        <div style={styles.blockerBox}>
          <strong style={{ color: '#ef4444' }}>⛔ Blockers ({plan.blockers.length})</strong>
          {plan.blockers.map((b, i) => <div key={i} style={styles.blockerItem}>{b}</div>)}
        </div>
      )}
      {(plan.warnings || []).length > 0 && (
        <div style={styles.warnBox}>
          <strong style={{ color: '#f59e0b' }}>⚠ Warnings ({plan.warnings.length})</strong>
          {plan.warnings.map((w, i) => <div key={i} style={styles.warnItem}>{w}</div>)}
        </div>
      )}

      {/* All plan sections */}
      <FileStructurePlan       fileStructurePlan={plan.fileStructurePlan} />
      <ModuleActivationPlan    moduleActivationPlan={plan.moduleActivationPlan} />
      <DataModelPlan           dataModelPlan={plan.dataModelPlan} />
      <UIComponentPlan         uiComponentPlan={plan.uiComponentPlan} />
      <StateTransitionPlan     stateTransitionPlan={plan.stateTransitionPlan} />
      <ApiIntegrationPlan      apiIntegrationPlan={plan.apiIntegrationPlan} />
      <AgentCapabilityPlan     agentCapabilityPlan={plan.agentCapabilityPlan} />
      <SafetyCompliancePlan    safetyCompliancePlan={plan.safetyCompliancePlan} />
      <FutureRunSequence       futureRunSequence={plan.futureRunSequence} />
      <TransformationRiskPanel risks={plan.risks || []} />
      <TransformationLockPanel locks={compiler.locks || {}} violations={[]} compileReasons={[]} />
      <TransformationExportPanel activePlanId={plan.id} onImportSuccess={() => setRefresh(r => r + 1)} />

      <div style={styles.navRow}>
        <button onClick={() => onNavigate?.('/product-skeleton-generator')} style={styles.navBtnSec}>← Skeleton Generator</button>
        <button onClick={() => onNavigate?.('/transformation-compiler')} style={styles.navBtnSec}>← Compiler</button>
      </div>
    </div>
  );
}

const styles = {
  page:         { padding: '24px', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 },
  header:       { marginBottom: 4 },
  headerTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  title:        { color: '#d4a843', fontSize: 24, fontWeight: 700, margin: '0 0 6px' },
  subtitle:     { color: '#9ca3af', fontSize: 14, margin: 0 },
  deleteBtn:    { background: '#1f0000', color: '#f87171', border: '1px solid #7f1d1d', borderRadius: 6, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 },
  summaryBar:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16 },
  summaryItem:  { display: 'flex', flexDirection: 'column', gap: 3 },
  sLabel:       { color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' },
  sVal:         { color: '#e5e7eb', fontSize: 13, fontWeight: 600 },
  readinessBox: { border: '1px solid', borderRadius: 8, padding: 14 },
  proceedReason:{ color: '#fca5a5', fontSize: 12, marginTop: 4 },
  blockerBox:   { background: '#1f0000', border: '1px solid #7f1d1d', borderRadius: 8, padding: 16 },
  blockerItem:  { color: '#fca5a5', fontSize: 12, marginTop: 6 },
  warnBox:      { background: '#1c1200', border: '1px solid #78350f', borderRadius: 8, padding: 16 },
  warnItem:     { color: '#fde68a', fontSize: 12, marginTop: 6 },
  empty:        { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  emptyIcon:    { fontSize: 48 },
  link:         { background: 'none', border: 'none', color: '#d4a843', cursor: 'pointer', fontSize: 14, fontWeight: 700, textDecoration: 'underline' },
  navRow:       { display: 'flex', gap: 12, flexWrap: 'wrap' },
  navBtnSec:    { background: '#1a1a1a', color: '#e5e7eb', border: '1px solid #333', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};
