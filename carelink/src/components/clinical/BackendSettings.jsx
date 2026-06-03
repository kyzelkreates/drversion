import React, { useState } from 'react';
import { ChevronLeft, Settings, Database, Shield, RefreshCw, Check } from 'lucide-react';
import { getSettings, updateSettings } from '../../lib/carelinkDb.js';
import { getBackendStatus, testSupabaseConnection, connectSupabase, setLocalMode } from '../../lib/supabaseAdapter.js';
import SAFETY_TEXT from '../../config/medicalSafetyText.js';
import APP_BRANDING from '../../config/appBranding.js';

export function BackendSettings({ onNavigate }) {
  const [settings, setSettingsState] = useState(getSettings());
  const [backendStatus, setBackendStatus] = useState(getBackendStatus());
  const [supaUrl, setSupaUrl] = useState(settings.supabaseUrl || '');
  const [supaKey, setSupaKey] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [clinicalCode, setClinicalCode] = useState(settings.clinicalAccessCode || '');
  const [patientCode, setPatientCode] = useState(settings.patientAccessCode || '');

  function refresh() {
    const s = getSettings();
    setSettingsState(s);
    setBackendStatus(getBackendStatus());
  }

  async function handleTest() {
    setTestResult('testing');
    const r = await testSupabaseConnection();
    setTestResult(r.message);
  }

  async function handleConnect() {
    if (!supaUrl.trim() || !supaKey.trim()) return;
    const r = await connectSupabase(supaUrl.trim(), supaKey.trim());
    setTestResult(r.message);
    refresh();
  }

  function handleSetLocal() {
    setLocalMode();
    refresh();
  }

  function handleSaveCodes() {
    updateSettings({ clinicalAccessCode: clinicalCode.trim(), patientAccessCode: patientCode.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    refresh();
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => onNavigate('clinical-dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={18} />
        </button>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700, margin: 0 }}>
          <Settings size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Settings & Backend
        </h2>
      </div>

      {/* Backend mode */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Database size={16} color='var(--green-mid)' />
          <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '14px', fontWeight: 700 }}>Backend Mode</h3>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          {['local', 'supabase'].map(mode => (
            <button key={mode} onClick={() => { if (mode === 'local') handleSetLocal(); }} style={{
              flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              background: backendStatus.mode === mode ? 'rgba(0,204,106,0.1)' : 'var(--bg-secondary)',
              border: `1px solid ${backendStatus.mode === mode ? 'var(--border-green)' : 'var(--border-card)'}`,
              color: backendStatus.mode === mode ? 'var(--green-mid)' : 'var(--text-muted)',
              cursor: 'pointer', textTransform: 'capitalize',
            }}>{mode}</button>
          ))}
        </div>
        {[
          ['Mode', backendStatus.mode],
          ['Supabase Configured', backendStatus.configured ? 'Yes' : 'No'],
          ['Sync Enabled', backendStatus.syncEnabled ? 'Yes' : 'No'],
          ['Last Sync', backendStatus.lastSyncAt || 'Never'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{k}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Supabase config */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--text-primary)', margin: '0 0 6px', fontSize: '14px', fontWeight: 700 }}>Supabase Configuration</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '16px', lineHeight: 1.5 }}>
          Optional. Enable only after configuring RLS, authentication, and data protection.
          Never enter a service role key here.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Supabase URL</label>
            <input value={supaUrl} onChange={e => setSupaUrl(e.target.value)} placeholder="https://your-project.supabase.co" style={{
              width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
            }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Anon Key (public)</label>
            <input type="password" value={supaKey} onChange={e => setSupaKey(e.target.value)} placeholder="eyJ… (anon key only)" style={{
              width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
            }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleTest} style={{ padding: '9px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={12} /> Test Connection
            </button>
            <button onClick={handleConnect} disabled={!supaUrl.trim() || !supaKey.trim()} style={{
              padding: '9px 16px', background: supaUrl.trim() && supaKey.trim() ? 'linear-gradient(135deg, var(--green-dim), var(--green-mid))' : 'var(--bg-secondary)',
              border: 'none', borderRadius: '8px', color: supaUrl.trim() && supaKey.trim() ? '#0a0a0a' : 'var(--text-muted)', cursor: supaUrl.trim() && supaKey.trim() ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: 700,
            }}>Save Supabase Config</button>
          </div>
          {testResult && <p style={{ color: testResult === 'testing' ? 'var(--text-muted)' : 'var(--gold-bright)', fontSize: '12px', margin: 0 }}>{testResult === 'testing' ? 'Testing…' : testResult}</p>}
        </div>
      </div>

      {/* Access codes */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px', fontSize: '14px', fontWeight: 700 }}>Access Codes</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Clinical Access Code</label>
            <input value={clinicalCode} onChange={e => setClinicalCode(e.target.value)} style={{
              width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
            }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Default Patient Access Code</label>
            <input value={patientCode} onChange={e => setPatientCode(e.target.value)} style={{
              width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
            }} />
          </div>
        </div>
        <button onClick={handleSaveCodes} style={{
          padding: '9px 18px', background: 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          {saved ? <><Check size={13} /> Saved</> : 'Save Codes'}
        </button>
      </div>

      {/* Privacy notice */}
      <div style={{ padding: '14px', background: 'rgba(176,96,255,0.06)', border: '1px solid var(--border-purple)', borderRadius: '10px' }}>
        <Shield size={14} color='var(--purple-bright)' style={{ marginBottom: '6px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0, lineHeight: 1.5 }}>{SAFETY_TEXT.privacyNotice}</p>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '10px', textAlign: 'center', marginTop: '20px' }}>{APP_BRANDING.poweredBy}</p>
    </div>
  );
}
export default BackendSettings;
