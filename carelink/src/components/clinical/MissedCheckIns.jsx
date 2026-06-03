import React from 'react';
import { ChevronLeft, Clock, ChevronRight } from 'lucide-react';
import { getPatients, getCheckIns } from '../../lib/carelinkDb.js';

export function MissedCheckIns({ onNavigate }) {
  const patients   = getPatients();
  const checkIns   = getCheckIns();
  const todayStr   = new Date().toISOString().slice(0, 10);

  const missed = patients
    .filter(p => p.status === 'active')
    .map(p => {
      const todayCI = checkIns.find(c => c.patientId === p.id && c.date === todayStr && c.submittedAt);
      const lastCI  = checkIns
        .filter(c => c.patientId === p.id && c.submittedAt)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
      const daysSince = lastCI
        ? Math.floor((new Date() - new Date(lastCI.submittedAt)) / 86400000)
        : null;
      return { patient: p, todayCI, lastCI, daysSince };
    })
    .filter(m => !m.todayCI);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => onNavigate('clinical-dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={18} />
        </button>
        <h2 style={{ color: 'var(--gold-bright)', fontSize: '18px', fontWeight: 700, margin: 0, flex: 1 }}>
          <Clock size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Missed Check-Ins Today
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{todayStr}</span>
      </div>

      {missed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--green-mid)' }}>
          <Clock size={40} style={{ marginBottom: '14px', opacity: 0.6 }} />
          <p style={{ fontSize: '15px', fontWeight: 600 }}>All active patients have checked in today.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px' }}>{missed.length} patient{missed.length > 1 ? 's' : ''} have not submitted today's check-in.</p>
          {missed.map(({ patient: p, lastCI, daysSince }) => (
            <button key={p.id} onClick={() => onNavigate('clinical-patient-detail', { patientId: p.id })} style={{
              background: 'var(--bg-card)', border: `1px solid ${daysSince !== null && daysSince >= 3 ? 'rgba(255,100,68,0.3)' : 'var(--border-card)'}`,
              borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dim), var(--gold-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
                {p.displayName?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', margin: '0 0 3px' }}>{p.displayName}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
                  {lastCI
                    ? `Last check-in: ${new Date(lastCI.submittedAt).toLocaleDateString()} (${daysSince}d ago)`
                    : 'No check-ins on record'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {daysSince !== null && daysSince >= 3 && (
                  <span style={{ display: 'block', color: '#ff6644', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>{daysSince}d missed</span>
                )}
                <ChevronRight size={14} color='var(--text-muted)' />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default MissedCheckIns;
