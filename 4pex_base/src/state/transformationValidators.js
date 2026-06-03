// 4P3X Transformation Validators — RUN 4

import { FORBIDDEN_PLAN_WORDS } from '../logic/transformer/transformationLocks.js';

// ─── Plan structure validator ─────────────────────────────────────────────────

export function validateTransformationPlan(plan) {
  const errors = [];
  if (!plan || typeof plan !== 'object') return { valid: false, errors: ['Plan must be a non-null object.'] };

  if (!plan.id)              errors.push('Plan must have an id.');
  if (!plan.blueprintId)     errors.push('Plan must have a blueprintId.');
  if (!plan.blueprintName)   errors.push('Plan must have a blueprintName.');
  if (!plan.productType)     errors.push('Plan must have a productType.');
  if (!plan.status)          errors.push('Plan must have a status.');
  if (plan.compileMode !== 'non_destructive') errors.push('compileMode must be non_destructive.');
  if (!plan.summary)         errors.push('Plan must have a summary.');
  if (!plan.audit?.createdAt) errors.push('Plan must have an audit.createdAt timestamp.');

  // Secret check
  const str = JSON.stringify(plan);
  if (/sk-[a-zA-Z0-9]{10,}/i.test(str)) errors.push('Plan contains raw API key — sanitize before saving.');

  // Demo language check
  for (const word of FORBIDDEN_PLAN_WORDS) {
    if (str.toLowerCase().includes(word)) {
      errors.push(`Plan contains forbidden wording: "${word}"`);
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateTransformationPlanReadiness(plan) {
  const issues = [];
  if (!plan) return { ready: false, issues: ['No plan.'] };

  if ((plan.blockers || []).length > 0) issues.push(`${plan.blockers.length} unresolved blocker(s).`);
  const criticals = (plan.risks || []).filter(r => r.severity === 'critical');
  if (criticals.length > 0) issues.push(`${criticals.length} critical risk(s) unresolved.`);
  if (!plan.fileStructurePlan?.folders?.length) issues.push('File structure plan is empty.');
  if (!plan.moduleActivationPlan?.activeModules?.length) issues.push('Module activation plan is empty.');
  if (!plan.futureRunSequence?.length) issues.push('Future run sequence is empty.');
  if ((plan.readiness?.score ?? 0) < 40) issues.push(`Readiness score (${plan.readiness?.score}) is below 40.`);

  return { ready: issues.length === 0, issues };
}

export function validateFileStructurePlan(fileStructurePlan) {
  const errors = [];
  if (!fileStructurePlan) { return { valid: false, errors: ['fileStructurePlan is required.'] }; }
  if (!Array.isArray(fileStructurePlan.folders)) errors.push('fileStructurePlan.folders must be an array.');
  if (!Array.isArray(fileStructurePlan.files)) errors.push('fileStructurePlan.files must be an array.');
  for (const f of fileStructurePlan.files || []) {
    if (!f.path)    errors.push(`File entry missing path: ${JSON.stringify(f)}`);
    if (!f.purpose) errors.push(`File entry missing purpose: ${f.path}`);
    if (f.doNotTouch && f.allowedToModify) errors.push(`File "${f.path}" is both doNotTouch and allowedToModify.`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateModuleActivationPlan(moduleActivationPlan) {
  const errors = [];
  if (!moduleActivationPlan) return { valid: false, errors: ['moduleActivationPlan is required.'] };
  if (!Array.isArray(moduleActivationPlan.activeModules))   errors.push('activeModules must be an array.');
  if (!Array.isArray(moduleActivationPlan.reservedModules)) errors.push('reservedModules must be an array.');
  if (!Array.isArray(moduleActivationPlan.futureModules))   errors.push('futureModules must be an array.');
  if (!Array.isArray(moduleActivationPlan.blockedModules))  errors.push('blockedModules must be an array.');
  return { valid: errors.length === 0, errors };
}

export function validateDataModelPlan(dataModelPlan) {
  const errors = [];
  if (!dataModelPlan) return { valid: false, errors: ['dataModelPlan is required.'] };
  if (!Array.isArray(dataModelPlan.entities)) { errors.push('dataModelPlan.entities must be an array.'); return { valid: false, errors }; }
  for (const e of dataModelPlan.entities) {
    if (!e.name)    errors.push(`Entity missing name.`);
    if (!e.purpose) errors.push(`Entity "${e.name}" missing purpose.`);
    if (!Array.isArray(e.fields) || e.fields.length === 0) errors.push(`Entity "${e.name}" must have fields.`);
    if (!e.sourceOfTruth) errors.push(`Entity "${e.name}" missing sourceOfTruth.`);
    if (!e.runToBuild) errors.push(`Entity "${e.name}" missing runToBuild.`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateUiComponentPlan(uiComponentPlan) {
  const errors = [];
  if (!uiComponentPlan) return { valid: false, errors: ['uiComponentPlan is required.'] };
  if (!Array.isArray(uiComponentPlan.pages))          errors.push('pages must be an array.');
  if (!Array.isArray(uiComponentPlan.components))     errors.push('components must be an array.');
  if (!Array.isArray(uiComponentPlan.layouts))        errors.push('layouts must be an array.');
  if (!Array.isArray(uiComponentPlan.requiredStates)) errors.push('requiredStates must be an array.');
  return { valid: errors.length === 0, errors };
}

export function validateStateTransitionPlan(stateTransitionPlan) {
  const errors = [];
  if (!stateTransitionPlan) return { valid: false, errors: ['stateTransitionPlan is required.'] };
  if (!Array.isArray(stateTransitionPlan.transitions)) { errors.push('transitions must be an array.'); return { valid: false, errors }; }
  for (const t of stateTransitionPlan.transitions) {
    if (!t.name)    errors.push(`Transition missing name.`);
    if (!t.from)    errors.push(`Transition "${t.name}" missing from.`);
    if (!t.to)      errors.push(`Transition "${t.name}" missing to.`);
    if (!t.trigger) errors.push(`Transition "${t.name}" missing trigger.`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateApiIntegrationPlan(apiIntegrationPlan) {
  const errors = [];
  if (!apiIntegrationPlan) return { valid: false, errors: ['apiIntegrationPlan is required.'] };
  if (!Array.isArray(apiIntegrationPlan.providers)) errors.push('providers must be an array.');
  if (typeof apiIntegrationPlan.clientSafeOnly !== 'boolean') errors.push('clientSafeOnly must be boolean.');
  if (typeof apiIntegrationPlan.backendProxyRequired !== 'boolean') errors.push('backendProxyRequired must be boolean.');
  const str = JSON.stringify(apiIntegrationPlan);
  if (/sk-[a-zA-Z0-9]{10,}/i.test(str)) errors.push('apiIntegrationPlan contains raw API key.');
  return { valid: errors.length === 0, errors };
}

export function validateAgentCapabilityPlan(agentCapabilityPlan) {
  const errors = [];
  if (!agentCapabilityPlan) return { valid: false, errors: ['agentCapabilityPlan is required.'] };
  if (agentCapabilityPlan.autonomyAllowed !== false) errors.push('autonomyAllowed must be false.');
  if (!Array.isArray(agentCapabilityPlan.requiredAgents)) errors.push('requiredAgents must be an array.');
  if (!Array.isArray(agentCapabilityPlan.allowedCapabilities)) errors.push('allowedCapabilities must be an array.');
  if (!Array.isArray(agentCapabilityPlan.forbiddenCapabilities)) errors.push('forbiddenCapabilities must be an array.');
  return { valid: errors.length === 0, errors };
}

export function validateSafetyCompliancePlan(safetyCompliancePlan) {
  const errors = [];
  if (!safetyCompliancePlan) return { valid: false, errors: ['safetyCompliancePlan is required.'] };
  if (!safetyCompliancePlan.safetyLevel) errors.push('safetyLevel is required.');
  if (!Array.isArray(safetyCompliancePlan.requiredWarnings)) errors.push('requiredWarnings must be an array.');
  if (!Array.isArray(safetyCompliancePlan.complianceBoundaries)) errors.push('complianceBoundaries must be an array.');
  return { valid: errors.length === 0, errors };
}

export function validateFutureRunSequence(futureRunSequence) {
  const errors = [];
  if (!Array.isArray(futureRunSequence)) return { valid: false, errors: ['futureRunSequence must be an array.'] };
  for (const run of futureRunSequence) {
    if (!run.run)     errors.push(`Run entry missing run identifier.`);
    if (!run.title)   errors.push(`Run "${run.run}" missing title.`);
    if (!run.mission) errors.push(`Run "${run.run}" missing mission.`);
    if (!Array.isArray(run.allowedFiles)) errors.push(`Run "${run.run}" allowedFiles must be an array.`);
    if (!Array.isArray(run.forbiddenFiles)) errors.push(`Run "${run.run}" forbiddenFiles must be an array.`);
    if (!Array.isArray(run.validationGates)) errors.push(`Run "${run.run}" validationGates must be an array.`);
    if (!Array.isArray(run.stopConditions)) errors.push(`Run "${run.run}" stopConditions must be an array.`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateTransformationLocks(plan) {
  const errors = [];
  if (!plan) return { valid: false, errors: ['No plan.'] };
  if (plan.compileMode !== 'non_destructive') errors.push('compileMode must be non_destructive.');
  if (plan.allowFileWrites === true) errors.push('allowFileWrites must be false.');
  if (plan.allowOverwrite === true) errors.push('allowOverwrite must be false.');
  if (plan.destructiveRefactor === true) errors.push('destructiveRefactor must be false.');
  return { valid: errors.length === 0, errors };
}
