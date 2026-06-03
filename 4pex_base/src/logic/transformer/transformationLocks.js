// 4P3X Transformation Locks — RUN 4
// Enforces non-destructive compile boundaries.
// No file writes. No overwrite. No external calls. No raw keys.

import { getState } from '../../state/storage.js';

// ─── Lock definitions ────────────────────────────────────────────────────────

export const LOCK_DEFINITIONS = {
  preserveRun1: {
    id: 'preserveRun1',
    label: 'Preserve Run 1 Foundation',
    description: 'Run 1 base app, storage SSOT, and app shell must remain untouched.',
    severity: 'critical',
  },
  preserveRun2: {
    id: 'preserveRun2',
    label: 'Preserve Run 2 Blueprint Engine',
    description: 'Run 2 blueprint system, validators, and readiness engine must remain intact.',
    severity: 'critical',
  },
  preserveRun3: {
    id: 'preserveRun3',
    label: 'Preserve Run 3 Agent System',
    description: 'Run 3 agent system, recommendations, and safety boundaries must remain intact.',
    severity: 'critical',
  },
  preserveStorageSSOT: {
    id: 'preserveStorageSSOT',
    label: 'Preserve storage.js SSOT',
    description: 'All state must flow through storage.js. No duplicate stores.',
    severity: 'critical',
  },
  preventDuplicateState: {
    id: 'preventDuplicateState',
    label: 'Prevent Duplicate State System',
    description: 'No second state management system may be created.',
    severity: 'critical',
  },
  preventExternalApiCalls: {
    id: 'preventExternalApiCalls',
    label: 'Prevent External API Calls',
    description: 'Compiler must not call external APIs or AI services.',
    severity: 'critical',
  },
  preventSecretExposure: {
    id: 'preventSecretExposure',
    label: 'Prevent Secret Exposure',
    description: 'Raw API keys and backend secrets must never appear in plans or exports.',
    severity: 'critical',
  },
  preventDemoLanguage: {
    id: 'preventDemoLanguage',
    label: 'Prevent Non-Production Language',
    description: 'Plans must not contain demo, mock, fake, dummy, or toy wording.',
    severity: 'warning',
  },
  preventDestructiveRefactor: {
    id: 'preventDestructiveRefactor',
    label: 'Prevent Destructive Refactor',
    description: 'No existing working files may be overwritten by the compiler.',
    severity: 'critical',
  },
  requireValidatedBlueprint: {
    id: 'requireValidatedBlueprint',
    label: 'Require Validated Blueprint',
    description: 'Compilation requires a blueprint that has passed validation.',
    severity: 'critical',
  },
  requireReadinessCheck: {
    id: 'requireReadinessCheck',
    label: 'Require Readiness Check',
    description: 'Blueprint readiness score must reach a minimum threshold before compilation.',
    severity: 'critical',
  },
  requireUserReview: {
    id: 'requireUserReview',
    label: 'Require User Review',
    description: 'Compilation result must be reviewed by the user before proceeding to a variant run.',
    severity: 'warning',
  },
};

export const MINIMUM_READINESS_SCORE = 40;
export const FORBIDDEN_PLAN_WORDS = ['demo', 'mock', 'mocked', 'fake', 'dummy', 'toy', 'placeholder app', 'showcase-only', 'simulated product'];

// ─── Get locks from state ────────────────────────────────────────────────────

export function getTransformationLocks(state) {
  const s = state || getState();
  return s?.transformationCompiler?.locks || {
    preserveRun1: true,
    preserveRun2: true,
    preserveRun3: true,
    preserveStorageSSOT: true,
    preventDuplicateState: true,
    preventExternalApiCalls: true,
    preventSecretExposure: true,
    preventDemoLanguage: true,
    preventDestructiveRefactor: true,
    requireValidatedBlueprint: true,
    requireReadinessCheck: true,
    requireUserReview: true,
  };
}

// ─── Enforce locks on a plan ─────────────────────────────────────────────────

export function enforceTransformationLocks(plan, state) {
  const violations = [];
  const locks = getTransformationLocks(state);

  if (locks.preventDestructiveRefactor) {
    if (plan?.compileMode !== 'non_destructive') {
      violations.push({ lockId: 'preventDestructiveRefactor', message: 'Compile mode must be non_destructive.' });
    }
  }

  if (locks.preventExternalApiCalls) {
    const planStr = JSON.stringify(plan || {});
    if (planStr.includes('fetch(') || planStr.includes('axios.') || planStr.includes('http.get')) {
      violations.push({ lockId: 'preventExternalApiCalls', message: 'Plan contains external API call instructions.' });
    }
  }

  if (locks.preventSecretExposure) {
    const planStr = JSON.stringify(plan || {});
    if (/sk-[a-zA-Z0-9]{10,}|api_key\s*=\s*["'][^"']+["']|secret\s*=\s*["'][^"']+["']/i.test(planStr)) {
      violations.push({ lockId: 'preventSecretExposure', message: 'Plan contains raw API key or secret.' });
    }
  }

  if (locks.preventDemoLanguage) {
    const planStr = JSON.stringify(plan || {}).toLowerCase();
    for (const word of FORBIDDEN_PLAN_WORDS) {
      if (planStr.includes(word)) {
        violations.push({ lockId: 'preventDemoLanguage', message: `Plan contains forbidden wording: "${word}"` });
        break;
      }
    }
  }

  return { ok: violations.length === 0, violations };
}

