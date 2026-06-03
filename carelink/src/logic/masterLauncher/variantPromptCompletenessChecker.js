// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// variantPromptCompletenessChecker.js — Run 10
// Verifies that a generated master variant prompt contains all required sections.

import { BRANDING_LINE } from '../../config/masterVariantPromptTemplates.js';

// =====================================================
// MASTER COMPLETENESS CHECK
// =====================================================
export function checkVariantPromptCompleteness(promptText) {
  if (!promptText || typeof promptText !== 'string') {
    return {
      complete: false,
      score: 0,
      checks: [],
      summary: 'Prompt is empty or invalid.',
    };
  }

  const checks = [
    confirmBranding(promptText),
    confirmDashboardPwaPattern(promptText),
    confirmFixOnlyWrapper(promptText),
    confirmDirective1(promptText),
    confirmValidationGates(promptText),
    confirmStopConditions(promptText),
    confirmRollback(promptText),
    confirmProjectIdentity(promptText),
    confirmSafetyRules(promptText),
    confirmSsotRules(promptText),
    confirmUploadInstructions(promptText),
    confirmAcceptanceCriteria(promptText),
  ];

  const passed = checks.filter((c) => c.passed).length;
  const total  = checks.length;
  const score  = Math.round((passed / total) * 100);

  return {
    complete: passed === total,
    score,
    passed,
    total,
    checks,
    summary:
      passed === total
        ? `All ${total} completeness checks passed (${score}%).`
        : `${passed}/${total} checks passed (${score}%). Missing sections must be addressed.`,
  };
}

// =====================================================
// INDIVIDUAL CHECKS
// =====================================================
export function confirmBranding(promptText) {
  const passed = promptText.includes(BRANDING_LINE) ||
                 promptText.includes('Powered by 4P3X Intelligent AI') ||
                 promptText.includes('Created by Kyzel Kreates');
  return {
    checkId: 'branding',
    label: 'Branding line present',
    passed,
    detail: passed
      ? `"${BRANDING_LINE}" found in prompt.`
      : `Missing required branding: "${BRANDING_LINE}"`,
  };
}

export function confirmDashboardPwaPattern(promptText) {
  const lower = promptText.toLowerCase();
  const passed =
    lower.includes('dashboard') &&
    (lower.includes('pwa') || lower.includes('progressive web app')) &&
    lower.includes('state isolation') || (
      lower.includes('dashboard') &&
      lower.includes('pwa') &&
      lower.includes('role')
    );
  return {
    checkId: 'dashboard_pwa_pattern',
    label: 'Dashboard + PWA pattern defined',
    passed,
    detail: passed
      ? 'Dashboard and PWA roles and pattern found.'
      : 'Missing Dashboard + Connected PWA pattern definition.',
  };
}

export function confirmFixOnlyWrapper(promptText) {
  const passed =
    promptText.includes('FIX-ONLY BUILD COMPILER MODE') ||
    promptText.includes('FIX-ONLY');
  return {
    checkId: 'fix_only_wrapper',
    label: 'FIX-ONLY BUILD COMPILER MODE header present',
    passed,
    detail: passed
      ? 'FIX-ONLY BUILD COMPILER MODE header found.'
      : 'Missing FIX-ONLY BUILD COMPILER MODE header.',
  };
}

export function confirmDirective1(promptText) {
  const passed =
    promptText.includes('DIRECTIVE 1') ||
    promptText.includes('Directive 1') ||
    promptText.includes('Adapt the skill set to the task');
  return {
    checkId: 'directive_1',
    label: 'Directive 1 footer present',
    passed,
    detail: passed
      ? 'Directive 1 footer found.'
      : 'Missing Directive 1 footer.',
  };
}

export function confirmValidationGates(promptText) {
  const passed =
    promptText.includes('VALIDATION GATES') ||
    promptText.includes('npm run build') ||
    promptText.includes('validation gate');
  return {
    checkId: 'validation_gates',
    label: 'Validation gates present',
    passed,
    detail: passed ? 'Validation gates section found.' : 'Missing validation gates.',
  };
}

export function confirmStopConditions(promptText) {
  const passed =
    promptText.includes('STOP CONDITIONS') ||
    promptText.includes('Stop immediately if') ||
    promptText.includes('stop condition');
  return {
    checkId: 'stop_conditions',
    label: 'Stop conditions present',
    passed,
    detail: passed ? 'Stop conditions section found.' : 'Missing stop conditions.',
  };
}

export function confirmRollback(promptText) {
  const passed =
    promptText.includes('ROLLBACK') ||
    promptText.includes('rollback') ||
    promptText.includes('Revert only the files');
  return {
    checkId: 'rollback',
    label: 'Rollback guidance present',
    passed,
    detail: passed ? 'Rollback guidance found.' : 'Missing rollback guidance.',
  };
}

export function confirmProjectIdentity(promptText) {
  const passed =
    (promptText.includes('4P3X') || promptText.includes('Kyzel Kreates')) &&
    promptText.includes('Part of the 4P3X Verse');
  return {
    checkId: 'project_identity',
    label: 'Project identity section present',
    passed,
    detail: passed ? 'Project identity found.' : 'Missing project identity (4P3X / Kyzel Kreates / 4P3X Verse).',
  };
}

export function confirmSafetyRules(promptText) {
  const lower = promptText.toLowerCase();
  const passed =
    lower.includes('do not expose') ||
    lower.includes('do not build multiple') ||
    lower.includes('safety rule') ||
    lower.includes('absolute');
  return {
    checkId: 'safety_rules',
    label: 'Safety rules section present',
    passed,
    detail: passed ? 'Safety rules found.' : 'Missing safety rules section.',
  };
}

export function confirmSsotRules(promptText) {
  const passed =
    promptText.includes('SSOT') ||
    promptText.includes('storage.js') ||
    promptText.includes('single source of truth');
  return {
    checkId: 'ssot_rules',
    label: 'SSOT rules present',
    passed,
    detail: passed ? 'SSOT rules found.' : 'Missing SSOT rules (storage.js / single source of truth).',
  };
}

export function confirmUploadInstructions(promptText) {
  const lower = promptText.toLowerCase();
  const passed =
    lower.includes('zip') &&
    (lower.includes('attach') || lower.includes('upload') || lower.includes('extract')) &&
    lower.includes('npm install');
  return {
    checkId: 'upload_instructions',
    label: 'Base zip upload/attach instructions present',
    passed,
    detail: passed
      ? 'Base zip attachment instructions found.'
      : 'Missing base zip attachment and npm install instructions.',
  };
}

export function confirmAcceptanceCriteria(promptText) {
  const passed =
    promptText.includes('ACCEPTANCE CRITERIA') ||
    promptText.includes('acceptance criteria') ||
    promptText.includes('complete only if');
  return {
    checkId: 'acceptance_criteria',
    label: 'Acceptance criteria present',
    passed,
    detail: passed ? 'Acceptance criteria found.' : 'Missing acceptance criteria section.',
  };
}
