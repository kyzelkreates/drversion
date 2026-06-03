// 4P3X Workspace Lock Rules — Run 6

export const WORKSPACE_LOCK_RULES = [
  {
    id: 'preserveBaseFoundation',
    label: 'Preserve Base Foundation',
    description: 'This workspace must not mutate Run 1–5 base structure files or state.',
    severity: 'critical',
    blocking: true,
    appliesToProductTypes: 'all',
  },
  {
    id: 'isolateWorkspaceState',
    label: 'Isolate Workspace State',
    description: 'Workspace state must remain separate from all other workspaces. No shared mutable state.',
    severity: 'critical',
    blocking: true,
    appliesToProductTypes: 'all',
  },
  {
    id: 'preventCrossWorkspaceMutation',
    label: 'Prevent Cross-Workspace Mutation',
    description: 'This workspace must not read from or write to another workspace\'s records.',
    severity: 'critical',
    blocking: true,
    appliesToProductTypes: 'all',
  },
  {
    id: 'manualPromptExecutionOnly',
    label: 'Manual Prompt Execution Only',
    description: 'Generated run prompts linked to this workspace must only be executed by the user manually.',
    severity: 'critical',
    blocking: true,
    appliesToProductTypes: 'all',
  },
  {
    id: 'preventAutoBuildExecution',
    label: 'Prevent Auto-Build Execution',
    description: 'No build run may be triggered automatically from this workspace.',
    severity: 'critical',
    blocking: true,
    appliesToProductTypes: 'all',
  },
  {
    id: 'preventSecretExposure',
    label: 'Prevent Secret Exposure',
    description: 'This workspace must not store or export raw API keys, backend secrets, or environment secrets.',
    severity: 'critical',
    blocking: true,
    appliesToProductTypes: 'all',
  },
  {
    id: 'preventBackendAssumption',
    label: 'Prevent Backend Assumption',
    description: 'Workspace planning must not assume a backend exists unless the product run sequence includes a backend run.',
    severity: 'high',
    blocking: false,
    appliesToProductTypes: ['learningPlatform', 'projectControlOS', 'fleetDashboard', 'monitoringDashboard', 'clientPortal', 'adminDashboard', 'localFirstPWAProduct', 'customProductSystem'],
  },
  {
    id: 'preventDemoLanguage',
    label: 'Prevent Demo Language',
    description: 'Workspace notes, descriptions, and fields must not use demo, mock, fake, dummy, toy, or sample-only wording.',
    severity: 'medium',
    blocking: false,
    appliesToProductTypes: 'all',
  },
  {
    id: 'requireLinkedBlueprint',
    label: 'Require Linked Blueprint',
    description: 'A workspace must have a linked blueprint before it can be marked as ready_for_build_prompt.',
    severity: 'high',
    blocking: true,
    appliesToProductTypes: 'all',
  },
  {
    id: 'requireLinkedTransformationPlan',
    label: 'Require Linked Transformation Plan',
    description: 'A workspace must have a linked transformation plan before build progress can begin.',
    severity: 'high',
    blocking: true,
    appliesToProductTypes: 'all',
  },
  {
    id: 'requireManualReviewBeforeBuild',
    label: 'Require Manual Review Before Build',
    description: 'User must manually review and approve the workspace before marking any run as in_progress.',
    severity: 'high',
    blocking: false,
    appliesToProductTypes: 'all',
  },
  {
    id: 'requireRunValidationBeforeStatusComplete',
    label: 'Require Run Validation Before Completing',
    description: 'Workspace status cannot be set to completed unless all expected runs are marked complete.',
    severity: 'warning',
    blocking: false,
    appliesToProductTypes: 'all',
  },
];

export function getLockRuleById(ruleId) {
  return WORKSPACE_LOCK_RULES.find((r) => r.id === ruleId) || null;
}

export function getBlockingLockRules() {
  return WORKSPACE_LOCK_RULES.filter((r) => r.blocking);
}

export function getLockRulesForProductType(productType) {
  return WORKSPACE_LOCK_RULES.filter(
    (r) => r.appliesToProductTypes === 'all' || r.appliesToProductTypes.includes(productType)
  );
}

export default WORKSPACE_LOCK_RULES;
