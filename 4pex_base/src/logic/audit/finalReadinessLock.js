// 4P3X Final Readiness Lock — Run 8
import { getReadinessLevel } from '../../config/finalReadinessRules.js';

export function calculateFinalReadiness(state) {
  const fa = state?.finalAudit || {};
  const h  = fa.hardening || {};
  const latestRun = (fa.auditRuns || []).slice(-1)[0] || null;

  const score    = fa.overallScore || 0;
  const blockers = fa.blockers || [];

  const baseReadyForVariants =
    score >= 90 &&
    blockers.length === 0 &&
    h.ssotVerified &&
    h.modulesVerified &&
    h.routesVerified &&
    h.secretsCleared &&
    h.noDemoLanguageVerified &&
    h.transformationSafe &&
    h.promptsSafe &&
    h.workspacesSafe &&
    h.exportsSafe;

  const exportReady =
    h.exportsSafe &&
    h.secretsCleared;

  const zipHandoffReady =
    h.pwaReady &&
    exportReady;

  const canStartVariantBuilds =
    baseReadyForVariants &&
    exportReady &&
    fa.finalLock?.status === 'locked';

  return { baseReadyForVariants, exportReady, zipHandoffReady, canStartVariantBuilds, score, blockers };
}

export function canLockBaseForTransformation(state) {
  const fa = state?.finalAudit || {};
  return (fa.blockers || []).length === 0 && fa.overallScore >= 85;
}

export function lockBaseForTransformation(state) {
  return {
    ...state,
    finalAudit: {
      ...(state?.finalAudit || {}),
      finalLock: {
        status: 'locked',
        lockedAt: new Date().toISOString(),
        lockedBy: 'final_audit',
        canStartVariantBuilds: true,
        reason: 'Final audit passed. Base is locked for transformation.',
      },
    },
  };
}

export function unlockBaseForFixes(state) {
  return {
    ...state,
    finalAudit: {
      ...(state?.finalAudit || {}),
      finalLock: {
        status: 'unlocked',
        lockedAt: null,
        lockedBy: 'final_audit',
        canStartVariantBuilds: false,
        reason: 'Base unlocked for fixes. Re-run audit to lock again.',
      },
    },
  };
}

export function explainFinalLockStatus(state) {
  const lock = state?.finalAudit?.finalLock || {};
  if (lock.status === 'locked') return `Locked at ${lock.lockedAt}. ${lock.reason}`;
  if (lock.status === 'unlocked') return lock.reason || 'Base is unlocked. Run the final audit to proceed.';
  return 'Lock status unknown. Run the final audit first.';
}

export function blockVariantBuildIfAuditFails(state) {
  const fa = state?.finalAudit || {};
  return (fa.blockers || []).length > 0 || fa.finalLock?.canStartVariantBuilds !== true;
}

export function blockExportIfSecretsDetected(state) {
  const fa = state?.finalAudit || {};
  return !(fa.hardening?.secretsCleared);
}

export function blockTransformationIfCriticalFindings(state) {
  const fa = state?.finalAudit || {};
  const criticalFindings = (fa.latestFindings || []).filter(f => f.severity === 'critical' && f.status === 'open');
  return criticalFindings.length > 0;
}
