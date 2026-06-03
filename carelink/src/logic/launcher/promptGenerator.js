// 4P3X Prompt Generator — Run 5
// Generates isolated, copy-paste-ready future run prompts.
// Does not execute builds. Does not call external APIs. Does not write variant files.

import { getRunForProduct, getRunSequenceForProduct } from '../../config/productRunSequences.js';
import { compileRunScope } from './runScopeCompiler.js';
import { compileFilePermissions } from './filePermissionCompiler.js';
import { compileValidationGates, compilePostRunTests } from './validationGateCompiler.js';
import { compileAcceptanceCriteria } from './acceptanceCriteriaCompiler.js';
import { compileStopConditions } from './stopConditionCompiler.js';
import { compileRollbackGuidance } from './rollbackCompiler.js';
import { scanPromptSafety } from './promptSafetyScanner.js';
import { validatePromptCompleteness } from './promptCompletenessValidator.js';
import {
  injectProjectIdentity,
  injectRunScope,
  injectSafetyRules,
  buildPromptSections,
  assembleFullPromptText,
} from './promptTemplateFactory.js';

function nowIso() {
  return new Date().toISOString();
}

function generateId() {
  return 'prompt_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now();
}

export function buildPromptContext(transformationPlan, runDef, state) {
  const productType = transformationPlan?.productType || 'customProductSystem';
  const productLabel = transformationPlan?.productTypeName || productType;
  const runNumber = runDef?.runNumber || 'Run 6';
  const runSequence = getRunSequenceForProduct(productType);
  const preservedRuns = ['Run 1', 'Run 2', 'Run 3', 'Run 4', 'Run 5'];

  const runScope = compileRunScope(productType, runNumber, transformationPlan);

  let context = {
    projectName: '4P3X Reusable Base Structure™',
    productType,
    productLabel: runSequence?.productLabel || productLabel,
    runNumber,
    runTitle: runDef?.title || runNumber,
    mission: runDef?.mission || '',
    missionPoints: [
      ...(runDef?.requiredModules?.map((m) => `Create module: ${m}`) || []),
      ...(runDef?.requiredDataModels?.map((m) => `Create data model: ${m}`) || []),
      ...(runDef?.requiredUiScreens?.map((s) => `Build UI screen: ${s}`) || []),
    ],
    preservedRuns,
    lastPreservedRun: 'Run 5',
    allowedFiles: runScope.allowedFiles,
    forbiddenFiles: runScope.forbiddenFiles,
    requiredModules: runScope.allowedModules,
    requiredDataModels: runDef?.requiredDataModels || [],
    requiredUiScreens: runDef?.requiredUiScreens || [],
    requiredStateTransitions: runDef?.requiredStateTransitions || [],
    implementationRequirements: [
      'The app must compile with npm run build',
      'The app must start with npm run dev',
      'No backend required',
      'No Supabase required (unless this is a Supabase product run)',
      'No external API keys required at build time',
    ],
    uiRequirements: [
      'All new pages use Card component system',
      'All new pages are mobile responsive',
      'Empty states present for all lists',
      'Error states present for failed operations',
    ],
    stateLogicRules: [
      'All new state added to initialState.js schema first',
      'All mutations go through storage.js functions',
      'No component directly reads/writes localStorage',
      'No duplicate state keys',
    ],
    validationGates: compileValidationGates(productType, runNumber, transformationPlan),
    acceptanceCriteria: compileAcceptanceCriteria(productType, runNumber, transformationPlan),
    stopConditions: compileStopConditions(productType, runNumber, transformationPlan),
    rollbackGuidance: compileRollbackGuidance(productType, runNumber, transformationPlan),
    runChecklist: [
      ...(runDef?.requiredModules?.map((m) => `${m} module created and active`) || []),
      ...(runDef?.requiredDataModels?.map((m) => `${m} data model persists via storage.js`) || []),
      ...(runDef?.requiredUiScreens?.map((s) => `${s} renders without errors`) || []),
    ],
  };

  context = injectProjectIdentity(context);
  context = injectRunScope(context, runScope);
  context = injectSafetyRules(context);

  return context;
}

export function assemblePromptFromSections(context) {
  const sections = buildPromptSections(context);
  return assembleFullPromptText(sections);
}

