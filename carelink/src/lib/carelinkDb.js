// 4P3X CareLink Dashboard™ — Local-First Data Layer (carelinkDb)
// All CareLink patient/clinical data flows through this module.
// Extends the base SSOT pattern: uses a separate localStorage key so base state is preserved.

import { safeParseJson, safeStringifyJson } from '../utils/safeJson.js';
import { nowIso } from '../utils/date.js';
import { generateId } from '../utils/id.js';

const CL_KEY = '4p3x_carelink_v1';

// ─── Schema defaults ─────────────────────────────────────────────────

function createEmptyDb() {
  return {
    schemaVersion: 1,
    clinicians:       [],
    careTeamMembers:  [],
    patients:         [],
    clinicianPatients:[],
    dailyQuestions:   [],
    checkIns:         [],
    checkInAnswers:   [],
    symptomReports:   [],
    recoveryUpdates:  [],
    medicationNotes:  [],
    riskFlags:        [],
    careTeamNotes:    [],
    reports:          [],
    syncQueue:        [],
    appSettings: {
      backendMode:   'local',
      supabaseUrl:   '',
      supabaseAnonKey: '',
      syncEnabled:   false,
      lastSyncAt:    null,
      syncStatus:    'idle',
      clinicalAccessCode: 'CARE2024',
      patientAccessCode:  'PATIENT001',
      demoDataEnabled:    true,
    },
    audit: {
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  };
}

// ─── Persistence ─────────────────────────────────────────────────────

function loadDb() {
  try {
    const raw = localStorage.getItem(CL_KEY);
    if (!raw) return createEmptyDb();
    const { ok, data } = safeParseJson(raw);
    if (!ok || !data) return createEmptyDb();
    // Deep merge with defaults so new schema fields appear
    const base = createEmptyDb();
    return { ...base, ...data, appSettings: { ...base.appSettings, ...data.appSettings } };
  } catch {
    return createEmptyDb();
  }
}

function saveDb(db) {
  try {
    db.audit = { ...db.audit, updatedAt: nowIso() };
    const { ok, value } = safeStringifyJson(db);
    if (ok) localStorage.setItem(CL_KEY, value);
  } catch (e) {
    console.warn('[CareLink DB] Save failed:', e.message);
  }
}

// ─── Generic CRUD helpers ─────────────────────────────────────────────

function getAll(collection) {
  return loadDb()[collection] || [];
}

function getById(collection, id) {
  return (loadDb()[collection] || []).find(r => r.id === id) || null;
}

function create(collection, data) {
  const db = loadDb();
  const record = { id: generateId(), createdAt: nowIso(), updatedAt: nowIso(), ...data };
  db[collection] = [...(db[collection] || []), record];
  saveDb(db);
  return record;
}

function update(collection, id, updates) {
  const db = loadDb();
  let found = false;
  db[collection] = (db[collection] || []).map(r => {
    if (r.id === id) { found = true; return { ...r, ...updates, id, updatedAt: nowIso() }; }
    return r;
  });
  if (!found) return null;
  saveDb(db);
  return getById(collection, id);
}

function remove(collection, id) {
  const db = loadDb();
  const before = db[collection]?.length || 0;
  db[collection] = (db[collection] || []).filter(r => r.id !== id);
  saveDb(db);
  return db[collection].length < before;
}

function query(collection, filterFn) {
  return (loadDb()[collection] || []).filter(filterFn);
}

// ─── Settings ─────────────────────────────────────────────────────────

export function getSettings() {
  return loadDb().appSettings;
}

export function updateSettings(updates) {
  const db = loadDb();
  db.appSettings = { ...db.appSettings, ...updates };
  saveDb(db);
  return db.appSettings;
}


// ─── Demo Data Toggle Helpers ─────────────────────────────────────────

export function isDemoDataEnabled() {
  return getSettings().demoDataEnabled !== false; // default true
}

export function setDemoDataEnabled(enabled) {
  updateSettings({ demoDataEnabled: !!enabled });
  if (enabled) {
    seedFullDemoData();
  } else {
    clearDemoData();
  }
}

/**
 * Seed a rich demo data set:
 * - 2 demo patients
 * - 7 days of check-ins each
 * - Symptoms, recovery updates, medication notes
 * - Pre-seeded risk flags
 */
export function seedFullDemoData() {
  const db = loadDb();

  // Remove existing demo records first so we don't duplicate
  db.patients         = db.patients.filter(p => !p._demo);
  db.checkIns         = db.checkIns.filter(c => !c._demo);
  db.checkInAnswers   = db.checkInAnswers.filter(a => !a._demo);
  db.symptomReports   = db.symptomReports.filter(s => !s._demo);
  db.recoveryUpdates  = db.recoveryUpdates.filter(r => !r._demo);
  db.medicationNotes  = db.medicationNotes.filter(m => !m._demo);
  db.riskFlags        = db.riskFlags.filter(f => !f._demo);
  db.careTeamNotes    = db.careTeamNotes.filter(n => !n._demo);

  const today = new Date();
  const dayAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };
  const isoAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };

  // Demo patient 1 — recovering well
  const p1 = { id: 'demo-p1', displayName: 'Alex Morgan', patientReference: 'DEMO-001', recoveryType: 'Post-Op', startDate: dayAgo(14), status: 'active', accessCode: 'PATIENT001', lastCheckInAt: isoAgo(1), _demo: true };
  // Demo patient 2 — flagged/concerning
  const p2 = { id: 'demo-p2', displayName: 'Jordan Lee', patientReference: 'DEMO-002', recoveryType: 'Orthopaedic', startDate: dayAgo(21), status: 'active', accessCode: 'PATIENT002', lastCheckInAt: isoAgo(3), _demo: true };

  db.patients.push(p1, p2);

  // Check-ins for p1 — improving over 7 days (pain 7→3)
  const p1Pains   = [7, 6, 6, 5, 4, 4, 3];
  const p1Moods   = [2, 3, 3, 4, 4, 5, 5];
  const p1Risks   = ['medium','medium','medium','low','low','low','low'];
  const p1Scores  = [24, 20, 19, 14, 12, 10, 9];

  p1Pains.forEach((pain, i) => {
    const date = dayAgo(6 - i);
    const ciId = `demo-ci1-${i}`;
    db.checkIns.push({
      id: ciId, patientId: 'demo-p1', date,
      submittedAt: isoAgo(6 - i),
      riskLevel: p1Risks[i],
      totalSeverityScore: p1Scores[i],
      answers: [
        { questionId: 'q1', questionText: 'How would you rate your overall wellbeing?', answerValue: p1Moods[i], severityScore: 5 - p1Moods[i] },
        { questionId: 'q2', questionText: 'Pain level (0–10)?', answerValue: pain, severityScore: Math.ceil(pain / 2) },
        { questionId: 'q3', questionText: 'Any urgent concerns?', answerValue: i < 2 ? 'Mild soreness' : 'None', severityScore: i < 2 ? 2 : 0 },
        { questionId: 'q4', questionText: 'How is your sleep?', answerValue: i < 3 ? 'Disrupted' : 'Good', severityScore: i < 3 ? 2 : 0 },
        { questionId: 'q5', questionText: 'How is your appetite?', answerValue: i < 2 ? 'Poor' : 'Normal', severityScore: i < 2 ? 2 : 0 },
      ],
      _demo: true,
    });
  });

  // Check-ins for p2 — worsening (pain 4→8), missed last 3 days
  const p2Pains  = [4, 5, 6, 7, 8];
  const p2Risks  = ['low','medium','medium','high','urgent_review'];
  const p2Scores = [10, 15, 19, 25, 32];

  p2Pains.forEach((pain, i) => {
    const date = dayAgo(6 - i);
    if (6 - i < 3) return; // missed last 3 days
    const ciId = `demo-ci2-${i}`;
    db.checkIns.push({
      id: ciId, patientId: 'demo-p2', date,
      submittedAt: isoAgo(6 - i),
      riskLevel: p2Risks[i],
      totalSeverityScore: p2Scores[i],
      answers: [
        { questionId: 'q1', questionText: 'How would you rate your overall wellbeing?', answerValue: 5 - i, severityScore: i },
        { questionId: 'q2', questionText: 'Pain level (0–10)?', answerValue: pain, severityScore: Math.ceil(pain / 2) },
        { questionId: 'q3', questionText: 'Any urgent concerns?', answerValue: i >= 3 ? 'Sharp pain when moving' : 'None', severityScore: i >= 3 ? 5 : 0 },
        { questionId: 'q4', questionText: 'How is your sleep?', answerValue: i >= 2 ? 'Very disrupted' : 'Ok', severityScore: i >= 2 ? 3 : 0 },
        { questionId: 'q5', questionText: 'How is your appetite?', answerValue: i >= 3 ? 'None' : 'Reduced', severityScore: i >= 3 ? 3 : 1 },
      ],
      _demo: true,
    });
  });

  // Symptom reports
  db.symptomReports.push(
    { id: 'demo-s1', patientId: 'demo-p1', symptomTitle: 'Incision site soreness', symptomDescription: 'Mild soreness around the wound area', bodyArea: 'Abdomen', severity: 2, createdAt: isoAgo(6), _demo: true },
    { id: 'demo-s2', patientId: 'demo-p2', symptomTitle: 'Sharp knee pain', symptomDescription: 'Sudden sharp pain when attempting to bend knee beyond 30°', bodyArea: 'Left knee', severity: 5, createdAt: isoAgo(4), _demo: true },
    { id: 'demo-s3', patientId: 'demo-p2', symptomTitle: 'Swelling increased', symptomDescription: 'Noticeable increase in swelling around joint', bodyArea: 'Left knee', severity: 4, createdAt: isoAgo(3), _demo: true }
  );

  // Recovery updates
  db.recoveryUpdates.push(
    { id: 'demo-r1', patientId: 'demo-p1', recoveryStatus: 'progressing_well', mobilityStatus: 'Limited but improving', sleepStatus: 'Good', appetiteStatus: 'Good', painLevel: 3, notes: 'Feeling much better than last week.', createdAt: isoAgo(1), _demo: true },
    { id: 'demo-r2', patientId: 'demo-p2', recoveryStatus: 'needs_attention', mobilityStatus: 'Very limited', sleepStatus: 'Poor', appetiteStatus: 'Poor', painLevel: 8, notes: 'Struggling to complete physiotherapy exercises.', createdAt: isoAgo(3), _demo: true }
  );

  // Medication notes
  db.medicationNotes.push(
    { id: 'demo-m1', patientId: 'demo-p1', note: 'Taking prescribed anti-inflammatories as directed. No side effects noted.', hasConcern: false, createdAt: isoAgo(5), _demo: true },
    { id: 'demo-m2', patientId: 'demo-p2', note: 'Missed 2 doses of prescribed pain relief this week.', hasConcern: true, createdAt: isoAgo(3), _demo: true }
  );

  // Risk flags
  db.riskFlags.push(
    { id: 'demo-f1', patientId: 'demo-p2', riskLevel: 'urgent_review', reason: 'Pain trend severely worsening (4→8 over 5 days)', evidence: 'Check-in scores: 10, 15, 19, 25, 32', recommendedActionLabel: 'Contact patient immediately — clinical review required', reviewed: false, reviewNote: '', createdAt: isoAgo(0), checkInId: 'demo-ci2-4', _demo: true },
    { id: 'demo-f2', patientId: 'demo-p2', riskLevel: 'high', reason: 'Patient missed 3 consecutive check-ins', evidence: 'No submission on ' + [dayAgo(2), dayAgo(1), dayAgo(0)].join(', '), recommendedActionLabel: 'Follow up with patient or next-of-kin', reviewed: false, reviewNote: '', createdAt: isoAgo(0), _demo: true },
    { id: 'demo-f3', patientId: 'demo-p2', riskLevel: 'high', reason: 'Reported missed medication doses', evidence: 'Medication note flagged concern', recommendedActionLabel: 'Review medication compliance and reasons', reviewed: false, reviewNote: '', createdAt: isoAgo(3), _demo: true }
  );

  // Care team notes
  db.careTeamNotes.push(
    { id: 'demo-n1', patientId: 'demo-p1', text: 'Post-op review scheduled for next week. Patient progressing as expected.', createdBy: 'Dr. S. Patel', createdAt: isoAgo(4), _demo: true },
    { id: 'demo-n2', patientId: 'demo-p2', text: 'Attempted phone contact — no answer. Left voicemail. Will try again tomorrow.', createdBy: 'Nurse Williams', createdAt: isoAgo(2), _demo: true }
  );

  saveDb(db);
  return { patients: 2, checkIns: db.checkIns.filter(c => c._demo).length, flags: 3 };
}

