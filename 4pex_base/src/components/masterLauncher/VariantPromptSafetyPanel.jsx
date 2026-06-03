// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// VariantPromptSafetyPanel.jsx — Run 10
import { scanVariantPromptSafety } from '../../logic/masterLauncher/variantPromptSafetyScanner.js';

const SEVERITY_COLOURS = { critical: '#ef4444', warning: '#f59e0b', info: '#6366f1' };

export default function VariantPromptSafetyPanel({ prompt }) {
  if (!prompt?.promptText) {
    return (
      <div className="card">
        <div className="card-title">Safety Scan</div>
        <div style={{ color: '#64748b', fontSize: 13 }}>Generate a prompt to run the safety scan.</div>
      </div>
    );
  }

  const result = scanVariantPromptSafety(prompt.promptText);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="card-title" style={{ margin: 0 }}>Safety Scan</div>
        <span style={{
          fontSize: 12,
          padding: '4px 12px',
          borderRadius: 6,
          background: result.safe ? '#052e16' : '#450a0a',
          color: result.safe ? '#4ade80' : '#ef4444',
          fontWeight: 700,
        }}>
          {result.safe ? '✓ SAFE' : '✗ ISSUES FOUND'}
        </span>
      </div>

      <div style={{ marginBottom: 12, fontSize: 13, color: result.safe ? '#86efac' : '#fca5a5' }}>
        {result.summary}
      </div>

      {result.issues.length > 0 && (
        <div>
          {result.issues.map((issue, i) => (
            <div key={i} style={{
              background: '#0f172a',
              border: `1px solid ${SEVERITY_COLOURS[issue.severity]}44`,
              borderLeft: `3px solid ${SEVERITY_COLOURS[issue.severity]}`,
              borderRadius: 6,
              padding: '8px 12px',
              marginBottom: 6,
              fontSize: 12,
            }}>
              <span style={{ color: SEVERITY_COLOURS[issue.severity], fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
                {issue.severity}
              </span>
              <span style={{ color: '#64748b', marginLeft: 6, fontSize: 10 }}>{issue.category}</span>
              <div style={{ color: '#cbd5e1', marginTop: 4 }}>{issue.message}</div>
            </div>
          ))}
        </div>
      )}

      {result.safe && result.issues.length === 0 && (
        <div style={{ fontSize: 12, color: '#64748b' }}>No issues detected. Prompt is safe for copy-paste use.</div>
      )}
    </div>
  );
}
