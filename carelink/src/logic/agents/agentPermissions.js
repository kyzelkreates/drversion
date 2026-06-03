// 4P3X Agent Permissions — RUN 3
// Config-driven permission matrix. No agent may exceed these boundaries.
// All permissions are read from this file — never hardcoded in components.

import agentRegistry from '../../config/agentRegistry.js';

/**
 * Flat permission matrix for each agent.
 * canModifyBlueprint, canCallExternalApi, canEditFiles, canPerformDestructiveAction
 * are permanently false for all Run 3 agents.
 */
export const AGENT_PERMISSION_MATRIX = {
  systemArchitectAgent:  { readBlueprint: true,  readApiConfig: false, writeRecommendations: true,  modifyBlueprint: false, callExternalApi: false, editFiles: false, destructiveAction: false },
  uxLogicAgent:          { readBlueprint: true,  readApiConfig: false, writeRecommendations: true,  modifyBlueprint: false, callExternalApi: false, editFiles: false, destructiveAction: false },
  validationAgent:       { readBlueprint: true,  readApiConfig: false, writeRecommendations: true,  modifyBlueprint: false, callExternalApi: false, editFiles: false, destructiveAction: false },
  refactorPlannerAgent:  { readBlueprint: true,  readApiConfig: false, writeRecommendations: true,  modifyBlueprint: false, callExternalApi: false, editFiles: false, destructiveAction: false },
  apiConfigAgent:        { readBlueprint: false, readApiConfig: true,  writeRecommendations: true,  modifyBlueprint: false, callExternalApi: false, editFiles: false, destructiveAction: false },
  safetyComplianceAgent: { readBlueprint: true,  readApiConfig: false, writeRecommendations: true,  modifyBlueprint: false, callExternalApi: false, editFiles: false, destructiveAction: false },
  productStrategyAgent:  { readBlueprint: true,  readApiConfig: false, writeRecommendations: true,  modifyBlueprint: false, callExternalApi: false, editFiles: false, destructiveAction: false },
};

function _getPermission(agentId) {
  return AGENT_PERMISSION_MATRIX[agentId] || null;
}

export function canAgentReadBlueprint(agentId) {
  return _getPermission(agentId)?.readBlueprint === true;
}

export function canAgentReadApiConfig(agentId) {
  return _getPermission(agentId)?.readApiConfig === true;
}

export function canAgentWriteRecommendations(agentId) {
  return _getPermission(agentId)?.writeRecommendations === true;
}

export function canAgentModifyBlueprint(agentId) {
  // Permanently false — kept for explicitness
  return false;
}

export function canAgentCallExternalApi(agentId) {
  // Permanently false in Run 3
  return false;
}

export function canAgentEditFiles(agentId) {
  // Permanently false — agents never edit files
  return false;
}

export function canAgentPerformDestructiveAction(agentId) {
  // Permanently false
  return false;
}

/**
 * Returns the full permission set for a given agent.
 * Unknown agents return null.
 */
export function getAgentPermissions(agentId) {
  return _getPermission(agentId);
}

/**
 * Returns all agents with their permission rows — used by AgentPermissionsMatrix.
 */
export function getAllAgentPermissions() {
  return Object.entries(AGENT_PERMISSION_MATRIX).map(([agentId, perms]) => {
    const agent = agentRegistry.find((a) => a.id === agentId);
    return {
      agentId,
      agentName: agent?.name || agentId,
      ...perms,
    };
  });
}
