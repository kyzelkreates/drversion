import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';

const CATEGORIES = ['general', 'architecture', 'build', 'risk', 'validation', 'deployment'];
const catColors  = { architecture: '#8b5cf6', build: '#22c55e', risk: '#ef4444', validation: '#f59e0b', deployment: '#3b82f6', general: '#9ca3af' };

export function WorkspaceNotesPanel({ workspace, onAddNote, onUpdateNote, onDeleteNote }) {
  const [adding,   setAdding]   = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [title,    setTitle]    = useState('');
  const [body,     setBody]     = useState('');
  const [category, setCategory] = useState('general');
  const notes = workspace?.notes || [];

  const inputStyle = { background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 12, width: '100%' };

  function handleAdd() {
    if (!title.trim()) return;
    onAddNote({ title: title.trim(), body: body.trim(), category });
    setTitle(''); setBody(''); setCategory('general'); setAdding(false);
  }

  function handleEdit(note) {
    setEditing(note.id); setTitle(note.title); setBody(note.body || ''); setCategory(note.category || 'general');
  }

  function handleSaveEdit() {
    if (!title.trim()) return;
    onUpdateNote(editing, { title: title.trim(), body: body.trim(), category });
    setEditing(null); setTitle(''); setBody(''); setCategory('general');
  }

  return (
    <Card variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="card-title" style={{ margin: 0 }}>Notes ({notes.length})</div>
        <button className="btn btn-ghost btn-sm" onClick={() => { setAdding(!adding); setEditing(null); }}>+ Add</button>
      </div>

      {(adding || editing) && (
        <div style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 6, padding: 12, marginBottom: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title *" />
          </div>
          <div style={{ marginBottom: 8 }}>
            <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Note body..." />
          </div>
          <div style={{ marginBottom: 8 }}>
            <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={editing ? handleSaveEdit : handleAdd}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setAdding(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {notes.length === 0 && !adding && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No notes yet. Add notes to track architecture decisions and build progress.</div>
      )}

      {notes.map((note) => (
        <div key={note.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 6, padding: '8px 12px', marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{note.title}</span>
              <span style={{ fontSize: 10, color: catColors[note.category] || '#9ca3af', marginLeft: 8 }}>{note.category}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => handleEdit(note)}>Edit</button>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, color: '#ef4444' }} onClick={() => onDeleteNote(note.id)}>Delete</button>
            </div>
          </div>
          {note.body && <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{note.body}</div>}
        </div>
      ))}
    </Card>
  );
}
export default WorkspaceNotesPanel;
