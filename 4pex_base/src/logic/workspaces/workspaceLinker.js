// 4P3X Workspace Linker — Run 6
// Read-only asset reference resolution for workspace linked assets.

export function getLinkedBlueprint(workspace, state) {
  if (!workspace?.linkedBlueprintId) return null;
  return (state?.blueprints?.blueprints || []).find((b) => b.id === workspace.linkedBlueprintId) || null;
}

export function getLinkedTransformationPlan(workspace, state) {
  if (!workspace?.linkedTransformationPlanId) return null;
  return (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId) || null;
}

export function getLinkedPrompts(workspace, state) {
  const ids = workspace?.linkedPromptIds || [];
  return ids
    .map((id) => (state?.variantLauncher?.generatedPrompts || []).find((p) => p.id === id))
    .filter(Boolean);
}

export function getLinkedRecommendations(workspace, state) {
  const ids = workspace?.linkedRecommendationIds || [];
  return ids
    .map((id) => (state?.agentSystem?.recommendationQueue || []).find((r) => r.id === id))
    .filter(Boolean);
}

export function getWorkspaceLinkedAssets(workspace, state) {
  return {
    blueprint:         getLinkedBlueprint(workspace, state),
    transformationPlan: getLinkedTransformationPlan(workspace, state),
    prompts:           getLinkedPrompts(workspace, state),
    recommendations:   getLinkedRecommendations(workspace, state),
  };
}

export function validateLinkedAssets(workspace, state) {
  const issues = [];

  if (workspace.linkedBlueprintId && !getLinkedBlueprint(workspace, state)) {
    issues.push({ field: 'linkedBlueprintId', message: 'Linked blueprint not found.', severity: 'warning' });
  }
  if (workspace.linkedTransformationPlanId && !getLinkedTransformationPlan(workspace, state)) {
    issues.push({ field: 'linkedTransformationPlanId', message: 'Linked transformation plan not found.', severity: 'warning' });
  }
  for (const id of workspace.linkedPromptIds || []) {
    const found = (state?.variantLauncher?.generatedPrompts || []).find((p) => p.id === id);
    if (!found) issues.push({ field: 'linkedPromptIds', message: `Linked prompt "${id}" not found.`, severity: 'info' });
  }

  return issues;
}
