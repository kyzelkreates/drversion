import React, { useState } from 'react';
import { ChevronLeft, Flag, Check, Filter } from 'lucide-react';
import { getRiskFlags, getPatients, markFlagReviewed } from '../../lib/carelinkDb.js';
import { RiskBadge } from '../shared/RiskBadge.jsx';

export function RiskFlagsPanel({ onNavigate }) {
  const [filter, setFilter] = useState('unreviewed');
  const [refresh, setRefresh] = useState(0);

  const flags    = getRiskFlags().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const patients = getPatients();

  const filtered = flags.filter(f => {
    if (filter === 'unreviewed') return !f.reviewed;
    if (filter === 'urgent')     return f.riskLevel === 'urgent_review';
    if (filter === 'high')       return f.riskLevel === 'high' || f.riskLevel === 'urgent_review';
    return true;
  });

  function handleReview(id) {
    markFlagReviewed(id, '');
    setRefresh(r => r + 1);
  }

  const unreviewed = flags.filter(f => !f.reviewed).length;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => onNavigate('clinical-dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={18} />
        </button>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700, margin: 0, flex: 1 }}>
          <Flag size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Risk Flags
        </h2>
        {unreviewed > 0 && <span style={{ background: 'var(--status-error)', color: '#fff', borderRadius: '10px', padding: '3px 10px', fontSize: '12px', fontWeight: 700 }}>{unreviewed} unreviewed</span>}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[['unreviewed', 'Unreviewed'], ['urgent', 'Urgent'], ['high', 'High+'], ['all', 'All']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
            background: filter === val ? 'rgba(245,200,66,0.15)' : 'var(--bg-card)',
            border: `1px solid ${filter === val ? 'var(--border-gold)' : 'var(--border-card)'}`,
            color: filter === val ? 'var(--gold-bright)' : 'var(--text-muted)', cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.length === 0 && <p style={{ color: 'var(--green-mid)', textAlign: 'center', padding: '32px', fontSize: '14px' }}>✓ No flags in this view.</p>}
        {filtered.map(f => {
          const p = patients.find(pt => pt.id === f.patientId);
          return (
            <div key={f.id} style={{ background: 'var(--bg-card)', border: `1px solid ${f.reviewed ? 'var(--border-card)' : f.riskLevel === 'urgent_review' ? 'rgba(255,68,85,0.4)' : 'rgba(255,100,68,0.25)'}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <RiskBadge level={f.riskLevel} />
                    <button onClick={() => onNavigate('clinical-patient-detail', { patientId: f.patientId })} style={{ background: 'none', border: 'none', color: 'var(--silver-bright)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: 0 }}>
                      {p?.displayName || 'Unknown Patient'}
                    </button>
                    {f.reviewed && <span style={{ color: 'var(--green-mid)', fontSize: '11px' }}>✓ Reviewed</span>}
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>{f.reason}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: '0 0 4px', fontStyle: 'italic' }}>{f.evidence}</p>
                  <p style={{ color: 'var(--purple-bright)', fontSize: '11px', margin: 0 }}>→ {f.recommendedActionLabel}</p>
                </div>
                {!f.reviewed && (
                  <button onClick={() => handleReview(f.id)} style={{ background: 'rgba(0,204,106,0.1)', border: '1px solid var(--border-green)', borderRadius: '8px', padding: '7px 14px', color: 'var(--green-mid)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={13} /> Reviewed
                  </button>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '10px', margin: '8px 0 0' }}>{new Date(f.createdAt).toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default RiskFlagsPanel;
