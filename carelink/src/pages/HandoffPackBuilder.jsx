import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { BuilderToolSelector } from '../components/export/BuilderToolSelector.jsx';
import { HandoffInstructionPanel } from '../components/export/HandoffInstructionPanel.jsx';
import { ExportPackLinkedAssets } from '../components/export/ExportPackLinkedAssets.jsx';
import { DashboardPwaStructurePanel } from '../components/export/DashboardPwaStructurePanel.jsx';
import { NoSecretsGuardPanel } from '../components/export/NoSecretsGuardPanel.jsx';
import {
  getState,
  getActiveExportPack,
  setActiveExportPackStorage,
  generateHandoffInstructionsStorage,
  generateEnvExampleForExportStorage,
  runSanitisationStorage,
  calculateExportPackReadinessStorage,
  linkWorkspaceToExportPackStorage,
  linkBlueprintToExportPackStorage,
  linkTransformationPlanToExportPackStorage,
  linkPromptToExportPackStorage,
  unlinkPromptFromExportPackStorage,
  updateExportPackStorage,
} from '../state/storage.js';
import { exportPackToText, copyExportPackText } from '../utils/exportPackExport.js';

export function HandoffPackBuilder({ navigate, onNavigate }) {
  navigate = navigate || onNavigate;
  
  const [state,   setLocalState] = useState(() => getState());
  const [tool,    setTool]       = useState('base44');
  const [copied,  setCopied]     = useState(false);
  const [message, setMessage]    = useState('');

  function refresh() { setLocalState(getState()); }
  function flash(msg) { setMessage(msg); setTimeout(() => setMessage(''), 3000); }

  const es      = state.exportSystem || {};
  const packs   = es.exportPacks || [];
  const activeEP = packs.find((ep) => ep.id === es.activeExportPackId) || null;

  function handleGenerate() {
    if (!activeEP) return;
    generateHandoffInstructionsStorage(activeEP.id, tool);
    generateEnvExampleForExportStorage(activeEP.id);
    runSanitisationStorage(activeEP.id);
    calculateExportPackReadinessStorage(activeEP.id);
    refresh();
    flash('Handoff instructions generated and sanitisation run.');
  }

  function handleCopy() {
    if (!activeEP?.handoffInstructions) return;
    const text = exportPackToText(activeEP, state);
    copyExportPackText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Handoff Pack Builder</h1>
          <p className="page-subtitle">
            Builds structured handoff instructions for Base44, Manus, Replit, Cursor, GitHub, and Vercel. Manual copy-paste only — no builds execute automatically.
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/export-centre')}>← Export Centre</button>
      </div>

      {message && (
        <div style={{ background: '#14532d', border: '1px solid #166534', borderRadius: 6, padding: '8px 14px', marginBottom: 12, color: '#22c55e', fontSize: 13 }}>
          {message}
        </div>
      )}

      {/* Pack Selector */}
      {packs.length > 0 && (
        <Card variant="default" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Active export pack:</div>
          <select
            style={{ background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13, width: '100%' }}
            value={es.activeExportPackId || ''}
            onChange={(e) => { setActiveExportPackStorage(e.target.value); refresh(); }}
          >
            <option value="">Select export pack...</option>
            {packs.map((ep) => <option key={ep.id} value={ep.id}>{ep.name}</option>)}
          </select>
        </Card>
      )}

      {!activeEP ? (
        <EmptyState
          title="No export pack selected"
          description="Create an export pack in the Export Centre first."
          action={{ label: '← Export Centre', onClick: () => navigate('/export-centre') }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>

          {/* Builder Tool + Generate */}
          <Card variant="default">
            <div className="card-title">Builder Tool</div>
            <BuilderToolSelector selected={tool} onChange={setTool} />
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={handleGenerate}>Generate Instructions</button>
              {activeEP.handoffInstructions && (
                <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                  {copied ? '✓ Copied' : '📋 Copy All'}
                </button>
              )}
            </div>
            {activeEP.handoffInstructions && (
              <div style={{ fontSize: 11, color: '#22c55e', marginTop: 8 }}>
                ✓ Instructions generated for {activeEP.builderTool} · {new Date(activeEP.audit?.updatedAt).toLocaleString()}
              </div>
            )}
          </Card>

          {/* Linked Assets */}
          <ExportPackLinkedAssets
            exportPack={activeEP}
            state={state}
            onLinkWorkspace={(id) => { linkWorkspaceToExportPackStorage(activeEP.id, id); refresh(); }}
            onLinkBlueprint={(id) => { linkBlueprintToExportPackStorage(activeEP.id, id); refresh(); }}
            onLinkPlan={(id) => { linkTransformationPlanToExportPackStorage(activeEP.id, id); refresh(); }}
            onLinkPrompt={(id) => { linkPromptToExportPackStorage(activeEP.id, id); refresh(); }}
            onUnlinkPrompt={(id) => { unlinkPromptFromExportPackStorage(activeEP.id, id); refresh(); }}
          />

          {/* Dashboard + PWA Structure */}
          <DashboardPwaStructurePanel
            structure={activeEP.dashboardPwaStructure}
            onUpdate={(s) => { updateExportPackStorage(activeEP.id, { dashboardPwaStructure: s }); refresh(); }}
          />

          {/* No-Secrets Guard */}
          <NoSecretsGuardPanel
            sanitisation={activeEP.sanitisation}
            onRunScan={() => { runSanitisationStorage(activeEP.id); refresh(); flash('Sanitisation scan complete.'); }}
          />
        </div>
      )}

      {/* Handoff Instructions */}
      {activeEP?.handoffInstructions && (
        <div style={{ marginTop: 16 }}>
          <HandoffInstructionPanel instructions={activeEP.handoffInstructions} onCopy={handleCopy} />
        </div>
      )}
    </div>
  );
}
export default HandoffPackBuilder;