/**
 * Remove all records tagged _demo: true
 * Leaves real patient data intact
 */
export function clearDemoData() {
  const db = loadDb();
  const tables = ['patients','checkIns','checkInAnswers','symptomReports','recoveryUpdates','medicationNotes','riskFlags','careTeamNotes','reports'];
  tables.forEach(t => {
    if (Array.isArray(db[t])) {
      db[t] = db[t].filter(r => !r._demo);
    }
  });
  saveDb(db);
}

// ─── Patients ─────────────────────────────────────────────────────────

export function getPatients()            { return getAll('patients'); }
export function getPatientById(id)       { return getById('patients', id); }
export function createPatient(data)      { return create('patients', { status: 'active', lastCheckInAt: null, ...data }); }
export function updatePatient(id, data)  { return update('patients', id, data); }
export function deletePatient(id)        { return remove('patients', id); }

// ─── Check-ins ────────────────────────────────────────────────────────

export function getCheckIns()                    { return getAll('checkIns'); }
export function getCheckInsByPatient(patientId)  { return query('checkIns', c => c.patientId === patientId); }
export function getCheckInById(id)               { return getById('checkIns', id); }
export function getTodayCheckIn(patientId) {
  const today = new Date().toISOString().slice(0, 10);
  return query('checkIns', c => c.patientId === patientId && c.date === today)[0] || null;
}

