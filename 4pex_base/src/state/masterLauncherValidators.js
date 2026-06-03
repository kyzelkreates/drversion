// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// masterLauncherValidators.js — Run 10

import { getAllVariantIds } from '../config/finalVariantOptions.js';
import { getAllPatternIds } from '../config/dashboardPwaPatterns.js';

export function validateMasterLauncherState(ml) {
  const errors = [];

  if (!ml || typeof ml !== 'object') {
    return [{ field: 'masterLauncher', message: 'masterLauncher state must be an object.' }];
  }

  // status
  const validStatuses = ['ready', 'in_progress', 'complete'];
  if (!validStatuses.includes(ml.status)) {
    errors.push({ field: 'masterLauncher.status', message: `status must be one of: ${validStatuses.join(', ')}` });
  }

  // selectedVariantType
  if (ml.selectedVariantType) {
    if (!getAllVariantIds().includes(ml.selectedVariantType)) {
      errors.push({ field: 'masterLauncher.selectedVariantType', message: `Unknown variant type: ${ml.selectedVariantType}` });
    }
  }

  // selectedDashboardPwaPattern
  if (ml.selectedDashboardPwaPattern) {
    if (!getAllPatternIds().includes(ml.selectedDashboardPwaPattern)) {
      errors.push({ field: 'masterLauncher.selectedDashboardPwaPattern', message: `Unknown pattern ID: ${ml.selectedDashboardPwaPattern}` });
    }
  }

  // generatedMasterPrompts
  if (!Array.isArray(ml.generatedMasterPrompts)) {
    errors.push({ field: 'masterLauncher.generatedMasterPrompts', message: 'generatedMasterPrompts must be an array.' });
  } else {
    ml.generatedMasterPrompts.forEach((p, idx) => {
      if (!p.id)          errors.push({ field: `generatedMasterPrompts[${idx}].id`, message: 'Prompt must have an id.' });
      if (!p.variantType) errors.push({ field: `generatedMasterPrompts[${idx}].variantType`, message: 'Prompt must have a variantType.' });
      if (!p.promptText)  errors.push({ field: `generatedMasterPrompts[${idx}].promptText`, message: 'Prompt must have promptText.' });
      if (!p.generatedAt) errors.push({ field: `generatedMasterPrompts[${idx}].generatedAt`, message: 'Prompt must have a generatedAt timestamp.' });
    });
  }

  // booleans
  if (typeof ml.finalBaseComplete !== 'boolean') {
    errors.push({ field: 'masterLauncher.finalBaseComplete', message: 'finalBaseComplete must be boolean.' });
  }
  if (typeof ml.readyToBuildVariants !== 'boolean') {
    errors.push({ field: 'masterLauncher.readyToBuildVariants', message: 'readyToBuildVariants must be boolean.' });
  }

  // locks
  if (!ml.locks || typeof ml.locks !== 'object') {
    errors.push({ field: 'masterLauncher.locks', message: 'locks must be an object.' });
  } else {
    const requiredLocks = [
      'preventMoreBaseFeatureRuns',
      'preventMultiVariantBuildInOneRun',
      'preventVariantBuildInsideBase',
      'requireBasePackageReady',
      'requireFinalAuditLock',
      'requireManualVariantPromptUse',
      'preventSecretExposure',
      'enforceBranding',
      'enforceDashboardPwaPattern',
    ];
    requiredLocks.forEach((lock) => {
      if (typeof ml.locks[lock] !== 'boolean') {
        errors.push({ field: `masterLauncher.locks.${lock}`, message: `${lock} must be boolean.` });
      }
    });
    // Safety lock enforcement
    if (ml.locks.preventVariantBuildInsideBase === false) {
      errors.push({ field: 'masterLauncher.locks.preventVariantBuildInsideBase', message: 'preventVariantBuildInsideBase must remain true.' });
    }
    if (ml.locks.preventSecretExposure === false) {
      errors.push({ field: 'masterLauncher.locks.preventSecretExposure', message: 'preventSecretExposure must remain true.' });
    }
    if (ml.locks.enforceBranding === false) {
      errors.push({ field: 'masterLauncher.locks.enforceBranding', message: 'enforceBranding must remain true.' });
    }
  }

  return errors;
}
