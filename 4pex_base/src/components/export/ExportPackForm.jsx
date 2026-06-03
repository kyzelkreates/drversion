import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';
import { getAllBuilderTools } from '../../config/builderToolTemplates.js';

const TYPES = [
  { value: 'base_handoff',          label: 'Base Handoff' },
  { value: 'variant_handoff',       label: 'Variant Handoff' },
  { value: 'deployment_preparation', label: 'Deployment Preparation' },
  { value: 'builder_tool_pack',     label: 'Builder Tool Pack' },
];

export function ExportPackForm({ initial = {}, onSave, onCancel }) {
  const [name,   setName]   = useState(initial.name        || '');
  const [type,   setType]   = useState(initial.type        || 'base_handoff');
  const [tool,   setTool]   = useState(initial.builderTool || 'base44');
  const [error,  setError]  = useState('');

  const tools = getAllBuilderTools();
  const s     = { background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '7px 10px', width: '100%', fontSize: 13 };
  const l     = { fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' };

  function handleSave() {
    if (!name.trim()) { setError('Name is required.'); return; }
    setError('');
    onSave({ name: name.trim(), type, builderTool: tool });
  }

  return (
    <Card variant="default">
      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gold)', marginBottom: 14 }}>
        {initial.id ? 'Edit Export Pack' : 'New Export Pack'}
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={l}>Pack Name *</label>
        <input style={s} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 4P3X Base Handoff — June 2026" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={l}>Type</label>
        <select style={s} value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={l}>Target Builder Tool</label>
        <select style={s} value={tool} onChange={(e) => setTool(e.target.value)}>
          {tools.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>
      {error && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 10 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
        {onCancel && <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </Card>
  );
}
export default ExportPackForm;
