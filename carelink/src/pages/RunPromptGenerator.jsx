import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { getState, generatePromptForRunStorage, generateAllPromptsForPlanStorage, deleteGeneratedPrompt, setActiveGeneratedPrompt, copyPromptToClipboard, exportGeneratedPrompt, importGeneratedPrompt, linkPromptToWorkspaceStorage, checkVariantLaunchReadiness } from '../state/storage.js';
import { getRunSequenceForProduct } from '../config/productRunSequences.js';

export function RunPromptGenerator({ navigate }) {
  const [state,       setLocalState] = useState(() => getState());
  const [message,     setMessage]    = useState('');
  const [selectedRun, setSelectedRun] = useState('');
  const [importText,  setImportText]  = useState('');
  const [importResult, setImportResult] = useState(null);
  const [linkWsId,    setLinkWsId]   = useState('');

  function refresh() { setLocalState(getState()); }
  function flash(msg) { setMessage(msg); setTimeout(() => setMessage(''), 2500); }

  const launcher     = state.variantLauncher || {};
  const plans        = state.transformationCompiler?.plans || [];
  const activePlanId = state.transformationCompiler?.activePlanId;
  const activePlan   = plans.find((p) => p.id === activePlanId) || plans[0] || null;
  const prompts      = launcher.generatedPrompts || [];
  const workspaces   = (state.variantWorkspaces?.workspaces || []).filter((w) => w.status !== 'archived');

  const runSeq = activePlan ? getRunSequenceForProduct(activePlan.productType) : null;
  const runs   = runSeq?.runs || [];

  function handleGenerate() {
    if (!activePlan || !selectedRun) { flash('Select a transformation plan and a run first.'); return; }
    const r = generatePromptForRunStorage(activePlan.id, selectedRun);
    if (r.ok) {
      if (linkWsId) { linkPromptToWorkspaceStorage(linkWsId, r.prompt.id); }
      checkVariantLaunchReadiness();
      refresh(); flash(`Prompt generated: ${r.prompt.title}`);
    } else {
      flash(`Error: ${r.error}`);
    }
  }

  function handleGenerateAll() {
    if (!activePlan) { flash('No active transformation plan.'); return; }
    const r = generateAllPromptsForPlanStorage(activePlan.id);
    checkVariantLaunchReadiness();
    refresh(); flash(`Generated ${r.saved.length} prompt(s). ${r.errors.length} error(s).`);
  }

  function handleCopy(id) {
    const r = copyPromptToClipboard(id);
    if (r.ok) { navigator.clipboard?.writeText(r.text); refresh(); flash('Prompt copied to clipboard.'); }
  }

  function handleExport(id) {
    const r = exportGeneratedPrompt(id);
    if (r.ok) { const b = new Blob([r.json], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href=u; a.download='prompt.json'; a.click(); URL.revokeObjectURL(u); }
  }

  function handleImport() {
    if (!importText.trim()) return;
    const r = importGeneratedPrompt(importText);
    setImportResult(r);
    if (r.ok) { checkVariantLaunchReadiness(); refresh(); flash(`Imported ${r.saved.length} prompt(s).`); }
  }

  const inputStyle = { background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 12, width: '100%' };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Run Prompt Generator</h1>
          <p className="page-subtitle">Generates isolated, copy-paste-ready run prompts. No builds are executed automatically.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/variant-build-launcher')}>← Launcher</button>
      </div>

      {message && <div style={{ background: '#14532d', border: '1px solid #166534', borderRadius: 6, padding: '8px 14px', marginBottom: 12, color: '#22c55e', fontSize: 13 }}>{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        <Card variant="default">
          <div className="card-title">Generate Prompt</div>
          {!activePlan ? (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Compile a transformation plan first.</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/transformation-compiler')}>Open Compiler →</button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Plan: <span style={{ color: 'var(--gold)' }}>{activePlan.name || activePlan.title || 'Active Plan'}</span></div>
              <div style={{ marginBottom: 10 }}>
                <select style={inputStyle} value={selectedRun} onChange={(e) => setSelectedRun(e.target.value)}>
                  <option value="">Select run...</option>
                  {runs.map((r) => <option key={r.runNumber} value={r.runNumber}>{r.runNumber}: {r.title}</option>)}
                </select>
              </div>
              {workspaces.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <select style={inputStyle} value={linkWsId} onChange={(e) => setLinkWsId(e.target.value)}>
                    <option value="">Link to workspace (optional)...</option>
                    {workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                  {linkWsId && <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 3 }}>Isolation boundary: prompt stored by ID reference only.</div>}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={handleGenerate}>Generate</button>
                <button className="btn btn-ghost btn-sm" onClick={handleGenerateAll}>Generate All</button>
              </div>
            </div>
          )}
        </Card>

        <Card variant="default">
          <div className="card-title">Import Prompt</div>
          <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Paste prompt JSON..." />
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }} onClick={handleImport}>Import</button>
          {importResult && <div style={{ fontSize: 11, marginTop: 6, color: importResult.ok ? '#22c55e' : '#ef4444' }}>{importResult.ok ? `✓ ${importResult.saved.length} imported.` : `⛔ ${importResult.errors?.[0]}`}</div>}
        </Card>
      </div>

      {prompts.length === 0 ? (
        <EmptyState title="No prompts generated" description="Select a transformation plan and run, then click Generate." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {prompts.map((p) => (
            <Card key={p.id} variant="default">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{p.title}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.productType}</span>
                    <span style={{ fontSize: 11, color: p.safety?.passed ? '#22c55e' : '#ef4444' }}>{p.safety?.passed ? '✓ Safe' : '⛔ Safety Issues'}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Completeness: {p.completeness?.score || 0}/100</span>
                    <span style={{ fontSize: 11, color: { draft: '#9ca3af', validated: '#22c55e', ready_to_copy: '#22c55e', needs_review: '#ef4444' }[p.status] || '#9ca3af' }}>{p.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { setActiveGeneratedPrompt(p.id); refresh(); navigate('/generated-prompt-detail'); }}>View →</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleCopy(p.id)}>Copy</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleExport(p.id)}>Export</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => { deleteGeneratedPrompt(p.id); refresh(); }}>Del</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default RunPromptGenerator;
