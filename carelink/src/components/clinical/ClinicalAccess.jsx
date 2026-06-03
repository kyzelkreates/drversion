import React, { useState } from 'react';
import { Monitor, Lock, ShieldCheck } from 'lucide-react';
import APP_BRANDING from '../../config/appBranding.js';
import SAFETY_TEXT from '../../config/medicalSafetyText.js';
import { getSettings } from '../../lib/carelinkDb.js';

export function ClinicalAccess({ onLogin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    const settings = getSettings();
    if (code.trim() === settings.clinicalAccessCode) {
      onLogin({ role: 'clinician', name: 'Care Team Member' });
    } else {
      setError('Access code not recognised.');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 16px', background: 'linear-gradient(135deg, var(--silver-dim), var(--silver-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Monitor size={32} color='#0a0a0a' />
          </div>
          <h1 style={{ color: 'var(--silver-bright)', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            Clinical Monitoring Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{APP_BRANDING.productName}</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <ShieldCheck size={18} color='var(--green-mid)' />
            <h2 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, margin: 0 }}>Care Team Access</h2>
          </div>
          <form onSubmit={handleLogin}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Clinical Access Code</label>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter clinical access code" style={{
                width: '100%', padding: '12px 12px 12px 36px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
              }} />
            </div>
            {error && <p style={{ color: 'var(--status-error)', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
            <button type="submit" disabled={!code.trim()} style={{
              width: '100%', padding: '13px', background: code.trim() ? 'linear-gradient(135deg, var(--silver-dim), var(--silver-bright))' : 'var(--bg-secondary)',
              border: 'none', borderRadius: '10px', color: code.trim() ? '#0a0a0a' : 'var(--text-muted)',
              fontSize: '15px', fontWeight: 700, cursor: code.trim() ? 'pointer' : 'not-allowed',
            }}>Access Dashboard</button>
          </form>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginTop: '12px' }}>
            Demo code: <strong style={{ color: 'var(--text-secondary)' }}>CARE2024</strong>
          </p>
        </div>

        <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(0,255,136,0.04)', border: '1px solid var(--border-green)', borderRadius: '10px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.5, margin: 0 }}>{SAFETY_TEXT.clinicalNotice}</p>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '10px', marginTop: '16px' }}>{APP_BRANDING.poweredBy}</p>
      </div>
    </div>
  );
}
export default ClinicalAccess;
