import React from 'react';
import { Card } from '../ui/Card.jsx';

export function NoSecretsGuardPanel({ sanitisation, onRunScan }) {
  return (
    <Card variant={sanitisation?.passed === false ? 'red' : 'default'}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="card-title" style={{ margin: 0 }}>⊡ No-Secrets Guard</div>
        {onRunScan && <button className="btn btn-ghost btn-sm" onClick={onRunScan}>Run Scan</button>}
      </div>

      {!sanitisation ? (
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Scan not yet run. Click "Run Scan" to check this export pack for secrets.</div>
      ) : sanitisation.passed ? (
        <div>
          <div style={{ fontSize: 13, color: '#22c55e', fontWeight: 700, marginBottom: 4 }}>✓ No secrets detected</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Export pack is safe to share or deploy.</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 700, marginBottom: 6 }}>⛔ Security issues detected</div>
          {(sanitisation.findings || []).map((f, i) => (
            <div key={i} style={{ fontSize: 12, color: '#ef4444', padding: '3px 0' }}>⛔ {f}</div>
          ))}
          <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 8 }}>
            This export pack must not be shared until all secrets are removed.
          </div>
        </div>
      )}
    </Card>
  );
}
export default NoSecretsGuardPanel;
