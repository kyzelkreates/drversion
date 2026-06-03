// 4P3X BlueprintForm — RUN 2
// Controlled form for editing all blueprint fields.
// Does NOT directly write to storage. Parent must call saveBlueprint().

import React from 'react';
import moduleRegistry from '../../config/moduleRegistry.js';

const STATE_MODES   = ['local-first', 'supabase', 'hybrid'];
const SAFETY_LEVELS = ['standard', 'sensitive', 'safety-critical', 'compliance-critical'];
const UI_PROFILES   = ['sidebar-shell', 'kanban-shell', 'map-shell', 'data-grid-shell', 'portal-shell', 'analysis-shell', 'showcase-shell'];

function TagInput({ label, values = [], onChange, placeholder }) {
  const [input, setInput] = React.useState('');

  function handleKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      onChange([...values.filter(Boolean), input.trim()]);
      setInput('');
    }
  }

  function remove(index) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
        {values.filter(Boolean).map((v, i) => (
          <span key={i} style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border-card)',
            borderRadius: 4, padding: '2px 8px', fontSize: 11, color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {v}
            <button
              onClick={() => remove(i)}
              style={{ background: 'none', border: 'none', color: '#ff4455', cursor: 'pointer', padding: 0, lineHeight: 1 }}
            >×</button>
          </span>
        ))}
      </div>
      <input
        className="form-input"
        type="text"
        value={input}
        placeholder={placeholder || 'Type and press Enter…'}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="form-hint">Press Enter or comma to add.</div>
    </div>
  );
}

export function BlueprintForm({ blueprint, onChange }) {
  if (!blueprint) return null;

  const set = (field, value) => onChange({ ...blueprint, [field]: value });
  const setIdentity = (field, value) => onChange({
    ...blueprint,
    identity: { ...(blueprint.identity || {}), [field]: value },
  });

  const allModuleIds = moduleRegistry.map((m) => m.id);

  return (
    <div>
      {/* Identity */}
      <div className="section-header">Product Identity</div>

      <div className="form-group">
        <label className="form-label">Blueprint Name *</label>
        <input className="form-input" type="text" value={blueprint.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="e.g. My Learning Platform" />
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea className="form-textarea" rows={3} value={blueprint.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Describe this product blueprint…" style={{ minHeight: 70 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="form-group">
          <label className="form-label">App Name</label>
          <input className="form-input" type="text" value={blueprint.identity?.appName || ''} onChange={(e) => setIdentity('appName', e.target.value)} placeholder="App display name" />
        </div>
        <div className="form-group">
          <label className="form-label">Tagline</label>
          <input className="form-input" type="text" value={blueprint.identity?.tagline || ''} onChange={(e) => setIdentity('tagline', e.target.value)} placeholder="Short tagline…" />
        </div>
      </div>

      {/* Config */}
      <div className="section-header" style={{ marginTop: 8 }}>Configuration</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div className="form-group">
          <label className="form-label">State Mode</label>
          <select className="form-input" value={blueprint.stateMode || 'local-first'} onChange={(e) => set('stateMode', e.target.value)}>
            {STATE_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Safety Level</label>
          <select className="form-input" value={blueprint.safetyLevel || 'standard'} onChange={(e) => set('safetyLevel', e.target.value)}>
            {SAFETY_LEVELS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">UI Layout Profile</label>
          <select className="form-input" value={blueprint.uiLayoutProfile || 'sidebar-shell'} onChange={(e) => set('uiLayoutProfile', e.target.value)}>
            {UI_PROFILES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={blueprint.pwaRequired || false} onChange={(e) => set('pwaRequired', e.target.checked)} />
          <span>PWA Required</span>
        </label>
      </div>

      {/* Arrays */}
      <div className="section-header" style={{ marginTop: 8 }}>People &amp; Flows</div>

      <TagInput label="Target Users *" values={blueprint.targetUsers || []} onChange={(v) => set('targetUsers', v)} placeholder="e.g. Students, Admins…" />
      <TagInput label="Main User Flows *" values={blueprint.mainUserFlows || []} onChange={(v) => set('mainUserFlows', v)} placeholder="e.g. User logs in and views dashboard…" />

      <div className="section-header" style={{ marginTop: 8 }}>Modules &amp; Data</div>

      <TagInput label="Core Modules *" values={blueprint.coreModules || []} onChange={(v) => set('coreModules', v)} placeholder="e.g. dashboard, learning, admin…" />
      <TagInput label="Optional Modules" values={blueprint.optionalModules || []} onChange={(v) => set('optionalModules', v)} placeholder="e.g. reports, aiAgents…" />
      <TagInput label="Required Data Entities *" values={blueprint.requiredDataEntities || []} onChange={(v) => set('requiredDataEntities', v)} placeholder="e.g. Course, Student, Enrollment…" />

      <div className="section-header" style={{ marginTop: 8 }}>AI &amp; Integrations</div>

      <TagInput label="AI Agent Needs" values={blueprint.aiAgentNeeds || []} onChange={(v) => set('aiAgentNeeds', v)} placeholder="e.g. validationAgent, uxLogicAgent…" />
      <TagInput label="API Integration Needs" values={blueprint.apiIntegrationNeeds || []} onChange={(v) => set('apiIntegrationNeeds', v)} placeholder="e.g. email-notifications, maps-api…" />

      <div className="section-header" style={{ marginTop: 8 }}>Rules &amp; Future Runs</div>

      <TagInput label="Locked Rules" values={blueprint.lockedRules || []} onChange={(v) => set('lockedRules', v)} placeholder="e.g. No LMS logic in admin module…" />
      <TagInput label="Future Run Recommendations" values={blueprint.futureRuns || []} onChange={(v) => set('futureRuns', v)} placeholder="e.g. Run 3: AI Agent Panels…" />
    </div>
  );
}

export default BlueprintForm;
