// 4P3X Package Validation — Run 9
// Validates a package record before zip preparation is authorised.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { scanPackageReadiness } from './packageReadinessScanner.js';
import { scanPackageForSecretRisks } from './packageSecretScanner.js';
import { BLOCKER_RULES } from '../../config/packageRules.js';

export function validatePackageRecord(packageRecord, state) {
  const errors = [];
  if (!packageRecord) return { valid: false, errors: ['Package record is missing.'] };
  if (!packageRecord.id) errors.push('Package ID is missing.');
  if (!packageRecord.name) errors.push('Package name is missing.');
  if (packageRecord.type !== 'reusable_base_package') errors.push('Package type must be "reusable_base_package".');
  if (!packageRecord.identity?.brandingLine?.includes('4P3X Intelligent AI')) {
    errors.push('Package identity missing required branding line.');
  }
  return { valid: errors.length === 0, errors };
}

export function validatePackageManifest(manifest, state) {
  const errors = [];
  if (!manifest) return { valid: false, errors: ['Manifest is missing.'] };
  if (!manifest.requiredFiles?.length) errors.push('Manifest has no required files defined.');
  if (!manifest.forbiddenFiles?.length) errors.push('Manifest has no forbidden files defined.');
  if (!manifest.identity?.brandingLine) errors.push('Manifest missing branding line.');
  if (!manifest.safetyNote) errors.push('Manifest missing safety note.');
  return { valid: errors.length === 0, errors };
}

export function validatePackageRules(packageRecord, state) {
  const violations = [];
  const locks = state?.basePackage?.locks || {};
  if (locks.preventSecretPackaging && (packageRecord?.validation?.noSecretsPassed === false)) {
    violations.push('Secret packaging prevented: secrets detected in package scan.');
  }
  if (locks.preventNodeModulesPackaging) {
    violations.push('node_modules packaging is locked — always excluded.');
  }
  if (locks.requireFinalAuditPass) {
    const fa = state?.finalAudit || {};
    if (!fa.finalLock?.canStartVariantBuilds) {
      violations.push('Final audit lock required before zip preparation is authorised.');
    }
  }
  const blockerViolations = violations.filter((v) => v.includes('locked') || v.includes('prevented'));
  return {
    valid: blockerViolations.length === 0,
    violations,
    blockers: blockerViolations,
  };
}

export function validatePackageReadiness(packageRecord, state) {
  const readiness = scanPackageReadiness(state);
  const secretScan = scanPackageForSecretRisks(state);

  const allBlockers = [
    ...readiness.blockers,
    ...secretScan.blockers,
  ];

  const allWarnings = [
    ...readiness.warnings,
    ...secretScan.warnings,
  ];

  const finalAuditPassed   = readiness.checks.find((c) => c.key === 'final_audit_passed')?.ok || false;
  const noSecretsPassed    = secretScan.ok;
  const ssotPassed         = readiness.checks.find((c) => c.key === 'ssot_readiness')?.ok || false;
  const routesPassed       = readiness.checks.find((c) => c.key === 'route_readiness')?.ok || false;
  const buildPassed        = readiness.checks.find((c) => c.key === 'build_readiness')?.ok || false;
  const noUnsafeLang       = state?.finalAudit?.hardening?.noDemoLanguageVerified !== false;

  const zipReady = allBlockers.length === 0 && finalAuditPassed && noSecretsPassed;

  return {
    finalAuditPassed,
    noSecretsPassed,
    noUnsafeLanguagePassed: noUnsafeLang,
    routesPassed,
    ssotPassed,
    buildPassed,
    blockers: allBlockers,
    warnings: allWarnings,
    zipReady,
    readinessScore: readiness.score,
    readinessLevel: readiness.level,
    nextAction: readiness.nextAction,
  };
}

export default {
  validatePackageRecord,
  validatePackageManifest,
  validatePackageRules,
  validatePackageReadiness,
};
