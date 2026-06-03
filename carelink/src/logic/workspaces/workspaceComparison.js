// 4P3X Workspace Comparison — Run 6
// Read-only comparison of multiple workspaces. Never mutates workspace state.

export function compareWorkspaces(workspaceIds, state) {
  const allWS = state?.variantWorkspaces?.workspaces || [];
  const selected = workspaceIds.map((id) => allWS.find((w) => w.id === id)).filter(Boolean);
  if (selected.length < 2) return { error: 'Select at least two workspaces to compare.' };

  return {
    workspaces:     selected,
    productTypes:   compareProductTypes(selected),
    readiness:      compareReadiness(selected),
    progress:       compareProgress(selected),
    linkedAssets:   compareLinkedAssets(selected),
    blockers:       compareBlockers(selected),
    nextActions:    compareNextActions(selected),
  };
}

export function compareProductTypes(workspaces) {
  return workspaces.map((w) => ({ id: w.id, name: w.name, productType: w.productType }));
}

export function compareReadiness(workspaces) {
  return workspaces.map((w) => ({
    id:      w.id,
    name:    w.name,
    score:   w.readiness?.score ?? 0,
    level:   w.readiness?.level ?? 'not_ready',
    blockers: (w.readiness?.blockers || []).length,
    warnings: (w.readiness?.warnings || []).length,
  }));
}

export function compareProgress(workspaces) {
  return workspaces.map((w) => ({
    id:             w.id,
    name:           w.name,
    progressPercent: w.buildProgress?.progressPercent ?? 0,
    completedRuns:  (w.buildProgress?.completedRuns || []).length,
    totalRuns:      w.buildProgress?.totalRuns ?? 0,
    activeRun:      w.buildProgress?.activeRun ?? null,
    blockedRuns:    (w.buildProgress?.blockedRuns || []).length,
    status:         w.status,
  }));
}

export function compareLinkedAssets(workspaces) {
  return workspaces.map((w) => ({
    id:                         w.id,
    name:                       w.name,
    hasBlueprint:               !!w.linkedBlueprintId,
    hasTransformationPlan:      !!w.linkedTransformationPlanId,
    linkedPromptCount:          (w.linkedPromptIds || []).length,
    linkedRecommendationCount:  (w.linkedRecommendationIds || []).length,
  }));
}

export function compareBlockers(workspaces) {
  return workspaces.map((w) => ({
    id:              w.id,
    name:            w.name,
    criticalOpen:    (w.blockers || []).filter((b) => b.severity === 'critical' && b.status === 'open').length,
    warningOpen:     (w.blockers || []).filter((b) => b.severity === 'warning' && b.status === 'open').length,
    infoOpen:        (w.blockers || []).filter((b) => b.severity === 'info' && b.status === 'open').length,
    resolved:        (w.blockers || []).filter((b) => b.status === 'resolved').length,
  }));
}

export function compareNextActions(workspaces) {
  return workspaces.map((w) => ({
    id:         w.id,
    name:       w.name,
    nextAction: w.readiness?.nextAction || 'Review workspace setup.',
  }));
}
