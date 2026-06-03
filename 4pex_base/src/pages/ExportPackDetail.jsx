import React, { useState } from 'react';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ExportPackDetailViewer } from '../components/export/ExportPackDetailViewer.jsx';
import { ExportPackLinkedAssets } from '../components/export/ExportPackLinkedAssets.jsx';
import {
  getState,
  runSanitisationStorage,
  calculateExportPackReadinessStorage,
  deleteExportPackStorage,
  setActiveExportPackStorage,
  linkWorkspaceToExportPackStorage,
  linkBlueprintToExportPackStorage,
  linkTransformationPlanToExportPackStorage,
  linkPromptToExportPackStorage,
  unlinkPromptFromExportPackStorage,
} from '../state/storage.js';

export function ExportPackDetail({ navigate, onNavigate }) {
  navigate = navigate || onNavigate;
  
  const [state,      setLocalState] = useState(() => getState());
  const [confirmDel, setConfirmDel] = useState(false);
  const [message,    setMessage]    = useState('');

  function refresh() { setLocalState(getState()); }
  function flash(msg) { setMessage(msg); setTimeout(() => setMessage(''), 3000); }

  const es   = state.exportSystem || {};
  const packs = es.exportPacks || [];
  const ep    = packs.find((p) => p.id === es.activeExportPackId) || null;

  if (!ep) return (
    <div className="page-container">
      <h1 className="page-title">Export Pack Detail</h1>
      <EmptyState
        title="No export pack selected"
        description="Open the Export Centre and select an export pack."
        action={{ label: '← Export Centre', onClick: () => navigate('/export-centre') }}
      />
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 6 }} onClick={() => navigate('/export-centre')}>← Export Centre</button>
          <h1 className="page-title">{ep.name}</h1>
          <p className="page-subtitle">{ep.type} · {ep.builderTool}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { navigate('/handoff-pack-builder'); }}>Handoff Builder →</button>
        </div>
      </div>

      {message && (
        <div style={{ background: '#14532d', border: '1px solid #166534', borderRadius: 6, padding: '8px 14px', marginBottom: 12, color: '#22c55e', fontSize: 13 }}>
          {message}
        </div>
      )}

      {/* Pack Selector */}
      {packs.length > 1 && (
        <div style={{ marginBottom: 16 }}>
          <select
            style={{ background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 }}
            value={es.activeExportPackId || ''}
            onChange={(e) => { setActiveExportPackStorage(e.target.value); refresh(); }}
          >
            {packs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <ExportPackDetailViewer
          exportPack={ep}
          state={state}
          onRunScan={() => { runSanitisationStorage(ep.id); calculateExportPackReadinessStorage(ep.id); refresh(); flash('Sanitisation scan complete.'); }}
          onRecalculate={() => { calculateExportPackReadinessStorage(ep.id); refresh(); flash('Readiness recalculated.'); }}
        />
        <div>
          <ExportPackLinkedAssets
            exportPack={ep}
            state={state}
            onLinkWorkspace={(id) => { linkWorkspaceToExportPackStorage(ep.id, id); calculateExportPackReadinessStorage(ep.id); refresh(); }}
            onLinkBlueprint={(id) => { linkBlueprintToExportPackStorage(ep.id, id); calculateExportPackReadinessStorage(ep.id); refresh(); }}
            onLinkPlan={(id) => { linkTransformationPlanToExportPackStorage(ep.id, id); calculateExportPackReadinessStorage(ep.id); refresh(); }}
            onLinkPrompt={(id) => { linkPromptToExportPackStorage(ep.id, id); calculateExportPackReadinessStorage(ep.id); refresh(); }}
            onUnlinkPrompt={(id) => { unlinkPromptFromExportPackStorage(ep.id, id); calculateExportPackReadinessStorage(ep.id); refresh(); }}
          />
        </div>
      </div>

      {/* Delete */}
      {!confirmDel ? (
        <button className="btn btn-ghost" style={{ marginTop: 20, color: '#ef4444' }} onClick={() => setConfirmDel(true)}>Delete Export Pack</button>
      ) : (
        <div style={{ background: '#1a0505', border: '1px solid #7f1d1d', borderRadius: 8, padding: 12, marginTop: 20 }}>
          <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 8 }}>Permanently delete "{ep.name}"?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={() => { deleteExportPackStorage(ep.id); navigate('/export-centre'); }}>Delete</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDel(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ExportPackDetail;
