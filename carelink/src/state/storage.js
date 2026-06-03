// 4P3X Reusable Base Structure™
// storage.js — Single Source of Truth (SSOT)
// RUN 1 + RUN 2 + RUN 3 — Extended safely. No Run 1 or Run 2 functions removed.
// All persisted state MUST go through this module.

import { createInitialState } from './initialState.js';
import { validateState, validateAiProviderConfig } from './validators.js';
import { validateBlueprint, calculateBlueprintReadiness, createBlueprintFromPreset as _createBPFromPreset } from './blueprintValidators.js';
import { sanitizeBlueprintForExport, importBlueprintFromJson } from '../utils/blueprintExport.js';
import { safeParseJson, safeStringifyJson } from '../utils/safeJson.js';
import { nowIso } from '../utils/date.js';
import { generateId } from '../utils/id.js';

const STORAGE_KEY = '4p3x_reusable_base_state_v1';

let _state = null;
const _listeners = new Set();

// ─── Internal Helpers ─────────────────────────────────────────────────

function _isLocalStorageAvailable() {
  try {
    const test = '__4p3x_test__';
    localStorage.setItem(test, '1');
    localStorage.removeItem(test);
    return true;
  } catch { return false; }
}

function _persist(state) {
  if (!_isLocalStorageAvailable()) return;
  // Strip _rawKey before persisting — it must never reach localStorage
  const toSave = { ...state };
  delete toSave._rawKey;
  const { ok, value, error } = safeStringifyJson(toSave);
  if (!ok) { console.warn('[4P3X SSOT] Persist failed:', error); return; }
  try { localStorage.setItem(STORAGE_KEY, value); }
  catch (e) { console.warn('[4P3X SSOT] localStorage write failed:', e.message); }
}

function _notify() {
  for (const listener of _listeners) { try { listener(_state); } catch {} }
}

function _deepMerge(base, override) {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      override[key] !== null && typeof override[key] === 'object' && !Array.isArray(override[key]) &&
      base[key]    !== null && typeof base[key]    === 'object' && !Array.isArray(base[key])
    ) {
      result[key] = _deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

// ─── Run 1 Core API ───────────────────────────────────────────────────

export function getState() {
  if (_state) return _state;
  if (!_isLocalStorageAvailable()) {
    _state = createInitialState();
    return _state;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      _state = createInitialState();
      _persist(_state);
      return _state;
    }
    const { ok, data, error } = safeParseJson(raw);
    if (!ok) {
      console.warn('[4P3X SSOT] Parse error, resetting:', error);
      _state = createInitialState();
      _persist(_state);
      return _state;
    }
    const merged = _deepMerge(createInitialState(), data);
    const { valid, error: validErr } = validateState(merged);
    if (!valid) {
      console.warn('[4P3X SSOT] Validation error, resetting:', validErr);
      _state = createInitialState();
      _persist(_state);
      return _state;
    }
    _state = merged;
    return _state;
  } catch (e) {
    console.warn('[4P3X SSOT] Load failed, resetting:', e.message);
    _state = createInitialState();
    _persist(_state);
    return _state;
  }
}

export function setState(updater) {
  const current = getState();
  const next = typeof updater === 'function' ? updater(current) : _deepMerge(current, updater);
  next.audit = { ...next.audit, updatedAt: nowIso() };
  const { valid, error } = validateState(next);
  if (!valid) {
    console.warn('[4P3X SSOT] setState rejected:', error);
    return { ok: false, error };
  }
  _state = next;
  _persist(_state);
  _notify();
  return { ok: true };
}

export function resetState() {
  _state = createInitialState();
  _persist(_state);
  _notify();
}

export function exportState() {
  const state = getState();
  const safe = _deepMerge({}, state);
  if (safe.aiSettings) {
    safe.aiSettings = { ...safe.aiSettings };
    delete safe.aiSettings._rawKey;
  }
  // Sanitize blueprints
  if (safe.blueprints?.items) {
    safe.blueprints = {
      ...safe.blueprints,
      items: safe.blueprints.items.map(sanitizeBlueprintForExport),
    };
  }
  return safe;
}

export function importState(json) {
  if (typeof json === 'string') {
    const { ok, data, error } = safeParseJson(json);
    if (!ok) return { ok: false, error };
    json = data;
  }
  if (typeof json !== 'object' || json === null) {
    return { ok: false, error: 'Imported state must be a JSON object.' };
  }
  const merged = _deepMerge(createInitialState(), json);
  const { valid, error } = validateState(merged);
  if (!valid) return { ok: false, error };
  if (merged.aiSettings) delete merged.aiSettings._rawKey;
  merged.audit = { ...merged.audit, updatedAt: nowIso() };
  _state = merged;
  _persist(_state);
  _notify();
  return { ok: true };
}

export function subscribe(listener) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

export { validateState };

export function maskApiKey(key) {
  if (!key || typeof key !== 'string' || key.length < 5) return '••••••••';
  return key.slice(0, 4) + '•'.repeat(Math.min(key.length - 4, 20));
}

export { validateAiProviderConfig };

export function saveAiProviderConfig(config) {
  const { valid, error } = validateAiProviderConfig(config);
  if (!valid) return { ok: false, error };
  const masked = config.apiKey ? maskApiKey(config.apiKey) : '';
  const result = setState((prev) => ({
    ...prev,
    aiSettings: {
      ...prev.aiSettings,
      provider:         config.provider || 'none',
      model:            config.model || '',
      apiKeyConfigured: Boolean(config.apiKey && config.apiKey.length > 4),
      apiKeyMasked:     masked,
      baseUrl:          config.baseUrl || '',
      testStatus:       'not_tested',
      localOnlyMode:    config.localOnlyMode !== undefined ? config.localOnlyMode : prev.aiSettings.localOnlyMode,
    },
    health: {
      ...prev.health,
      aiConfig: config.provider && config.provider !== 'none' ? 'configured' : 'not_configured',
    },
  }));
  if (result.ok && config.apiKey) _state._rawKey = config.apiKey;
  return result;
}

export function clearAiProviderConfig() {
  if (_state) delete _state._rawKey;
  return setState((prev) => ({
    ...prev,
    aiSettings: {
      ...prev.aiSettings,
      provider: 'none', model: '', apiKeyConfigured: false,
      apiKeyMasked: '', baseUrl: '', testStatus: 'not_tested', lastTestedAt: null,
    },
    health: { ...prev.health, aiConfig: 'not_configured' },
  }));
}

export function testAiProviderConfig(config) {
  const current    = getState();
  const aiSettings = current.aiSettings;
  const provider   = config?.provider || aiSettings.provider;
  const apiKey     = config?.apiKey || (_state && _state._rawKey) || '';
  const baseUrl    = config?.baseUrl || aiSettings.baseUrl;

  setState((prev) => ({ ...prev, aiSettings: { ...prev.aiSettings, testStatus: 'testing' } }));

  const errors = [];
  if (!provider || provider === 'none') errors.push('No provider selected.');
  const requiresKey = ['openai', 'anthropic', 'google', 'groq', 'openrouter'];
  if (requiresKey.includes(provider) && !apiKey) errors.push('API key required for this provider.');
  const requiresUrl = ['ollama', 'customEndpoint'];
  if (requiresUrl.includes(provider) && !baseUrl) errors.push('Base URL required for this provider.');

  const status = errors.length === 0 ? 'success' : 'failed';
  setState((prev) => ({
    ...prev,
    aiSettings: { ...prev.aiSettings, testStatus: status, lastTestedAt: nowIso() },
  }));
  return { ok: status === 'success', status, errors };
}

// ─── Run 2 Blueprint API ───────────────────────────────────────────────

export function createBlueprintFromPreset(presetId) {
  const result = _createBPFromPreset(presetId);
  if (!result.ok) return result;
  const blueprint = result.blueprint;

  const saveResult = setState((prev) => ({
    ...prev,
    blueprints: {
      ...prev.blueprints,
      items:             [...(prev.blueprints?.items || []), blueprint],
      activeBlueprintId: blueprint.id,
    },
  }));

  if (!saveResult.ok) return { ok: false, error: saveResult.error };
  return { ok: true, blueprint };
}

