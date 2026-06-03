import React, { useState } from 'react';
import { ChevronLeft, Heart, Check } from 'lucide-react';
import { createRecoveryUpdate } from '../../lib/carelinkDb.js';

const STATUS_OPTS = {
  recoveryStatus:  ['On track', 'Slower than expected', 'Struggling', 'Feeling better than expected'],
  mobilityStatus:  ['Normal', 'Some difficulty', 'Limited movement', 'Unable to move normally'],
  sleepStatus:     ['Sleeping well', 'Some disruption', 'Poor sleep', 'Very poor sleep'],
  appetiteStatus:  ['Good appetite', 'Reduced appetite', 'Poor appetite', 'Not eating'],
};

export function RecoveryStatus({ patient, onNavigate }) {
  const [form, setForm] = useState({ recoveryStatus: '', mobilityStatus: '', sleepStatus: '', appetiteStatus: '', painLevel: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) { setForm(f => ({ ...f, [field]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.recoveryStatus) { setError('Please select a recovery status.'); return; }
    setError('');
    createRecoveryUpdate({ patientId: patient.id, ...form, painLevel: Number(form.painLevel) || 0 });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <Check size={40} color='var(--green-mid)' style={{ marginBottom: '14px' }} />
          <h2 style={{ color: 'var(--green-mid)', margin: '0 0 10px' }}>Recovery Update Saved</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>Your care team will see your update.</p>
          <button onClick={() => onNavigate('patient-home')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))', border: 'none', borderRadius: '10px', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer' }}>
            Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <button onClick={() => onNavigate('patient-home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', padding: 0 }}>
        <ChevronLeft size={16} /> Back
      </button>
      <h2 style={{ color: '#ff6b9d', margin: '0 0 6px', fontSize: '20px' }}>
        <Heart size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
        Recovery Status
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>Share how your recovery is going today.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {Object.entries(STATUS_OPTS).map(([field, opts]) => (
          <div key={field}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px', textTransform: 'capitalize' }}>
              {field.replace(/([A-Z])/g, ' $1').trim()} {field === 'recoveryStatus' && '*'}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {opts.map(o => (
                <button type="button" key={o} onClick={() => set(field, o)} style={{
                  padding: '10px 14px', borderRadius: '8px', textAlign: 'left',
                  background: form[field] === o ? 'rgba(245,200,66,0.1)' : 'var(--bg-secondary)',
                  border: `1px solid ${form[field] === o ? 'var(--border-gold)' : 'var(--border-card)'}`,
                  color: form[field] === o ? 'var(--gold-bright)' : 'var(--text-muted)',
                  fontSize: '13px', cursor: 'pointer', fontWeight: form[field] === o ? 600 : 400,
                }}>{o}</button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Pain level (0–10)</label>
          <input type="number" min={0} max={10} value={form.painLevel} onChange={e => set('painLevel', e.target.value)} placeholder="0 = no pain, 10 = worst" style={{
            width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
          }} />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Notes for your care team (optional)</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anything else you want to share…" rows={3} style={{
            width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box',
          }} />
        </div>

        {error && <p style={{ color: 'var(--status-error)', fontSize: '12px' }}>{error}</p>}
        <button type="submit" style={{
          padding: '14px', background: 'linear-gradient(135deg, #8b1a4a, #ff6b9d)',
          border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
        }}>Submit Recovery Update</button>
      </form>
    </div>
  );
}
export default RecoveryStatus;
