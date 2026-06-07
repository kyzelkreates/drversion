// 4P3X CareLink Dashboard™ — Page Entry Point
// Routes: Patient Recovery PWA + Clinical Monitoring Dashboard

import React, { useState } from 'react';
import { ShieldCheck, Monitor, ChevronRight, LogOut } from 'lucide-react';

import { PatientAccess }     from '../components/patient/PatientAccess.jsx';
import { PatientHome }       from '../components/patient/PatientHome.jsx';
import { DailyCheckIn }      from '../components/patient/DailyCheckIn.jsx';
import { SymptomsUpload }    from '../components/patient/SymptomsUpload.jsx';
import { RecoveryStatus }    from '../components/patient/RecoveryStatus.jsx';
import { MedicationNotes }   from '../components/patient/MedicationNotes.jsx';
import { PatientTimeline }   from '../components/patient/PatientTimeline.jsx';

import { ClinicalAccess }    from '../components/clinical/ClinicalAccess.jsx';
import { ClinicalDashboard } from '../components/clinical/ClinicalDashboard.jsx';
import { PatientList }       from '../components/clinical/PatientList.jsx';
import { PatientDetail }     from '../components/clinical/PatientDetail.jsx';
import { RiskFlagsPanel }    from '../components/clinical/RiskFlagsPanel.jsx';
import { MissedCheckIns }    from '../components/clinical/MissedCheckIns.jsx';
import { RecoveryTrends }    from '../components/clinical/RecoveryTrends.jsx';
import { ExportReport }      from '../components/clinical/ExportReport.jsx';
import { BackendSettings }   from '../components/clinical/BackendSettings.jsx';

import { OfflineBanner }     from '../components/shared/OfflineBanner.jsx';
import APP_BRANDING          from '../config/appBranding.js';
import { PwaSharePanel }      from '../components/shared/PwaSharePanel.jsx';
import { seedDemoPatientIfEmpty } from '../lib/carelinkDb.js';

try { seedDemoPatientIfEmpty(); } catch(e) { console.warn("[CareLink] demo seed failed:", e); }

// ─── Mode Selector ────────────────────────────────────────────────────

function ModeSelector({ onSelectPatient, onSelectClinical }) {
  const [showShare, setShowShare] = React.useState(false);
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ color: 'var(--gold-bright)', fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>
            {APP_BRANDING.productName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 4px' }}>{APP_BRANDING.subtitle}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{APP_BRANDING.poweredBy}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button onClick={onSelectPatient} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-gold)',
            borderRadius: '16px', padding: '22px', display: 'flex', alignItems: 'center',
            gap: '16px', cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--gold-dim), var(--gold-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={26} color='#0a0a0a' />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'var(--gold-bright)', fontWeight: 700, fontSize: '16px', margin: '0 0 4px' }}>Patient Recovery App</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>Daily check-ins, symptom tracking, recovery updates</p>
            </div>
            <ChevronRight size={18} color='var(--gold-bright)' />
          </button>

          <button onClick={onSelectClinical} style={{
            background: 'var(--bg-card)', border: '1px solid rgba(160,160,160,0.3)',
            borderRadius: '16px', padding: '22px', display: 'flex', alignItems: 'center',
            gap: '16px', cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--silver-dim), var(--silver-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Monitor size={26} color='#0a0a0a' />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'var(--silver-bright)', fontWeight: 700, fontSize: '16px', margin: '0 0 4px' }}>Clinical Monitoring Dashboard</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>Patient overview, risk flags, trends, reports</p>
            </div>
            <ChevronRight size={18} color='var(--silver-bright)' />
          </button>
        </div>

        {/* Install & Share button */}
        <button onClick={() => setShowShare(true)} style={{
          marginTop: '18px', width: '100%', padding: '13px',
          background: 'transparent', border: '1px solid var(--border-gold)',
          borderRadius: '12px', color: 'var(--gold-bright)', fontWeight: 700,
          fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '18px' }}>📲</span> Install App &amp; Share with Patients
        </button>
      </div>

      {showShare && <PwaSharePanel onClose={() => setShowShare(false)} />}
    </div>
  );
}

