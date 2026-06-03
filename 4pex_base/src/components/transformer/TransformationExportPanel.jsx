// 4P3X — TransformationExportPanel — RUN 4
import React, { useState } from 'react';
import { exportTransformationPlan, importTransformationPlan } from '../../state/storage.js';

export default function TransformationExportPanel({ activePlanId, onImportSuccess }) {
  const [importText,   setImportText]   = useState('');
  const [importResult, setImportResult] = useState(null);
  const [exportResult, setExportResult] = useState(null);

  function handleExport() {
    if (!activePlanId) { setExportResult({ ok: false, error: 'No active plan selected.' }); return; }
    const res = exportTransformationPlan(activePlanId);
    setExportResult(res);
    if (res.ok) {
      const blob = new Blob([res.json], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), { href: url, download: `4p3x-plan-${activePlanId}.json` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  function handleImport() {
    if (!importText.trim()) { setImportResult({ ok: false, error: 'Paste a plan JSON first.' }); return; }
    const res = importTransformationPlan(importText.trim());
    setImportResult(res);
    if (res.ok) { setImportText(''); onImportSuccess?.(); }
  }

  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>📤 Export / Import Transformation Plan</h4>

      <div style={styles.section}>
        <strong style={styles.label}>Export Active Plan</strong>
        <p style={styles.note}>Exports a sanitized JSON file. Raw API keys and secrets are never included.</p>
        <button onClick={handleExport} disabled={!activePlanId} style={{ ...styles.btn, opacity: activePlanId ? 1 : 0.45 }}>
          ↓ Export Plan as JSON
        </button>
        {exportResult && !exportResult.ok && <div style={styles.error}>⛔ {exportResult.error}</div>}
        {exportResult?.ok && <div style={styles.success}>✅ Plan exported successfully.</div>}
      </div>

      <div style={styles.divider} />

      <div style={styles.section}>
        <strong style={styles.label}>Import Plan</strong>
        <p style={styles.note}>Paste an exported plan JSON. The plan will be validated and sanitized before saving.</p>
        <textarea
          value={importText}
          onChange={e => { setImportText(e.target.value); setImportResult(null); }}
          placeholder="Paste transformation plan JSON here…"
          rows={6}
          style={styles.textarea}
        />
        <button onClick={handleImport} disabled={!importText.trim()} style={{ ...styles.btn, background: '#1a3a1a', color: '#22c55e', border: '1px solid #166534', marginTop: 8, opacity: importText.trim() ? 1 : 0.45 }}>
          ↑ Validate & Import Plan
        </button>
        {importResult && !importResult.ok  && <div style={styles.error}>⛔ {importResult.error}</div>}
        {importResult?.ok                  && <div style={styles.success}>✅ Plan imported and saved successfully.</div>}
      </div>
    </div>
  );
}

const styles = {
  wrap:     { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:  { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 16px' },
  section:  { marginBottom: 4 },
  label:    { color: '#9ca3af', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 },
  note:     { color: '#6b7280', fontSize: 12, margin: '0 0 10px' },
  btn:      { background: '#d4a843', color: '#000', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  textarea: { width: '100%', boxSizing: 'border-box', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#e5e7eb', fontSize: 12, padding: 10, fontFamily: 'monospace', resize: 'vertical' },
  error:    { color: '#fca5a5', fontSize: 12, marginTop: 8 },
  success:  { color: '#86efac', fontSize: 12, marginTop: 8 },
  divider:  { borderTop: '1px solid #222', margin: '18px 0' },
};
