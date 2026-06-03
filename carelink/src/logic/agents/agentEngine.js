// 4P3X Agent Engine — RUN 3
// Orchestrates local advisory agent analysis.
// No external API calls. No file edits. No destructive actions.
// All persistence goes through storage.js only.

import agentRegistry from '../../config/agentRegistry.js';
import {
  analyzeArchitecture,
  analyzeUxLogic,
  analyzeValidation,
  analyzeRefactorPlan,
  analyzeApiConfig,
  analyzeSafetyCompliance,
  analyzeProductStrategy,
} from './agentAnalyzers.js';
import {
  sanitizeAgentOutput,
  enforceNoAutonomy,
  validateAgentOutput,
  detectSecretsInAgentOutput,
} from './agentSafety.js';
import {
  canAgentReadBlueprint,
  canAgentReadApiConfig,
  canAgentWriteRecommendations,
  canAgentCallExternalApi,
  canAgentEditFiles,
  canAgentPerformDestructiveAction,
} from './agentPermissions.js';
import { generateId } from '../../utils/id.js';
import { nowIso } from '../../utils/date.js';

// ─── Analyzer map ────────────────────────────────────────────────────────────

const ANALYZER_MAP = {
  systemArchitectAgent:  analyzeArchitecture,
  uxLogicAgent:          analyzeUxLogic,
  validationAgent:       analyzeValidation,
  refactorPlannerAgent:  analyzeRefactorPlan,
  apiConfigAgent:        analyzeApiConfig,
  safetyComplianceAgent: analyzeSafetyCompliance,
  productStrategyAgent:  analyzeProductStrategy,
};

// ─── Context builder ─────────────────────────────────────────────────────────

/**
 * Build the local context object that analyzers receive.
 * Pulls from current app state — no external calls.
 */
export function getAgentContext(state) {
  if (!state) return {};

  const items    = state.blueprints?.items || [];
  const activeId = state.blueprints?.activeBlueprintId;
  const blueprint = activeId
    ? items.find((b) => b.id === activeId) || null
    : items[0] || null;

  // Masked AI settings only — never pass raw keys
  const aiSettings = state.aiSettings
    ? {
        provider:         state.aiSettings.provider,
        apiKeyConfigured: state.aiSettings.apiKeyConfigured,
        apiKeyMasked:     state.aiSettings.apiKeyMasked,
        testStatus:       state.aiSettings.testStatus,
        localOnlyMode:    state.aiSettings.localOnlyMode,
        baseUrl:          state.aiSettings.baseUrl,
      }
    : {};

  return {
    blueprint,
    readiness:   blueprint?.readiness || {},
    transformation: state.transformation || {},
    aiSettings,
    health:      state.health || {},
    modules:     state.modules || {},
    activeVariant: state.activeVariant || {},
  };
}

// ─── Agent lookup ────────────────────────────────────────────────────────────

export function getAgentById(agentId) {
  return agentRegistry.find((a) => a.id === agentId) || null;
}

// ─── Validation gate ─────────────────────────────────────────────────────────

/**
 * Validates that an agent is allowed to run.
 * Returns { canRun: boolean, reason: string | null }
 */
export function validateAgentCanRun(agentId) {
  const agent = getAgentById(agentId);
  if (!agent) return { canRun: false, reason: `Agent not found: "${agentId}"` };
  if (agent.status !== 'active') return { canRun: false, reason: `Agent "${agentId}" is not active (status: ${agent.status}).` };

  const { safe, violations } = enforceNoAutonomy(agent);
  if (!safe) return { canRun: false, reason: 'Agent safety violation: ' + violations.join('; ') };

  if (canAgentCallExternalApi(agentId)) return { canRun: false, reason: 'Agent is not permitted to call external APIs in Run 3.' };
  if (canAgentEditFiles(agentId))       return { canRun: false, reason: 'Agent is not permitted to edit files.' };
  if (canAgentPerformDestructiveAction(agentId)) return { canRun: false, reason: 'Agent is not permitted to perform destructive actions.' };

  if (!ANALYZER_MAP[agentId]) return { canRun: false, reason: `No local analyzer registered for agent "${agentId}".` };

  return { canRun: true, reason: null };
}

// ─── Safety boundary enforcer ────────────────────────────────────────────────

/**
 * Enforces agent safety boundary for a proposed action.
 * Returns { allowed: boolean, reason: string | null }
 */
export function enforceAgentSafetyBoundary(agentId, action) {
  const ALWAYS_FORBIDDEN = [
    'edit_files', 'rewrite_code', 'call_external_api', 'delete_data',
    'modify_blueprint', 'auto_deploy', 'store_raw_keys', 'uncontrolled_autonomy',
  ];

  if (ALWAYS_FORBIDDEN.includes(action)) {
    return { allowed: false, reason: `Action "${action}" is permanently forbidden for all Run 3 agents.` };
  }

  const CONDITIONAL = {
    read_blueprint:        canAgentReadBlueprint(agentId),
    read_api_config:       canAgentReadApiConfig(agentId),
    write_recommendation:  canAgentWriteRecommendations(agentId),
  };

  if (action in CONDITIONAL) {
    const allowed = CONDITIONAL[action];
    return { allowed, reason: allowed ? null : `Agent "${agentId}" does not have permission for action "${action}".` };
  }

  return { allowed: true, reason: null };
}

