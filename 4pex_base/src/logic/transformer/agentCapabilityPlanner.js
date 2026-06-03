// 4P3X Agent Capability Planner — RUN 4

const ALLOWED_CAPABILITIES = [
  'read_local_state',
  'read_blueprint',
  'read_api_config_masked',
  'read_module_registry',
  'write_recommendations',
  'analyze_architecture',
  'analyze_ux_flows',
  'analyze_validation_gaps',
  'analyze_api_config',
  'analyze_safety_compliance',
  'analyze_product_strategy',
  'generate_advisory_report',
  'flag_missing_requirements',
  'flag_safety_risks',
];

const FORBIDDEN_CAPABILITIES = [
  'edit_files',
  'create_files',
  'delete_files',
  'overwrite_existing_code',
  'call_external_api',
  'call_ai_api_directly',
  'execute_code',
  'modify_production_state',
  'expose_raw_keys',
  'autonomous_decision_making',
  'self_modification',
  'deploy_to_production',
];

const TYPE_AGENT_NEEDS = {
  lms:           ['systemArchitectAgent', 'uxLogicAgent', 'validationAgent', 'productStrategyAgent'],
  fleet:         ['systemArchitectAgent', 'validationAgent', 'safetyComplianceAgent', 'apiConfigAgent'],
  projectOS:     ['systemArchitectAgent', 'uxLogicAgent', 'validationAgent', 'refactorPlannerAgent'],
  saas:          ['systemArchitectAgent', 'apiConfigAgent', 'productStrategyAgent', 'validationAgent'],
  ecommerce:     ['systemArchitectAgent', 'apiConfigAgent', 'uxLogicAgent', 'safetyComplianceAgent'],
  crm:           ['systemArchitectAgent', 'uxLogicAgent', 'validationAgent'],
  healthTracker: ['systemArchitectAgent', 'safetyComplianceAgent', 'validationAgent'],
  eventPlatform: ['systemArchitectAgent', 'uxLogicAgent', 'productStrategyAgent'],
  portfolioPlatform: ['systemArchitectAgent', 'uxLogicAgent', 'productStrategyAgent'],
  cybersecurity: ['systemArchitectAgent', 'safetyComplianceAgent', 'validationAgent'],
  customProductSystem: ['systemArchitectAgent', 'validationAgent'],
  foundation:    ['validationAgent'],
};

export function planAgentCapabilities(blueprint, agentRegistry) {
  const type  = blueprint?.productType || 'foundation';
  const needed = TYPE_AGENT_NEEDS[type] || TYPE_AGENT_NEEDS.customProductSystem;

  const registered = Array.isArray(agentRegistry) ? agentRegistry.map(a => a.id) : [];
  const available  = needed.filter(id => registered.includes(id));
  const gaps       = detectAgentCapabilityGaps(blueprint, agentRegistry);

  return enforceAgentAuthorityLimits({
    requiredAgents:       available,
    allowedCapabilities:  ALLOWED_CAPABILITIES,
    forbiddenCapabilities: FORBIDDEN_CAPABILITIES,
    autonomyAllowed:      false,
    gaps,
  });
}

export function mapAgentsToVariantNeeds(blueprint, agents) {
  const type   = blueprint?.productType || 'foundation';
  const needed = TYPE_AGENT_NEEDS[type] || [];
  const agentArr = Array.isArray(agents) ? agents : [];

  return needed.map(id => {
    const agent = agentArr.find(a => a.id === id);
    return {
      id,
      found:       !!agent,
      name:        agent?.name || id,
      status:      agent?.status || 'unknown',
      note:        agent ? 'Ready for advisory analysis' : 'Agent not found in registry — check agentRegistry.js',
    };
  });
}

export function detectAgentCapabilityGaps(blueprint, agents) {
  const type   = blueprint?.productType || 'foundation';
  const needed = TYPE_AGENT_NEEDS[type] || [];
  const agentArr = Array.isArray(agents) ? agents : [];
  const registeredIds = agentArr.map(a => a.id);

  return needed
    .filter(id => !registeredIds.includes(id))
    .map(id => ({ agentId: id, gap: `Agent "${id}" is required for ${type} but is not registered.` }));
}

export function enforceAgentAuthorityLimits(plan) {
  return {
    ...plan,
    autonomyAllowed:      false,
    fileEditAllowed:      false,
    externalCallsAllowed: false,
    note: 'All agents remain advisory-only. No autonomous actions, file edits, or external calls are permitted.',
  };
}