export function generatePromptForRun(transformationPlanId, runNumber, state) {
  const plan = findPlan(transformationPlanId, state);
  if (!plan) {
    return { error: 'Transformation plan not found. Compile a plan in the Transformation Compiler first.' };
  }

  const validStatuses = ['ready_for_variant_run', 'ready_with_warnings'];
  if (!validStatuses.includes(plan.status)) {
    return { error: `Transformation plan status is "${plan.status}". Plan must be ready_for_variant_run before generating prompts.` };
  }

  const productType = plan.productType || 'customProductSystem';
  const runDef = getRunForProduct(productType, runNumber);
  if (!runDef) {
    return { error: `No run definition found for product type "${productType}", run "${runNumber}".` };
  }

  const context = buildPromptContext(plan, runDef, state);
  const promptText = assemblePromptFromSections(context);
  const safetyResult = scanPromptSafety(promptText);
  const completenessResult = validatePromptCompleteness(promptText);

  let status = 'draft';
  if (!safetyResult.passed) status = 'needs_review';
  else if (completenessResult.score >= 85) status = 'ready_to_copy';
  else if (completenessResult.score >= 60) status = 'validated';

  const runScope = compileRunScope(productType, runNumber, plan);
  const filePerms = compileFilePermissions(runScope);

  const prompt = {
    id: generateId(),
    transformationPlanId: plan.id,
    blueprintId: plan.blueprintId || null,
    productType,
    runNumber,
    title: `${runNumber}: ${runDef.title}`,
    mission: runDef.mission,
    promptText,
    status,
    safety: safetyResult,
    completeness: {
      score: completenessResult.score,
      missingSections: completenessResult.missingSections,
      requiredSectionsPresent: completenessResult.requiredSectionsPresent,
    },
    scope: {
      allowedFiles: runScope.allowedFiles,
      forbiddenFiles: runScope.forbiddenFiles,
      allowedModules: runScope.allowedModules,
      forbiddenModules: runScope.forbiddenModules,
      requiredOutputs: runScope.requiredOutputs,
    },
    validation: {
      gates: context.validationGates,
      acceptanceCriteria: context.acceptanceCriteria,
      postRunTests: compilePostRunTests(productType, runNumber, plan),
    },
    controls: {
      stopConditions: context.stopConditions,
      rollbackGuidance: context.rollbackGuidance,
      noTouchRules: filePerms.doNotTouchRules.filter((r) => r.enforced).map((r) => r.file),
      ssotRules: [
        'Only storage.js may read/write localStorage',
        'All new state must be added to initialState.js first',
        'No component may directly mutate localStorage',
      ],
    },
    audit: {
      createdAt: nowIso(),
      updatedAt: nowIso(),
      copiedAt: null,
      exportedAt: null,
    },
  };

  return { prompt, error: null };
}

export function generateAllPromptsForPlan(transformationPlanId, state) {
  const plan = findPlan(transformationPlanId, state);
  if (!plan) {
    return { prompts: [], errors: ['Transformation plan not found.'] };
  }

  const validStatuses = ['ready_for_variant_run', 'ready_with_warnings'];
  if (!validStatuses.includes(plan.status)) {
    return { prompts: [], errors: [`Plan status "${plan.status}" is not ready.`] };
  }

  const productType = plan.productType || 'customProductSystem';
  const seq = getRunSequenceForProduct(productType);
  if (!seq || !seq.runs?.length) {
    return { prompts: [], errors: [`No run sequence found for product type "${productType}".`] };
  }

  const prompts = [];
  const errors = [];

  for (const runDef of seq.runs) {
    const result = generatePromptForRun(transformationPlanId, runDef.runNumber, state);
    if (result.error) {
      errors.push(`${runDef.runNumber}: ${result.error}`);
    } else {
      prompts.push(result.prompt);
    }
  }

  return { prompts, errors };
}

export function validateGeneratedPrompt(prompt) {
  if (!prompt || typeof prompt !== 'object') return { valid: false, error: 'Prompt must be a non-null object.' };
  if (!prompt.id) return { valid: false, error: 'Prompt missing id.' };
  if (!prompt.transformationPlanId) return { valid: false, error: 'Prompt missing transformationPlanId.' };
  if (!prompt.productType) return { valid: false, error: 'Prompt missing productType.' };
  if (!prompt.runNumber) return { valid: false, error: 'Prompt missing runNumber.' };
  if (!prompt.title) return { valid: false, error: 'Prompt missing title.' };
  if (!prompt.promptText) return { valid: false, error: 'Prompt missing promptText.' };
  if (!prompt.audit?.createdAt) return { valid: false, error: 'Prompt missing audit.createdAt.' };

  // Safety check: no raw API keys
  const secretPatterns = [/sk-[a-zA-Z0-9]{20,}/, /eyJ[a-zA-Z0-9._-]{50,}/, /service_role_key\s*=/i];
  for (const pattern of secretPatterns) {
    if (pattern.test(prompt.promptText)) {
      return { valid: false, error: 'Prompt contains a possible raw secret key.' };
    }
  }

  return { valid: true };
}

export function sanitizeGeneratedPrompt(prompt) {
  if (!prompt) return null;
  const sanitized = { ...prompt };

  // Remove any raw secret-looking strings from promptText as a safeguard
  if (sanitized.promptText) {
    sanitized.promptText = sanitized.promptText
      .replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED_KEY]')
      .replace(/eyJ[a-zA-Z0-9._-]{50,}/g, '[REDACTED_TOKEN]')
      .replace(/service_role_key\s*=\s*["'][^"']+["']/gi, 'service_role_key=[REDACTED]');
  }

  return sanitized;
}

function findPlan(planId, state) {
  const plans = state?.transformationCompiler?.plans || [];
  if (planId) {
    return plans.find((p) => p.id === planId) || null;
  }
  // Fall back to active plan
  const activePlanId = state?.transformationCompiler?.activePlanId;
  return activePlanId ? plans.find((p) => p.id === activePlanId) || null : null;
}