// ─── Create agent run record ─────────────────────────────────────────────────

export function createAgentRun(agentId, context, output) {
  const blueprint = context?.blueprint;
  return {
    id:           generateId('run'),
    agentId,
    blueprintId:  blueprint?.id || null,
    inputSource:  blueprint ? 'active_blueprint' : (context?.aiSettings ? 'api_config' : 'manual_context'),
    status:       'completed',
    summary:      output.summary || '',
    findings:     output.findings || [],
    warnings:     output.warnings || [],
    blockers:     output.blockers || [],
    recommendations: output.recommendations || [],
    nextActions:  output.nextActions || [],
    safetyFlags:  output.safetyFlags || [],
    createdAt:    nowIso(),
  };
}

// ─── Create recommendation from finding ─────────────────────────────────────

/**
 * Derives priority from content keywords.
 */
function derivePriority(text) {
  const lower = (text || '').toLowerCase();
  if (lower.includes('critical') || lower.includes('blocker') || lower.includes('safety-critical')) return 'critical';
  if (lower.includes('warning') || lower.includes('must') || lower.includes('required')) return 'high';
  if (lower.includes('consider') || lower.includes('suggest') || lower.includes('recommend')) return 'medium';
  return 'low';
}

/**
 * Derives category from agent id.
 */
function deriveCategory(agentId) {
  const MAP = {
    systemArchitectAgent:  'architecture',
    uxLogicAgent:          'ux',
    validationAgent:       'validation',
    refactorPlannerAgent:  'refactor',
    apiConfigAgent:        'api',
    safetyComplianceAgent: 'safety',
    productStrategyAgent:  'strategy',
  };
  return MAP[agentId] || 'architecture';
}

export function createRecommendationFromFinding(agentId, finding, blueprintId = null, suggestedRun = 'Run 4') {
  const now = nowIso();
  return {
    id:          generateId('rec'),
    agentId,
    blueprintId,
    title:       finding.slice(0, 80),
    description: finding,
    priority:    derivePriority(finding),
    category:    deriveCategory(agentId),
    status:      'open',
    suggestedRun,
    blockedBy:   [],
    createdAt:   now,
    updatedAt:   now,
  };
}

// ─── Run a single agent ──────────────────────────────────────────────────────

/**
 * Runs a single advisory agent against local context.
 * Returns { ok, agentRun, recommendations, errors }
 * Does NOT persist — caller must persist via storage.js.
 */
export function runAgentAnalysis(agentId, context) {
  const { canRun, reason } = validateAgentCanRun(agentId);
  if (!canRun) {
    return {
      ok: false,
      errors: [reason],
      agentRun: null,
      recommendations: [],
    };
  }

  const analyzer = ANALYZER_MAP[agentId];
  let rawOutput;
  try {
    rawOutput = analyzer(context);
  } catch (e) {
    return {
      ok: false,
      errors: [`Analyzer error for "${agentId}": ${e.message}`],
      agentRun: null,
      recommendations: [],
    };
  }

  // Safety pass
  const { valid, errors, sanitized } = validateAgentOutput(rawOutput);
  const finalOutput = sanitized || rawOutput;
  const secretWarnings = detectSecretsInAgentOutput(finalOutput);

  // Build agent run record
  const agentRun = createAgentRun(agentId, context, {
    ...finalOutput,
    safetyFlags: [
      ...(finalOutput.safetyFlags || []),
      ...(secretWarnings.length > 0 ? secretWarnings : []),
      ...(!valid ? errors.map((e) => 'Safety: ' + e) : []),
    ],
  });

  // Build recommendations from blockers + recommendations in output
  const recommendations = [];
  const blueprintId = context?.blueprint?.id || null;

  const recSources = [
    ...(finalOutput.blockers || []).map((b) => ({ text: b, priority: 'critical' })),
    ...(finalOutput.recommendations || []).map((r) => ({ text: r, priority: null })),
  ];

  for (const src of recSources) {
    if (canAgentWriteRecommendations(agentId)) {
      const rec = createRecommendationFromFinding(agentId, src.text, blueprintId);
      if (src.priority) rec.priority = src.priority;
      recommendations.push(rec);
    }
  }

  return {
    ok: true,
    agentRun,
    recommendations,
    errors: valid ? [] : errors,
  };
}

// ─── Run all advisory agents ─────────────────────────────────────────────────

/**
 * Runs all active advisory agents sequentially.
 * Returns array of { agentId, ok, agentRun, recommendations, errors }
 * Does NOT persist — caller must persist via storage.js.
 */
export function runAllAdvisoryAgents(context) {
  const agentIds = Object.keys(ANALYZER_MAP);
  return agentIds.map((agentId) => ({
    agentId,
    ...runAgentAnalysis(agentId, context),
  }));
}
