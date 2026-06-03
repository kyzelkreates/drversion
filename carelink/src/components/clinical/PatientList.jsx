import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, UserPlus, Users } from 'lucide-react';
import { getPatients, getCheckIns, createPatient, seedDemoPatientIfEmpty } from '../../lib/carelinkDb.js';
import { RiskBadge } from '../shared/RiskBadge.jsx';
import { StatusBadge } from '../shared/StatusBadge.jsx';

export function PatientList({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newPatient, setNewPatient] = useState({ displayName: '', patientReference: '', recoveryType: '', accessCode: '' });
  const [refresh, setRefresh] = useState(0);

  seedDemoPatientIfEmpty();
  const patients  = getPatients();
  const checkIns  = getCheckIns();
  const todayStr  = new Date().toISOString().slice(0, 10);

  const filtered = patients.filter(p =>
    p.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    p.patientReference?.toLowerCase().includes(search.toLowerCase())
  );

  function getLatestRisk(patientId) {
    const recent = checkIns
      .filter(c => c.patientId === patientId && c.submittedAt)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    return recent[0]?.riskLevel || null;
  }

  function checkedInToday(patientId) {
    return checkIns.some(c => c.patientId === patientId && c.date === todayStr && c.submittedAt);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!newPatient.displayName.trim()) return;
    createPatient({
      displayName:       newPatient.displayName.trim(),
      patientReference:  newPatient.patientReference.trim() || `REF-${Date.now()}`,
      recoveryType:      newPatient.recoveryType.trim() || 'General',
      accessCode:        newPatient.accessCode.trim() || `PAT-${Date.now()}`,
      status:            'active',
      startDate:         new Date().toISOString().slice(0, 10),
    });
    setNewPatient({ displayName: '', patientReference: '', recoveryType: '', accessCode: '' });
    setShowAdd(false);
    setRefresh(r => r + 1);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => onNavigate('clinical-dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
          <ChevronLeft size={16} />
        </button>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700, margin: 0, flex: 1 }}>
          <Users size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Patient List
        </h2>
        <button onClick={() => setShowAdd(s => !s)} style={{ background: 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))', border: 'none', borderRadius: '8px', padding: '8px 14px', color: '#0a0a0a', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UserPlus size={13} /> Add Patient
        </button>
      </div>

      {showAdd && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--gold-bright)', margin: '0 0 16px', fontSize: '14px' }}>Add New Patient</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[['displayName', 'Full Name *'], ['patientReference', 'Patient Reference'], ['recoveryType', 'Recovery Type'], ['accessCode', 'Access Code']].map(([field, label]) => (
              <div key={field}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>{label}</label>
                <input value={newPatient[field]} onChange={e => setNewPatient(p => ({ ...p, [field]: e.target.value }))} style={{
                  width: '100%', padding: '9px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                }} />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
              <button type="submit" style={{ padding: '8px 16px', background: 'linear-gradient(135deg, var(--gold-mid), var(--gold-bright))', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>Add Patient</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients…" style={{
          width: '100%', padding: '10px 10px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>No patients found.</p>}
        {filtered.map(p => {
          const risk = getLatestRisk(p.id);
          const todayCI = checkedInToday(p.id);
          return (
            <button key={p.id} onClick={() => onNavigate('clinical-patient-detail', { patientId: p.id })} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px',
              padding: '16px', display: 'flex', alignItems: 'center', gap: '14px',
              cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--silver-dim), var(--silver-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#0a0a0a', fontWeight: 700, fontSize: '16px' }}>
                {p.displayName?.[0] || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}>{p.displayName}</span>
                  <StatusBadge status={p.status || 'active'} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>
                  {p.patientReference} · {p.recoveryType} · {todayCI ? '✓ Checked in today' : '⏳ No check-in today'}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                {risk && <RiskBadge level={risk} />}
                <ChevronRight size={14} color='var(--text-muted)' />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default PatientList;
