// 4P3X Workspace Readiness — Run 6

export function calculateWorkspaceReadiness(workspace, state) {
  const blockers = findWorkspaceBlockers(workspace, state);
  const warnings = findWorkspaceWarnings(workspace, state);
  const score    = computeReadinessScore(workspace, state, blockers, warnings);
  const level    = determineWorkspaceReadinessLevel(score, blockers, warnings);
  const nextAction = determineWorkspaceNextAction(workspace, state);

  return { score, level, blockers, warnings, nextAction };
}

function computeReadinessScore(workspace, state, blockers, warnings) {
  let score = 0;

  // Blueprint linked (+20)
  if (workspace.linkedBlueprintId) {
    const bp = (state?.blueprints?.blueprints || []).find((b) => b.id === workspace.linkedBlueprintId);
    if (bp) score += 20;
    else score += 5; // ID set but not found
  }

  // Transformation plan linked (+20)
  if (workspace.linkedTransformationPlanId) {
    const plan = (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId);
    if (plan) {
      score += 20;
      if (['ready_for_variant_run', 'ready_with_warnings'].includes(plan.status)) score += 10;
    } else {
      score += 5;
    }
  }

  // Generated prompts linked (+15)
  const linkedPrompts = (workspace.linkedPromptIds || [])
    .map((id) => (state?.variantLauncher?.generatedPrompts || []).find((p) => p.id === id))
    .filter(Boolean);
  if (linkedPrompts.length > 0) {
    score += 15;
    // Safety passed (+5)
    if (linkedPrompts.every((p) => p.safety?.passed)) score += 5;
    // Completeness +5
    if (linkedPrompts.some((p) => (p.completeness?.score || 0) >= 85)) score += 5;
  }

  // No critical open blockers (+10)
  const criticalOpen = (workspace.blockers || []).filter((b) => b.severity === 'critical' && b.status === 'open');
  if (criticalOpen.length === 0) score += 10;

  // Workspace locks enforced (+10)
  if (workspace.locks?.preserveBaseFoundation && workspace.locks?.isolateFromOtherWorkspaces) score += 10;

  // Warnings minor deduction
  score -= warnings.length * 2;

  return Math.max(0, Math.min(100, score));
}

export function findWorkspaceBlockers(workspace, state) {
  const blockers = [];

  if (!workspace.linkedBlueprintId) {
    blockers.push('No blueprint linked — link a validated blueprint to proceed.');
  } else {
    const bp = (state?.blueprints?.blueprints || []).find((b) => b.id === workspace.linkedBlueprintId);
    if (!bp) blockers.push('Linked blueprint not found — it may have been deleted.');
  }

  if (!workspace.linkedTransformationPlanId) {
    blockers.push('No transformation plan linked — link a compiled transformation plan to proceed.');
  } else {
    const plan = (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId);
    if (!plan) blockers.push('Linked transformation plan not found.');
    else if (!['ready_for_variant_run', 'ready_with_warnings'].includes(plan.status)) {
      blockers.push(`Linked transformation plan status is "${plan.status}" — must be ready_for_variant_run.`);
    }
  }

  // Critical open blockers
  const criticalOpen = (workspace.blockers || []).filter((b) => b.severity === 'critical' && b.status === 'open');
  for (const b of criticalOpen) {
    blockers.push(`Critical blocker open: "${b.title}"`);
  }

  return blockers;
}

export function findWorkspaceWarnings(workspace, state) {
  const warnings = [];

  if (workspace.linkedTransformationPlanId) {
    const plan = (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId);
    if (plan?.status === 'ready_with_warnings') {
      warnings.push('Linked transformation plan has warnings — review before proceeding.');
    }
  }

  if ((workspace.linkedPromptIds || []).length === 0) {
    warnings.push('No generated run prompts linked — generate prompts in the Run Prompt Generator.');
  } else {
    const linkedPrompts = (workspace.linkedPromptIds || [])
      .map((id) => (state?.variantLauncher?.generatedPrompts || []).find((p) => p.id === id))
      .filter(Boolean);
    const failedSafety = linkedPrompts.filter((p) => !p.safety?.passed);
    if (failedSafety.length > 0) {
      warnings.push(`${failedSafety.length} linked prompt(s) failed safety scan.`);
    }
  }

  const openWarnings = (workspace.blockers || []).filter((b) => b.severity === 'warning' && b.status === 'open');
  for (const b of openWarnings) {
    warnings.push(`Warning blocker open: "${b.title}"`);
  }

  return warnings;
}

export function determineWorkspaceNextAction(workspace, state) {
  if (!workspace.linkedBlueprintId) return 'Link a validated blueprint to this workspace.';
  if (!workspace.linkedTransformationPlanId) return 'Link a compiled transformation plan to this workspace.';

  const plan = (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId);
  if (plan && !['ready_for_variant_run', 'ready_with_warnings'].includes(plan.status)) {
    return 'Return to the Transformation Compiler and resolve plan blockers.';
  }

  if ((workspace.linkedPromptIds || []).length === 0) {
    return 'Open the Run Prompt Generator and link at least one run prompt to this workspace.';
  }

  const criticalOpen = (workspace.blockers || []).filter((b) => b.severity === 'critical' && b.status === 'open');
  if (criticalOpen.length > 0) return 'Resolve critical blockers before proceeding.';

  if (workspace.status === 'planning') return 'Review workspace setup and change status to "ready_for_build_prompt" when ready.';
  if (workspace.status === 'ready_for_build_prompt') return 'Begin the first build run manually using the linked run prompt.';
  if (workspace.status === 'in_progress') return 'Continue build runs manually. Update progress when each run is complete.';
  if (workspace.status === 'blocked') return 'Resolve blockers to continue build progress.';
  if (workspace.status === 'paused') return 'Resume build progress when ready.';
  if (workspace.status === 'completed') return 'All planned runs complete. Consider archiving or exporting this workspace.';

  return 'Review workspace and linked assets.';
}

export function determineWorkspaceReadinessLevel(score, blockers, _warnings) {
  if (blockers.length > 0) return 'not_ready';
  if (score >= 90) return 'ready';
  if (score >= 70) return 'ready_with_warnings';
  if (score >= 40) return 'partial';
  return 'not_ready';
}
