// 4P3X Transformation Compiler — RUN 4
// Converts validated blueprints into non-destructive product skeleton plans.
// Does NOT write files. Does NOT call external APIs. Does NOT build variants.

import { generateProductSkeleton } from './skeletonGenerator.js';
import { scanTransformationRisks } from './transformationRiskScanner.js';
import { canCompilePlan, enforceTransformationLocks, MINIMUM_READINESS_SCORE } from './transformationLocks.js';
import { planSafetyCompliance } from './safetyCompliancePlanner.js';
import { generateFutureRunSequence } from './futureRunPlanner.js';
import { generateId } from '../../utils/id.js';
import { nowIso } from '../../utils/date.js';

// ─── Blueprint validation for compilation ────────────────────────────────────

export function validateBlueprintForCompilation(blueprint, state) {
  const errors = [];
  if (!blueprint)               { return { valid: false, errors: ['No blueprint provided.'] }; }
  if (!blueprint.name || blueprint.name.length < 2) errors.push('Blueprint must have a name (min 2 characters).');
  if (!blueprint.productType)   errors.push('Blueprint must have a productType.');
  if (!blueprint.coreModules?.length) errors.push('Blueprint must have at least one core module.');
  if (!blueprint.mainUserFlows?.length) errors.push('Blueprint must have at least one user flow.');
  if (!blueprint.requiredDataEntities?.length) errors.push('Blueprint must declare at least one data entity.');
  const score = blueprint.readiness?.score ?? 0;
  if (score < MINIMUM_READINESS_SCORE) errors.push(`Readiness score (${score}) is below minimum threshold (${MINIMUM_READINESS_SCORE}).`);
  return { valid: errors.length === 0, errors };
}

// ─── Build context ────────────────────────────────────────────────────────────

export function buildTransformationContext(blueprint, state, agentRegistry) {
  const maskedAiSettings = state?.aiSettings
    ? { selectedProvider: state.aiSettings.selectedProvider, hasKey: !!state.aiSettings.apiKey, keyMasked: true }
    : { selectedProvider: null, hasKey: false };

  return {
    blueprint,
    state: {
      aiSettings:      maskedAiSettings,
      modules:         { registry: state?.modules?.registry || [] },
      transformation:  { dependencyMap: state?.transformation?.dependencyMap || {}, rules: state?.transformation?.rules || [] },
      agentSystem:     { mode: state?.agentSystem?.mode || 'local-advisory' },
    },
    agentRegistry: agentRegistry || [],
    compilerState: {
      compileMode:              state?.transformationCompiler?.compileMode || 'non_destructive',
      allowFileWrites:          state?.transformationCompiler?.allowFileWrites ?? false,
      allowOverwrite:           state?.transformationCompiler?.allowOverwrite ?? false,
      allowDestructiveRefactor: state?.transformationCompiler?.allowDestructiveRefactor ?? false,
    },
  };
}

// ─── Generate plan ────────────────────────────────────────────────────────────

export function generateTransformationPlan(context) {
  const { blueprint, agentRegistry } = context;
  const now = nowIso();

  // Run skeleton generator
  const skeleton = generateProductSkeleton(context);
  if (!skeleton.ok) {
    return { ok: false, error: skeleton.error };
  }

  // Run risk scanner
  const risks = scanTransformationRisks({
    ...context,
    fileStructurePlan: skeleton.fileStructurePlan,
  });
  const criticalRisks = risks.filter(r => r.severity === 'critical');
  const warnings      = risks.filter(r => r.severity === 'warning').map(r => r.message);
  const blockers      = criticalRisks.map(r => r.message);

  // Safety / compliance plan
  const safetyPlan = planSafetyCompliance(blueprint);

  // Future run sequence
  const futureRunSequence = generateFutureRunSequence(blueprint, null);

  // Calculate initial readiness
  const plan = {
    id:                  generateId('tp'),
    blueprintId:         blueprint.id,
    blueprintName:       blueprint.name,
    productType:         blueprint.productType,
    status:              'draft',
    compileMode:         'non_destructive',
    summary:             `Transformation plan for "${blueprint.name}" (${blueprint.productType}). Non-destructive skeleton plan — no files written.`,
    fileStructurePlan:   skeleton.fileStructurePlan,
    moduleActivationPlan: skeleton.moduleActivationPlan,
    dataModelPlan:       skeleton.dataModelPlan,
    uiComponentPlan:     skeleton.uiComponentPlan,
    stateTransitionPlan: skeleton.stateTransitionPlan,
    apiIntegrationPlan:  skeleton.apiIntegrationPlan,
    agentCapabilityPlan: skeleton.agentCapabilityPlan,
    safetyCompliancePlan: safetyPlan,
    futureRunSequence,
    risks,
    blockers,
    warnings,
    readiness: { score: 0, level: 'not_ready' },
    audit: { createdAt: now, updatedAt: now, compiledAt: now },
  };

  // Enforce non-destructive locks
  enforceNonDestructiveCompile(plan);

  // Calculate readiness
  plan.readiness = calculatePlanReadiness(plan);

  // Update status
  if (blockers.length > 0) {
    plan.status = 'blocked';
  } else if (plan.readiness.level === 'ready') {
    plan.status = 'ready_for_variant_run';
  } else {
    plan.status = 'compiled';
  }

  // Final sanitization
  const sanitized = sanitizeTransformationPlan(plan);

  return { ok: true, plan: sanitized };
}

