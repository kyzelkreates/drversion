import React from 'react';
import { Card } from '../ui/Card.jsx';
import { ENV_SAFETY_RULES } from '../../config/envSafetyRules.js';

export function EnvSafetyPanel({ envCheck, envExample }) {
  return (
    <Card variant="default">
      <div className="card-title">⊡ Environment Safety</div>

      {envCheck && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: envCheck.passed ? '#22c55e' : '#ef4444', fontWeight: 700, marginBottom: 4 }}>
            {envCheck.passed ? '✓ Env safety check passed' : '⛔ Env safety issues detected'}
          </div>
          {(envCheck.issues || []).map((i, idx) => (
            <div key={idx} style={{ fontSize: 11, color: '#ef4444' }}>⛔ {i}</div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>ALLOWED PUBLIC PREFIXES</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ENV_SAFETY_RULES.allowedPublicPrefixes.map((p) => (
            <span key={p} style={{ background: '#14532d', color: '#22c55e', borderRadius: 4, padding: '2px 8px', fontSize: 11 }}>{p}</span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>FORBIDDEN SECRET NAMES (never include real values)</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {ENV_SAFETY_RULES.forbiddenSecretNames.slice(0, 8).map((n) => (
            <span key={n} style={{ background: '#1a0505', color: '#ef4444', borderRadius: 4, padding: '2px 6px', fontSize: 10 }}>{n}</span>
          ))}
          {ENV_SAFETY_RULES.forbiddenSecretNames.length > 8 && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{ENV_SAFETY_RULES.forbiddenSecretNames.length - 8} more</span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>RULES</div>
        {ENV_SAFETY_RULES.envExampleRules.map((r, i) => (
          <div key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '2px 0' }}>⊡ {r}</div>
        ))}
      </div>

      {envExample && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>.ENV.EXAMPLE PREVIEW</div>
          <pre style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 6, padding: 10, fontSize: 10, color: '#22c55e', overflow: 'auto', maxHeight: 140 }}>
            {envExample}
          </pre>
        </div>
      )}
    </Card>
  );
}
export default EnvSafetyPanel;