export function createCheckIn(data) {
  const ci = create('checkIns', {
    date: new Date().toISOString().slice(0, 10),
    answers: [],
    totalSeverityScore: 0,
    riskLevel: 'low',
    submittedAt: null,
    syncStatus: 'pending',
    ...data,
  });
  return ci;
}

export function submitCheckIn(checkInId, answers, totalSeverityScore, riskLevel) {
  const ci = update('checkIns', checkInId, {
    answers,
    totalSeverityScore,
    riskLevel,
    submittedAt: nowIso(),
    syncStatus: 'pending',
  });
  if (ci) {
    update('patients', ci.patientId, { lastCheckInAt: nowIso() });
    addToSyncQueue('checkIn', checkInId);
  }
  return ci;
}

// ─── Check-in Answers ─────────────────────────────────────────────────

export function createCheckInAnswer(data) {
  return create('checkInAnswers', { syncStatus: 'pending', ...data });
}

export function getAnswersByCheckIn(checkInId) {
  return query('checkInAnswers', a => a.checkInId === checkInId);
}

// ─── Symptom Reports ──────────────────────────────────────────────────

export function getSymptomReports()                      { return getAll('symptomReports'); }
export function getSymptomsByPatient(patientId)          { return query('symptomReports', s => s.patientId === patientId); }
export function createSymptomReport(data) {
  const r = create('symptomReports', { syncStatus: 'pending', ...data });
  addToSyncQueue('symptomReport', r.id);
  return r;
}
export function updateSymptomReport(id, data)            { return update('symptomReports', id, data); }

