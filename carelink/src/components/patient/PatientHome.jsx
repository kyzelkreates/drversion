import React from 'react';
import { CheckCircle, Clock, AlertCircle, FileText, Heart, Pill, ChevronRight } from 'lucide-react';
import { getTodayCheckIn, getSymptomsByPatient, getRecoveryByPatient } from '../../lib/carelinkDb.js';
import { OfflineBanner } from '../shared/OfflineBanner.jsx';
import { SafetyNotice } from '../shared/SafetyNotice.jsx';

export function PatientHome({ patient, onNavigate }) {
  const todayCheckIn = getTodayCheckIn(patient.id);
  const symptoms = getSymptomsByPatient(patient.id);
  const recovery = getRecoveryByPatient(patient.id);
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const tiles = [
    {
      icon: CheckCircle, label: "Today's Check-In",
      sub: todayCheckIn?.submittedAt ? 'Completed ✓' : 'Not completed yet',
      color: todayCheckIn?.submittedAt ? 'var(--green-mid)' : 'var(--gold-bright)',
      bg: todayCheckIn?.submittedAt ? 'var(--green-glow)' : 'var(--gold-glow)',
      border: todayCheckIn?.submittedAt ? 'var(--border-green)' : 'var(--border-gold)',
      route: 'patient-checkin',
    },
    { icon: AlertCircle, label: 'Report Symptoms',     sub: `${symptoms.length} reports`,      color: 'var(--purple-bright)', bg: 'var(--purple-glow)', border: 'var(--border-purple)', route: 'patient-symptoms'  },
    { icon: Heart,       label: 'Recovery Status',     sub: `${recovery.length} updates`,      color: '#ff6b9d',              bg: 'rgba(255,107,157,0.1)', border: 'rgba(255,107,157,0.3)', route: 'patient-recovery'  },
    { icon: Pill,        label: 'Medication Notes',    sub: 'Add a note',                      color: 'var(--status-info)',   bg: 'rgba(74,158,255,0.1)', border: 'rgba(74,158,255,0.3)', route: 'patient-medication' },
    { icon: FileText,    label: 'My Submissions',      sub: 'View history',                    color: 'var(--silver-mid)',    bg: 'rgba(160,160,160,0.08)', border: 'var(--border-subtle)', route: 'patient-timeline' },
  ];

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
      <OfflineBanner />

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>{today}</p>
        <h1 style={{ color: 'var(--gold-bright)', fontSize: '22px', fontWeight: 700, margin: '0 0 2px' }}>
          Hello, {patient.displayName}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
          Recovery: <strong style={{ color: 'var(--text-primary)' }}>{patient.recoveryType || 'General'}</strong>
        </p>
      </div>

      {/* Today's status card */}
      <div style={{
        background: todayCheckIn?.submittedAt ? 'rgba(0,204,106,0.08)' : 'rgba(245,200,66,0.08)',
        border: `1px solid ${todayCheckIn?.submittedAt ? 'var(--border-green)' : 'var(--border-gold)'}`,
        borderRadius: '14px', padding: '16px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        {todayCheckIn?.submittedAt
          ? <CheckCircle size={28} color='var(--green-mid)' />
          : <Clock size={28} color='var(--gold-bright)' />}
        <div style={{ flex: 1 }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 3px', fontSize: '14px' }}>
            {todayCheckIn?.submittedAt ? "Today's check-in complete" : "Daily check-in due today"}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
            {todayCheckIn?.submittedAt ? 'Thank you for checking in.' : '10 questions — takes about 2 minutes.'}
          </p>
        </div>
        {!todayCheckIn?.submittedAt && (
          <button onClick={() => onNavigate('patient-checkin')} style={{
            background: 'var(--gold-bright)', border: 'none', borderRadius: '10px',
            padding: '9px 16px', color: '#0a0a0a', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
          }}>Start</button>
        )}
      </div>

      {/* Action tiles */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {tiles.map(t => (
          <button key={t.route} onClick={() => onNavigate(t.route)} style={{
            background: 'var(--bg-card)', border: `1px solid ${t.border}`,
            borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center',
            gap: '14px', cursor: 'pointer', width: '100%', textAlign: 'left',
            transition: 'background 0.15s',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <t.icon size={20} color={t.color} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 2px', fontSize: '14px' }}>{t.label}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>{t.sub}</p>
            </div>
            <ChevronRight size={16} color='var(--text-muted)' />
          </button>
        ))}
      </div>

      <SafetyNotice variant="patient" compact />
    </div>
  );
}
export default PatientHome;
