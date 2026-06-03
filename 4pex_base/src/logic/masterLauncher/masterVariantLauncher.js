// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// masterVariantLauncher.js — Run 10
// Core logic for the Master Variant Launcher.
// Advisory/planning only — no variant is built inside the base.

import { getVariantById }  from '../../config/finalVariantOptions.js';
import { getPatternById }  from '../../config/dashboardPwaPatterns.js';

// =====================================================
// SELECT VARIANT TYPE
// =====================================================
export function selectVariantType(variantType, state) {
  if (!variantType || typeof variantType !== 'string') {
    return { success: false, error: 'Variant type must be a non-empty string.' };
  }
  const option = getVariantById(variantType);
  if (!option) {
    return { success: false, error: `Unknown variant type: ${variantType}` };
  }
  return { success: true, variantType, variantOption: option };
}

// =====================================================
// SELECT DASHBOARD + PWA PATTERN
// =====================================================
export function selectDashboardPwaPattern(patternId, state) {
  if (!patternId || typeof patternId !== 'string') {
    return { success: false, error: 'Pattern ID must be a non-empty string.' };
  }
  const pattern = getPatternById(patternId);
  if (!pattern) {
    return { success: false, error: `Unknown pattern ID: ${patternId}` };
  }
  return { success: true, patternId, pattern };
}

// =====================================================
// PREPARE VARIANT LAUNCH CONTEXT
// =====================================================
export function prepareVariantLaunchContext(state) {
  const ml = state?.masterLauncher || {};
  const variantOption = getVariantById(ml.selectedVariantType);
  const pattern       = getPatternById(ml.selectedDashboardPwaPattern);

  return {
    variantType:           ml.selectedVariantType     || null,
    patternId:             ml.selectedDashboardPwaPattern || null,
    variantOption:         variantOption || null,
    pattern:               pattern || null,
    hasVariant:            !!variantOption,
    hasPattern:            !!pattern,
    baseReady:             _isBaseReady(state),
    finalAuditPassed:      _isFinalAuditPassed(state),
    packageReady:          _isPackageReady(state),
    brandingLine:          'Powered by 4P3X Intelligent AI — Created by Kyzel Kreates',
  };
}

// =====================================================
// VALIDATE BASE READY FOR VARIANT LAUNCH
// =====================================================
export function validateBaseReadyForVariantLaunch(state) {
  const errors   = [];
  const warnings = [];

  if (!_isFinalAuditPassed(state)) {
    errors.push('Final system audit (Run 8) has not passed. Complete the audit before launching a variant.');
  }
  if (!_isPackageReady(state)) {
    errors.push('Base package (Run 9) is not ready. Build and validate the base package before launching a variant.');
  }
  if (state?.masterLauncher?.locks?.preventVariantBuildInsideBase === false) {
    errors.push('SSOT lock violation: preventVariantBuildInsideBase must remain true.');
  }

  const finalLock = state?.finalAudit?.finalLock;
  if (!finalLock || finalLock.status !== 'locked') {
    warnings.push('Transformation readiness lock (Run 8) is not engaged. Engage the lock before building variants.');
  }

  return {
    valid:    errors.length === 0,
    errors,
    warnings,
    canLaunch: errors.length === 0,
  };
}

// =====================================================
// VALIDATE SELECTED VARIANT
// =====================================================
export function validateSelectedVariant(state) {
  const variantType = state?.masterLauncher?.selectedVariantType;
  if (!variantType) {
    return { valid: false, error: 'No variant type selected.' };
  }
  const option = getVariantById(variantType);
  if (!option) {
    return { valid: false, error: `Selected variant type "${variantType}" is not a known variant.` };
  }
  return { valid: true, variantOption: option };
}

// =====================================================
// VALIDATE DASHBOARD + PWA PATTERN
// =====================================================
export function validateDashboardPwaPattern(state) {
  const patternId = state?.masterLauncher?.selectedDashboardPwaPattern;
  if (!patternId) {
    return { valid: false, error: 'No Dashboard + PWA pattern selected.' };
  }
  const pattern = getPatternById(patternId);
  if (!pattern) {
    return { valid: false, error: `Selected pattern "${patternId}" is not a known pattern.` };
  }
  return { valid: true, pattern };
}

// =====================================================
// INTERNAL HELPERS
// =====================================================
function _isFinalAuditPassed(state) {
  const audit = state?.finalAudit;
  if (!audit) return false;
  const hasLock     = audit.finalLock?.status === 'locked';
  const noBlockers  = !audit.blockers || audit.blockers.length === 0;
  return hasLock || noBlockers;
}

function _isPackageReady(state) {
  const pkg = state?.basePackage;
  if (!pkg) return false;
  return pkg.status === 'validated' || pkg.zipReady === true;
}

function _isBaseReady(state) {
  return _isFinalAuditPassed(state) && _isPackageReady(state);
}