// ─── Can compile? ────────────────────────────────────────────────────────────

export function canCompilePlan(state) {
  const s = state || getState();
  const reasons = [];

  const compiler = s?.transformationCompiler;
  if (!compiler) { reasons.push('Transformation compiler state not initialised.'); return { ok: false, reasons }; }

  if (compiler.allowFileWrites === true) reasons.push('allowFileWrites must be false.');
  if (compiler.allowOverwrite === true) reasons.push('allowOverwrite must be false.');
  if (compiler.allowDestructiveRefactor === true) reasons.push('allowDestructiveRefactor must be false.');
  if (compiler.compileMode !== 'non_destructive') reasons.push('compileMode must be non_destructive.');

  const locks = getTransformationLocks(s);
  if (!locks.preserveRun1) reasons.push('Lock: preserveRun1 is disabled.');
  if (!locks.preserveRun2) reasons.push('Lock: preserveRun2 is disabled.');
  if (!locks.preserveRun3) reasons.push('Lock: preserveRun3 is disabled.');
  if (!locks.preserveStorageSSOT) reasons.push('Lock: preserveStorageSSOT is disabled.');

  const bps = s?.blueprints?.items || [];
  const activeBpId = compiler.selectedBlueprintId || s?.blueprints?.activeBlueprintId;
  if (!activeBpId) { reasons.push('No blueprint selected.'); return { ok: reasons.length === 0, reasons }; }

  const bp = bps.find(b => b.id === activeBpId);
  if (!bp) reasons.push(`Selected blueprint not found: ${activeBpId}`);
  else {
    if (!bp.name || bp.name.length < 2) reasons.push('Blueprint name is required.');
    if (!bp.productType) reasons.push('Blueprint productType is required.');
    const score = bp.readiness?.score ?? 0;
    if (score < MINIMUM_READINESS_SCORE) {
      reasons.push(`Blueprint readiness score (${score}) is below minimum (${MINIMUM_READINESS_SCORE}).`);
    }
  }

  return { ok: reasons.length === 0, reasons };
}

// ─── Can export plan? ────────────────────────────────────────────────────────

export function canExportPlan(plan) {
  if (!plan || typeof plan !== 'object') return { ok: false, reasons: ['No plan provided.'] };
  const reasons = [];
  if (!plan.id) reasons.push('Plan missing id.');
  if (!plan.blueprintId) reasons.push('Plan missing blueprintId.');
  if (plan.status === 'blocked') reasons.push('Plan is blocked — resolve critical blockers before export.');
  const str = JSON.stringify(plan);
  if (/sk-[a-zA-Z0-9]{10,}/i.test(str)) reasons.push('Plan contains raw API key — sanitize before export.');
  return { ok: reasons.length === 0, reasons };
}

// ─── Can proceed to variant run? ─────────────────────────────────────────────

export function canProceedToVariantRun(plan) {
  if (!plan) return { ok: false, reasons: ['No plan provided.'] };
  const reasons = [];
  if (plan.status !== 'ready_for_variant_run') reasons.push(`Plan status is "${plan.status}" — must be ready_for_variant_run.`);
  if ((plan.blockers || []).length > 0) reasons.push(`Plan has ${plan.blockers.length} unresolved blockers.`);
  const criticalRisks = (plan.risks || []).filter(r => r.severity === 'critical');
  if (criticalRisks.length > 0) reasons.push(`Plan has ${criticalRisks.length} critical risk(s) — resolve before proceeding.`);
  if ((plan.readiness?.score ?? 0) < MINIMUM_READINESS_SCORE) reasons.push('Plan readiness score is too low.');
  return { ok: reasons.length === 0, reasons };
}

// ─── Explain blocked locks ───────────────────────────────────────────────────

export function explainBlockedLocks(plan, state) {
  const { violations } = enforceTransformationLocks(plan, state);
  const { reasons: compileReasons } = canCompilePlan(state);
  const { reasons: exportReasons } = canExportPlan(plan);

  return {
    compileBlocked: compileReasons,
    exportBlocked: exportReasons,
    lockViolations: violations,
    allClear: violations.length === 0 && compileReasons.length === 0,
  };
}
