// 4P3X Transformation Risk Scanner — RUN 4
// Scans compilation context for risks before plan is finalised.
// Returns structured risk objects. Critical risks block plan readiness.

import { FORBIDDEN_PLAN_WORDS } from './transformationLocks.js';

// ─── Risk builder ────────────────────────────────────────────────────────────

function risk(id, severity, category, message, mitigation) {
  return { id, severity, category, message, mitigation };
}

// ─── Main scanner ────────────────────────────────────────────────────────────

export function scanTransformationRisks(context) {
  if (!context || typeof context !== 'object') {
    return [risk('ctx_missing', 'critical', 'context', 'No compilation context provided.', 'Ensure blueprint and state are loaded before scanning.')];
  }

  const risks = [
    ...detectSSOTRisk(context),
    ...detectFeatureCreepRisk(context),
    ...detectSecretExposureRisk(context),
    ...detectDuplicateModuleRisk(context),
    ...detectDestructiveRefactorRisk(context),
    ...detectSafetyCriticalRisk(context),
    ...detectBackendAssumptionRisk(context),
    ...detectDemoLanguageRisk(context),
  ];

  return risks;
}

// ─── Individual risk detectors ───────────────────────────────────────────────

export function detectSSOTRisk(context) {
  const risks = [];
  const { compilerState } = context;
  if (compilerState?.allowFileWrites === true) {
    risks.push(risk('ssot_file_writes', 'critical', 'ssot', 'allowFileWrites is enabled — plans must not write files.', 'Ensure allowFileWrites remains false in transformation compiler state.'));
  }
  if (compilerState?.allowOverwrite === true) {
    risks.push(risk('ssot_overwrite', 'critical', 'ssot', 'allowOverwrite is enabled — existing code must not be overwritten.', 'Ensure allowOverwrite remains false.'));
  }
  if (compilerState?.compileMode !== 'non_destructive') {
    risks.push(risk('ssot_compile_mode', 'critical', 'ssot', `Compile mode is "${compilerState?.compileMode}" — must be non_destructive.`, 'Reset compile mode to non_destructive.'));
  }
  return risks;
}

export function detectFeatureCreepRisk(context) {
  const risks = [];
  const { blueprint } = context;
  if (!blueprint) return risks;

  const modules = [...(blueprint.coreModules || []), ...(blueprint.optionalModules || [])];
  if (modules.length > 20) {
    risks.push(risk('feature_creep_modules', 'warning', 'scope', `Blueprint has ${modules.length} modules — unusually high count may indicate scope creep.`, 'Review module list and remove any that are not required for this product type.'));
  }

  const flows = blueprint.mainUserFlows || [];
  if (flows.length > 15) {
    risks.push(risk('feature_creep_flows', 'warning', 'scope', `Blueprint has ${flows.length} user flows — consider splitting into sub-products.`, 'Group user flows into logical runs and defer non-essential flows to future runs.'));
  }

  const agents = blueprint.aiAgentNeeds || [];
  if (agents.some(a => String(a).toLowerCase().includes('autonomous'))) {
    risks.push(risk('feature_creep_autonomy', 'critical', 'scope', 'Blueprint lists autonomous agent requirements — not permitted in current run scope.', 'Remove autonomous agent requirements. All agents must be advisory-only.'));
  }

  return risks;
}

export function detectSecretExposureRisk(context) {
  const risks = [];
  const str = JSON.stringify(context || {});

  if (/sk-[a-zA-Z0-9]{10,}/i.test(str)) {
    risks.push(risk('secret_raw_key', 'critical', 'security', 'Raw API key detected in compilation context.', 'Remove raw API keys from blueprint and state before compiling. Use masked references only.'));
  }

  const dangerousFields = ['rawKey', 'raw_key', 'secret_key', 'client_secret', 'private_key', 'supabase_service_key'];
  for (const field of dangerousFields) {
    if (str.includes(`"${field}"`)) {
      risks.push(risk(`secret_field_${field}`, 'critical', 'security', `Forbidden secret field name detected: "${field}"`, `Remove the "${field}" field from all plans and exports.`));
    }
  }

  return risks;
}

