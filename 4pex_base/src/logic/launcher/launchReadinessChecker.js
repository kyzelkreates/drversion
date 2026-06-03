// 4P3X Launch Readiness Checker — Run 5
// Determines if the variant build launcher has everything needed to generate run prompts.
// Does not execute builds. Does not generate prompts automatically.

export function checkLaunchReadiness(transformationPlan, generatedPrompts) {
  const blockers = detectLaunchBlockers(transformationPlan, generatedPrompts || []);
  const warnings = detectLaunchWarnings(transformationPlan, generatedPrompts || []);
  const nextAction = generateNextRecommendedAction(transformationPlan, generatedPrompts || []);

  return {
    ready: blockers.length === 0,
    blockers,
    warnings,
    nextRecommendedAction: nextAction,
    promptCount: (generatedPrompts || []).length,
    validatedPromptCount: (generatedPrompts || []).filter(
      (p) => p.status === 'ready_to_copy' || p.status === 'validated'
    ).length,
  };
}

export function detectLaunchBlockers(transformationPlan, prompts) {
  const blockers = [];

  if (!transformationPlan) {
    blockers.push('No active transformation plan — compile a plan in the Transformation Compiler first.');
    return blockers;
  }

  const validStatuses = ['ready_for_variant_run', 'ready_with_warnings'];
  if (!validStatuses.includes(transformationPlan.status)) {
    blockers.push(
      `Transformation plan status is "${transformationPlan.status}" — must be "ready_for_variant_run" or "ready_with_warnings".`
    );
  }

  if (!transformationPlan.futureRunSequence || !transformationPlan.futureRunSequence.runs?.length) {
    blockers.push('No future run sequence found in the transformation plan — regenerate the plan in the Transformation Compiler.');
  }

  const safetyBlockers = detectPromptSafetyBlockers(prompts);
  blockers.push(...safetyBlockers);

  return blockers;
}

function detectLaunchWarnings(transformationPlan, prompts) {
  const warnings = [];

  if (!transformationPlan) return warnings;

  if (transformationPlan.status === 'ready_with_warnings') {
    warnings.push('Transformation plan has warnings — review them before proceeding.');
  }

  const criticalRisks = (transformationPlan.risks || []).filter((r) => r.severity === 'critical');
  if (criticalRisks.length > 0) {
    warnings.push(`${criticalRisks.length} critical risk(s) exist in the transformation plan.`);
  }

  const missing = detectMissingPrompts(transformationPlan, prompts);
  if (missing.length > 0) {
    warnings.push(`${missing.length} run prompt(s) have not been generated yet.`);
  }

  const incompletePrompts = prompts.filter((p) => (p.completeness?.score || 0) < 60);
  if (incompletePrompts.length > 0) {
    warnings.push(`${incompletePrompts.length} generated prompt(s) have low completeness scores.`);
  }

  return warnings;
}

export function detectMissingPrompts(transformationPlan, prompts) {
  if (!transformationPlan?.futureRunSequence?.runs) return [];

  const generatedRunNumbers = prompts.map((p) => p.runNumber);
  return transformationPlan.futureRunSequence.runs
    .map((r) => r.runNumber)
    .filter((rn) => !generatedRunNumbers.includes(rn));
}

export function detectPromptSafetyBlockers(prompts) {
  const blockers = [];

  for (const prompt of prompts) {
    if (prompt.safety && !prompt.safety.passed) {
      const issues = [
        ...(prompt.safety.secretRisks || []),
        ...(prompt.safety.destructiveRisks || []),
        ...(prompt.safety.autonomyRisks || []),
      ];
      if (issues.length > 0) {
        blockers.push(`Prompt "${prompt.title}" has ${issues.length} critical safety issue(s).`);
      }
    }
  }

  return blockers;
}

export function detectPromptCompletenessBlockers(prompts) {
  return prompts
    .filter((p) => (p.completeness?.score || 0) < 60)
    .map((p) => `Prompt "${p.title}" has low completeness score (${p.completeness?.score || 0}/100).`);
}

export function generateNextRecommendedAction(transformationPlan, prompts) {
  if (!transformationPlan) {
    return 'Open the Transformation Compiler and compile a transformation plan for your selected blueprint.';
  }

  const validStatuses = ['ready_for_variant_run', 'ready_with_warnings'];
  if (!validStatuses.includes(transformationPlan.status)) {
    return 'Return to the Transformation Compiler and resolve blockers until the plan reaches "ready_for_variant_run" status.';
  }

  if (!transformationPlan.futureRunSequence?.runs?.length) {
    return 'Regenerate the transformation plan to include a future run sequence.';
  }

  const safetyBlockers = detectPromptSafetyBlockers(prompts);
  if (safetyBlockers.length > 0) {
    return 'Resolve safety issues in generated prompts before proceeding.';
  }

  if (prompts.length === 0) {
    return 'Open the Run Prompt Generator and generate your first run prompt for this transformation plan.';
  }

  const readyPrompts = prompts.filter(
    (p) => p.status === 'ready_to_copy' || p.status === 'validated'
  );
  if (readyPrompts.length === 0) {
    return 'Review generated prompts — increase completeness scores and resolve any safety issues.';
  }

  const missing = detectMissingPrompts(transformationPlan, prompts);
  if (missing.length > 0) {
    return `Generate prompts for the remaining ${missing.length} run(s): ${missing.join(', ')}.`;
  }

  return 'All run prompts are ready. Copy your first prompt and begin the manual build process.';
}