export function saveBlueprint(blueprint) {
  if (!blueprint || !blueprint.id) return { ok: false, error: 'Blueprint must have an id.' };
  const { valid, errors } = validateBlueprint(blueprint);
  const readiness = calculateBlueprintReadiness(blueprint);
  const updated = {
    ...blueprint,
    readiness,
    status: valid ? (readiness.score >= 70 ? 'validated' : 'needs_work') : 'needs_work',
    audit:  { ...blueprint.audit, updatedAt: nowIso() },
  };

  return setState((prev) => {
    const items    = prev.blueprints?.items || [];
    const exists   = items.find((b) => b.id === updated.id);
    const newItems = exists
      ? items.map((b) => (b.id === updated.id ? updated : b))
      : [...items, updated];
    return {
      ...prev,
      blueprints: { ...prev.blueprints, items: newItems },
    };
  });
}

export function updateBlueprint(blueprintId, updates) {
  const state = getState();
  const existing = (state.blueprints?.items || []).find((b) => b.id === blueprintId);
  if (!existing) return { ok: false, error: `Blueprint not found: "${blueprintId}"` };
  const merged = { ...existing, ...updates, id: blueprintId };
  return saveBlueprint(merged);
}

export function deleteBlueprint(blueprintId) {
  return setState((prev) => {
    const items = (prev.blueprints?.items || []).filter((b) => b.id !== blueprintId);
    const active = prev.blueprints?.activeBlueprintId;
    const newActive = active === blueprintId
      ? (items.length > 0 ? items[items.length - 1].id : null)
      : active;
    return {
      ...prev,
      blueprints: { ...prev.blueprints, items, activeBlueprintId: newActive },
    };
  });
}

export function duplicateBlueprint(blueprintId) {
  const state = getState();
  const original = (state.blueprints?.items || []).find((b) => b.id === blueprintId);
  if (!original) return { ok: false, error: `Blueprint not found: "${blueprintId}"` };

  const now  = nowIso();
  const copy = {
    ...original,
    id:     generateId('bp'),
    name:   original.name + ' (Copy)',
    status: 'draft',
    audit:  { createdAt: now, updatedAt: now },
  };

  return setState((prev) => ({
    ...prev,
    blueprints: {
      ...prev.blueprints,
      items:             [...(prev.blueprints?.items || []), copy],
      activeBlueprintId: copy.id,
    },
  }));
}

export function setActiveBlueprint(blueprintId) {
  const state = getState();
  const exists = (state.blueprints?.items || []).find((b) => b.id === blueprintId);
  if (!exists) return { ok: false, error: `Blueprint not found: "${blueprintId}"` };

  return setState((prev) => ({
    ...prev,
    blueprints: { ...prev.blueprints, activeBlueprintId: blueprintId },
  }));
}

export function exportBlueprint(blueprintId) {
  const state = getState();
  const bp = (state.blueprints?.items || []).find((b) => b.id === blueprintId);
  if (!bp) return { ok: false, error: `Blueprint not found: "${blueprintId}"` };
  const safe = sanitizeBlueprintForExport(bp);
  const { ok, value, error } = safeStringifyJson(safe, 2);
  if (!ok) return { ok: false, error };

  setState((prev) => ({
    ...prev,
    blueprints: { ...prev.blueprints, lastExportedAt: nowIso() },
  }));

  return { ok: true, json: value };
}

export function importBlueprint(json) {
  const result = importBlueprintFromJson(json);
  if (!result.ok) {
    setState((prev) => ({
      ...prev,
      blueprints: { ...prev.blueprints, importStatus: 'failed' },
    }));
    return result;
  }

  const blueprint = {
    ...result.blueprint,
    id:    generateId('bp'),  // always assign a fresh id on import
    audit: { ...(result.blueprint.audit || {}), updatedAt: nowIso() },
  };
  blueprint.readiness = calculateBlueprintReadiness(blueprint);

  const saveResult = setState((prev) => ({
    ...prev,
    blueprints: {
      ...prev.blueprints,
      items:        [...(prev.blueprints?.items || []), blueprint],
      importStatus: 'success',
    },
  }));

  if (!saveResult.ok) return { ok: false, error: saveResult.error };
  return { ok: true, blueprint };
}

export function validateBlueprintBeforeSave(blueprint) {
  return validateBlueprint(blueprint);
}

export function calculateTransformationReadiness() {
  const state = getState();
  const items = state.blueprints?.items || [];
  if (items.length === 0) {
    setState((prev) => ({
      ...prev,
      transformation: {
        ...prev.transformation,
        readinessScore:      0,
        readinessLevel:      'not_ready',
        missingRequirements: ['No blueprints defined.'],
        recommendedNextRun:  'Run 3',
      },
    }));
    return { score: 0, level: 'not_ready' };
  }

  // Use active blueprint if set, else best-scoring one
  const activeId = state.blueprints?.activeBlueprintId;
  const bp = activeId
    ? items.find((b) => b.id === activeId) || items[0]
    : items.reduce((best, b) => (b.readiness?.score || 0) > (best.readiness?.score || 0) ? b : best, items[0]);

  const readiness = calculateBlueprintReadiness(bp);

  setState((prev) => ({
    ...prev,
    transformation: {
      ...prev.transformation,
      readinessScore:      readiness.score,
      readinessLevel:      readiness.level,
      missingRequirements: readiness.missing,
      recommendedNextRun:  readiness.score >= 70 ? 'Run 3' : 'Complete blueprint first',
    },
  }));

  return readiness;
}

// ─── Run 3 Agent System API ───────────────────────────────────────────────────
// All agent state goes through these functions only.
// No component may write agent data directly to localStorage.

import { validateAgentRun, validateRecommendation, validateAgentSystem } from './agentValidators.js';
import { runAgentAnalysis as _runAgentAnalysis, runAllAdvisoryAgents as _runAll, getAgentContext } from '../logic/agents/agentEngine.js';
import { sanitizeAgentReportExport } from '../utils/agentOutput.js';

/**
 * Run a single advisory agent and persist results.
 * Returns { ok, agentRun, recommendations, errors }
 */
export function runAgent(agentId, customContext) {
  const state   = getState();
  const context = customContext || getAgentContext(state);
  const result  = _runAgentAnalysis(agentId, context);

  if (!result.ok) return result;

  // Persist run and recommendations
  saveAgentRun(result.agentRun);
  for (const rec of result.recommendations) {
    addAgentRecommendation(rec);
  }

  // Update lastRunAt
  setState((prev) => ({
    ...prev,
    agentSystem: {
      ...prev.agentSystem,
      lastRunAt:    nowIso(),
      activeAgentId: agentId,
    },
    health: { ...prev.health, agentSystem: 'ready' },
  }));

  return result;
}

/**
 * Run all active advisory agents and persist all results.
 * Returns array of results.
 */
export function runAllAgents(customContext) {
  const state   = getState();
  const context = customContext || getAgentContext(state);
  const results = _runAll(context);

  for (const result of results) {
    if (result.ok && result.agentRun) {
      saveAgentRun(result.agentRun);
      for (const rec of result.recommendations || []) {
        addAgentRecommendation(rec);
      }
    }
  }

  setState((prev) => ({
    ...prev,
    agentSystem: { ...prev.agentSystem, lastRunAt: nowIso(), activeAgentId: null },
  }));

  return results;
}

/**
 * Save a single agent run to state.
 */
export function saveAgentRun(agentRun) {
  const { valid, errors } = validateAgentRun(agentRun);
  if (!valid) {
    console.warn('[4P3X Agent] saveAgentRun rejected:', errors);
    return { ok: false, errors };
  }
  return setState((prev) => ({
    ...prev,
    agentSystem: {
      ...prev.agentSystem,
      agentRuns: [...(prev.agentSystem?.agentRuns || []), agentRun],
    },
  }));
}

/**
 * Add a recommendation to the queue.
 */
export function addAgentRecommendation(recommendation) {
  const { valid, errors } = validateRecommendation(recommendation);
  if (!valid) {
    console.warn('[4P3X Agent] addAgentRecommendation rejected:', errors);
    return { ok: false, errors };
  }
  return setState((prev) => ({
    ...prev,
    agentSystem: {
      ...prev.agentSystem,
      recommendationQueue: [...(prev.agentSystem?.recommendationQueue || []), recommendation],
    },
  }));
}