// ─── Recovery Updates ─────────────────────────────────────────────────

export function getRecoveryUpdates()                     { return getAll('recoveryUpdates'); }
export function getRecoveryByPatient(patientId)          { return query('recoveryUpdates', r => r.patientId === patientId); }
export function createRecoveryUpdate(data) {
  const r = create('recoveryUpdates', { syncStatus: 'pending', ...data });
  addToSyncQueue('recoveryUpdate', r.id);
  return r;
}

// ─── Medication Notes ─────────────────────────────────────────────────

export function getMedicationNotes()                     { return getAll('medicationNotes'); }
export function getMedsByPatient(patientId)              { return query('medicationNotes', m => m.patientId === patientId); }
export function createMedicationNote(data) {
  const r = create('medicationNotes', { syncStatus: 'pending', ...data });
  addToSyncQueue('medicationNote', r.id);
  return r;
}

// ─── Risk Flags ───────────────────────────────────────────────────────

export function getRiskFlags()                           { return getAll('riskFlags'); }
export function getRiskFlagsByPatient(patientId)         { return query('riskFlags', f => f.patientId === patientId); }
export function getUnreviewedFlags()                     { return query('riskFlags', f => !f.reviewed); }
export function createRiskFlag(data) {
  return create('riskFlags', { reviewed: false, reviewedAt: null, ...data });
}
export function markFlagReviewed(id, note) {
  return update('riskFlags', id, { reviewed: true, reviewedAt: nowIso(), reviewNote: note || '' });
}

