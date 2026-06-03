// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// VariantPromptCompletenessPanel.jsx — Run 10
import { checkVariantPromptCompleteness } from '../../logic/masterLauncher/variantPromptCompletenessChecker.js';

export default function VariantPromptCompletenessPanel({ prompt }) {
  if (!prompt?.promptText) {
    return (
      <div className="card">
        <div className="card-title">Completeness Check</div>
        <div style={{ color: '#64748b', fontSize: 13 }}>Generate a prompt to check completeness.</div>
      </div>
    );
  }

  const result = checkVariantPromptCompleteness(prompt.promptText);

  const barColour = result.score >= 90 ? '#22c55e' : result.score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="card-title" style={{ margin: 0 }}>Completeness Check</div>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          color: barColour,
        }}>{result.score}%</span>
      </div>

      <div style={{ background: '#0f172a', borderRadius: 6, height: 8, marginBottom: 12, overflow: 'hidden' }}>
        <div style={{ height: 8, width: `${result.score}%`, background: barColour, borderRadius: 6, transition: 'width 0.3s' }} />
      </div>

      <div style={{ fontSize: 13, color: result.complete ? '#86efac' : '#fca5a5', marginBottom: 12 }}>
        {result.summary}
      </div>

      <div>
        {result.checks.map((c) => (
          <div key={c.checkId} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '6px 0',
            borderBottom: '1px solid #1e293b',
          }}>
            <span style={{ fontSize: 14, color: c.passed ? '#22c55e' : '#ef4444', flexShrink: 0 }}>
              {c.passed ? '✓' : '✗'}
            </span>
            <div>
              <div style={{ fontSize: 12, color: '#e2e8f0' }}>{c.label}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{c.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