// ─── Patient Shell ─────────────────────────────────────────────────────

function PatientShell() {
  const [patient, setPatient] = useState(null);
  const [route, setRoute]     = useState('patient-home');
  const [params, setParams]   = useState({});
  const [shareOpen, setShareOpen] = useState(false);

  function navigate(r, p) { setRoute(r); setParams(p || {}); window.scrollTo(0, 0); }
  if (!patient) return <PatientAccess onLogin={setPatient} />;
  const props = { patient, onNavigate: navigate, ...params };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg-topbar)', borderBottom: '1px solid var(--border-subtle)', padding: '0 16px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={18} color='var(--gold-bright)' />
          <span style={{ color: 'var(--gold-bright)', fontWeight: 700, fontSize: '14px' }}>Patient Recovery</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{patient.displayName}</span>
          <button onClick={() => setShareOpen(true)} style={{ background: 'none', border: '1px solid var(--border-gold)', borderRadius: '6px', color: 'var(--gold-bright)', cursor: 'pointer', padding: '3px 8px', fontSize: '11px', fontWeight: 700 }} title="Install &amp; Share">📲</button>
          <button onClick={() => setPatient(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} title="Log out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
      <OfflineBanner />
      {shareOpen && <PwaSharePanel onClose={() => setShareOpen(false)} />}
      <div style={{ paddingBottom: '32px' }}>
        {route === 'patient-home'       && <PatientHome       {...props} />}
        {route === 'patient-checkin'    && <DailyCheckIn      {...props} />}
        {route === 'patient-symptoms'   && <SymptomsUpload    {...props} />}
        {route === 'patient-recovery'   && <RecoveryStatus    {...props} />}
        {route === 'patient-medication' && <MedicationNotes   {...props} />}
        {route === 'patient-timeline'   && <PatientTimeline   {...props} />}
      </div>
    </div>
  );
}

// ─── Clinical Shell ───────────────────────────────────────────────────

function ClinicalShell() {
  const [clinician, setClinician] = useState(null);
  const [route, setRoute]         = useState('clinical-dashboard');
  const [params, setParams]       = useState({});

  function navigate(r, p) { setRoute(r); setParams(p || {}); window.scrollTo(0, 0); }
  if (!clinician) return <ClinicalAccess onLogin={setClinician} />;
  const props = { clinician, onNavigate: navigate, ...params };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg-topbar)', borderBottom: '1px solid var(--border-subtle)', padding: '0 20px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Monitor size={16} color='var(--silver-bright)' />
          <span style={{ color: 'var(--silver-bright)', fontWeight: 700, fontSize: '14px' }}>Clinical Monitoring Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{clinician.name}</span>
          <button onClick={() => setClinician(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} title="Log out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
      <div style={{ paddingBottom: '40px' }}>
        {route === 'clinical-dashboard'      && <ClinicalDashboard {...props} />}
        {route === 'clinical-patients'       && <PatientList       {...props} />}
        {route === 'clinical-patient-detail' && <PatientDetail     {...props} />}
        {route === 'clinical-flags'          && <RiskFlagsPanel    {...props} />}
        {route === 'clinical-missed'         && <MissedCheckIns    {...props} />}
        {route === 'clinical-trends'         && <RecoveryTrends    {...props} />}
        {route === 'clinical-export'         && <ExportReport      {...props} />}
        {route === 'clinical-settings'       && <BackendSettings   {...props} />}
      </div>
    </div>
  );
}

// ─── CareLink Page Export ─────────────────────────────────────────────

export function CareLink({ initialMode }) {
  const [mode, setMode] = useState(initialMode || null);

  if (!mode)               return <ModeSelector onSelectPatient={() => setMode('patient')} onSelectClinical={() => setMode('clinical')} />;
  if (mode === 'patient')  return <PatientShell />;
  if (mode === 'clinical') return <ClinicalShell />;
  return null;
}

export default CareLink;
