import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';
import { exportWorkspaceToJson, importWorkspaceFromJson } from '../../utils/workspaceExport.js';

export function WorkspaceExportPanel({ workspace, state, onImport }) {
  const [importText,    setImportText]    = useState('');
  const [importResult,  setImportResult]  = useState(null);
  const [copyConfirmed, setCopyConfirmed] = useState(false);

  function handleExport() {
    const json = exportWorkspaceToJson(workspace, state);
    if (!json) return;
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `workspace-${workspace.name.replace(/\s+/g,'-')}.json`;
    a.click(); URL.revokeObjectURL(url);
  }

  function handleCopy() {
    const json = exportWorkspaceToJson(workspace, state);
    if (!json) return;
    navigator.clipboard?.writeText(json).then(() => {
      setCopyConfirmed(true); setTimeout(() => setCopyConfirmed(false), 2000);
    });
  }

  function handleImport() {
    if (!importText.trim()) return;
    const result = importWorkspaceFromJson(importText);
    setImportResult(result);
    if (result.valid && onImport) onImport(result.workspace);
  }

  return (
    <Card variant="default">
      <div className="card-title">Export / Import Workspace</div>
      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 12 }}>
        Exports are sanitised. Raw API keys and backend secrets are never included.
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={handleExport}>⬇ Export JSON</button>
        <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
          {copyConfirmed ? '✓ Copied' : '📋 Copy JSON'}
        </button>
      </div>

      <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Import workspace JSON:</div>
        <textarea
          style={{ background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '8px', width: '100%', minHeight: 80, fontSize: 11, resize: 'vertical' }}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder='Paste workspace JSON here...'
        />
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }} onClick={handleImport}>Import</button>
        {importResult && (
          <div style={{ marginTop: 8, fontSize: 12, color: importResult.valid ? '#22c55e' : '#ef4444' }}>
            {importResult.valid ? '✓ Import valid — workspace saved.' : `⛔ ${importResult.error}`}
          </div>
        )}
      </div>
    </Card>
  );
}
export default WorkspaceExportPanel;
