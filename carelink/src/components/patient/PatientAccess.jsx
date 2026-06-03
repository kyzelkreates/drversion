import React, { useState } from 'react';
import { ShieldCheck, User, Lock } from 'lucide-react';
import APP_BRANDING from '../../config/appBranding.js';
import SAFETY_TEXT from '../../config/medicalSafetyText.js';
import { getPatients, seedDemoPatientIfEmpty } from '../../lib/carelinkDb.js';

export function PatientAccess({ onLogin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    seedDemoPatientIfEmpty();
    const patients = getPatients();
    const patient = patients.find(p => p.accessCode === code.trim());
    if (patient) {
      setTimeout(() => { setLoading(false); onLogin(patient); }, 400);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError('Access code not recognised. Please contact your care team.');
      }, 400);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={32} color='#0a0a0a' />
          </div>
          <h1 style={{ color: 'var(--gold-bright)', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            {APP_BRANDING.productName}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{APP_BRANDING.subtitle}</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-card)',
          borderRadius: '16px', padding: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <User size={18} color='var(--gold-bright)' />
            <h2 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              Patient Access
            </h2>
          </div>

          <form onSubmit={handleLogin}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>
              Patient Access Code
            </label>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter your access code"
                autoComplete="off"
                style={{
                  width: '100%', padding: '12px 12px 12px 36px', background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-card)', borderRadius: '10px',
                  color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
                  letterSpacing: '0.05em', boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <p style={{ color: 'var(--status-error)', fontSize: '12px', marginBottom: '12px' }}>{error}</p>
            )}

            <button type="submit" disabled={loading || !code.trim()} style={{
              width: '100%', padding: '13px', background: loading || !code.trim()
                ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))',
              border: 'none', borderRadius: '10px', color: loading || !code.trim() ? 'var(--text-muted)' : '#0a0a0a',
              fontSize: '15px', fontWeight: 700, cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}>
              {loading ? 'Checking…' : 'Access My Recovery'}
            </button>
          </form>

          <p style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginTop: '16px', lineHeight: 1.4 }}>
            Demo code: <strong style={{ color: 'var(--text-secondary)' }}>PATIENT001</strong>
          </p>
        </div>

        {/* Safety notice */}
        <div style={{
          marginTop: '20px', padding: '14px', background: 'rgba(176,96,255,0.06)',
          border: '1px solid var(--border-purple)', borderRadius: '10px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.5, margin: 0 }}>
            {SAFETY_TEXT.patientNotice}
          </p>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '10px', marginTop: '20px' }}>
          {APP_BRANDING.poweredBy}
        </p>
      </div>
    </div>
  );
}
export default PatientAccess;
