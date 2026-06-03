// 4P3X Blueprint Detail — RUN 2

import React, { useState, useEffect } from 'react';
import {
  getState, subscribe,
  saveBlueprint, validateBlueprintBeforeSave,
} from '../state/storage.js';
import { calculateBlueprintReadiness, detectBlueprintRisks } from '../state/blueprintValidators.js';
import BlueprintForm from '../components/blueprints/BlueprintForm.jsx';
import BlueprintPreview from '../components/blueprints/BlueprintPreview.jsx';
import BlueprintReadinessScore from '../components/blueprints/BlueprintReadinessScore.jsx';
import BlueprintModuleMapper from '../components/blueprints/BlueprintModuleMapper.jsx';
import BlueprintFlowList from '../components/blueprints/BlueprintFlowList.jsx';
import BlueprintDataModelList from '../components/blueprints/BlueprintDataModelList.jsx';
import RefactorPlannerPanel from '../components/blueprints/RefactorPlannerPanel.jsx';

export function BlueprintDetail({ onNavigate }) {
  const [appState, setAppState]   = useState(() => getState());
  const [draft, setDraft]         = useState(null);
  const [message, setMessage]     = useState(null);
  const [activeTab, setActiveTab] = useState('edit');

  useEffect(() => {
    const unsub = subscribe((s) => setAppState({ ...s }));
    return unsub;
  }, []);

  // Keep draft in sync with active blueprint from state
  useEffect(() => {
    const items  = appState.blueprints?.items || [];
    const active = appState.blueprints?.activeBlueprintId;
    const bp     = active ? items.find((b) => b.id === active) : items[0] || null;
    if (bp && (!draft || draft.id !== bp.id)) {
      setDraft({ ...bp });
    }
  }, [appState.blueprints?.activeBlueprintId, appState.blueprints?.items?.length]);

  function flash(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  function handleSave() {
    if (!draft) return;
    const result = saveBlueprint(draft);
    if (result.ok) {
      flash('success', 'Blueprint saved and validated.');
    } else {
      flash('error', 'Save failed: ' + result.error);
    }
  }

  function handleValidate() {
    if (!draft) return;
    const { valid, errors } = validateBlueprintBeforeSave(draft);
    const readiness = calculateBlueprintReadiness(draft);
    if (valid) {
      flash('success', `Validation passed. Readiness score: ${readiness.score}`);
    } else {
      flash('error', 'Validation errors: ' + errors.join('; '));
    }
  }

  if (!draft) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">Blueprint Detail</div>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>No blueprint selected</div>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/blueprints')}>
            Go to Blueprint Engine
          </button>
        </div>
      </div>
    );
  }

  const readiness = calculateBlueprintReadiness(draft);
  const risks     = detectBlueprintRisks(draft);

  const TABS = ['edit', 'preview', 'modules', 'flows', 'data', 'agents'];

  return (
    <div>
      <div className="page-header">
        <div className="row-between">
          <div>
            <div className="page-title">{draft.name || 'Untitled Blueprint'}</div>
            <div className="page-subtitle">{draft.productType} · {draft.stateMode} · {draft.safetyLevel}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-green btn-sm" onClick={handleValidate}>Validate</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/blueprints')}>← Back</button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 14 }}>
          {message.text}
        </div>
      )}

      {risks.length > 0 && (
        <div className="alert alert-warn" style={{ marginBottom: 14 }}>
          <strong>Risk Notices:</strong>
          {risks.map((r, i) => <div key={i} style={{ marginTop: 4 }}>{r}</div>)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
        {/* Main area */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 0 }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: activeTab === tab ? '2px solid var(--gold-bright)' : '2px solid transparent',
                  color: activeTab === tab ? 'var(--gold-bright)' : 'var(--text-secondary)',
                  padding: '8px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', textTransform: 'capitalize',
                  transition: 'all 0.15s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="card">
            {activeTab === 'edit'    && <BlueprintForm blueprint={draft} onChange={setDraft} />}
            {activeTab === 'preview' && <BlueprintPreview blueprint={draft} />}
            {activeTab === 'modules' && <BlueprintModuleMapper coreModules={draft.coreModules} optionalModules={draft.optionalModules} />}
            {activeTab === 'flows'   && (
              <div>
                <div className="section-header">Main User Flows</div>
                <BlueprintFlowList flows={draft.mainUserFlows} />
              </div>
            )}
            {activeTab === 'data' && (
              <div>
                <div className="section-header">Required Data Entities</div>
                <BlueprintDataModelList entities={draft.requiredDataEntities} />
              </div>
            )}
            {activeTab === 'agents' && <RefactorPlannerPanel />}
          </div>
        </div>

        {/* Readiness sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="card-title">Readiness Score</div>
            <BlueprintReadinessScore
              score={readiness.score}
              level={readiness.level}
              missing={readiness.missing}
              warnings={readiness.warnings}
            />
          </div>

          <div className="card">
            <div className="card-title">Future Runs</div>
            {(draft.futureRuns || []).filter(Boolean).length === 0
              ? <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No future runs defined.</div>
              : (draft.futureRuns || []).filter(Boolean).map((r, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'var(--purple-bright)', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    → {r}
                  </div>
                ))}
          </div>

          <div className="card">
            <div className="card-title">Locked Rules</div>
            {(draft.lockedRules || []).filter(Boolean).length === 0
              ? <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No locked rules.</div>
              : (draft.lockedRules || []).filter(Boolean).map((r, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#ff6677', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    ⚠ {r}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlueprintDetail;