export function detectDuplicateModuleRisk(context) {
  const risks = [];
  const { blueprint } = context;
  if (!blueprint) return risks;

  const allModules = [...(blueprint.coreModules || []), ...(blueprint.optionalModules || [])];
  const seen = new Set();
  for (const m of allModules) {
    if (seen.has(m)) {
      risks.push(risk(`dup_module_${m}`, 'warning', 'modules', `Duplicate module reference: "${m}"`, `Remove duplicate "${m}" from blueprint module list.`));
    }
    seen.add(m);
  }

  return risks;
}

export function detectDestructiveRefactorRisk(context) {
  const risks = [];
  const { compilerState } = context;

  if (compilerState?.allowDestructiveRefactor === true) {
    risks.push(risk('destructive_refactor', 'critical', 'safety', 'allowDestructiveRefactor is enabled — Run 4 must never destructively refactor existing files.', 'Ensure allowDestructiveRefactor remains false.'));
  }

  const protectedFiles = [
    'src/state/storage.js',
    'src/state/initialState.js',
    'src/config/appConfig.js',
    'src/config/moduleRegistry.js',
  ];

  const filesPlan = context?.fileStructurePlan?.files || [];
  for (const f of filesPlan) {
    if (f.allowedToModify && protectedFiles.includes(f.path)) {
      risks.push(risk(`destructive_protected_${f.path.replace(/\//g, '_')}`, 'critical', 'safety', `Protected file marked as allowedToModify: "${f.path}"`, `Mark "${f.path}" as doNotTouch in the file plan.`));
    }
  }

  return risks;
}

export function detectSafetyCriticalRisk(context) {
  const risks = [];
  const { blueprint } = context;
  if (!blueprint) return risks;

  const safetyLevel = blueprint.safetyLevel || 'standard';
  const type = blueprint.productType || '';

  const safetyTypes = ['fleet', 'navigation', 'medical', 'cybersecurity', 'legal', 'financial_compliance', 'health'];
  const isSafetyCritical = safetyTypes.some(t => type.toLowerCase().includes(t)) || safetyLevel === 'safety_critical';

  if (isSafetyCritical) {
    risks.push(risk('safety_critical_type', 'warning', 'safety', `Product type "${type}" is safety-critical. Additional compliance boundaries are required.`, 'Ensure safety/compliance plan includes human override, data freshness warnings, and responsibility boundaries.'));

    if (!(blueprint.lockedRules || []).some(r => r.includes('human_override') || r.includes('safety'))) {
      risks.push(risk('safety_no_override_rule', 'critical', 'safety', 'Safety-critical blueprint is missing human override rule.', 'Add human_override_required to blueprint lockedRules.'));
    }
  }

  return risks;
}

export function detectBackendAssumptionRisk(context) {
  const risks = [];
  const { blueprint } = context;
  if (!blueprint) return risks;

  const stateMode = blueprint.stateMode || 'local';
  const apis = blueprint.apiIntegrationNeeds || [];

  if (stateMode === 'supabase' || stateMode === 'remote') {
    risks.push(risk('backend_early_supabase', 'warning', 'backend', `Blueprint stateMode is "${stateMode}" — Supabase integration is a future run only.`, 'Current run uses local-first state. Remote sync is deferred to a future backend run.'));
  }

  const backendOnlyApis = apis.filter(a => {
    const str = String(a).toLowerCase();
    return str.includes('supabase') || str.includes('firebase') || str.includes('backend') || str.includes('server');
  });

  if (backendOnlyApis.length > 0) {
    risks.push(risk('backend_api_assumption', 'warning', 'backend', `Blueprint lists ${backendOnlyApis.length} backend-requiring API(s). These require a future proxy/backend run.`, 'Mark these APIs as "backend proxy required" in the API integration plan. Do not implement in Run 4.'));
  }

  return risks;
}

export function detectDemoLanguageRisk(context) {
  const risks = [];
  const str = JSON.stringify(context || {}).toLowerCase();

  for (const word of FORBIDDEN_PLAN_WORDS) {
    if (str.includes(word.toLowerCase())) {
      risks.push(risk(`demo_lang_${word.replace(/\s/g, '_')}`, 'warning', 'language', `Forbidden wording detected in compilation context: "${word}"`, `Remove all "${word}" references. Use production terminology only.`));
    }
  }

  return risks;
}
