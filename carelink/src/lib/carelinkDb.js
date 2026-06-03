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
  const patients = getPatients();
  if (patients.length > 0) return null;
  return createPatient({
    displayName: 'Demo Patient',
    patientReference: 'DEMO-001',
    assignedClinicianId: null,
    recoveryType: 'General',
    startDate: new Date().toISOString().slice(0, 10),
    status: 'active',
    accessCode: 'PATIENT001',
  });
}
