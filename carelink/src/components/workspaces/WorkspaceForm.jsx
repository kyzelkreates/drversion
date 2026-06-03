import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';
import { getAllProductTypes } from '../../config/productRunSequences.js';

export function WorkspaceForm({ initial = {}, onSave, onCancel }) {
  const [name,        setName]        = useState(initial.name || '');
  const [productType, setProductType] = useState(initial.productType || '');
  const [description, setDescription] = useState(initial.description || '');
  const [status,      setStatus]      = useState(initial.status || 'planning');
  const [error,       setError]       = useState('');

  const productTypes = getAllProductTypes();
  const STATUSES = ['planning', 'ready_for_build_prompt', 'in_progress', 'blocked', 'paused', 'completed'];

  function handleSave() {
    if (!name.trim())     { setError('Workspace name is required.'); return; }
    if (!productType)     { setError('Product type is required.'); return; }
    setError('');
    onSave({ name: name.trim(), productType, description: description.trim(), status });
  }

  const inputStyle = {
    background: '#111', border: '1px solid #333', color: 'var(--text-primary)',
    borderRadius: 6, padding: '8px 12px', width: '100%', fontSize: 13,
  };
  const labelStyle = { fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block' };

  return (
    <Card variant="default">
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: 'var(--gold)' }}>
        {initial.id ? 'Edit Workspace' : 'New Workspace'}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Workspace Name *</label>
        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Learning Platform Build" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Product Type *</label>
        <select style={inputStyle} value={productType} onChange={(e) => setProductType(e.target.value)}>
          <option value="">Select product type...</option>
          {productTypes.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the purpose of this workspace..." />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Status</label>
        <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary" onClick={handleSave}>Save Workspace</button>
        {onCancel && <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </Card>
  );
}
export default WorkspaceForm;
