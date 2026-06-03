import React, { useState } from 'react';
import { ChevronLeft, TrendingUp } from 'lucide-react';
import { getPatients, getCheckInsByPatient } from '../../lib/carelinkDb.js';
import { RiskBadge } from '../shared/RiskBadge.jsx';

function MiniPainChart({ checkIns }) {
  const sorted = [...checkIns]
    .filter(c => c.submittedAt && c.answers?.length > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);

  if (sorted.length === 0) return <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>No data</span>;

  const points = sorted.map(ci => {
    const q2 = ci.answers?.find(a => a.questionId === 'q2');
    return { date: ci.date, pain: q2 ? Number(q2.answerValue) : null };
  }).filter(p => p.pain !== null);

  if (points.length === 0) return <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>No pain data</span>;

  const max = 10;
  const w = 120, h = 36;
  const stepX = points.length > 1 ? w / (points.length - 1) : 0;

  const coords = points.map((p, i) => ({
    x: i * stepX,
    y: h - (p.pain / max) * h,
    pain: p.pain,
  }));

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const latest = points[points.length - 1].pain;
  const prev   = points.length > 1 ? points[points.length - 2].pain : latest;
  const trend  = latest > prev ? '↑' : latest < prev ? '↓' : '→';
  const trendColor = latest > prev ? 'var(--status-error)' : latest < prev ? 'var(--green-mid)' : 'var(--text-muted)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        <path d={pathD} fill="none" stroke="var(--gold-mid)" strokeWidth="1.5" />
        {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="2.5" fill="var(--gold-bright)" />)}
      </svg>
      <span style={{ color: trendColor, fontSize: '14px', fontWeight: 700 }}>{trend}</span>
      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{latest}/10</span>
    </div>
  );
}

export function RecoveryTrends({ onNavigate }) {
  const patients = getPatients();

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => onNavigate('clinical-dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={18} />
        </button>
        <h2 style={{ color: 'var(--green-mid)', fontSize: '18px', fontWeight: 700, margin: 0 }}>
          <TrendingUp size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Recovery Trends
        </h2>
      </div>

      {patients.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No patients found.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {patients.map(p => {
          const cis = getCheckInsByPatient(p.id);
          const submitted = cis.filter(c => c.submittedAt);
          const latest = submitted.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          return (
            <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => onNavigate('clinical-patient-detail', { patientId: p.id })} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, fontSize: '14px', padding: 0 }}>
                    {p.displayName}
                  </button>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{submitted.length} check-ins</span>
                </div>
                {latest?.riskLevel && <RiskBadge level={latest.riskLevel} />}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', minWidth: '60px' }}>Pain trend</span>
                <MiniPainChart checkIns={cis} />
              </div>
              {latest && (
                <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: '8px 0 0' }}>
                  Last check-in: {latest.date} · Score {latest.totalSeverityScore}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default RecoveryTrends;
