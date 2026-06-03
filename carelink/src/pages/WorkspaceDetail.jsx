import React, { useState } from 'react';
import { WorkspaceReadinessPanel } from '../components/workspaces/WorkspaceReadinessPanel.jsx';
import { WorkspaceProgressTracker } from '../components/workspaces/WorkspaceProgressTracker.jsx';
import { WorkspaceRunTracker } from '../components/workspaces/WorkspaceRunTracker.jsx';
import { WorkspaceLinkedAssets } from '../components/workspaces/WorkspaceLinkedAssets.jsx';
import { WorkspaceLocksPanel } from '../components/workspaces/WorkspaceLocksPanel.jsx';
import { WorkspaceBlockersPanel } from '../components/workspaces/WorkspaceBlockersPanel.jsx';
import { WorkspaceNotesPanel } from '../components/workspaces/WorkspaceNotesPanel.jsx';
import { WorkspaceIsolationPanel } from '../components/workspaces/WorkspaceIsolationPanel.jsx';
import { WorkspaceLaunchLinks } from '../components/workspaces/WorkspaceLaunchLinks.jsx';
import { WorkspaceExportPanel } from '../components/workspaces/WorkspaceExportPanel.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { WorkspaceStatusBadge } from '../components/workspaces/WorkspaceStatusBadge.jsx';
import {
  getState, updateWorkspaceStorage, archiveWorkspaceStorage, deleteWorkspaceStorage,
  setActiveWorkspaceStorage, linkBlueprintToWorkspaceStorage, linkTransformationPlanToWorkspaceStorage,
  linkPromptToWorkspaceStorage, unlinkPromptFromWorkspaceStorage,
  addWorkspaceNoteStorage, updateWorkspaceNoteStorage, deleteWorkspaceNoteStorage,
  addWorkspaceBlockerStorage, resolveWorkspaceBlockerStorage,
  updateWorkspaceBuildProgressStorage, calculateWorkspaceReadinessStorage,
  importWorkspaceStorage,
} from '../state/storage.js';

