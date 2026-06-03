// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// VariantPromptPreview.jsx — Run 10
import { maskSecretsInText } from '../../utils/masterVariantExport.js';

export default function VariantPromptPreview({ prompt, onCopy, onExport }) {
  if (!prompt) {
    return (
      <div className="card">
        <div className="card-title">Generated Prompt Preview</div>
        <div style={{ color: '#64748b', fontSize: 13 }}>No prompt generated yet. Select a variant and pattern, then click Generate.</div>
      </div>
    );
  }

  const safeText = maskSecretsInText(prompt.promptText || '');

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="card-title" style={{ margin: 0 }}>Generated Prompt Preview</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={onCopy}>📋 Copy Prompt</button>
          <button className="btn btn-ghost btn-sm" onClick={onExport}>⬇ Export .txt</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, background: '#1e1b4b', color: '#a5b4fc', padding: '2px 8px', borderRadius: 4 }}>
          {prompt.variantType}
        </span>
        <span style={{ fontSize: 11, background: '#052e16', color: '#86efac', padding: '2px 8px', borderRadius: 4 }}>
          {prompt.patternId}
        </span>
        <span style={{ fontSize: 11, color: '#64748b' }}>
          {prompt.wordCount?.toLocaleString()} words · {prompt.characterCount?.toLocaleString()} chars
        </span>
        <span style={{ fontSize: 11, color: '#64748b' }}>
          Generated: {prompt.generatedAt ? new Date(prompt.generatedAt).toLocaleString() : '—'}
        </span>
      </div>

      <div style={{
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 8,
        padding: 16,
        fontFamily: 'monospace',
        fontSize: 11,
        color: '#94a3b8',
        maxHeight: 400,
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 1.6,
      }}>
        {safeText}
      </div>

      <div style={{ fontSize: 11, color: '#4ade80', marginTop: 10 }}>
        ✓ Copy-paste ready — use in Base44, Manus, Cursor, or Replit as the first message in a new isolated project.
      </div>
      <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>
        ⚠ This prompt never executes automatically. It is for manual use only.
      </div>
    </div>
  );
}
