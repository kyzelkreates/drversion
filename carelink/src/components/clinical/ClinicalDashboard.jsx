import React, { useState } from 'react';
import {
  Users, AlertTriangle, Clock, CheckCircle, TrendingUp,
  Flag, FileText, Settings, ChevronRight, Monitor, RefreshCw
} from 'lucide-react';
import {
  getPatients, getCheckIns, getRiskFlags, getUnreviewedFlags,
  detectMissedCheckIn
} from '../../lib/carelinkDb.js';
import { detectMissedCheckIn as detectMissed } from '../../lib/correlationEngine.js';
import { RiskBadge } from '../shared/RiskBadge.jsx';
import { SafetyNotice } from '../shared/SafetyNotice.jsx';
import APP_BRANDING from '../../config/appBranding.js';

export function ClinicalDashboard({ clinician, onNavigate }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const patients     = getPatients();
  const allCheckIns  = getCheckIns();
  const unreviewedFlags = getUnreviewedFlags();
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCheckIns = allCheckIns.filter(ci => ci.date === todayStr && ci.submittedAt);

  // Missed check-ins: patients who haven't checked in today
  const missedToday = patients.filter(p => {
    const ci = allCheckIns.find(c => c.patientId === p.id && c.date === todayStr && c.submittedAt);
    return !ci && p.status === 'active';
  });

  // High/urgent flags
  const urgentFlags = unreviewedFlags.filter(f => f.riskLevel === 'urgent_review' || f.riskLevel === 'high');

  const stats = [
    { label: 'Total Patients',     value: patients.length,          icon: Users,         color: 'var(--silver-bright)', route: 'clinical-patients' },
    { label: 'Check-ins Today',    value: todayCheckIns.length,     icon: CheckCircle,   color: 'var(--green-mid)',     route: 'clinical-patients' },
    { label: 'Missed Today',       value: missedToday.length,       icon: Clock,         color: 'var(--gold-bright)',   route: 'clinical-missed'   },
    { label: 'Flags for Review',   value: unreviewedFlags.length,   icon: Flag,          color: unreviewedFlags.length > 0 ? 'var(--status-error)' : 'var(--text-muted)', route: 'clinical-flags' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Monitor size={20} color='var(--silver-bright)' />
            <h1 style={{ color: 'var(--silver-bright)', fontSize: '20px', fontWeight: 700, margin: 0 }}>
              Clinical Monitoring Dashboard
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0' }}>{APP_BRANDING.poweredBy}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setRefreshKey(k => k + 1)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={() => onNavigate('clinical-settings')} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <Settings size={13} /> Settings
          </button>
        </div>
      </div>

      <SafetyNotice variant="clinical" compact dismissible />

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {stats.map(s => (
          <button key={s.label} onClick={() => onNavigate(s.route)} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '14px',
            padding: '20px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <s.icon size={20} color={s.color} />
              <ChevronRight size={14} color='var(--text-muted)' />
            </div>
            <p style={{ color: s.color, fontSize: '28px', fontWeight: 700, margin: '0 0 4px' }}>{s.value}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* Urgent flags */}
      {urgentFlags.length > 0 && (
        <div style={{ background: 'rgba(255,68,85,0.08)', border: '1px solid rgba(255,68,85,0.3)', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color='var(--status-error)' />
              <span style={{ color: 'var(--status-error)', fontWeight: 700, fontSize: '14px' }}>
                {urgentFlags.length} flag{urgentFlags.length > 1 ? 's' : ''} requiring attention
              </span>
            </div>
            <button onClick={() => onNavigate('clinical-flags')} style={{ background: 'none', border: '1px solid rgba(255,68,85,0.4)', borderRadius: '6px', padding: '4px 12px', color: 'var(--status-error)', cursor: 'pointer', fontSize: '12px' }}>
              Review All
            </button>
          </div>
          {urgentFlags.slice(0, 3).map(f => {
            const p = patients.find(pt => pt.id === f.patientId);
            return (
              <div key={f.id} onClick={() => onNavigate('clinical-patient-detail', { patientId: f.patientId })} style={{ padding: '10px', background: 'rgba(255,68,85,0.05)', borderRadius: '8px', marginBottom: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <RiskBadge level={f.riskLevel} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, margin: '0 0 2px' }}>
                    {p?.displayName || 'Unknown Patient'}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>{f.reason}</p>
                </div>
                <ChevronRight size={14} color='var(--text-muted)' />
              </div>
            );
          })}
        </div>
      )}

      {/* Quick nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
        {[
          { label: 'Patient List',     icon: Users,        route: 'clinical-patients',   color: 'var(--silver-bright)' },
          { label: 'Risk Flags',       icon: Flag,         route: 'clinical-flags',      color: 'var(--status-error)' },
          { label: 'Missed Check-Ins', icon: Clock,        route: 'clinical-missed',     color: 'var(--gold-bright)' },
          { label: 'Recovery Trends',  icon: TrendingUp,   route: 'clinical-trends',     color: 'var(--green-mid)' },
          { label: 'Export Report',    icon: FileText,     route: 'clinical-export',     color: 'var(--purple-bright)' },
          { label: 'Backend Settings', icon: Settings,     route: 'clinical-settings',   color: 'var(--text-muted)' },
        ].map(t => (
          <button key={t.route} onClick={() => onNavigate(t.route)} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px',
            padding: '14px', display: 'flex', alignItems: 'center', gap: '10px',
            cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
          }}>
            <t.icon size={16} color={t.color} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default ClinicalDashboard;
