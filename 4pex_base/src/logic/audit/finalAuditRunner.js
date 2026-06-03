// 4P3X Final Audit Runner — Run 8
import { auditRoutes }              from './routeAudit.js';
import { auditModuleRegistry }      from './moduleRegistryAudit.js';
import { auditSsotIntegrity }       from './ssotAudit.js';
import { auditStateSchema }         from './stateSchemaAudit.js';
import { auditLocalStorageSafety }  from './localStorageAudit.js';
import { auditExportImportSafety }  from './exportImportAudit.js';
import { auditSecretExposure }      from './secretExposureAudit.js';
import { auditNoDemoLanguage }      from './noDemoLanguageAudit.js';
import { auditAgentSafety }         from './agentSafetyAudit.js';
import { auditTransformationSystem } from './transformationAudit.js';
import { auditPromptGenerator }     from './promptGeneratorAudit.js';
import { auditWorkspaces }          from './workspaceAudit.js';
import { auditExportHandoff }       from './exportHandoffAudit.js';
import { auditDashboardPwaStructure } from './dashboardPwaAudit.js';
import { auditPwaReadiness }        from './pwaAudit.js';
import { auditBuildReadiness }      from './buildReadinessAudit.js';
import { runProductionHardeningChecks, applySafeHardeningFlags } from './productionHardening.js';
import { getReadinessLevel }        from '../../config/finalReadinessRules.js';
import { generateId }               from '../../utils/id.js';

export function runFinalAudit(state) {
  const startedAt = new Date().toISOString();

  const categoryResults = {
    routes:          auditRoutes(state),
    moduleRegistry:  auditModuleRegistry(state),
    ssot:            auditSsotIntegrity(state),
    stateSchema:     auditStateSchema(state),
    localStorage:    auditLocalStorageSafety(state),
    exportImport:    auditExportImportSafety(state),
    secretExposure:  auditSecretExposure(state),
    noDemoLanguage:  auditNoDemoLanguage(state),
    agentSafety:     auditAgentSafety(state),
    transformation:  auditTransformationSystem(state),
    promptGenerator: auditPromptGenerator(state),
    workspaces:      auditWorkspaces(state),
    exportHandoff:   auditExportHandoff(state),
    dashboardPwa:    auditDashboardPwaStructure(state),
    pwa:             auditPwaReadiness(state),
    buildReadiness:  auditBuildReadiness(state),
  };

  const overallScore   = calculateOverallAuditScore(categoryResults);
  const allBlockers    = collectBlockers(categoryResults);
  const allWarnings    = collectWarnings(categoryResults);
  const allPassed      = collectPassed(categoryResults);
  const allFailed      = collectFailed(categoryResults);
  const readinessLevel = determineReadinessLevel(overallScore, allBlockers, allWarnings);
  const findings       = collectAuditFindings(categoryResults);
  const hardeningResult = runProductionHardeningChecks(state);
  const hardeningFlags  = applySafeHardeningFlags(state);

  const auditRun = createAuditRun({
    categoryResults,
    overallScore,
    allBlockers,
    allWarnings,
    allPassed,
    allFailed,
    readinessLevel,
    findings,
    hardeningFlags,
    startedAt,
  });

  return { auditRun, hardeningFlags, hardeningResult };
}

export function runAuditCategory(categoryId, state) {
  const runners = {
    routes:          auditRoutes,
    moduleRegistry:  auditModuleRegistry,
    ssot:            auditSsotIntegrity,
    stateSchema:     auditStateSchema,
    localStorage:    auditLocalStorageSafety,
    exportImport:    auditExportImportSafety,
    secretExposure:  auditSecretExposure,
    noDemoLanguage:  auditNoDemoLanguage,
    agentSafety:     auditAgentSafety,
    transformation:  auditTransformationSystem,
    promptGenerator: auditPromptGenerator,
    workspaces:      auditWorkspaces,
    exportHandoff:   auditExportHandoff,
    dashboardPwa:    auditDashboardPwaStructure,
    pwa:             auditPwaReadiness,
    buildReadiness:  auditBuildReadiness,
  };
  return runners[categoryId] ? runners[categoryId](state) : null;
}

export function calculateOverallAuditScore(results) {
  const scores = Object.values(results).map(r => r.score || 0);
  return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
}

export function determineReadinessLevel(score, blockers, warnings) {
  return getReadinessLevel(score, blockers);
}

export function collectAuditFindings(results) {
  const findings = [];
  const now = new Date().toISOString();
  Object.values(results).forEach(r => {
    (r.blockers || []).forEach(b => findings.push({
      id: generateId(), category: r.id, severity: 'critical', title: b,
      description: b, affectedArea: r.label, recommendedFix: 'Address the blocker and re-run audit.',
      blocking: true, status: 'open', createdAt: now, updatedAt: now,
    }));
    (r.warnings || []).forEach(w => findings.push({
      id: generateId(), category: r.id, severity: 'warning', title: w,
      description: w, affectedArea: r.label, recommendedFix: 'Review warning and resolve if possible.',
      blocking: false, status: 'open', createdAt: now, updatedAt: now,
    }));
  });
  return findings;
}

export function createAuditRun({ categoryResults, overallScore, allBlockers, allWarnings, allPassed, allFailed, readinessLevel, findings, hardeningFlags, startedAt }) {
  const now = new Date().toISOString();
  return {
    id:             generateId(),
    status:         allBlockers.length > 0 ? 'failed' : allWarnings.length > 0 ? 'passed_with_warnings' : 'passed',
    overallScore,
    readinessLevel,
    categories:     categoryResults,
    blockers:       allBlockers,
    warnings:       allWarnings,
    passedChecks:   allPassed,
    failedChecks:   allFailed,
    findings,
    hardeningFlags,
    finalRecommendation: generateFinalRecommendation({ overallScore, blockers: allBlockers, warnings: allWarnings, readinessLevel }),
    createdAt:  startedAt,
    completedAt: now,
  };
}

export function generateFinalRecommendation({ overallScore, blockers, warnings, readinessLevel }) {
  if (blockers.length > 0) return `${blockers.length} critical blocker(s) must be resolved before the base can be locked for variant builds. Score: ${overallScore}/100.`;
  if (readinessLevel === 'ready') return `All checks passed. Score: ${overallScore}/100. The base is ready — lock it for transformation and begin real product variant builds.`;
  if (readinessLevel === 'ready_with_warnings') return `No critical blockers. Score: ${overallScore}/100. Review ${warnings.length} warning(s), then lock the base for transformation.`;
  return `Score: ${overallScore}/100. Resolve outstanding issues to reach readiness.`;
}

export function updateFinalLockFromAudit(auditRun, state) {
  const canLock = auditRun.blockers.length === 0 && auditRun.overallScore >= 85;
  return {
    status: canLock ? 'ready_to_lock' : 'blocked',
    canStartVariantBuilds: false,
    reason: canLock
      ? 'Audit passed — click Lock Base to confirm.'
      : `Cannot lock: ${auditRun.blockers.length} blocker(s) remain.`,
  };
}

function collectBlockers(results) {
  return Object.values(results).flatMap(r => r.blockers || []);
}
function collectWarnings(results) {
  return Object.values(results).flatMap(r => r.warnings || []);
}
function collectPassed(results) {
  return Object.values(results).flatMap(r => r.passed || []);
}
function collectFailed(results) {
  return Object.values(results).flatMap(r => [
    ...(r.blockers || []).map(b => `${r.id}:${b}`),
  ]);
}
