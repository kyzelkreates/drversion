// 4P3X Package Builder — Run 9
// Core CRUD and readiness logic for base packages.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { buildPackageBranding } from './packageManifestBuilder.js';
import { buildAllInstructions }  from './packageInstructionBuilder.js';
import { validatePackageReadiness } from './packageValidation.js';
import { REQUIRED_INCLUDE_PATTERNS, FORBIDDEN_PATTERNS } from '../../config/packageFileRules.js';

function _id() {
  return `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createBasePackage(state) {
  const id = _id();
  const identity = buildPackageBranding(state);
  const instructions = buildAllInstructions(state);

  return {
    id,
    name: '4P3X Reusable Base Structure™ — Base Package',
    type: 'reusable_base_package',
    status: 'draft',
    identity,
    includeRules: REQUIRED_INCLUDE_PATTERNS.map((p) => p.pattern),
    excludeRules: FORBIDDEN_PATTERNS.map((p) => p.pattern),
    fileTreePlan: REQUIRED_INCLUDE_PATTERNS.map((p) => p.pattern),
    requiredFiles: REQUIRED_INCLUDE_PATTERNS.map((p) => p.pattern),
    forbiddenFiles: FORBIDDEN_PATTERNS.map((p) => p.pattern),
    builderInstructions: {
      base44:  instructions.base44.steps,
      manus:   instructions.manus.steps,
      replit:  instructions.replit.steps,
      cursor:  instructions.cursor.steps,
      github:  instructions.github.steps,
      vercel:  instructions.vercel.steps,
    },
    validation: {
      finalAuditPassed: false,
      noSecretsPassed: false,
      noUnsafeLanguagePassed: false,
      routesPassed: false,
      ssotPassed: false,
      buildPassed: false,
      blockers: [],
      warnings: [],
    },
    readiness: {
      score: 0,
      level: 'not_ready',
      nextAction: 'Run Package Validation to calculate readiness.',
    },
    audit: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function updateBasePackage(packageId, updates, packages) {
  return (packages || []).map((p) =>
    p.id === packageId
      ? { ...p, ...updates, audit: { ...p.audit, updatedAt: new Date().toISOString() } }
      : p
  );
}

export function deleteBasePackage(packageId, packages) {
  return (packages || []).filter((p) => p.id !== packageId);
}

export function setActiveBasePackage(packageId, packages) {
  return {
    updatedPackages: (packages || []).map((p) => ({ ...p, isActive: p.id === packageId })),
    activePackageId: packageId,
  };
}

export function calculatePackageReadiness(packageRecord, state) {
  const result = validatePackageReadiness(packageRecord, state);
  return {
    score: result.readinessScore,
    level: result.readinessLevel,
    nextAction: result.nextAction,
    zipReady: result.zipReady,
  };
}

export function validatePackageBeforeZip(packageRecord, state) {
  const result = validatePackageReadiness(packageRecord, state);
  const status = result.zipReady ? 'ready_to_zip' : result.blockers.length > 0 ? 'blocked' : 'validated';
  return {
    ...result,
    status,
  };
}

export default {
  createBasePackage,
  updateBasePackage,
  deleteBasePackage,
  setActiveBasePackage,
  calculatePackageReadiness,
  validatePackageBeforeZip,
};
