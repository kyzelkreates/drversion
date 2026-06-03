// 4P3X Package Manifest Builder — Run 9
// Generates the machine-readable package manifest.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { REQUIRED_INCLUDE_PATTERNS, FORBIDDEN_PATTERNS } from '../../config/packageFileRules.js';

export function buildPackageManifest(state) {
  return {
    schemaVersion: '9.0',
    identity: buildPackageBranding(state),
    generatedAt: new Date().toISOString(),
    requiredFiles: buildRequiredFileList(state),
    forbiddenFiles: buildForbiddenFileList(state),
    metadata: buildPackageMetadata(state),
    safetyNote: 'This manifest contains no raw API keys, secrets, or deployment credentials.',
    instruction: 'Package manually. Do not auto-zip or auto-deploy. Confirm all forbidden files are excluded before zipping.',
  };
}

export function buildRequiredFileList(state) {
  return REQUIRED_INCLUDE_PATTERNS.map((p) => ({
    pattern: p.pattern,
    reason: p.reason,
  }));
}

export function buildForbiddenFileList(state) {
  return FORBIDDEN_PATTERNS.map((p) => ({
    pattern: p.pattern,
    reason: p.reason,
  }));
}

export function buildPackageMetadata(state) {
  const app = state?.app || {};
  const fa  = state?.finalAudit || {};
  return {
    appName: app.name || '4P3X Reusable Base Structure™',
    appVersion: app.version || '1.0.0',
    finalAuditScore: fa.overallScore || 0,
    finalAuditLocked: fa.finalLock?.canStartVariantBuilds === true,
    totalRuns: 9,
    completedRuns: ['Run 1','Run 2','Run 3','Run 4','Run 5','Run 6','Run 7','Run 8','Run 8.5','Run 9'],
    nextRun: 'Run 10 — Master Variant Transformation Launcher (do not build yet)',
    packageType: 'reusable_base_package',
  };
}

export function buildPackageBranding(state) {
  return {
    appName: '4P3X Reusable Base Structure™',
    poweredBy: '4P3X Intelligent AI',
    createdBy: 'Kyzel Kreates',
    ecosystem: '4P3X Verse',
    brandingLine: 'Powered by 4P3X Intelligent AI — Created by Kyzel Kreates',
  };
}

export default {
  buildPackageManifest,
  buildRequiredFileList,
  buildForbiddenFileList,
  buildPackageMetadata,
  buildPackageBranding,
};