/**
 * Update an existing recommendation by id.
 */
export function updateAgentRecommendation(recommendationId, updates) {
  if (!recommendationId) return { ok: false, error: 'recommendationId required.' };
  return setState((prev) => {
    const queue = prev.agentSystem?.recommendationQueue || [];
    const exists = queue.find((r) => r.id === recommendationId);
    if (!exists) return prev;
    const updated = { ...exists, ...updates, id: recommendationId, updatedAt: nowIso() };
    return {
      ...prev,
      agentSystem: {
        ...prev.agentSystem,
        recommendationQueue: queue.map((r) => r.id === recommendationId ? updated : r),
      },
    };
  });
}

/**
 * Set recommendation status to dismissed.
 */
export function dismissAgentRecommendation(recommendationId) {
  return updateAgentRecommendation(recommendationId, { status: 'dismissed' });
}

/**
 * Set recommendation status to accepted.
 */
export function acceptAgentRecommendation(recommendationId) {
  return updateAgentRecommendation(recommendationId, { status: 'accepted' });
}

/**
 * Set recommendation status to converted_to_future_run.
 */
export function convertRecommendationToFutureRun(recommendationId) {
  return updateAgentRecommendation(recommendationId, { status: 'converted_to_future_run' });
}

/**
 * Clear all recommendations (requires explicit call — user must confirm in UI).
 */
export function clearAgentRecommendations() {
  return setState((prev) => ({
    ...prev,
    agentSystem: { ...prev.agentSystem, recommendationQueue: [] },
  }));
}

/**
 * Clear all agent runs (requires explicit call — user must confirm in UI).
 */
export function clearAgentRuns() {
  return setState((prev) => ({
    ...prev,
    agentSystem: { ...prev.agentSystem, agentRuns: [], activeAgentId: null, lastRunAt: null },
  }));
}

/**
 * Export sanitized agent report. Never includes raw secrets.
 */
export function exportAgentReport() {
  const state = getState();
  const bpItems  = state.blueprints?.items || [];
  const activeId = state.blueprints?.activeBlueprintId;
  const bp = activeId ? bpItems.find((b) => b.id === activeId) : bpItems[0] || null;

  const report = {
    exportedAt: nowIso(),
    app: {
      name:      state.app?.name,
      version:   state.app?.version,
      createdBy: state.app?.createdBy,
      ecosystem: state.app?.ecosystem,
    },
    activeBlueprintSummary: bp ? {
      name:         bp.name,
      productType:  bp.productType,
      stateMode:    bp.stateMode,
      safetyLevel:  bp.safetyLevel,
      readinessScore: bp.readiness?.score,
      readinessLevel: bp.readiness?.level,
      status:       bp.status,
    } : null,
    agentSystem: {
      status:     state.agentSystem?.status,
      mode:       state.agentSystem?.mode,
      lastRunAt:  state.agentSystem?.lastRunAt,
      permissions: state.agentSystem?.permissions,
    },
    agentRunSummaries: (state.agentSystem?.agentRuns || []).map((r) => ({
      id:          r.id,
      agentId:     r.agentId,
      status:      r.status,
      summary:     r.summary,
      findingsCount:     r.findings?.length || 0,
      warningsCount:     r.warnings?.length || 0,
      blockersCount:     r.blockers?.length || 0,
      recommendationsCount: r.recommendations?.length || 0,
      safetyFlagsCount:  r.safetyFlags?.length || 0,
      createdAt:   r.createdAt,
    })),
    recommendationQueueSummary: (state.agentSystem?.recommendationQueue || []).map((r) => ({
      id:          r.id,
      agentId:     r.agentId,
      title:       r.title,
      priority:    r.priority,
      category:    r.category,
      status:      r.status,
      suggestedRun: r.suggestedRun,
      createdAt:   r.createdAt,
    })),
    transformation: {
      readinessScore: state.transformation?.readinessScore,
      readinessLevel: state.transformation?.readinessLevel,
      recommendedNextRun: state.transformation?.recommendedNextRun,
      missingRequirements: state.transformation?.missingRequirements || [],
    },
  };

  return sanitizeAgentReportExport(report);
}

/**
 * Validate the agent system state block.
 */
