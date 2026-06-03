import React, { useState } from 'react';
import {
  ChevronLeft, User, CheckCircle, AlertCircle, Heart,
  Pill, Flag, FileText, MessageSquare, Plus, Check
} from 'lucide-react';
import {
  getPatientById, getCheckInsByPatient, getSymptomsByPatient,
  getRecoveryByPatient, getMedsByPatient, getRiskFlagsByPatient,
  getNotesByPatient, markFlagReviewed, createCareTeamNote
} from '../../lib/carelinkDb.js';
import { RiskBadge } from '../shared/RiskBadge.jsx';
import { StatusBadge } from '../shared/StatusBadge.jsx';

const TAB_CONFIG = [
  { id: 'overview',  label: 'Overview',   icon: User },
  { id: 'checkins',  label: 'Check-Ins',  icon: CheckCircle },
  { id: 'symptoms',  label: 'Symptoms',   icon: AlertCircle },
  { id: 'recovery',  label: 'Recovery',   icon: Heart },
  { id: 'meds',      label: 'Medication', icon: Pill },
  { id: 'flags',     label: 'Flags',      icon: Flag },
  { id: 'notes',     label: 'Notes',      icon: MessageSquare },
];

export function PatientDetail({ patientId, onNavigate }) {
  const [tab, setTab] = useState('overview');
  const [noteText, setNoteText] = useState('');
  const [refresh, setRefresh] = useState(0);

  const patient   = getPatientById(patientId);
  if (!patient) return (
    <div style={{ padding: '24px' }}>
      <button onClick={() => onNavigate('clinical-patients')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, marginBottom: '16px' }}>
        <ChevronLeft size={16} /> Back
      </button>
      <p style={{ color: 'var(--status-error)' }}>Patient not found.</p>
    </div>
  );

  const checkIns  = getCheckInsByPatient(patientId).sort((a, b) => new Date(b.date) - new Date(a.date));
  const symptoms  = getSymptomsByPatient(patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recovery  = getRecoveryByPatient(patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const meds      = getMedsByPatient(patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const flags     = getRiskFlagsByPatient(patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const notes     = getNotesByPatient(patientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const latestCI  = checkIns[0];
  const unreviewedFlags = flags.filter(f => !f.reviewed);

  function handleMarkReviewed(flagId) {
    markFlagReviewed(flagId, 'Reviewed by care team.');
    setRefresh(r => r + 1);
  }

  function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    createCareTeamNote({ patientId, text: noteText.trim(), createdBy: 'Care Team Member' });
    setNoteText('');
    setRefresh(r => r + 1);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => onNavigate('clinical-patients')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--silver-dim), var(--silver-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>
          {patient.displayName?.[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '18px', fontWeight: 700 }}>{patient.displayName}</h2>
            <StatusBadge status={patient.status} />
            {latestCI?.riskLevel && <RiskBadge level={latestCI.riskLevel} />}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '2px 0 0' }}>
            {patient.patientReference} · {patient.recoveryType} · Started {patient.startDate}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onNavigate('clinical-export', { patientId })} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '7px 12px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FileText size={13} /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px', overflowX: 'auto', paddingBottom: '0' }}>
        {TAB_CONFIG.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 14px', background: 'none', border: 'none',
            borderBottom: tab === t.id ? '2px solid var(--gold-bright)' : '2px solid transparent',
            color: tab === t.id ? 'var(--gold-bright)' : 'var(--text-muted)',
            cursor: 'pointer', fontSize: '12px', fontWeight: tab === t.id ? 700 : 400,
            display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap',
          }}>
            <t.icon size={13} />
            {t.label}
            {t.id === 'flags' && unreviewedFlags.length > 0 && (
              <span style={{ background: 'var(--status-error)', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>{unreviewedFlags.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            ['Patient Ref', patient.patientReference],
            ['Recovery Type', patient.recoveryType],
            ['Start Date', patient.startDate],
            ['Last Check-in', patient.lastCheckInAt ? new Date(patient.lastCheckInAt).toLocaleDateString() : 'Never'],
            ['Total Check-ins', checkIns.filter(c => c.submittedAt).length],
            ['Unreviewed Flags', unreviewedFlags.length],
            ['Symptom Reports', symptoms.length],
            ['Recovery Updates', recovery.length],
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '14px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: '0 0 4px' }}>{label}</p>
              <p style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, margin: 0 }}>{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'checkins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {checkIns.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>No check-ins yet.</p>}
          {checkIns.map(ci => (
            <div key={ci.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: ci.answers?.length > 0 ? '12px' : 0 }}>
                <div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', marginRight: '10px' }}>{ci.date}</span>
                  {ci.submittedAt && <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Submitted {new Date(ci.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {ci.riskLevel && <RiskBadge level={ci.riskLevel} />}
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Score: {ci.totalSeverityScore}</span>
                </div>
              </div>
              {ci.answers?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {ci.answers.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', flexShrink: 0, minWidth: '70px' }}>Q{i + 1}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px', flex: 1 }}>{a.questionText}</span>
                      <span style={{ color: a.severityScore > 3 ? 'var(--status-error)' : 'var(--gold-bright)', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
                        {String(a.answerValue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'symptoms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {symptoms.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>No symptoms reported.</p>}
          {symptoms.map(s => (
            <div key={s.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}>{s.symptomTitle}</span>
                <span style={{ color: s.severity >= 4 ? 'var(--status-error)' : s.severity >= 3 ? 'var(--gold-bright)' : 'var(--green-mid)', fontSize: '12px', fontWeight: 700 }}>Severity {s.severity}/5</span>
              </div>
              {s.symptomDescription && <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 4px' }}>{s.symptomDescription}</p>}
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>{s.bodyArea && `${s.bodyArea} · `}{new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'recovery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recovery.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>No recovery updates yet.</p>}
          {recovery.map(r => (
            <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px' }}>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', margin: '0 0 8px' }}>{r.recoveryStatus}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                {[['Mobility', r.mobilityStatus], ['Sleep', r.sleepStatus], ['Appetite', r.appetiteStatus], ['Pain', r.painLevel ? `${r.painLevel}/10` : '—']].map(([k, v]) => (
                  v && <div key={k} style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{k}:</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{v}</span>
                  </div>
                ))}
              </div>
              {r.notes && <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0', fontStyle: 'italic' }}>{r.notes}</p>}
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: '6px 0 0' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'meds' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {meds.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>No medication notes.</p>}
          {meds.map(m => (
            <div key={m.id} style={{ background: 'var(--bg-card)', border: `1px solid ${m.hasConcern ? 'rgba(255,100,68,0.3)' : 'var(--border-card)'}`, borderRadius: '12px', padding: '14px' }}>
              {m.hasConcern && <span style={{ color: '#ff6644', fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>⚠ Concern flagged</span>}
              <p style={{ color: 'var(--text-primary)', fontSize: '13px', margin: '0 0 4px' }}>{m.note}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>{new Date(m.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'flags' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {flags.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>No risk flags.</p>}
          {flags.map(f => (
            <div key={f.id} style={{ background: 'var(--bg-card)', border: `1px solid ${f.reviewed ? 'var(--border-card)' : 'rgba(255,68,85,0.25)'}`, borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <RiskBadge level={f.riskLevel} />
                    {f.reviewed && <span style={{ color: 'var(--green-mid)', fontSize: '11px' }}>✓ Reviewed</span>}
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>{f.reason}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: '0 0 4px', fontStyle: 'italic' }}>{f.evidence}</p>
                  <p style={{ color: 'var(--purple-bright)', fontSize: '11px', margin: 0 }}>→ {f.recommendedActionLabel}</p>
                </div>
                {!f.reviewed && (
                  <button onClick={() => handleMarkReviewed(f.id)} style={{ background: 'rgba(0,204,106,0.1)', border: '1px solid var(--border-green)', borderRadius: '8px', padding: '6px 12px', color: 'var(--green-mid)', cursor: 'pointer', fontSize: '11px', fontWeight: 600, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} /> Mark Reviewed
                  </button>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '10px', margin: '8px 0 0' }}>{new Date(f.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'notes' && (
        <div>
          <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a care team note…" style={{
              flex: 1, padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
            }} />
            <button type="submit" disabled={!noteText.trim()} style={{
              padding: '10px 16px', background: noteText.trim() ? 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))' : 'var(--bg-secondary)',
              border: 'none', borderRadius: '10px', color: noteText.trim() ? '#0a0a0a' : 'var(--text-muted)', cursor: noteText.trim() ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '13px',
            }}>Add</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notes.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>No notes yet.</p>}
            {notes.map(n => (
              <div key={n.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: '13px', margin: '0 0 6px' }}>{n.text}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>{n.createdBy} · {new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default PatientDetail;
