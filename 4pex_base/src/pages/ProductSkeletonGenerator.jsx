// 4P3X — Product Skeleton Generator Page — RUN 4
import React, { useState } from 'react';
import { getState, setActiveTransformationPlan } from '../state/storage.js';
import FileStructurePlan      from '../components/transformer/FileStructurePlan.jsx';
import ModuleActivationPlan   from '../components/transformer/ModuleActivationPlan.jsx';
import DataModelPlan          from '../components/transformer/DataModelPlan.jsx';
import UIComponentPlan        from '../components/transformer/UIComponentPlan.jsx';
import StateTransitionPlan    from '../components/transformer/StateTransitionPlan.jsx';
import ApiIntegrationPlan     from '../components/transformer/ApiIntegrationPlan.jsx';
import AgentCapabilityPlan    from '../components/transformer/AgentCapabilityPlan.jsx';
import SafetyCompliancePlan   from '../components/transformer/SafetyCompliancePlan.jsx';
import FutureRunSequence      from '../components/transformer/FutureRunSequence.jsx';
import TransformationExportPanel from '../components/transformer/TransformationExportPanel.jsx';

const SECTIONS = [
  'File Structure', 'Modules', 'Data Model', 'UI / Components',
  'State Transitions', 'API / Integrations', 'Agent Capabilities',
  'Safety & Compliance', 'Future Runs', 'Export / Import',
];

export default function ProductSkeletonGenerator({ onNavigate }) {
  const [activeSection, setActiveSection] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const state    = getState();
  const compiler = state?.transformationCompiler || {};
  const plans    = compiler.plans || [];
  const activePlan = plans.find(p => p.id === compiler.activePlanId) || plans[0] || null;

  function handlePlanSelect(e) {
    setActiveTransformationPlan(e.target.value);
    setRefresh(r => r + 1);
  }

  if (!plans.length) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>🏗️ Product Skeleton Generator</h1>
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📋</div>
          <p>No transformation plans compiled yet.</p>
          <p>Go to the <button onClick={() => onNavigate?.('/transformation-compiler')} style={styles.link}>Transformation Compiler</button> and compile a plan first.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏗️ Product Skeleton Generator</h1>
        <p style={styles.subtitle}>
          Skeleton generation produces a <strong style={{ color: '#22c55e' }}>saved plan only</strong>. It does not create or overwrite live app files.
        </p>
      </div>

      {plans.length > 1 && (
        <div style={styles.planSelector}>
          <label style={styles.planLabel}>Active Plan</label>
          <select value={activePlan?.id || ''} onChange={handlePlanSelect} style={styles.select}>
            {plans.map(p => <option key={p.id} value={p.id}>{p.blueprintName} — {p.status}</option>)}
          </select>
        </div>
      )}

      {activePlan && (
        <div style={styles.planSummary}>
          <span style={styles.planName}>{activePlan.blueprintName}</span>
          <span style={styles.planType}>{activePlan.productType}</span>
          <span style={{ ...styles.planStatus, color: activePlan.status === 'ready_for_variant_run' ? '#22c55e' : activePlan.status === 'blocked' ? '#ef4444' : '#60a5fa' }}>
            {activePlan.status?.replace(/_/g, ' ')}
          </span>
          <span style={styles.planScore}>Readiness: {activePlan.readiness?.score ?? 0}/100</span>
        </div>
      )}

      {/* Section tabs */}
      <div style={styles.tabs}>
        {SECTIONS.map((s, i) => (
          <button key={i} onClick={() => setActiveSection(i)} style={{ ...styles.tab, background: activeSection === i ? '#d4a843' : '#1a1a1a', color: activeSection === i ? '#000' : '#9ca3af' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div style={styles.content}>
        {activeSection === 0 && <FileStructurePlan fileStructurePlan={activePlan?.fileStructurePlan} />}
        {activeSection === 1 && <ModuleActivationPlan moduleActivationPlan={activePlan?.moduleActivationPlan} />}
        {activeSection === 2 && <DataModelPlan dataModelPlan={activePlan?.dataModelPlan} />}
        {activeSection === 3 && <UIComponentPlan uiComponentPlan={activePlan?.uiComponentPlan} />}
        {activeSection === 4 && <StateTransitionPlan stateTransitionPlan={activePlan?.stateTransitionPlan} />}
        {activeSection === 5 && <ApiIntegrationPlan apiIntegrationPlan={activePlan?.apiIntegrationPlan} />}
        {activeSection === 6 && <AgentCapabilityPlan agentCapabilityPlan={activePlan?.agentCapabilityPlan} />}
        {activeSection === 7 && <SafetyCompliancePlan safetyCompliancePlan={activePlan?.safetyCompliancePlan} />}
        {activeSection === 8 && <FutureRunSequence futureRunSequence={activePlan?.futureRunSequence} />}
        {activeSection === 9 && <TransformationExportPanel activePlanId={activePlan?.id} onImportSuccess={() => setRefresh(r => r + 1)} />}
      </div>

      <div style={styles.navRow}>
        <button onClick={() => onNavigate?.('/transformation-plan-detail')} style={styles.navBtn}>View Full Detail →</button>
        <button onClick={() => onNavigate?.('/transformation-compiler')} style={styles.navBtnSec}>← Back to Compiler</button>
      </div>
    </div>
  );
}

const styles = {
  page:        { padding: '24px', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 },
  header:      { marginBottom: 4 },
  title:       { color: '#d4a843', fontSize: 24, fontWeight: 700, margin: '0 0 8px' },
  subtitle:    { color: '#9ca3af', fontSize: 14, margin: 0 },
  empty:       { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 },
  emptyIcon:   { fontSize: 48, marginBottom: 12 },
  link:        { background: 'none', border: 'none', color: '#d4a843', cursor: 'pointer', fontSize: 14, fontWeight: 700, textDecoration: 'underline' },
  planSelector:{ background: '#111', border: '1px solid #333', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 },
  planLabel:   { color: '#9ca3af', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' },
  select:      { background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#e5e7eb', padding: '8px 12px', fontSize: 13 },
  planSummary: { background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' },
  planName:    { color: '#e5e7eb', fontSize: 14, fontWeight: 700 },
  planType:    { color: '#9ca3af', fontSize: 12, background: '#1a1a1a', borderRadius: 10, padding: '2px 10px' },
  planStatus:  { fontSize: 12, fontWeight: 700 },
  planScore:   { color: '#d4a843', fontSize: 12, fontWeight: 600 },
  tabs:        { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tab:         { border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  content:     {},
  navRow:      { display: 'flex', gap: 12, flexWrap: 'wrap' },
  navBtn:      { background: '#d4a843', color: '#000', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  navBtnSec:   { background: '#1a1a1a', color: '#e5e7eb', border: '1px solid #333', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};