export function validateAgentSystemState() {
  const state = getState();
  return validateAgentSystem(state.agentSystem);
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUN 4 — TRANSFORMATION COMPILER STORAGE FUNCTIONS
// All transformation plans persist through storage.js SSOT only.
// No component may directly write transformation plan data to localStorage.
// ═══════════════════════════════════════════════════════════════════════════════

import { compileTransformationPlan as _compileTransformationPlan } from '../logic/transformer/transformationCompiler.js';
import { sanitizeTransformationPlanForExport, exportTransformationPlanToJson, importTransformationPlanFromJson } from '../utils/transformationExport.js';
import { validateTransformationPlan } from './transformationValidators.js';
import agentRegistry from '../config/agentRegistry.js';
import { generatePromptForRun as _genPrompt, generateAllPromptsForPlan as _genAll, validateGeneratedPrompt as _validatePrompt, sanitizeGeneratedPrompt as _sanitizePrompt } from '../logic/launcher/promptGenerator.js';
import { scanPromptSafety } from '../logic/launcher/promptSafetyScanner.js';
import { validatePromptCompleteness } from '../logic/launcher/promptCompletenessValidator.js';
import { exportPromptToJson, exportAllPromptsToJson, importPromptFromJson, sanitizePromptForExport } from '../utils/promptExport.js';
import { runAllPromptValidations } from './promptValidators.js';
import { checkLaunchReadiness } from '../logic/launcher/launchReadinessChecker.js';
import {
  createWorkspace as _createWS,
  createWorkspaceFromTemplate as _createFromTemplate,
  updateWorkspace as _updateWS,
  deleteWorkspace as _deleteWS,
  archiveWorkspace as _archiveWS,
  duplicateWorkspace as _duplicateWS,
  addWorkspaceNote as _addNote,
  updateWorkspaceNote as _updateNote,
  deleteWorkspaceNote as _deleteNote,
  addWorkspaceBlocker as _addBlocker,
  resolveWorkspaceBlocker as _resolveBlocker,
  updateWorkspaceBuildProgress as _updateProgress,
} from '../logic/workspaces/workspaceManager.js';
import { calculateWorkspaceReadiness as _calcReadiness } from '../logic/workspaces/workspaceReadiness.js';
import { exportWorkspaceToJson, importWorkspaceFromJson, sanitizeWorkspaceForExport } from '../utils/workspaceExport.js';
import { createExportPack as _createEP, createExportPackFromTemplate as _createEPFromTpl, updateExportPack as _updateEP, deleteExportPack as _deleteEP, duplicateExportPack as _dupEP, linkWorkspaceToExportPack as _linkWsEP, linkBlueprintToExportPack as _linkBpEP, linkTransformationPlanToExportPack as _linkPlanEP, linkPromptToExportPack as _linkPromptEP, linkVariantBuildToExportPack as _linkVarEP } from '../logic/export/exportPackManager.js';
import { buildHandoffInstructions as _buildHandoff } from '../logic/export/handoffBuilder.js';
import { generateEnvExample as _genEnv, validateEnvExample as _validateEnv } from '../logic/export/envExampleBuilder.js';
import { calculateDeploymentReadiness as _calcDeploy } from '../logic/export/deploymentReadiness.js';
import { calculateExportPackReadiness as _calcEPReady } from '../logic/export/exportPackReadiness.js';
import { sanitizeExportPack as _sanitizeEP } from '../logic/export/exportPackSanitizer.js';
import { validateExportPackImport as _validateImport } from '../state/exportPackValidators.js';
import { exportPackToJson as _epToJson, importExportPackFromJson as _epFromJson } from '../utils/exportPackExport.js';



function getCompilerState(state) {
  return state?.transformationCompiler || {};
}

function getPlans(state) {
  return state?.transformationCompiler?.plans || [];
}

/**
 * Compile a transformation plan from the selected blueprint.
 * Saves the plan through storage.js SSOT.
 * Does NOT write files. Does NOT call external APIs.
 */
export function compileTransformationPlan(blueprintId) {
  const state = getState();
  const targetBpId = blueprintId || state?.transformationCompiler?.selectedBlueprintId || state?.blueprints?.activeBlueprintId;
  if (!targetBpId) return { ok: false, error: 'No blueprint selected for compilation.' };

  const result = _compileTransformationPlan(targetBpId, state, Array.isArray(agentRegistry) ? agentRegistry : []);
  if (!result.ok) return { ok: false, errors: result.errors };

  const plan = result.plan;

  setState((prev) => {
    const compiler = prev.transformationCompiler || {};
    const plans    = compiler.plans || [];
    return {
      ...prev,
      transformationCompiler: {
        ...compiler,
        plans:           [...plans, plan],
        activePlanId:    plan.id,
        lastCompiledAt:  nowIso(),
        status:          'active',
      },
    };
  });

  return { ok: true, plan };
}

/**
 * Save (or update) a transformation plan.
 */
export function saveTransformationPlan(plan) {
  const { valid, errors } = validateTransformationPlan(plan);
  if (!valid) return { ok: false, errors };

  const sanitized = sanitizeTransformationPlanForExport(plan);

  setState((prev) => {
    const compiler = prev.transformationCompiler || {};
    const plans    = compiler.plans || [];
    const exists   = plans.find(p => p.id === sanitized.id);
    const updated  = exists
      ? plans.map(p => p.id === sanitized.id ? sanitized : p)
      : [...plans, sanitized];
    return { ...prev, transformationCompiler: { ...compiler, plans: updated } };
  });

  return { ok: true, plan: sanitized };
}

/**
 * Update specific fields of an existing plan.
 */
export function updateTransformationPlan(planId, updates) {
  if (!planId) return { ok: false, error: 'planId required.' };
  const state = getState();
  const plans = getPlans(state);
  const existing = plans.find(p => p.id === planId);
  if (!existing) return { ok: false, error: `Plan not found: "${planId}"` };

  const merged = { ...existing, ...updates, id: planId, compileMode: 'non_destructive',
                   audit: { ...existing.audit, updatedAt: nowIso() } };
  const { valid, errors } = validateTransformationPlan(merged);
  if (!valid) return { ok: false, errors };

  const sanitized = sanitizeTransformationPlanForExport(merged);
  setState((prev) => ({
    ...prev,
    transformationCompiler: {
      ...prev.transformationCompiler,
      plans: (prev.transformationCompiler?.plans || []).map(p => p.id === planId ? sanitized : p),
    },
  }));

  return { ok: true, plan: sanitized };
}

/**
 * Delete a transformation plan by id.
 * If the deleted plan is active, clears activePlanId or selects the next plan.
 */
export function deleteTransformationPlan(planId) {
  if (!planId) return { ok: false, error: 'planId required.' };
  const state = getState();
  const plans = getPlans(state);
  if (!plans.find(p => p.id === planId)) return { ok: false, error: `Plan not found: "${planId}"` };

  setState((prev) => {
    const compiler  = prev.transformationCompiler || {};
    const remaining = (compiler.plans || []).filter(p => p.id !== planId);
    const newActive = compiler.activePlanId === planId
      ? (remaining.length > 0 ? remaining[remaining.length - 1].id : null)
      : compiler.activePlanId;
    return { ...prev, transformationCompiler: { ...compiler, plans: remaining, activePlanId: newActive } };
  });

  return { ok: true };
}

/**
 * Set the active transformation plan.
 */
export function setActiveTransformationPlan(planId) {
  const state = getState();
  if (planId && !getPlans(state).find(p => p.id === planId)) {
    return { ok: false, error: `Plan not found: "${planId}"` };
  }
  setState((prev) => ({ ...prev, transformationCompiler: { ...prev.transformationCompiler, activePlanId: planId } }));
  return { ok: true };
}

/**
 * Export a sanitized transformation plan as JSON.
 */
export function exportTransformationPlan(planId) {
  const state = getState();
  const plan  = getPlans(state).find(p => p.id === planId);
  if (!plan) return { ok: false, error: `Plan not found: "${planId}"` };
  return exportTransformationPlanToJson(plan);
}

/**
 * Import a transformation plan from a JSON string.
 * Validates and sanitizes before saving.
 */
export function importTransformationPlan(json) {
  const result = importTransformationPlanFromJson(json);
  if (!result.ok) {
    setState((prev) => ({ ...prev, transformationCompiler: { ...prev.transformationCompiler, status: 'import_error' } }));
    return { ok: false, error: result.error };
  }

  // Assign fresh id to avoid collision
  const plan = { ...result.plan, id: generateId('tp'), audit: { ...result.plan.audit, updatedAt: nowIso() } };
  return saveTransformationPlan(plan);
}

/**
 * Validate a plan before saving (exposed for UI pre-checks).
 */
export function validateTransformationPlanBeforeSave(plan) {
  return validateTransformationPlan(plan);
}

/**
 * Clear all transformation plans.
 */
export function clearTransformationPlans() {
  setState((prev) => ({
    ...prev,
    transformationCompiler: { ...prev.transformationCompiler, plans: [], activePlanId: null, lastCompiledAt: null },
  }));
  return { ok: true };
}

/**
 * Get the currently active transformation plan object.
 */
export function getActiveTransformationPlan() {
  const state = getState();
  const compiler = state?.transformationCompiler;
  if (!compiler?.activePlanId) return null;
  return (compiler.plans || []).find(p => p.id === compiler.activePlanId) || null;
}

/**
 * Set the selected blueprint for compilation.
 */
export function setCompilerBlueprintSelection(blueprintId) {
  setState((prev) => ({
    ...prev,
    transformationCompiler: { ...prev.transformationCompiler, selectedBlueprintId: blueprintId },
  }));
  return { ok: true };
}

// ============================================================
// RUN 5 — Variant Build Launcher / Prompt Generator
// ============================================================









// ── Prompt state helpers ─────────────────────────────────────
function getLauncherState() { return getState()?.variantLauncher || {}; }
function getPrompts()       { return getLauncherState().generatedPrompts || []; }

export function generatePromptForRunStorage(transformationPlanId, runNumber) {
  const state = getState();
  const result = _genPrompt(transformationPlanId, runNumber, state);
  if (result.error) return { ok: false, error: result.error };
  return saveGeneratedPrompt(result.prompt);
}

export function generateAllPromptsForPlanStorage(transformationPlanId) {
  const state = getState();
  const { prompts, errors } = _genAll(transformationPlanId, state);
  const saved = [];
  for (const p of prompts) {
    const r = saveGeneratedPrompt(p);
    if (r.ok) saved.push(r.prompt);
  }
  return { ok: true, saved, errors };
}

export function saveGeneratedPrompt(prompt) {
  const validation = runAllPromptValidations(prompt);
  if (!validation.valid) return { ok: false, error: validation.errors[0] };
  const sanitized = _sanitizePrompt(prompt);
  setState((prev) => {
    const launcher = prev.variantLauncher || {};
    const existing = launcher.generatedPrompts || [];
    const updated  = existing.some((p) => p.id === sanitized.id)
      ? existing.map((p) => p.id === sanitized.id ? sanitized : p)
      : [...existing, sanitized];
    return { ...prev, variantLauncher: { ...launcher, generatedPrompts: updated, activeGeneratedPromptId: sanitized.id } };
  });
  return { ok: true, prompt: sanitized };
}

export function updateGeneratedPrompt(promptId, updates) {
  setState((prev) => {
    const launcher = prev.variantLauncher || {};
    const prompts  = (launcher.generatedPrompts || []).map((p) =>
      p.id === promptId ? { ...p, ...updates, audit: { ...p.audit, updatedAt: nowIso() } } : p
    );
    return { ...prev, variantLauncher: { ...launcher, generatedPrompts: prompts } };
  });
  return { ok: true };
}

export function deleteGeneratedPrompt(promptId) {
  setState((prev) => {
    const launcher  = prev.variantLauncher || {};
    const remaining = (launcher.generatedPrompts || []).filter((p) => p.id !== promptId);
    const newActive = launcher.activeGeneratedPromptId === promptId
      ? (remaining.length ? remaining[remaining.length - 1].id : null)
      : launcher.activeGeneratedPromptId;
    return { ...prev, variantLauncher: { ...launcher, generatedPrompts: remaining, activeGeneratedPromptId: newActive } };
  });
  return { ok: true };
}

export function setActiveGeneratedPrompt(promptId) {
  setState((prev) => ({ ...prev, variantLauncher: { ...(prev.variantLauncher || {}), activeGeneratedPromptId: promptId } }));
  return { ok: true };
}

export function copyPromptToClipboard(promptId) {
  const prompt = getPrompts().find((p) => p.id === promptId);
  if (!prompt) return { ok: false, error: 'Prompt not found.' };
  updateGeneratedPrompt(promptId, { audit: { ...prompt.audit, copiedAt: nowIso() } });
  return { ok: true, text: prompt.promptText };
}

export function exportGeneratedPrompt(promptId) {
  const prompt = getPrompts().find((p) => p.id === promptId);
  if (!prompt) return { ok: false, error: 'Prompt not found.' };
  updateGeneratedPrompt(promptId, { audit: { ...prompt.audit, exportedAt: nowIso() } });
  return { ok: true, json: exportPromptToJson(prompt) };
}

export function exportAllPromptsForPlan(transformationPlanId) {
  const prompts = getPrompts().filter((p) => p.transformationPlanId === transformationPlanId);
  return { ok: true, json: exportAllPromptsToJson(prompts) };
}

export function importGeneratedPrompt(json) {
  const result = importPromptFromJson(json);
  if (result.type === 'error') return { ok: false, error: result.results[0].error };
  const saved = [], errors = [];
  for (const r of result.results) {
    if (!r.valid || !r.prompt) { errors.push(r.error); continue; }
    const sv = saveGeneratedPrompt(r.prompt);
    if (sv.ok) saved.push(sv.prompt); else errors.push(sv.error);
  }
  return { ok: saved.length > 0, saved, errors };
}

export function validatePromptBeforeSave(prompt) { return runAllPromptValidations(prompt); }

export function scanPromptBeforeSave(prompt) { return scanPromptSafety(prompt?.promptText || ''); }

export function clearGeneratedPrompts() {
  setState((prev) => ({ ...prev, variantLauncher: { ...(prev.variantLauncher || {}), generatedPrompts: [], activeGeneratedPromptId: null } }));
  return { ok: true };
}

export function getActiveGeneratedPrompt() {
  const launcher = getLauncherState();
  return (launcher.generatedPrompts || []).find((p) => p.id === launcher.activeGeneratedPromptId) || null;
}

export function checkVariantLaunchReadiness() {
  const state   = getState();
  const launcher = state.variantLauncher || {};
  const plan     = (state.transformationCompiler?.plans || []).find((p) => p.id === launcher.selectedTransformationPlanId)
    || (state.transformationCompiler?.plans || []).find((p) => p.id === state.transformationCompiler?.activePlanId)
    || null;
  const prompts  = launcher.generatedPrompts || [];
  const result   = checkLaunchReadiness(plan, prompts);
  setState((prev) => ({ ...prev, variantLauncher: { ...(prev.variantLauncher || {}), launchReadiness: result } }));
  return result;
}

// ============================================================
// RUN 6 — Variant Workspace Manager
// ============================================================





function getWorkspacesState()  { return getState()?.variantWorkspaces || {}; }
function getAllWorkspaces()     { return getWorkspacesState().workspaces || []; }
function getWorkspaceById(id)  { return getAllWorkspaces().find((w) => w.id === id) || null; }

function setWorkspaces(updater) {
  setState((prev) => {
    const ws = prev.variantWorkspaces || {};
    const updated = typeof updater === 'function' ? updater(ws) : updater;
    return { ...prev, variantWorkspaces: updated };
  });
}

export function createWorkspaceStorage(input) {
  const state = getState();
  const result = _createWS(input, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((ws) => {
    const list = ws.workspaces || [];
    const newActive = ws.activeWorkspaceId || result.workspace.id;
    return { ...ws, workspaces: [...list, result.workspace], activeWorkspaceId: newActive };
  });
  return { ok: true, workspace: result.workspace };
}

export function createWorkspaceFromTemplateStorage(templateId) {
  const state = getState();
  const result = _createFromTemplate(templateId, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((ws) => {
    const list = ws.workspaces || [];
    const newActive = ws.activeWorkspaceId || result.workspace.id;
    return { ...ws, workspaces: [...list, result.workspace], activeWorkspaceId: newActive };
  });
  return { ok: true, workspace: result.workspace };
}

export function updateWorkspaceStorage(workspaceId, updates) {
  const state = getState();
  const ws    = getWorkspaceById(workspaceId);
  if (!ws) return { ok: false, error: 'Workspace not found.' };
  const result = _updateWS(workspaceId, updates, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) => w.id === workspaceId ? result.workspace : w),
  }));
  return { ok: true, workspace: result.workspace };
}