// ─── Care Team Notes ──────────────────────────────────────────────────

export function getCareTeamNotes()                       { return getAll('careTeamNotes'); }
export function getNotesByPatient(patientId)             { return query('careTeamNotes', n => n.patientId === patientId); }
export function createCareTeamNote(data)                 { return create('careTeamNotes', data); }
export function updateCareTeamNote(id, data)             { return update('careTeamNotes', id, data); }
export function deleteCareTeamNote(id)                   { return remove('careTeamNotes', id); }

// ─── Clinicians ───────────────────────────────────────────────────────

export function getClinicians()                          { return getAll('clinicians'); }
export function createClinician(data)                    { return create('clinicians', data); }
export function updateClinician(id, data)                { return update('clinicians', id, data); }

// ─── Sync Queue ───────────────────────────────────────────────────────

export function getSyncQueue()                           { return getAll('syncQueue'); }
export function addToSyncQueue(type, recordId) {
  return create('syncQueue', { type, recordId, status: 'pending', attempts: 0 });
}
export function markSyncComplete(queueId) {
  return update('syncQueue', queueId, { status: 'synced', syncedAt: nowIso() });
}
export function clearSyncQueue() {
  const db = loadDb();
  db.syncQueue = db.syncQueue.filter(q => q.status !== 'synced');
  saveDb(db);
}

// ─── Export / Import ──────────────────────────────────────────────────

export function exportCareDb() {
  return loadDb();
}

export function importCareDb(data) {
  if (!data || typeof data !== 'object') return { ok: false, error: 'Invalid data' };
  const merged = { ...createEmptyDb(), ...data };
  saveDb(merged);
  return { ok: true };
}

export function resetCareDb() {
  const fresh = createEmptyDb();
  saveDb(fresh);
  return fresh;
}

// ─── Seed Demo Patient (for first-run UX) ─────────────────────────────

export function seedDemoPatientIfEmpty() {
  if (!isDemoDataEnabled()) return null;
  const demoPatients = getPatients().filter(p => p._demo);
  if (demoPatients.length > 0) return null; // already seeded
  return seedFullDemoData();
}