// ─── Plan lifecycle ───────────────────────────────────────────────────────────

export function markPlanAsBlocked(plan, blockers) {
  return {
    ...plan,
    status: 'blocked',
    blockers: [...(plan.blockers || []), ...(blockers || [])],
    audit: { ...plan.audit, updatedAt: nowIso() },
  };
}

export function markPlanAsReady(plan) {
  if ((plan.blockers || []).length > 0) {
    return { ...plan, status: 'blocked' };
  }
  const criticals = (plan.risks || []).filter(r => r.severity === 'critical');
  if (criticals.length > 0) {
    return { ...plan, status: 'blocked', blockers: [...(plan.blockers || []), ...criticals.map(r => r.message)] };
  }
  return {
    ...plan,
    status: 'ready_for_variant_run',
    audit: { ...plan.audit, updatedAt: nowIso() },
  };
}

export function calculatePlanReadiness(plan) {
  let score = 0;
  const missing = [];

  if (plan.fileStructurePlan?.folders?.length > 0)           score += 15;
  else missing.push('File structure plan is empty.');

  if (plan.moduleActivationPlan?.activeModules?.length > 0)  score += 15;
  else missing.push('Module activation plan has no active modules.');

  if (plan.dataModelPlan?.entities?.length > 0)              score += 15;
  else missing.push('Data model plan has no entities.');

  if (plan.uiComponentPlan?.pages?.length > 0)               score += 15;
  else missing.push('UI component plan has no pages.');

  if (plan.stateTransitionPlan?.transitions?.length > 0)     score += 10;
  else missing.push('State transition plan has no transitions.');

  if (plan.futureRunSequence?.length > 0)                    score += 15;
  else missing.push('Future run sequence is empty.');

  if (plan.safetyCompliancePlan?.safetyLevel)                score += 10;
  else missing.push('Safety compliance plan is missing.');

  if ((plan.blockers || []).length === 0)                    score += 5;
  const criticals = (plan.risks || []).filter(r => r.severity === 'critical');
  if (criticals.length === 0)                                score += 0; // bonus captured above

  score = Math.min(100, score);

  let level;
  if (score >= 90 && (plan.blockers || []).length === 0) level = 'ready';
  else if (score >= 60)                                  level = 'ready_with_warnings';
  else if (score >= 30)                                  level = 'partial';
  else                                                   level = 'not_ready';

  if ((plan.blockers || []).length > 0) level = 'not_ready';

  return { score, level, missing };
}

export function enforceNonDestructiveCompile(plan) {
  // Hard-enforce — these may never be true in a plan
  plan.compileMode         = 'non_destructive';
  plan.allowFileWrites     = false;
  plan.allowOverwrite      = false;
  plan.destructiveRefactor = false;
  return plan;
}

export function sanitizeTransformationPlan(plan) {
  if (!plan || typeof plan !== 'object') return plan;
  const str    = JSON.stringify(plan);
  // Strip any accidentally included raw keys
  const cleaned = str.replace(/"(rawKey|raw_key|apiKey|api_key|secret|client_secret|private_key)"\s*:\s*"[^"]*"/gi,
    (_, key) => `"${key}":"[REDACTED]"`);
  try { return JSON.parse(cleaned); } catch { return plan; }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function compileTransformationPlan(blueprintId, state, agentRegistry) {
  // 1. Check compile locks
  const { ok: canCompile, reasons } = canCompilePlan(state);
  if (!canCompile) {
    return { ok: false, errors: reasons };
  }

  // 2. Find blueprint
  const bps = state?.blueprints?.items || [];
  const blueprint = bps.find(b => b.id === blueprintId);
  if (!blueprint) {
    return { ok: false, errors: [`Blueprint not found: "${blueprintId}"`] };
  }

  // 3. Validate blueprint for compilation
  const { valid, errors } = validateBlueprintForCompilation(blueprint, state);
  if (!valid) {
    return { ok: false, errors };
  }

  // 4. Build context (no raw keys included)
  const context = buildTransformationContext(blueprint, state, agentRegistry);

  // 5. Enforce locks on context
  const { ok: locksOk, violations } = enforceTransformationLocks({ compileMode: context.compilerState.compileMode }, state);
  if (!locksOk) {
    return { ok: false, errors: violations.map(v => v.message) };
  }

  // 6. Generate plan
  const result = generateTransformationPlan(context);
  if (!result.ok) {
    return { ok: false, errors: [result.error] };
  }

  return { ok: true, plan: result.plan };
}
