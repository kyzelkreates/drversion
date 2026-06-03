import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ExportPackCard } from '../components/export/ExportPackCard.jsx';
import { ExportPackForm } from '../components/export/ExportPackForm.jsx';
import { getAllExportPackTemplates } from '../config/exportPackTemplates.js';
import {
  getState,
  createExportPackStorage,
  createExportPackFromTemplateStorage,
  deleteExportPackStorage,
  duplicateExportPackStorage,
  setActiveExportPackStorage,
  importExportPackStorage,
  calculateExportPackReadinessStorage,
} from '../state/storage.js';

export function ExportCentre({ navigate, onNavigate }) {
  navigate = navigate || onNavigate;
  
  const [state,       setLocalState]  = useState(() => getState());
  const [showForm,    setShowForm]    = useState(false);
  const [showImport,  setShowImport]  = useState(false);
  const [importText,  setImportText]  = useState('');
  const [importResult,setImportResult]= useState(null);
  const [confirmDel,  setConfirmDel]  = useState(null);
  const [message,     setMessage]     = useState('');

  function refresh() { setLocalState(getState()); }
  function flash(msg, ok = true) {
    setMessage({ text: msg, ok });
    setTimeout(() => setMessage(''), 3000);
  }

  const es        = state.exportSystem || {};
  const packs     = es.exportPacks || [];
  const activePId = es.activeExportPackId;
  const templates = getAllExportPackTemplates();

  function handleCreate(input) {
    const r = createExportPackStorage(input);
    if (r.ok) { calculateExportPackReadinessStorage(r.exportPack.id); refresh(); setShowForm(false); flash('Export pack created.'); }
    else flash(r.error, false);
  }

  function handleTemplate(tplId) {
    if (!tplId) return;
    const r = createExportPackFromTemplateStorage(tplId);
    if (r.ok) { calculateExportPackReadinessStorage(r.exportPack.id); refresh(); flash('Export pack created from template.'); }
    else flash(r.error, false);
  }

  function handleOpen(id) {
    setActiveExportPackStorage(id); refresh();
    if (navigate) navigate('/export-pack-detail');
  }

  function handleDelete(id) {
    if (confirmDel !== id) { setConfirmDel(id); return; }
    deleteExportPackStorage(id); refresh(); setConfirmDel(null); flash('Export pack deleted.');
  }

  function handleDuplicate(id) {
    const r = duplicateExportPackStorage(id);
    if (r.ok) { refresh(); flash('Export pack duplicated.'); }
    else flash(r.error, false);
  }

  function handleImport() {
    if (!importText.trim()) return;
    const r = importExportPackStorage(importText);
    setImportResult(r);
    if (r.ok) { refresh(); flash('Export pack imported.'); }
  }

  const inputStyle = { background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 12 };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Export Centre</h1>
          <p className="page-subtitle">
            Export packs prepare safe manual handoff only. They do not deploy, push code, execute prompts, or write product files.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Pack'}
        </button>
      </div>

      {message && (
        <div style={{ background: message.ok ? '#14532d' : '#1a0505', border: `1px solid ${message.ok ? '#166534' : '#7f1d1d'}`, borderRadius: 6, padding: '8px 14px', marginBottom: 12, color: message.ok ? '#22c55e' : '#ef4444', fontSize: 13 }}>
          {message.text}
        </div>
      )}

      {/* Template Selector */}
      <Card variant="default" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Quick-create from template:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {templates.map((t) => (
            <button key={t.id} className="btn btn-ghost btn-sm" onClick={() => handleTemplate(t.id)}>{t.label}</button>
          ))}
        </div>
      </Card>

      {showForm && (
        <div style={{ marginBottom: 16 }}>
          <ExportPackForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {packs.length === 0 ? (
        <EmptyState title="No export packs yet" description="Create an export pack from a template or custom input to begin preparing your handoff." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>
          {packs.map((ep) => (
            <div key={ep.id}>
              {confirmDel === ep.id && (
                <div style={{ background: '#1a0505', border: '1px solid #7f1d1d', borderRadius: 6, padding: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 6 }}>Delete "{ep.name}"?</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(ep.id)}>Confirm</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDel(null)}>Cancel</button>
                  </div>
                </div>
              )}
              <ExportPackCard
                exportPack={ep}
                isActive={ep.id === activePId}
                onOpen={handleOpen}
                onDuplicate={handleDuplicate}
                onDelete={() => setConfirmDel(confirmDel === ep.id ? null : ep.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Import */}
      <Card variant="default" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Import Export Pack</div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowImport(!showImport)}>{showImport ? 'Hide' : 'Show'}</button>
        </div>
        {showImport && (
          <div>
            <textarea
              style={{ ...inputStyle, width: '100%', minHeight: 80, resize: 'vertical' }}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste export pack JSON here..."
            />
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }} onClick={handleImport}>Import</button>
            {importResult && (
              <div style={{ fontSize: 12, marginTop: 6, color: importResult.ok ? '#22c55e' : '#ef4444' }}>
                {importResult.ok ? '✓ Imported successfully.' : `⛔ ${importResult.error}`}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Shortcuts */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/handoff-pack-builder')}>→ Handoff Pack Builder</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/deployment-readiness')}>→ Deployment Readiness</button>
      </div>
    </div>
  );
}
export default ExportCentre;
