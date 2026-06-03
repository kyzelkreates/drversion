import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';

export function WorkspaceBlockersPanel({ workspace, onAddBlocker, onResolveBlocker }) {
  const [adding,      setAdding]      = useState(false);
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [severity,    setSeverity]    = useState('warning');

  const blockers = workspace?.blockers || [];
  const open     = blockers.filter((b) => b.status === 'open');
  const resolved = blockers.filter((b) => b.status === 'resolved');

  const sevColors = { critical: '#ef4444', warning: '#f59e0b', info: '#9ca3af' };

  function handleAdd() {
    if (!title.trim()) return;
    onAddBlocker({ title: title.trim(), description: description.trim(), severity });
    setTitle(''); setDescription(''); setSeverity('warning'); setAdding(false);
  }

  const inputStyle = { background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 12, width: '100%' };

  return (
    <Card variant={open.filter((b) => b.severity === 'critical').length > 0 ? 'red' : 'default'}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="card-title" style={{ margin: 0 }}>Blockers ({open.length} open)</div>
        <button className="btn btn-ghost btn-sm" onClick={() => setAdding(!adding)}>+ Add</button>
      </div>

      {adding && (
        <div style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 6, padding: 12, marginBottom: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blocker title *" />
          </div>
          <div style={{ marginBottom: 8 }}>
            <textarea style={{ ...inputStyle, minHeight: 52, resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" />
          </div>
          <div style={{ marginBottom: 8 }}>
            <select style={inputStyle} value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      {open.length === 0 && !adding && (
        <div style={{ fontSize: 12, color: '#22c55e', marginBottom: 8 }}>✓ No open blockers.</div>
      )}

      {open.map((b) => (
        <div key={b.id} style={{ background: '#111', border: `1px solid ${sevColors[b.severity]}44`, borderRadius: 6, padding: '8px 12px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: sevColors[b.severity] }}>{b.severity.toUpperCase()} — {b.title}</div>
            {b.description && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{b.description}</div>}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, marginLeft: 8 }} onClick={() => onResolveBlocker(b.id)}>Resolve</button>
        </div>
      ))}

      {resolved.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>RESOLVED ({resolved.length})</div>
          {resolved.map((b) => (
            <div key={b.id} style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 0', textDecoration: 'line-through' }}>✓ {b.title}</div>
          ))}
        </div>
      )}
    </Card>
  );
}
export default WorkspaceBlockersPanel;
