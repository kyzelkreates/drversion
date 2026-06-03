import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { PwaReadinessPanel } from '../components/export/PwaReadinessPanel.jsx';
import { GitHubReadinessPanel } from '../components/export/GitHubReadinessPanel.jsx';
import { VercelReadinessPanel } from '../components/export/VercelReadinessPanel.jsx';
import { EnvSafetyPanel } from '../components/export/EnvSafetyPanel.jsx';
import { NoSecretsGuardPanel } from '../components/export/NoSecretsGuardPanel.jsx';
import { getState, checkDeploymentReadinessStorage, generateEnvExampleForExportStorage, getActiveExportPack } from '../state/storage.js';
import { ENV_SAFETY_RULES } from '../config/envSafetyRules.js';

const overallColors = { ready: '#22c55e', ready_with_warnings: '#f59e0b', blocked: '#ef4444', not_checked: '#6b7280' };

export function DeploymentReadiness({ navigate, onNavigate }) {
  navigate = navigate || onNavigate;
  
  const [state,   setLocalState] = useState(() => getState());
  const [message, setMessage]    = useState('');

  function refresh() { setLocalState(getState()); }
  function flash(msg) { setMessage(msg); setTimeout(() => setMessage(''), 3000); }

  const dr  = state.exportSystem?.deploymentReadiness || {};
  const ep  = (state.exportSystem?.exportPacks || []).find((p) => p.id === state.exportSystem?.activeExportPackId);
  const env = ep?.envExample?.content || ENV_SAFETY_RULES.safeEnvExampleContent;

  function handleCheck() {
    checkDeploymentReadinessStorage();
    refresh();
    flash('Deployment readiness check complete.');
  }

  function handleGenEnv() {
    if (!ep) { flash('No active export pack — create one in Export Centre first.'); return; }
    generateEnvExampleForExportStorage(ep.id);
    refresh();
    flash('.env.example generated.');
  }

  const overallColor = overallColors[dr.overallStatus] || '#6b7280';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Deployment Readiness</h1>
          <p className="page-subtitle">
            This page prepares deployment readiness only. It does not deploy automatically, push to GitHub, or connect to Vercel.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCheck}>Run Readiness Check</button>
      </div>

      {message && (
        <div style={{ background: '#14532d', border: '1px solid #166534', borderRadius: 6, padding: '8px 14px', marginBottom: 12, color: '#22c55e', fontSize: 13 }}>
          {message}
        </div>
      )}

      {/* Overall Score */}
      {dr.overallStatus !== 'not_checked' && (
        <Card variant="default" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: overallColor }}>{dr.score || 0}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: overallColor }}>{dr.overallStatus?.replace(/_/g, ' ').toUpperCase()}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>overall deployment readiness</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {[
                { label: 'PWA',    ok: dr.pwaReady },
                { label: 'GitHub', ok: dr.githubReady },
                { label: 'Vercel', ok: dr.vercelReady },
                { label: 'Env',    ok: dr.envSafe },
                { label: 'Secrets',ok: dr.noSecretsPassed },
              ].map((x) => (
                <span key={x.label} style={{ fontSize: 11, color: x.ok ? '#22c55e' : '#ef4444', background: '#111', borderRadius: 4, padding: '3px 8px' }}>
                  {x.ok ? '✓' : '⛔'} {x.label}
                </span>
              ))}
            </div>
          </div>

          {(dr.blockers || []).length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>BLOCKERS</div>
              {dr.blockers.map((b, i) => <div key={i} style={{ fontSize: 12, color: '#ef4444' }}>⛔ {b}</div>)}
            </div>
          )}
          {(dr.warnings || []).length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>WARNINGS</div>
              {dr.warnings.map((w, i) => <div key={i} style={{ fontSize: 12, color: '#f59e0b' }}>⚠ {w}</div>)}
            </div>
          )}
        </Card>
      )}

      {dr.overallStatus === 'not_checked' && (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>
          Click "Run Readiness Check" to evaluate PWA, GitHub, Vercel, and environment readiness.
        </div>
      )}

      {dr.overallStatus !== 'not_checked' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          <PwaReadinessPanel    pwaCheck={dr.pwa} />
          <GitHubReadinessPanel githubCheck={dr.github} />
          <VercelReadinessPanel vercelCheck={dr.vercel} />
          <EnvSafetyPanel envCheck={dr.env} envExample={env} />
          <NoSecretsGuardPanel sanitisation={dr.secrets ? { passed: dr.noSecretsPassed, findings: (dr.secrets.findings || []).map((f) => f.label) } : null} onRunScan={() => { checkDeploymentReadinessStorage(); refresh(); }} />
        </div>
      )}

      {/* .env.example generator */}
      <Card variant="default" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginBottom: 6 }}>.env.example Generator</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
          Generates a safe .env.example with placeholder values only. No real secrets are ever included.
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleGenEnv}>Generate .env.example</button>
        {ep?.envExample?.content && (
          <pre style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 6, padding: 10, fontSize: 10, color: '#22c55e', marginTop: 10, overflow: 'auto', maxHeight: 180 }}>
            {ep.envExample.content}
          </pre>
        )}
      </Card>

      {/* Build commands reference */}
      <Card variant="default" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Build Reference</div>
        {[
          { label: 'Install',       cmd: 'npm install' },
          { label: 'Dev server',    cmd: 'npm run dev' },
          { label: 'Build',        cmd: 'npm run build' },
          { label: 'Output dir',   cmd: 'dist/' },
          { label: 'Build cmd (Vercel)', cmd: 'npm run build' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #111', fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
            <code style={{ color: 'var(--gold)', background: '#0a0a0a', borderRadius: 4, padding: '1px 8px' }}>{item.cmd}</code>
          </div>
        ))}
      </Card>

      <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/export-centre')}>← Export Centre</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/handoff-pack-builder')}>→ Handoff Pack Builder</button>
      </div>
    </div>
  );
}
export default DeploymentReadiness;
