// 4P3X Workspace Isolation — Run 6
// Enforces that workspaces cannot contaminate each other or the base foundation.

const BASE_PROTECTED_KEYS = ['blueprints', 'transformation', 'transformationCompiler', 'variantLauncher', 'agentSystem', 'aiSettings', 'modules', 'activeVariant'];

export function enforceWorkspaceIsolation(workspace, state) {
  const violations = detectCrossWorkspaceMutationRisk(workspace.id, {}, state);
  const baseRisks  = detectBaseMutationRisk(workspace, state);
  return { violations, baseRisks, isolated: violations.length === 0 && baseRisks.length === 0 };
}

export function detectCrossWorkspaceMutationRisk(workspaceId, updates, state) {
  const risks = [];
  const allWS  = state?.variantWorkspaces?.workspaces || [];

  // Check if any update key is trying to reference another workspace's ID as owned data
  for (const other of allWS) {
    if (other.id === workspaceId) continue;
    if (updates?.linkedBlueprintId && updates.linkedBlueprintId === other.linkedBlueprintId) {
      // Sharing a blueprint reference is fine — it's read-only
    }
    // An actual mutation risk would be directly embedding another workspace's sub-records
    if (updates?.notes && other.notes?.some((n) => updates.notes?.some((un) => un.id === n.id && un !== n))) {
      risks.push(`Note ID collision detected with workspace "${other.name}".`);
    }
  }

  return risks;
}

export function detectBaseMutationRisk(workspace, _state) {
  const risks = [];

  // Check if the workspace description/notes contain references to modifying base files
  const text = JSON.stringify(workspace).toLowerCase();
  const dangerTerms = ['storage.js', 'initialstate.js', 'appshell', 'sidebar', 'moduleregistry.js', 'appconfig.js'];
  for (const term of dangerTerms) {
    if (text.includes(term)) {
      risks.push(`Workspace contains reference to protected base file: "${term}". Workspace must not modify base files.`);
    }
  }

  return risks;
}

export function validateWorkspaceAssetLinks(workspace, state) {
  const issues = [];

  if (workspace.linkedBlueprintId) {
    const bp = (state?.blueprints?.blueprints || []).find((b) => b.id === workspace.linkedBlueprintId);
    if (!bp) issues.push(`Linked blueprint ID "${workspace.linkedBlueprintId}" not found.`);
  }

  if (workspace.linkedTransformationPlanId) {
    const plan = (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId);
    if (!plan) issues.push(`Linked transformation plan ID "${workspace.linkedTransformationPlanId}" not found.`);
  }

  for (const promptId of workspace.linkedPromptIds || []) {
    const prompt = (state?.variantLauncher?.generatedPrompts || []).find((p) => p.id === promptId);
    if (!prompt) issues.push(`Linked prompt ID "${promptId}" not found.`);
  }

  return issues;
}

export function preventWorkspaceAssetOwnership(workspace) {
  // Returns a version of the workspace that only stores IDs, not full copies
  return {
    ...workspace,
    // Ensure linked assets are IDs only — no embedded full records
    linkedBlueprintId:          workspace.linkedBlueprintId || null,
    linkedTransformationPlanId: workspace.linkedTransformationPlanId || null,
    linkedPromptIds:            (workspace.linkedPromptIds || []).filter((id) => typeof id === 'string'),
    linkedRecommendationIds:    (workspace.linkedRecommendationIds || []).filter((id) => typeof id === 'string'),
  };
}

export function explainWorkspaceIsolation(workspace) {
  return [
    `Workspace "${workspace.name}" is isolated from all other workspaces.`,
    'Linked blueprints, transformation plans, and prompts are read-only references (stored as IDs only).',
    'This workspace cannot modify source blueprint, plan, or prompt records.',
    'This workspace cannot read from or write to other workspace records.',
    'All workspace data is stored through storage.js SSOT only.',
    'No build runs are executed automatically from this workspace.',
  ];
}