export function deleteWorkspaceStorage(workspaceId) {
  setWorkspaces((wss) => {
    const remaining = (wss.workspaces || []).filter((w) => w.id !== workspaceId);
    const newActive = wss.activeWorkspaceId === workspaceId
      ? (remaining.length ? remaining[remaining.length - 1].id : null)
      : wss.activeWorkspaceId;
    return { ...wss, workspaces: remaining, activeWorkspaceId: newActive };
  });
  return { ok: true };
}

export function archiveWorkspaceStorage(workspaceId) {
  const state  = getState();
  const ws     = getWorkspaceById(workspaceId);
  if (!ws) return { ok: false, error: 'Workspace not found.' };
  const result = _archiveWS(workspaceId, state);
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) => w.id === workspaceId ? result.workspace : w),
  }));
  return { ok: true };
}

export function restoreWorkspaceStorage(workspaceId) {
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) =>
      w.id === workspaceId ? { ...w, status: 'planning', audit: { ...w.audit, archivedAt: null, updatedAt: nowIso() } } : w
    ),
  }));
  return { ok: true };
}

export function duplicateWorkspaceStorage(workspaceId) {
  const state  = getState();
  const ws     = getWorkspaceById(workspaceId);
  if (!ws) return { ok: false, error: 'Workspace not found.' };
  const result = _duplicateWS(workspaceId, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((wss) => ({ ...wss, workspaces: [...(wss.workspaces || []), result.workspace] }));
  return { ok: true, workspace: result.workspace };
}

export function setActiveWorkspaceStorage(workspaceId) {
  setWorkspaces((wss) => ({ ...wss, activeWorkspaceId: workspaceId }));
  return { ok: true };
}

export function linkBlueprintToWorkspaceStorage(workspaceId, blueprintId) {
  return updateWorkspaceStorage(workspaceId, { linkedBlueprintId: blueprintId });
}

export function linkTransformationPlanToWorkspaceStorage(workspaceId, planId) {
  return updateWorkspaceStorage(workspaceId, { linkedTransformationPlanId: planId });
}

export function linkPromptToWorkspaceStorage(workspaceId, promptId) {
  const ws = getWorkspaceById(workspaceId);
  if (!ws) return { ok: false, error: 'Workspace not found.' };
  const existing = ws.linkedPromptIds || [];
  if (existing.includes(promptId)) return { ok: true };
  return updateWorkspaceStorage(workspaceId, { linkedPromptIds: [...existing, promptId] });
}

export function unlinkPromptFromWorkspaceStorage(workspaceId, promptId) {
  const ws = getWorkspaceById(workspaceId);
  if (!ws) return { ok: false, error: 'Workspace not found.' };
  return updateWorkspaceStorage(workspaceId, { linkedPromptIds: (ws.linkedPromptIds || []).filter((id) => id !== promptId) });
}

export function addWorkspaceNoteStorage(workspaceId, note) {
  const state  = getState();
  const result = _addNote(workspaceId, note, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) => w.id === workspaceId ? result.workspace : w),
  }));
  return { ok: true };
}

export function updateWorkspaceNoteStorage(workspaceId, noteId, updates) {
  const state  = getState();
  const result = _updateNote(workspaceId, noteId, updates, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) => w.id === workspaceId ? result.workspace : w),
  }));
  return { ok: true };
}

export function deleteWorkspaceNoteStorage(workspaceId, noteId) {
  const state  = getState();
  const result = _deleteNote(workspaceId, noteId, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) => w.id === workspaceId ? result.workspace : w),
  }));
  return { ok: true };
}