export function WorkspaceDetail({ navigate }) {
  const [state,         setLocalState] = useState(() => getState());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing,       setEditing]    = useState(false);
  const [editName,      setEditName]   = useState('');
  const [editDesc,      setEditDesc]   = useState('');
  const [editStatus,    setEditStatus] = useState('');
  const [message,       setMessage]    = useState('');

  function refresh() {
    setLocalState(getState());
    const ws = getActiveWS(getState());
    if (ws) { calculateWorkspaceReadinessStorage(ws.id); setLocalState(getState()); }
  }
  function flash(msg) { setMessage(msg); setTimeout(() => setMessage(''), 2500); }
  function getActiveWS(s) {
    const id = s.variantWorkspaces?.activeWorkspaceId;
    return (s.variantWorkspaces?.workspaces || []).find((w) => w.id === id) || null;
  }

  const workspace  = getActiveWS(state);
  const blueprints = state.blueprints?.blueprints || [];
  const plans      = state.transformationCompiler?.plans || [];
  const prompts    = state.variantLauncher?.generatedPrompts || [];

  if (!workspace) return (
    <div className="page-container">
      <h1 className="page-title">Workspace Detail</h1>
      <EmptyState title="No active workspace" description="Open Variant Workspaces and select a workspace to view." action={{ label: '← Workspaces', onClick: () => navigate('/variant-workspaces') }} />
    </div>
  );

  const STATUSES = ['planning', 'ready_for_build_prompt', 'in_progress', 'blocked', 'paused', 'completed'];
  const inputStyle = { background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13, width: '100%' };

  function startEdit() { setEditName(workspace.name); setEditDesc(workspace.description || ''); setEditStatus(workspace.status); setEditing(true); }
  function saveEdit() {
    updateWorkspaceStorage(workspace.id, { name: editName, description: editDesc, status: editStatus });
    refresh(); setEditing(false); flash('Workspace updated.');
  }

  function markRunInProgress(run) { updateWorkspaceBuildProgressStorage(workspace.id, { activeRun: run, currentRun: run }); refresh(); }
  function markRunComplete(run) {
    const bp = workspace.buildProgress || {};
    const completed = [...new Set([...(bp.completedRuns || []), run])];
    const pct = Math.round((completed.length / (bp.totalRuns || 3)) * 100);
    updateWorkspaceBuildProgressStorage(workspace.id, { completedRuns: completed, activeRun: null, progressPercent: pct });
    refresh(); flash(`${run} marked complete.`);
  }
  function markRunBlocked(run) {
    const bp = workspace.buildProgress || {};
    updateWorkspaceBuildProgressStorage(workspace.id, { blockedRuns: [...new Set([...(bp.blockedRuns || []), run])] });
    refresh();
  }
  function resetProgress() {
    updateWorkspaceBuildProgressStorage(workspace.id, { completedRuns: [], activeRun: null, blockedRuns: [], progressPercent: 0, currentRun: null });
    refresh(); flash('Progress reset.');
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/variant-workspaces')}>← Workspaces</button>
            <WorkspaceStatusBadge status={workspace.status} size="lg" />
          </div>
          <h1 className="page-title">{workspace.name}</h1>
          <p className="page-subtitle" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{workspace.productType}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={startEdit}>Edit</button>
          {workspace.status !== 'archived' && <button className="btn btn-ghost" onClick={() => { archiveWorkspaceStorage(workspace.id); refresh(); navigate('/variant-workspaces'); }}>Archive</button>}
        </div>
      </div>

      {message && <div style={{ background: '#14532d', border: '1px solid #166534', borderRadius: 6, padding: '8px 14px', marginBottom: 12, color: '#22c55e', fontSize: 13 }}>{message}</div>}

      {editing && (
        <div style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ marginBottom: 10 }}><input style={inputStyle} value={editName} onChange={(e) => setEditName(e.target.value)} /></div>
          <div style={{ marginBottom: 10 }}><textarea style={{ ...inputStyle, minHeight: 52 }} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} /></div>
          <div style={{ marginBottom: 10 }}>
            <select style={inputStyle} value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        <WorkspaceReadinessPanel readiness={workspace.readiness} />
        <WorkspaceProgressTracker buildProgress={workspace.buildProgress} />
        <WorkspaceRunTracker workspace={workspace} onMarkInProgress={markRunInProgress} onMarkComplete={markRunComplete} onMarkBlocked={markRunBlocked} onResetProgress={resetProgress} />
        <WorkspaceLinkedAssets workspace={workspace} blueprints={blueprints} plans={plans} prompts={prompts}
          onLinkBlueprint={(bpId) => { linkBlueprintToWorkspaceStorage(workspace.id, bpId); refresh(); }}
          onLinkPlan={(pId) => { linkTransformationPlanToWorkspaceStorage(workspace.id, pId); refresh(); }}
          onLinkPrompt={(pId) => { linkPromptToWorkspaceStorage(workspace.id, pId); refresh(); }}
          onUnlinkPrompt={(pId) => { unlinkPromptFromWorkspaceStorage(workspace.id, pId); refresh(); }}
          onNavigate={navigate}
        />
        <WorkspaceLocksPanel workspace={workspace} />
        <WorkspaceIsolationPanel workspace={workspace} />
        <WorkspaceBlockersPanel workspace={workspace}
          onAddBlocker={(b) => { addWorkspaceBlockerStorage(workspace.id, b); refresh(); }}
          onResolveBlocker={(id) => { resolveWorkspaceBlockerStorage(workspace.id, id); refresh(); }}
        />
        <WorkspaceNotesPanel workspace={workspace}
          onAddNote={(n) => { addWorkspaceNoteStorage(workspace.id, n); refresh(); }}
          onUpdateNote={(nId, u) => { updateWorkspaceNoteStorage(workspace.id, nId, u); refresh(); }}
          onDeleteNote={(nId) => { deleteWorkspaceNoteStorage(workspace.id, nId); refresh(); }}
        />
        <WorkspaceLaunchLinks workspace={workspace} onNavigate={navigate} />
        <WorkspaceExportPanel workspace={workspace} state={state} onImport={(ws) => { importWorkspaceStorage(JSON.stringify(ws)); refresh(); flash('Workspace imported.'); }} />
      </div>

      {/* Readiness for build */}
      <div style={{ marginTop: 16, background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 8, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginBottom: 6 }}>Ready for product-specific build?</div>
        {workspace.readiness?.level === 'ready' ? (
          <div style={{ fontSize: 13, color: '#22c55e' }}>✓ Workspace is ready. Proceed with the first run prompt manually.</div>
        ) : (
          <div>
            <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 4 }}>Not ready — {workspace.readiness?.level?.replace(/_/g, ' ')}.</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>→ {workspace.readiness?.nextAction}</div>
          </div>
        )}
      </div>

      {/* Delete */}
      {!confirmDelete ? (
        <button className="btn btn-ghost" style={{ marginTop: 20, color: '#ef4444' }} onClick={() => setConfirmDelete(true)}>Delete Workspace</button>
      ) : (
        <div style={{ background: '#1a0505', border: '1px solid #7f1d1d', borderRadius: 8, padding: 12, marginTop: 20 }}>
          <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 8 }}>Permanently delete this workspace?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={() => { deleteWorkspaceStorage(workspace.id); navigate('/variant-workspaces'); }}>Delete</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default WorkspaceDetail;
