import React, { useState } from 'react';
import { ChevronLeft, AlertCircle, Check } from 'lucide-react';
import { createSymptomReport, createRiskFlag, getPatientById } from '../../lib/carelinkDb.js';
import { correlateSymptomReport } from '../../lib/correlationEngine.js';

const SEVERITY_OPTS = [
  { value: 1, label: 'Mild',    color: 'var(--green-mid)' },
  { value: 2, label: 'Moderate',color: 'var(--gold-bright)' },
  { value: 3, label: 'Significant', color: 'var(--gold-bright)' },
  { value: 4, label: 'Severe',  color: '#ff6644' },
  { value: 5, label: 'Very severe', color: 'var(--status-error)' },
];

export function SymptomsUpload({ patient, onNavigate }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState(null);
  const [bodyArea, setBodyArea] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('Please enter a symptom title.'); return; }
    if (!severity) { setError('Please select a severity level.'); return; }
    setError('');

    const report = createSymptomReport({
      patientId: patient.id,
      symptomTitle: title.trim(),
      symptomDescription: desc.trim(),
      severity,
      bodyArea: bodyArea.trim(),
      startedAt: null,
    });

    // Run correlation
    const flags = correlateSymptomReport({ patient, symptomReport: report });
    for (const f of flags) createRiskFlag(f);

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <Check size={40} color='var(--green-mid)' style={{ marginBottom: '14px' }} />
          <h2 style={{ color: 'var(--green-mid)', margin: '0 0 10px' }}>Symptom Reported</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px', lineHeight: 1.5 }}>
            Your symptom has been saved and will be reviewed by your care team.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => { setSubmitted(false); setTitle(''); setDesc(''); setSeverity(null); setBodyArea(''); }} style={{
              padding: '10px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '13px',
            }}>Report Another</button>
            <button onClick={() => onNavigate('patient-home')} style={{
              padding: '10px 20px', background: 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))', border: 'none', borderRadius: '10px', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: '13px',
            }}>Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <button onClick={() => onNavigate('patient-home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', padding: 0 }}>
        <ChevronLeft size={16} /> Back
      </button>

      <h2 style={{ color: 'var(--purple-bright)', margin: '0 0 6px', fontSize: '20px' }}>
        <AlertCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
        Report a Symptom
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>
        Describe what you're experiencing. Your care team will review this.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Symptom *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Headache, swelling, shortness of breath…" style={{
            width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
          }} />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Severity *</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SEVERITY_OPTS.map(o => (
              <button type="button" key={o.value} onClick={() => setSeverity(o.value)} style={{
                padding: '8px 14px', borderRadius: '8px',
                background: severity === o.value ? 'rgba(245,200,66,0.15)' : 'var(--bg-secondary)',
                border: `1px solid ${severity === o.value ? 'var(--border-gold)' : 'var(--border-card)'}`,
                color: severity === o.value ? o.color : 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', fontWeight: severity === o.value ? 700 : 400,
              }}>{o.value} — {o.label}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Description (optional)</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the symptom in more detail…" rows={3} style={{
            width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box',
          }} />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Body area (optional)</label>
          <input value={bodyArea} onChange={e => setBodyArea(e.target.value)} placeholder="e.g. Lower back, left knee…" style={{
            width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
          }} />
        </div>

        {error && <p style={{ color: 'var(--status-error)', fontSize: '12px' }}>{error}</p>}

        <button type="submit" style={{
          padding: '14px', background: 'linear-gradient(135deg, var(--purple-dim), var(--purple-bright))',
          border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
        }}>
          Submit Symptom Report
        </button>
      </form>
    </div>
  );
}
export default SymptomsUpload;