export function addWorkspaceBlockerStorage(workspaceId, blocker) {
  const state  = getState();
  const result = _addBlocker(workspaceId, blocker, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) => w.id === workspaceId ? result.workspace : w),
  }));
  return { ok: true };
}

export function resolveWorkspaceBlockerStorage(workspaceId, blockerId) {
  const state  = getState();
  const result = _resolveBlocker(workspaceId, blockerId, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) => w.id === workspaceId ? result.workspace : w),
  }));
  return { ok: true };
}

export function updateWorkspaceBuildProgressStorage(workspaceId, progress) {
  const state  = getState();
  const result = _updateProgress(workspaceId, progress, state);
  if (result.error) return { ok: false, error: result.error };
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) => w.id === workspaceId ? result.workspace : w),
  }));
  return { ok: true };
}

export function calculateWorkspaceReadinessStorage(workspaceId) {
  const state = getState();
  const ws    = getWorkspaceById(workspaceId);
  if (!ws) return { ok: false, error: 'Workspace not found.' };
  const readiness = _calcReadiness(ws, state);
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).map((w) =>
      w.id === workspaceId ? { ...w, readiness, audit: { ...w.audit, updatedAt: nowIso() } } : w
    ),
  }));
  return { ok: true, readiness };
}

export function exportWorkspaceStorage(workspaceId) {
  const state = getState();
  const ws    = getWorkspaceById(workspaceId);
  if (!ws) return { ok: false, error: 'Workspace not found.' };
  return { ok: true, json: exportWorkspaceToJson(ws, state) };
}

export function importWorkspaceStorage(json) {
  const result = importWorkspaceFromJson(json);
  if (!result.valid) return { ok: false, error: result.error };
  const ws = result.workspace;
  setWorkspaces((wss) => {
    const existing = (wss.workspaces || []).some((w) => w.id === ws.id);
    const updated  = existing
      ? (wss.workspaces || []).map((w) => w.id === ws.id ? ws : w)
      : [...(wss.workspaces || []), ws];
    return { ...wss, workspaces: updated };
  });
  return { ok: true, workspace: ws };
}

export function clearArchivedWorkspaces() {
  setWorkspaces((wss) => ({
    ...wss,
    workspaces: (wss.workspaces || []).filter((w) => w.status !== 'archived'),
  }));
  return { ok: true };
}

export function getActiveWorkspace() {
  const wss = getWorkspacesState();
  return getAllWorkspaces().find((w) => w.id === wss.activeWorkspaceId) || null;
}

export function setWorkspaceComparisonSelection(workspaceIds) {
  setWorkspaces((wss) => ({
    ...wss,
    comparison: { ...wss.comparison, selectedWorkspaceIds: workspaceIds },
  }));
  return { ok: true };
}

// ============================================================
// RUN 7 — Export / Handoff / Deployment Preparation Layer
// ============================================================










function getExportSystem() { return getState().exportSystem || {}; }
function setExportSystem(updater) {
  const prev = getExportSystem();
  const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
  setState((s) => ({ ...s, exportSystem: next }));
}

export function getAllExportPacks()     { return getExportSystem().exportPacks || []; }
export function getActiveExportPack()  {
  const es = getExportSystem();
  return (es.exportPacks || []).find((ep) => ep.id === es.activeExportPackId) || null;
}

export function createExportPackStorage(input) {
  const result = _createEP(input, getState());
  if (result.error) return { ok: false, error: result.error };
  const ep = result.exportPack;
  setExportSystem((es) => ({
    ...es,
    exportPacks: [...(es.exportPacks || []), ep],
    activeExportPackId: es.activeExportPackId || ep.id,
  }));
  return { ok: true, exportPack: ep };
}

export function createExportPackFromTemplateStorage(templateId) {
  const result = _createEPFromTpl(templateId, getState());
  if (result.error) return { ok: false, error: result.error };
  const ep = result.exportPack;
  setExportSystem((es) => ({
    ...es,
    exportPacks: [...(es.exportPacks || []), ep],
    activeExportPackId: es.activeExportPackId || ep.id,
  }));
  return { ok: true, exportPack: ep };
}

export function updateExportPackStorage(exportPackId, updates) {
  const result = _updateEP(exportPackId, updates, getState());
  if (result.error) return { ok: false, error: result.error };
  setExportSystem((es) => ({
    ...es,
    exportPacks: (es.exportPacks || []).map((ep) => ep.id === exportPackId ? result.exportPack : ep),
  }));
  return { ok: true, exportPack: result.exportPack };
}

export function deleteExportPackStorage(exportPackId) {
  setExportSystem((es) => {
    const remaining = (es.exportPacks || []).filter((ep) => ep.id !== exportPackId);
    const activeId  = es.activeExportPackId === exportPackId
      ? (remaining[0]?.id || null)
      : es.activeExportPackId;
    return { ...es, exportPacks: remaining, activeExportPackId: activeId };
  });
  return { ok: true };
}

export function duplicateExportPackStorage(exportPackId) {
  const result = _dupEP(exportPackId, getState());
  if (result.error) return { ok: false, error: result.error };
  setExportSystem((es) => ({ ...es, exportPacks: [...(es.exportPacks || []), result.exportPack] }));
  return { ok: true, exportPack: result.exportPack };
}

export function setActiveExportPackStorage(exportPackId) {
  setExportSystem((es) => ({ ...es, activeExportPackId: exportPackId }));
  return { ok: true };
}

export function linkWorkspaceToExportPackStorage(exportPackId, workspaceId) {
  const result = _linkWsEP(exportPackId, workspaceId, getState());
  if (result.error) return { ok: false, error: result.error };
  return updateExportPackStorage(exportPackId, { linkedWorkspaceId: workspaceId });
}

export function linkBlueprintToExportPackStorage(exportPackId, blueprintId) {
  return updateExportPackStorage(exportPackId, { linkedBlueprintId: blueprintId });
}

export function linkTransformationPlanToExportPackStorage(exportPackId, planId) {
  return updateExportPackStorage(exportPackId, { linkedTransformationPlanId: planId });
}

