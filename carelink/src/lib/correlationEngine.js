// 4P3X CareLink Dashboard™ — Correlation & Risk Flag Engine
// Rule-based only. Does NOT diagnose, prescribe, or make clinical decisions.
// Output risk levels: low | medium | high | urgent_review

import { RISK_RULES } from './riskRules.js';
import { nowIso } from '../utils/date.js';

// Allowed recommended action labels (forbidden: diagnose, prescribe, guarantee, etc.)
export const ALLOWED_ACTIONS = [
  'Review patient update',
  'Contact patient if clinically appropriate',
  'Check medication concern',
  'Review worsening symptoms',
  'Missed check-in follow-up',
  'Urgent clinical review may be required',
];

/**
 * Run correlation on a submitted check-in + answers.
 * Returns array of risk flag objects (not yet persisted — caller persists them).
 */
export function correlateCheckIn({ patient, checkIn, answers, recentCheckIns = [] }) {
  const flags = [];

  for (const rule of RISK_RULES) {
    try {
      const result = rule.evaluate({ patient, checkIn, answers, recentCheckIns });
      if (result && result.triggered) {
        flags.push({
          patientId:              patient.id,
          sourceType:             'checkIn',
          sourceId:               checkIn.id,
          riskLevel:              result.riskLevel,
          reason:                 result.reason,
          evidence:               result.evidence || '',
          recommendedActionLabel: result.recommendedActionLabel,
          reviewed:               false,
          reviewedAt:             null,
          createdAt:              nowIso(),
        });
      }
    } catch (e) {
      console.warn('[CorrelationEngine] Rule error:', rule.id, e.message);
    }
  }

  // Deduplicate: don't add same rule+patient same day
  return flags;
}

/**
 * Run correlation on a symptom report.
 */
export function correlateSymptomReport({ patient, symptomReport }) {
  const flags = [];
  const sev = symptomReport.severity || 0;

  if (sev >= 4) {
    flags.push({
      patientId:              patient.id,
      sourceType:             'symptomReport',
      sourceId:               symptomReport.id,
      riskLevel:              sev >= 5 ? 'urgent_review' : 'high',
      reason:                 'High severity symptom reported by patient.',
      evidence:               `Symptom: "${symptomReport.symptomTitle}" — severity ${sev}/5`,
      recommendedActionLabel: 'Review worsening symptoms',
      reviewed:               false,
      reviewedAt:             null,
      createdAt:              nowIso(),
    });
  } else if (sev >= 3) {
    flags.push({
      patientId:              patient.id,
      sourceType:             'symptomReport',
      sourceId:               symptomReport.id,
      riskLevel:              'medium',
      reason:                 'Moderate symptom reported.',
      evidence:               `Symptom: "${symptomReport.symptomTitle}" — severity ${sev}/5`,
      recommendedActionLabel: 'Review patient update',
      reviewed:               false,
      reviewedAt:             null,
      createdAt:              nowIso(),
    });
  }

  return flags;
}

/**
 * Detect missed check-ins for a patient.
 * Returns a flag if patient hasn't checked in for 1+ days.
 */
export function detectMissedCheckIn({ patient, lastCheckInAt }) {
  if (!lastCheckInAt) return null;
  const last = new Date(lastCheckInAt);
  const now  = new Date();
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  if (diffDays >= 1) {
    return {
      patientId:              patient.id,
      sourceType:             'missedCheckIn',
      sourceId:               null,
      riskLevel:              diffDays >= 3 ? 'high' : 'medium',
      reason:                 `Patient has missed ${diffDays} day(s) of check-ins.`,
      evidence:               `Last check-in: ${lastCheckInAt}`,
      recommendedActionLabel: 'Missed check-in follow-up',
      reviewed:               false,
      reviewedAt:             null,
      createdAt:              nowIso(),
    };
  }
  return null;
}

/**
 * Calculate overall risk level from a set of answers.
 */
export function calculateCheckInRisk(answers) {
  let total = 0;
  let hasUrgent = false;

  for (const a of answers) {
    const score = Number(a.severityScore) || 0;
    total += score;
    if (a.answerType === 'urgent_concern' && a.answerValue && a.answerValue !== 'none') {
      hasUrgent = true;
    }
  }

  if (hasUrgent || total >= 25) return { riskLevel: 'urgent_review', totalSeverityScore: total };
  if (total >= 15) return { riskLevel: 'high', totalSeverityScore: total };
  if (total >= 8)  return { riskLevel: 'medium', totalSeverityScore: total };
  return { riskLevel: 'low', totalSeverityScore: total };
}
