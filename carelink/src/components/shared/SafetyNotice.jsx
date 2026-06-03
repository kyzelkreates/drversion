import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import SAFETY_TEXT from '../../config/medicalSafetyText.js';

export function SafetyNotice({ variant = 'patient', dismissible = true, compact = false }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const text = variant === 'clinical' ? SAFETY_TEXT.clinicalNotice : SAFETY_TEXT.patientNotice;
  return (
    <div style={{
      background: 'rgba(176,96,255,0.08)', border: '1px solid var(--border-purple)',
      borderRadius: '10px', padding: compact ? '10px 14px' : '14px 18px',
      position: 'relative', marginBottom: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <ShieldAlert size={18} color='var(--purple-bright)' style={{ flexShrink: 0, marginTop: '1px' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: compact ? '12px' : '13px', lineHeight: '1.5', margin: 0 }}>
          {text}
        </p>
      </div>
      {dismissible && (
        <button onClick={() => setDismissed(true)} style={{
          position: 'absolute', top: '8px', right: '10px', background: 'none', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer', padding: '2px',
        }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
export default SafetyNotice;
