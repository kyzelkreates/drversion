import React, { useState } from 'react';
import { ChevronLeft, FileText, Download, Printer } from 'lucide-react';
import {
  getPatients, getPatientById,
  getCheckInsByPatient, getSymptomsByPatient,
  getRecoveryByPatient, getMedsByPatient, getRiskFlagsByPatient
} from '../../lib/carelinkDb.js';
import APP_BRANDING from '../../config/appBranding.js';
import SAFETY_TEXT from '../../config/medicalSafetyText.js';
import { RiskBadge } from '../shared/RiskBadge.jsx';

export function ExportReport({ patientId: propPatientId, onNavigate }) {
  const [selectedId, setSelectedId] = useState(propPatientId || '');
  const [exported, setExported] = useState(false);
  const patients = getPatients();

  const patient = selectedId ? getPatientById(selectedId) : null;

  function buildReport(p) {
    return {
      reportGeneratedAt: new Date().toISOString(),
      product: APP_BRANDING.productName,
      poweredBy: APP_BRANDING.poweredBy,
      disclaimer: SAFETY_TEXT.clinicalNotice,
      patient: {
        id: p.id,
        displayName: p.displayName,
        patientReference: p.patientReference,
        recoveryType: p.recoveryType,
        startDate: p.startDate,
        status: p.status,
      },
      checkIns:    getCheckInsByPatient(p.id),
      symptoms:    getSymptomsByPatient(p.id),
      recovery:    getRecoveryByPatient(p.id),
      medication:  getMedsByPatient(p.id),
      riskFlags:   getRiskFlagsByPatient(p.id),
    };
  }

  function handleExportJson() {
    if (!patient) return;
    const report = buildReport(patient);
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareLink-Report-${patient.patientReference}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
  }

  function handlePrint() {
    if (!patient) return;
    window.print();
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => onNavigate('clinical-dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={18} />
        </button>
        <h2 style={{ color: 'var(--purple-bright)', fontSize: '18px', fontWeight: 700, margin: 0 }}>
          <FileText size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Export Patient Report
        </h2>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>Select Patient</label>
        <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setExported(false); }} style={{
          width: '100%', padding: '11px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', marginBottom: '20px',
        }}>
          <option value="">— Choose patient —</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.displayName} ({p.patientReference})</option>)}
        </select>

        {patient && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                ['Patient', patient.displayName],
                ['Reference', patient.patientReference],
                ['Recovery Type', patient.recoveryType],
                ['Check-ins', getCheckInsByPatient(patient.id).filter(c => c.submittedAt).length],
                ['Symptoms', getSymptomsByPatient(patient.id).length],
                ['Risk Flags', getRiskFlagsByPatient(patient.id).length],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: '0 0 2px' }}>{k}</p>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleExportJson} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px',
                background: 'linear-gradient(135deg, var(--purple-dim), var(--purple-bright))',
                border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '13px',
              }}>
                <Download size={15} /> Export as JSON
              </button>
              <button onClick={handlePrint} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '13px',
              }}>
                <Printer size={15} /> Print View
              </button>
            </div>

            {exported && (
              <p style={{ color: 'var(--green-mid)', fontSize: '12px', marginTop: '12px' }}>✓ Report exported successfully.</p>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: '14px', background: 'rgba(176,96,255,0.06)', border: '1px solid var(--border-purple)', borderRadius: '10px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0, lineHeight: 1.5 }}>{SAFETY_TEXT.clinicalNotice}</p>
      </div>
    </div>
  );
}
export default ExportReport;
