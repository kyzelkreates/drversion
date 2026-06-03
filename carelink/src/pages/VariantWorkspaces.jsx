import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { WorkspaceCard } from '../components/workspaces/WorkspaceCard.jsx';
import { WorkspaceForm } from '../components/workspaces/WorkspaceForm.jsx';
import { WorkspaceExportPanel } from '../components/workspaces/WorkspaceExportPanel.jsx';
import { getAllWorkspaceTemplates } from '../config/workspaceTemplates.js';
import {
  createWorkspaceStorage, createWorkspaceFromTemplateStorage,
  deleteWorkspaceStorage, archiveWorkspaceStorage, duplicateWorkspaceStorage,
  setActiveWorkspaceStorage, importWorkspaceStorage, getActiveWorkspace,
} from '../state/storage.js';
import { getState } from '../state/storage.js';

export function VariantWorkspaces({ navigate }) {
  const [state, setLocalState]  = useState(() => getState());
  const [showForm,  setShowForm]  = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmArchive, setConfirmArchive] = useState(null);
  const [message, setMessage] = useState('');

  function refresh() { setLocalState(getState()); }
  function flash(msg) { setMessage(msg); setTimeout(() => setMessage(''), 2500); }

  const workspaces = state.variantWorkspaces?.workspaces || [];
  const activeWS   = state.variantWorkspaces?.activeWorkspaceId;
  const templates  = getAllWorkspaceTemplates();

  function handleCreate(input) {
    const r = createWorkspaceStorage(input);
    if (r.ok) { refresh(); setShowForm(false); flash('Workspace created.'); }
    else flash(`Error: ${r.error}`);
  }

  function handleTemplate(tplId) {
    if (!tplId) return;
    const r = createWorkspaceFromTemplateStorage(tplId);
    if (r.ok) { refresh(); flash(`Workspace created from template.`); }
    else flash(`Error: ${r.error}`);
  }

  function handleDelete(id) {
    if (confirmDelete !== id) { setConfirmDelete(id); return; }
    deleteWorkspaceStorage(id); refresh(); setConfirmDelete(null); flash('Workspace deleted.');
  }

  function handleArchive(id) {
    if (confirmArchive !== id) { setConfirmArchive(id); return; }
    archiveWorkspaceStorage(id); refresh(); setConfirmArchive(null); flash('Workspace archived.');
  }

  function handleOpen(id) {
    setActiveWorkspaceStorage(id); refresh();
    if (navigate) navigate('/workspace-detail');
  }

  function handleDuplicate(id) {
    const r = duplicateWorkspaceStorage(id);
    if (r.ok) { refresh(); flash('Workspace duplicated.'); }
    else flash(`Error: ${r.error}`);
  }

  function handleImport(ws) {
    if (ws) { importWorkspaceStorage(JSON.stringify(ws)); refresh(); flash('Workspace imported.'); }
  }

  const inputStyle = { background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Variant Workspaces</h1>
          <p className="page-subtitle">Workspaces prepare and track future variant builds only. They do not execute builds or write files.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Workspace'}
        </button>
      </div>

      {message && <div style={{ background: '#14532d', border: '1px solid #166534', borderRadius: 6, padding: '8px 14px', marginBottom: 12, fontSize: 13, color: '#22c55e' }}>{message}</div>}

      {/* Template Selector */}
      <Card variant="default" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Create from template:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {templates.slice(0, 6).map((t) => (
            <button key={t.id} className="btn btn-ghost btn-sm" onClick={() => handleTemplate(t.id)}>{t.label}</button>
          ))}
          <select style={{ ...inputStyle, fontSize: 11 }} onChange={(e) => handleTemplate(e.target.value)} defaultValue="">
            <option value="">More templates...</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
      </Card>

      {showForm && (
        <div style={{ marginBottom: 16 }}>
          <WorkspaceForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {workspaces.length === 0 ? (
        <EmptyState title="No workspaces yet" description="Create a workspace to start staging your first product variant build." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
          {workspaces.filter((w) => w.status !== 'archived').map((ws) => (
            <div key={ws.id}>
              {confirmDelete === ws.id && (
                <div style={{ background: '#1a0505', border: '1px solid #7f1d1d', borderRadius: 6, padding: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 6 }}>Delete "{ws.name}"?</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(ws.id)}>Confirm Delete</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>Cancel</button>
                  </div>
                </div>
              )}
              {confirmArchive === ws.id && (
                <div style={{ background: '#1a1005', border: '1px solid #78350f', borderRadius: 6, padding: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 6 }}>Archive "{ws.name}"?</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleArchive(ws.id)}>Confirm Archive</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmArchive(null)}>Cancel</button>
                  </div>
                </div>
              )}
              <WorkspaceCard
                workspace={ws}
                isActive={ws.id === activeWS}
                onOpen={handleOpen}
                onDuplicate={handleDuplicate}
                onArchive={() => setConfirmArchive(ws.id)}
                onDelete={() => setConfirmDelete(ws.id)}
              />
            </div>
          ))}
        </div>
      )}

      {workspaces.filter((w) => w.status === 'archived').length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Archived ({workspaces.filter((w) => w.status === 'archived').length})</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {workspaces.filter((w) => w.status === 'archived').map((ws) => (
              <span key={ws.id} style={{ fontSize: 11, color: 'var(--text-muted)', background: '#111', borderRadius: 4, padding: '3px 8px' }}>{ws.name}</span>
            ))}
          </div>
        </div>
      )}

      {workspaces.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <WorkspaceExportPanel workspace={workspaces.find((w) => w.id === activeWS) || workspaces[0]} state={state} onImport={handleImport} />
        </div>
      )}
    </div>
  );
}
export default VariantWorkspaces;
