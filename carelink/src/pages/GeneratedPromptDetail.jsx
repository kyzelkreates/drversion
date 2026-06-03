import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { getState, copyPromptToClipboard, exportGeneratedPrompt, deleteGeneratedPrompt } from '../state/storage.js';

export function GeneratedPromptDetail({ navigate }) {
  const [state,       setLocalState] = useState(() => getState());
  const [copied,      setCopied]     = useState(false);
  const [confirmDel,  setConfirmDel] = useState(false);

  function refresh() { setLocalState(getState()); }

  const launcher = state.variantLauncher || {};
  const prompt   = (launcher.generatedPrompts || []).find((p) => p.id === launcher.activeGeneratedPromptId) || null;

  if (!prompt) return (
    <div className="page-container">
      <h1 className="page-title">Generated Prompt Detail</h1>
      <EmptyState title="No prompt selected" description="Go to Run Prompt Generator and open a prompt." action={{ label: '← Generator', onClick: () => navigate('/run-prompt-generator') }} />
    </div>
  );

  function handleCopy() {
    const r = copyPromptToClipboard(prompt.id);
    if (r.ok) {
      navigator.clipboard?.writeText(r.text).then(() => { setCopied(true); refresh(); setTimeout(() => setCopied(false), 2500); });
    }
  }

  function handleExport() {
    const r = exportGeneratedPrompt(prompt.id);
    if (r.ok) { const b = new Blob([r.json],{type:'application/json'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=`${prompt.title.replace(/\s+/g,'-')}.json`; a.click(); URL.revokeObjectURL(u); refresh(); }
  }

  const statusColors = { draft: '#9ca3af', validated: '#22c55e', ready_to_copy: '#22c55e', needs_review: '#ef4444' };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 6 }} onClick={() => navigate('/run-prompt-generator')}>← Generator</button>
          <h1 className="page-title">{prompt.title}</h1>
          <p className="page-subtitle">{prompt.productType} · {prompt.runNumber}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={handleCopy}>{copied ? '✓ Copied!' : '📋 Copy Prompt'}</button>
          <button className="btn btn-ghost" onClick={handleExport}>⬇ Export JSON</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>

        {/* Status / Safety / Completeness */}
        <Card variant="default">
          <div className="card-title">Prompt Status</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Status',       value: prompt.status,    color: statusColors[prompt.status] },
              { label: 'Safety',       value: prompt.safety?.passed ? '✓ Passed' : '⛔ Issues', color: prompt.safety?.passed ? '#22c55e' : '#ef4444' },
              { label: 'Completeness', value: `${prompt.completeness?.score || 0}/100`, color: 'var(--gold)' },
              { label: 'Copied',       value: prompt.audit?.copiedAt ? 'Yes' : 'Not yet', color: 'var(--text-muted)' },
            ].map((item) => (
              <div key={item.label} style={{ background: '#111', borderRadius: 6, padding: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Safety Findings */}
        {!prompt.safety?.passed && (
          <Card variant="default">
            <div className="card-title" style={{ color: '#ef4444' }}>Safety Issues</div>
            {[...(prompt.safety?.secretRisks || []), ...(prompt.safety?.destructiveRisks || []), ...(prompt.safety?.autonomyRisks || [])].map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: '#ef4444', padding: '3px 0' }}>⛔ {r}</div>
            ))}
          </Card>
        )}

        {/* Scope */}
        {prompt.scope && (
          <Card variant="default">
            <div className="card-title">Run Scope</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>ALLOWED FILES ({prompt.scope.allowedFiles?.length || 0})</div>
            <div style={{ maxHeight: 80, overflowY: 'auto', marginBottom: 8 }}>
              {(prompt.scope.allowedFiles || []).map((f, i) => <div key={i} style={{ fontSize: 11, color: '#22c55e' }}>{f}</div>)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>FORBIDDEN FILES ({prompt.scope.forbiddenFiles?.length || 0})</div>
            <div style={{ maxHeight: 60, overflowY: 'auto' }}>
              {(prompt.scope.forbiddenFiles || []).map((f, i) => <div key={i} style={{ fontSize: 11, color: '#ef4444' }}>{f}</div>)}
            </div>
          </Card>
        )}

        {/* Stop Conditions */}
        {prompt.controls?.stopConditions?.length > 0 && (
          <Card variant="default">
            <div className="card-title">Stop Conditions</div>
            {prompt.controls.stopConditions.map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '3px 0' }}>⛔ {s}</div>
            ))}
          </Card>
        )}

        {/* Rollback */}
        {prompt.controls?.rollbackGuidance?.length > 0 && (
          <Card variant="default">
            <div className="card-title">Rollback Guidance</div>
            {prompt.controls.rollbackGuidance.map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '3px 0' }}>{i + 1}. {r}</div>
            ))}
          </Card>
        )}
      </div>

      {/* Full Prompt Text */}
      <Card variant="default" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div className="card-title" style={{ margin: 0 }}>Full Prompt Text</div>
          <button className="btn btn-primary btn-sm" onClick={handleCopy}>{copied ? '✓ Copied' : '📋 Copy'}</button>
        </div>
        <pre style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 6, padding: 12, fontSize: 11, color: 'var(--text-primary)', overflow: 'auto', maxHeight: 400, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {prompt.promptText}
        </pre>
      </Card>

      {/* Delete */}
      {!confirmDel ? (
        <button className="btn btn-ghost" style={{ marginTop: 16, color: '#ef4444' }} onClick={() => setConfirmDel(true)}>Delete Prompt</button>
      ) : (
        <div style={{ background: '#1a0505', border: '1px solid #7f1d1d', borderRadius: 8, padding: 12, marginTop: 16 }}>
          <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 8 }}>Delete this prompt?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ background:'#ef4444',borderColor:'#ef4444' }} onClick={() => { deleteGeneratedPrompt(prompt.id); navigate('/run-prompt-generator'); }}>Delete</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDel(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default GeneratedPromptDetail;