export function linkPromptToExportPackStorage(exportPackId, promptId) {
  const ep  = (getExportSystem().exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { ok: false, error: 'Export pack not found.' };
  const ids = [...new Set([...(ep.linkedPromptIds || []), promptId])];
  return updateExportPackStorage(exportPackId, { linkedPromptIds: ids });
}

export function unlinkPromptFromExportPackStorage(exportPackId, promptId) {
  const ep = (getExportSystem().exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { ok: false, error: 'Export pack not found.' };
  return updateExportPackStorage(exportPackId, { linkedPromptIds: (ep.linkedPromptIds || []).filter((id) => id !== promptId) });
}

export function generateHandoffInstructionsStorage(exportPackId, builderTool) {
  const ep = (getExportSystem().exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { ok: false, error: 'Export pack not found.' };
  const state        = getState();
  const instructions = _buildHandoff({ ...ep, builderTool: builderTool || ep.builderTool }, state);
  return updateExportPackStorage(exportPackId, {
    builderTool: builderTool || ep.builderTool,
    handoffInstructions: instructions,
    status: 'validated',
  });
}

export function generateEnvExampleForExportStorage(exportPackId) {
  const state   = getState();
  const content = _genEnv(state);
  const valid   = _validateEnv(content);
  return updateExportPackStorage(exportPackId, {
    envExample: { content, containsPlaceholdersOnly: valid.issues.length === 0, backendSecretsBlocked: true },
  });
}

export function runSanitisationStorage(exportPackId) {
  const ep = (getExportSystem().exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { ok: false, error: 'Export pack not found.' };
  const sanitized   = _sanitizeEP(ep);
  
  const scan        = scanExportForSecrets(ep);
  const sanitisation = {
    secretsRemoved:      !scan.passed,
    rawKeysDetected:     scan.findings.some((f) => f.id.startsWith('raw_')),
    unsafeTermsDetected: false,
    passed:              scan.passed,
    findings:            scan.findings.map((f) => f.label),
  };
  return updateExportPackStorage(exportPackId, { sanitisation });
}

export function calculateExportPackReadinessStorage(exportPackId) {
  const ep    = (getExportSystem().exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { ok: false, error: 'Export pack not found.' };
  const state = getState();
  const readiness = _calcEPReady(ep, state);
  return updateExportPackStorage(exportPackId, { readiness });
}

export function exportExportPackStorage(exportPackId) {
  const ep = (getExportSystem().exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { ok: false, error: 'Export pack not found.' };
  updateExportPackStorage(exportPackId, { audit: { ...ep.audit, exportedAt: new Date().toISOString() } });
  return { ok: true, json: _epToJson(ep) };
}

export function importExportPackStorage(json) {
  const result = _epFromJson(json);
  if (!result.valid) return { ok: false, error: result.error };
  const validation = _validateImport(result.exportPack);
  if (!validation.valid) return { ok: false, error: validation.issues[0] };
  setExportSystem((es) => ({
    ...es,
    exportPacks: [...(es.exportPacks || []).filter((e) => e.id !== result.exportPack.id), result.exportPack],
  }));
  return { ok: true, exportPack: result.exportPack };
}

export function checkDeploymentReadinessStorage() {
  const result = _calcDeploy(getState());
  setExportSystem((es) => ({ ...es, deploymentReadiness: result }));
  return { ok: true, result };
}

export function clearExportHistoryStorage() {
  setExportSystem((es) => ({ ...es, exportHistory: [] }));
  return { ok: true };
}

// ─────────────────────────────────────────────
// RUN 8 — Final Audit / Hardening / Lock Storage
// ─────────────────────────────────────────────
import { runFinalAudit, updateFinalLockFromAudit } from '../logic/audit/finalAuditRunner.js';
import { validateAuditRun, validateFinalAuditState } from './auditValidators.js';
import { sanitizeAuditReport } from '../utils/auditExport.js';

function setFinalAudit(updater) {
  setState((s) => ({ ...s, finalAudit: updater(s.finalAudit || {}) }));
}

export function runFinalSystemAudit() {
  const state = getState();
  const { auditRun, hardeningFlags } = runFinalAudit(state);
  const lockUpdate = updateFinalLockFromAudit(auditRun, state);
  const validation = validateAuditRun(auditRun);
  if (!validation.ok) return { ok: false, error: validation.errors[0] };

  setFinalAudit((fa) => ({
    ...fa,
    status: auditRun.status,
    lastRunAt: auditRun.completedAt,
    overallScore: auditRun.overallScore,
    readinessLevel: auditRun.readinessLevel,
    blockers: auditRun.blockers,
    warnings: auditRun.warnings,
    passedChecks: auditRun.passedChecks,
    failedChecks: auditRun.failedChecks,
    latestFindings: auditRun.findings,
    auditRuns: [...(fa.auditRuns || []).slice(-9), auditRun],
    hardening: { ...(fa.hardening || {}), ...hardeningFlags },
    finalLock: lockUpdate.status === 'ready_to_lock'
      ? { ...(fa.finalLock || {}), status: 'ready_to_lock', reason: lockUpdate.reason, canStartVariantBuilds: false }
      : { ...(fa.finalLock || {}), status: 'blocked', reason: lockUpdate.reason, canStartVariantBuilds: false },
  }));
  return { ok: true, auditRun };
}

export function saveAuditRun(auditRun) {
  const v = validateAuditRun(auditRun);
  if (!v.ok) return { ok: false, error: v.errors[0] };
  setFinalAudit((fa) => ({ ...fa, auditRuns: [...(fa.auditRuns || []).slice(-9), auditRun] }));
  return { ok: true };
}

export function updateAuditFinding(findingId, updates) {
  setFinalAudit((fa) => ({
    ...fa,
    latestFindings: (fa.latestFindings || []).map(f =>
      f.id === findingId ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
    ),
  }));
  return { ok: true };
}

export function resolveAuditFinding(findingId) {
  return updateAuditFinding(findingId, { status: 'resolved' });
}

export function acceptAuditRisk(findingId) {
  return updateAuditFinding(findingId, { status: 'accepted_risk' });
}

export function clearAuditHistory() {
  setFinalAudit((fa) => ({ ...fa, auditRuns: [], latestFindings: [], blockers: [], warnings: [], passedChecks: [], failedChecks: [], status: 'not_run', overallScore: 0 }));
  return { ok: true };
}

export function calculateFinalReadiness() {
  const fa = getState().finalAudit || {};
  const h  = fa.hardening || {};
  const baseReadyForVariants = fa.overallScore >= 90 && (fa.blockers || []).length === 0 && h.ssotVerified && h.secretsCleared;
  const exportReady = h.exportsSafe && h.secretsCleared;
  const zipHandoffReady = h.pwaReady && exportReady;
  setFinalAudit((prev) => ({ ...prev, baseReadyForVariants, exportReady, zipHandoffReady }));
  return { ok: true, baseReadyForVariants, exportReady, zipHandoffReady };
}

export function lockBaseForTransformation() {
  const state = getState();
  const fa = state.finalAudit || {};
  if ((fa.blockers || []).length > 0) return { ok: false, error: 'Cannot lock: critical blockers remain.' };
  if (fa.overallScore < 85) return { ok: false, error: `Cannot lock: score ${fa.overallScore}/100 is below 85 threshold.` };
  setFinalAudit((prev) => ({
    ...prev,
    baseReadyForVariants: true,
    finalLock: { status: 'locked', lockedAt: new Date().toISOString(), lockedBy: 'user', canStartVariantBuilds: true, reason: 'Base locked for transformation. Real variant builds may begin.' },
  }));
  return { ok: true };
}

export function unlockBaseForFixes() {
  setFinalAudit((prev) => ({
    ...prev,
    baseReadyForVariants: false,
    finalLock: { status: 'unlocked', lockedAt: null, lockedBy: 'user', canStartVariantBuilds: false, reason: 'Base unlocked for fixes. Re-run audit to lock again.' },
  }));
  return { ok: true };
}

export function exportFinalReadinessReport() {
  const state = getState();
  const fa = state.finalAudit || {};
  const report = {
    appName: state.app?.name,
    appVersion: state.app?.version,
    overallScore: fa.overallScore,
    readinessLevel: fa.readinessLevel,
    baseReadyForVariants: fa.baseReadyForVariants,
    exportReady: fa.exportReady,
    zipHandoffReady: fa.zipHandoffReady,
    canStartVariantBuilds: fa.finalLock?.canStartVariantBuilds,
    lockStatus: fa.finalLock?.status,
    blockers: fa.blockers,
    warnings: fa.warnings,
    passedChecks: fa.passedChecks,
    failedChecks: fa.failedChecks,
    finalRecommendation: fa.auditRuns?.slice(-1)[0]?.finalRecommendation,
    nextAction: fa.finalLock?.canStartVariantBuilds
      ? 'Begin real product variant builds from the exported base zip.'
      : 'Resolve blockers and re-run the final audit.',
    generatedAt: new Date().toISOString(),
    safetyNote: 'This report contains no raw API keys, backend secrets, or deployment instructions.',
  };
  return sanitizeAuditReport(report);
}

export function getLatestAuditRun() {
  const runs = getState().finalAudit?.auditRuns || [];
  return runs.length ? runs[runs.length - 1] : null;
}

export function getFinalLockStatus() {
  return getState().finalAudit?.finalLock || { status: 'unlocked', canStartVariantBuilds: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// RUN 9 — BASE PACKAGE STORAGE FUNCTIONS
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// ─────────────────────────────────────────────────────────────────────────────

import {
  createBasePackage as _createPkg,
  updateBasePackage as _updatePkg,
  deleteBasePackage as _deletePkg,
  setActiveBasePackage as _setActive,
  validatePackageBeforeZip as _validateZip,
  calculatePackageReadiness as _calcPkgReadiness,
} from '../logic/package/packageBuilder.js';
import { buildPackageManifest as _buildManifest } from '../logic/package/packageManifestBuilder.js';
import { buildAllInstructions }                    from '../logic/package/packageInstructionBuilder.js';
import { sanitizeManifestForExport, formatManifestAsText, formatInstructionsAsText } from '../utils/packageExport.js';

function setBasePackage(updater) {
  setState((prev) => ({ ...prev, basePackage: updater(prev.basePackage || {}) }));
}

export function createBasePackage() {
  const state = getState();
  const pkg = _createPkg(state);
  setBasePackage((prev) => ({
    ...prev,
    packages: [...(prev.packages || []), pkg],
    activePackageId: pkg.id,
    status: 'draft',
  }));
  return pkg;
}

export function updateBasePackage(packageId, updates) {
  const state = getState();
  const updated = _updatePkg(packageId, updates, state.basePackage?.packages || []);
  setBasePackage((prev) => ({ ...prev, packages: updated }));
}

export function deleteBasePackage(packageId) {
  const state = getState();
  const remaining = _deletePkg(packageId, state.basePackage?.packages || []);
  setBasePackage((prev) => ({
    ...prev,
    packages: remaining,
    activePackageId: prev.activePackageId === packageId ? null : prev.activePackageId,
  }));
}

export function setActiveBasePackage(packageId) {
  const state = getState();
  const { updatedPackages, activePackageId } = _setActive(packageId, state.basePackage?.packages || []);
  setBasePackage((prev) => ({ ...prev, packages: updatedPackages, activePackageId }));
}

export function buildPackageManifest() {
  const state = getState();
  const manifest = _buildManifest(state);
  const safe = sanitizeManifestForExport(manifest);
  setBasePackage((prev) => ({ ...prev, latestManifest: safe }));
  return safe;
}

export function validateBasePackage(packageId) {
  const state = getState();
  const pkg = (state.basePackage?.packages || []).find((p) => p.id === packageId);
  if (!pkg) return { ok: false, error: 'Package not found.' };
  const result = _validateZip(pkg, state);
  const updated = _updatePkg(packageId, {
    status: result.status,
    validation: {
      finalAuditPassed:       result.finalAuditPassed,
      noSecretsPassed:        result.noSecretsPassed,
      noUnsafeLanguagePassed: result.noUnsafeLanguagePassed,
      routesPassed:           result.routesPassed,
      ssotPassed:             result.ssotPassed,
      buildPassed:            result.buildPassed,
      blockers:               result.blockers,
      warnings:               result.warnings,
    },
    readiness: {
      score:      result.readinessScore,
      level:      result.readinessLevel,
      nextAction: result.nextAction,
    },
  }, state.basePackage?.packages || []);
  setBasePackage((prev) => ({
    ...prev,
    packages: updated,
    latestValidation: result,
    zipReady: result.zipReady,
    builderAttachmentReady: result.zipReady,
    status: result.zipReady ? 'ready_to_zip' : result.blockers.length > 0 ? 'blocked' : 'validated',
  }));
  return result;
}

export function calculateBasePackageReadiness(packageId) {
  const state = getState();
  const pkg = (state.basePackage?.packages || []).find((p) => p.id === packageId) || {};
  return _calcReadiness(pkg, state);
}

export function exportPackageManifest(packageId) {
  const state = getState();
  const manifest = state.basePackage?.latestManifest || _buildManifest(state);
  return {
    text: formatManifestAsText(manifest),
    json: sanitizeManifestForExport(manifest),
    safetyNote: 'No raw API keys, secrets, or deployment credentials included.',
  };
}

export function exportPackageInstructions(packageId) {
  const state = getState();
  const all = buildAllInstructions(state);
  return Object.fromEntries(
    Object.entries(all).map(([target, instr]) => [
      target,
      { text: formatInstructionsAsText(instr, target), steps: instr.steps },
    ])
  );
}

export function getActiveBasePackage() {
  const state = getState();
  const id = state.basePackage?.activePackageId;
  return id ? (state.basePackage?.packages || []).find((p) => p.id === id) || null : null;
}

// =====================================================
// RUN 10 — MASTER VARIANT LAUNCHER
// =====================================================
import { compileMasterVariantPrompt } from '../logic/masterLauncher/variantPromptCompiler.js';
import { completeBase, unlockBaseForEmergencyFix } from '../logic/masterLauncher/finalBaseCompletionLock.js';
import { sanitiseMasterVariantPromptForExport } from '../utils/masterVariantExport.js';

export function selectMasterVariantType(variantType) {
  const state = getState();
  state.masterLauncher = state.masterLauncher || {};
  state.masterLauncher.selectedVariantType = variantType;
  setState(state);
}

export function selectDashboardPwaPattern(patternId) {
  const state = getState();
  state.masterLauncher = state.masterLauncher || {};
  state.masterLauncher.selectedDashboardPwaPattern = patternId;
  setState(state);
}

export function generateMasterVariantPrompt() {
  const state = getState();
  const ml = state.masterLauncher || {};
  const variantType = ml.selectedVariantType;
  if (!variantType) return { success: false, error: 'No variant type selected.' };
  const result = compileMasterVariantPrompt(variantType, state);
  if (!result.success) return result;
  const prompt = {
    id: result.promptId,
    variantType: result.variantType,
    patternId: result.patternId,
    generatedAt: result.generatedAt,
    branding: result.branding,
    promptText: result.promptText,
    characterCount: result.characterCount,
    wordCount: result.wordCount,
  };
  state.masterLauncher.generatedMasterPrompts = [
    ...(ml.generatedMasterPrompts || []),
    prompt,
  ];
  state.masterLauncher.activeMasterPromptId = prompt.id;
  state.masterLauncher.status = 'in_progress';
  setState(state);
  return { success: true, prompt };
}

export function saveMasterVariantPrompt(prompt) {
  const state = getState();
  state.masterLauncher = state.masterLauncher || {};
  const prompts = state.masterLauncher.generatedMasterPrompts || [];
  const idx = prompts.findIndex((p) => p.id === prompt.id);
  if (idx >= 0) prompts[idx] = prompt;
  else prompts.push(prompt);
  state.masterLauncher.generatedMasterPrompts = prompts;
  setState(state);
}

export function deleteMasterVariantPrompt(promptId) {
  const state = getState();
  state.masterLauncher = state.masterLauncher || {};
  state.masterLauncher.generatedMasterPrompts = (
    state.masterLauncher.generatedMasterPrompts || []
  ).filter((p) => p.id !== promptId);
  if (state.masterLauncher.activeMasterPromptId === promptId) {
    const remaining = state.masterLauncher.generatedMasterPrompts;
    state.masterLauncher.activeMasterPromptId =
      remaining.length > 0 ? remaining[remaining.length - 1].id : null;
  }
  setState(state);
}

export function setActiveMasterPrompt(promptId) {
  const state = getState();
  state.masterLauncher = state.masterLauncher || {};
  state.masterLauncher.activeMasterPromptId = promptId;
  setState(state);
}

export function exportMasterVariantPrompt(promptId) {
  const state = getState();
  const prompts = state.masterLauncher?.generatedMasterPrompts || [];
  const prompt = prompts.find((p) => p.id === promptId);
  if (!prompt) return null;
  return sanitiseMasterVariantPromptForExport(prompt);
}

export function copyMasterVariantPrompt(promptId) {
  return exportMasterVariantPrompt(promptId);
}

export function completeReusableBase() {
  const state = getState();
  const result = completeBase(state);
  if (result.success) {
    state.masterLauncher = state.masterLauncher || {};
    Object.assign(state.masterLauncher, result.completionRecord);
    state.masterLauncher.finalBaseComplete = true;
    state.masterLauncher.readyToBuildVariants = true;
    state.masterLauncher.status = 'complete';
    setState(state);
  }
  return result;
}

export function unlockReusableBaseForEmergencyFix() {
  const state = getState();
  const result = unlockBaseForEmergencyFix(state);
  if (result.success) {
    state.masterLauncher = state.masterLauncher || {};
    state.masterLauncher.finalBaseComplete = false;
    state.masterLauncher.status = 'ready';
    setState(state);
  }
  return result;
}

export function getReusableBaseCompletionStatus() {
  const state = getState();
  const ml = state.masterLauncher || {};
  return {
    finalBaseComplete:    ml.finalBaseComplete || false,
    readyToBuildVariants: ml.readyToBuildVariants || false,
    status:               ml.status || 'ready',
    message: ml.finalBaseComplete
      ? 'The 4P3X Reusable Base Structure™ is COMPLETE. Stop building the base. Begin real product variant builds.'
      : 'Base is not yet marked complete.',
  };
}
