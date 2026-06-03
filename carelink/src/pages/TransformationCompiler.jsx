// 4P3X — Transformation Compiler Page — RUN 4
import React, { useState } from 'react';
import {
  getState, compileTransformationPlan, setCompilerBlueprintSelection,
} from '../state/storage.js';
import { canCompilePlan, getTransformationLocks } from '../logic/transformer/transformationLocks.js';
import { calculateBlueprintReadiness } from '../state/blueprintValidators.js';
import CompilerControlPanel     from '../components/transformer/CompilerControlPanel.jsx';
import TransformationRiskPanel  from '../components/transformer/TransformationRiskPanel.jsx';
import TransformationLockPanel  from '../components/transformer/TransformationLockPanel.jsx';
import SkeletonPlanCard         from '../components/transformer/SkeletonPlanCard.jsx';

export default function TransformationCompiler({ onNavigate }) {
  const [compiling,   setCompiling]   = useState(false);
  const [compileMsg,  setCompileMsg]  = useState(null);
  const [refresh,     setRefresh]     = useState(0);

  const state     = getState();
  const compiler  = state?.transformationCompiler || {};
  const bps       = state?.blueprints?.items || [];
  const activeBpId = compiler.selectedBlueprintId || state?.blueprints?.activeBlueprintId;
  const blueprint  = bps.find(b => b.id === activeBpId) || null;
  const readiness  = blueprint ? calculateBlueprintReadiness(blueprint) : { score: 0, level: 'not_ready' };
  const locks      = getTransformationLocks(state);
  const { ok: canCompile, reasons } = canCompilePlan(state);
  const plans      = compiler.plans || [];
  const activePlan = plans.find(p => p.id === compiler.activePlanId);
  const depStatus  = !!(state?.transformation?.dependencyMap && Object.keys(state.transformation.dependencyMap).length);

  function handleCompile() {
    setCompiling(true); setCompileMsg(null);
    setTimeout(() => {
      const result = compileTransformationPlan(activeBpId);
      setCompiling(false);
      setRefresh(r => r + 1);
      if (result.ok) {
        setCompileMsg({ type: 'success', text: `✅ Plan compiled: "${result.plan.blueprintName}" — Status: ${result.plan.status}` });
      } else {
        setCompileMsg({ type: 'error', text: `⛔ Compile failed: ${(result.errors || [result.error]).join('; ')}` });
      }
    }, 200);
  }

  function handleBpSelect(e) {
    setCompilerBlueprintSelection(e.target.value);
    setRefresh(r => r + 1);
    setCompileMsg(null);
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚙️ Variant Transformation Compiler</h1>
        <p style={styles.subtitle}>
          Compilation is <strong style={{ color: '#22c55e' }}>non-destructive</strong>. It creates a product skeleton plan only and does not write files.
        </p>
      </div>

      {/* Blueprint selector */}
      {bps.length > 0 && (
        <div style={styles.bpSelector}>
          <label style={styles.bpLabel}>Select Blueprint for Compilation</label>
          <select value={activeBpId || ''} onChange={handleBpSelect} style={styles.select}>
            <option value="">— Select blueprint —</option>
            {bps.map(b => <option key={b.id} value={b.id}>{b.name} ({b.productType || 'unknown type'})</option>)}
          </select>
        </div>
      )}

      {!blueprint && (
        <div style={styles.warning}>
          ⚠ No blueprint selected. Go to <button onClick={() => onNavigate?.('/blueprints')} style={styles.link}>Blueprint Engine</button> to create or select a blueprint.
        </div>
      )}

      <CompilerControlPanel
        blueprint={blueprint}
        readiness={readiness}
        depStatus={depStatus}
        locks={locks}
        compileMode={compiler.compileMode}
        onCompile={handleCompile}
        compiling={compiling}
        canCompile={canCompile}
        blockReasons={reasons}
      />

      {compileMsg && (
        <div style={{ ...styles.msg, background: compileMsg.type === 'success' ? '#0a1a0a' : '#1f0000', borderColor: compileMsg.type === 'success' ? '#166534' : '#7f1d1d', color: compileMsg.type === 'success' ? '#86efac' : '#fca5a5' }}>
          {compileMsg.text}
        </div>
      )}

      <TransformationLockPanel locks={locks} violations={[]} compileReasons={reasons} />

      {activePlan && (
        <TransformationRiskPanel risks={activePlan.risks || []} />
      )}

      {activePlan?.blockers?.length > 0 && (
        <div style={styles.blockerBox}>
          <strong style={{ color: '#ef4444' }}>⛔ Blockers ({activePlan.blockers.length})</strong>
          {activePlan.blockers.map((b, i) => <div key={i} style={styles.blockerItem}>{b}</div>)}
        </div>
      )}

      {activePlan?.warnings?.length > 0 && (
        <div style={styles.warnBox}>
          <strong style={{ color: '#f59e0b' }}>⚠ Warnings ({activePlan.warnings.length})</strong>
          {activePlan.warnings.map((w, i) => <div key={i} style={styles.warnItem}>{w}</div>)}
        </div>
      )}

      {plans.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Compiled Plans ({plans.length})</h3>
          <div style={styles.planGrid}>
            {plans.map(p => (
              <SkeletonPlanCard
                key={p.id}
                plan={p}
                active={p.id === compiler.activePlanId}
                onSelect={plan => { setCompilerBlueprintSelection(plan.blueprintId); setRefresh(r => r + 1); }}
                onDelete={id => {
                  if (window.confirm('Delete this transformation plan? This cannot be undone.')) {
                    const { deleteTransformationPlan } = require('../state/storage.js');
                    deleteTransformationPlan(id);
                    setRefresh(r => r + 1);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div style={styles.navRow}>
        {activePlan && (
          <>
            <button onClick={() => onNavigate?.('/product-skeleton-generator')} style={styles.navBtn}>
              View Product Skeleton →
            </button>
            <button onClick={() => onNavigate?.('/transformation-plan-detail')} style={styles.navBtnSec}>
              Plan Detail →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:        { padding: '24px', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 },
  header:      { marginBottom: 4 },
  title:       { color: '#d4a843', fontSize: 24, fontWeight: 700, margin: '0 0 8px' },
  subtitle:    { color: '#9ca3af', fontSize: 14, margin: 0 },
  bpSelector:  { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 },
  bpLabel:     { color: '#9ca3af', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' },
  select:      { background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#e5e7eb', padding: '8px 12px', fontSize: 13 },
  warning:     { background: '#1c1200', border: '1px solid #78350f', borderRadius: 8, padding: 14, color: '#fde68a', fontSize: 13 },
  link:        { background: 'none', border: 'none', color: '#d4a843', cursor: 'pointer', fontSize: 13, fontWeight: 700, textDecoration: 'underline' },
  msg:         { borderRadius: 8, padding: 14, border: '1px solid', fontSize: 13 },
  blockerBox:  { background: '#1f0000', border: '1px solid #7f1d1d', borderRadius: 8, padding: 16 },
  blockerItem: { color: '#fca5a5', fontSize: 12, marginTop: 6 },
  warnBox:     { background: '#1c1200', border: '1px solid #78350f', borderRadius: 8, padding: 16 },
  warnItem:    { color: '#fde68a', fontSize: 12, marginTop: 6 },
  section:     { marginTop: 4 },
  sectionTitle:{ color: '#9ca3af', fontSize: 14, fontWeight: 700, marginBottom: 12 },
  planGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
  navRow:      { display: 'flex', gap: 12, flexWrap: 'wrap' },
  navBtn:      { background: '#d4a843', color: '#000', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  navBtnSec:   { background: '#1a1a1a', color: '#e5e7eb', border: '1px solid #333', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};
