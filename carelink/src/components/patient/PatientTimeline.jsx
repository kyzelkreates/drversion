import React from 'react';
import { ChevronLeft, CheckCircle, AlertCircle, Heart, Pill, Clock } from 'lucide-react';
import { getCheckInsByPatient, getSymptomsByPatient, getRecoveryByPatient, getMedsByPatient } from '../../lib/carelinkDb.js';
import { RiskBadge } from '../shared/RiskBadge.jsx';

export function PatientTimeline({ patient, onNavigate }) {
  const checkIns = getCheckInsByPatient(patient.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const symptoms = getSymptomsByPatient(patient.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recovery = getRecoveryByPatient(patient.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const meds     = getMedsByPatient(patient.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = checkIns.length + symptoms.length + recovery.length + meds.length;

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <button onClick={() => onNavigate('patient-home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', padding: 0 }}>
        <ChevronLeft size={16} /> Back
      </button>
      <h2 style={{ color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '20px' }}>My Submissions</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>{total} total submissions</p>

      {/* Check-ins */}
      {checkIns.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--gold-bright)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={14} /> Daily Check-Ins ({checkIns.length})
          </h3>
          {checkIns.slice(0, 5).map(ci => (
            <div key={ci.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, margin: '0 0 3px' }}>{ci.date}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
                  {ci.submittedAt ? `Submitted ${new Date(ci.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : 'Draft'}
                </p>
              </div>
              {ci.riskLevel && <RiskBadge level={ci.riskLevel} />}
            </div>
          ))}
        </section>
      )}

      {/* Symptoms */}
      {symptoms.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--purple-bright)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={14} /> Symptom Reports ({symptoms.length})
          </h3>
          {symptoms.slice(0, 5).map(s => (
            <div key={s.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px', marginBottom: '8px' }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, margin: '0 0 3px' }}>{s.symptomTitle}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>Severity {s.severity}/5 · {new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      )}

      {/* Recovery */}
      {recovery.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#ff6b9d', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={14} /> Recovery Updates ({recovery.length})
          </h3>
          {recovery.slice(0, 3).map(r => (
            <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px', marginBottom: '8px' }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, margin: '0 0 3px' }}>{r.recoveryStatus || 'Update'}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      )}

      {/* Meds */}
      {meds.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--status-info)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pill size={14} /> Medication Notes ({meds.length})
          </h3>
          {meds.slice(0, 3).map(m => (
            <div key={m.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px', marginBottom: '8px' }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '13px', margin: '0 0 3px' }}>{m.note}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>{new Date(m.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      )}

      {total === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <Clock size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p style={{ fontSize: '14px' }}>No submissions yet. Start with today's check-in.</p>
        </div>
      )}
    </div>
  );
}
export default PatientTimeline;
