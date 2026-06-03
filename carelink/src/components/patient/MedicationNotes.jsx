import React, { useState } from 'react';
import { ChevronLeft, Pill, Check } from 'lucide-react';
import { createMedicationNote, getMedsByPatient } from '../../lib/carelinkDb.js';

export function MedicationNotes({ patient, onNavigate }) {
  const [note, setNote] = useState('');
  const [hasConcern, setHasConcern] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const existing = getMedsByPatient(patient.id);

  function handleSubmit(e) {
    e.preventDefault();
    if (!note.trim()) return;
    createMedicationNote({ patientId: patient.id, note: note.trim(), hasConcern: hasConcern === 'yes' });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <Check size={40} color='var(--green-mid)' style={{ marginBottom: '14px' }} />
          <h2 style={{ color: 'var(--green-mid)', margin: '0 0 10px' }}>Note Saved</h2>
          <button onClick={() => onNavigate('patient-home')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))', border: 'none', borderRadius: '10px', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer' }}>Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <button onClick={() => onNavigate('patient-home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', padding: 0 }}>
        <ChevronLeft size={16} /> Back
      </button>
      <h2 style={{ color: 'var(--status-info)', margin: '0 0 6px', fontSize: '20px' }}>
        <Pill size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
        Medication Notes
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>Add a note for your care team about your medication.</p>

      {existing.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>Previous notes ({existing.length})</p>
          {existing.slice(-3).reverse().map(m => (
            <div key={m.id} style={{ padding: '8px 0', borderTop: '1px solid var(--border-subtle)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: '0 0 2px' }}>{new Date(m.createdAt).toLocaleDateString()}</p>
              <p style={{ color: 'var(--text-primary)', fontSize: '13px', margin: 0 }}>{m.note}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Do you have any concerns about your medication?</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['yes', 'no'].map(v => (
              <button type="button" key={v} onClick={() => setHasConcern(v)} style={{
                flex: 1, padding: '10px', borderRadius: '8px',
                background: hasConcern === v ? 'rgba(245,200,66,0.1)' : 'var(--bg-secondary)',
                border: `1px solid ${hasConcern === v ? 'var(--border-gold)' : 'var(--border-card)'}`,
                color: hasConcern === v ? 'var(--gold-bright)' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: '13px', fontWeight: hasConcern === v ? 600 : 400, textTransform: 'capitalize',
              }}>{v}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px' }}>Your note *</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Write anything about your medication here…" rows={4} style={{
            width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box',
          }} />
        </div>
        <button type="submit" disabled={!note.trim()} style={{
          padding: '14px', background: note.trim() ? 'linear-gradient(135deg, rgba(74,100,255,0.8), var(--status-info))' : 'var(--bg-secondary)',
          border: 'none', borderRadius: '12px', color: note.trim() ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '15px', cursor: note.trim() ? 'pointer' : 'not-allowed',
        }}>Save Medication Note</button>
      </form>
    </div>
  );
}
export default MedicationNotes;
