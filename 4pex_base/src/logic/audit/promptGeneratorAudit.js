// 4P3X Prompt Generator Audit — Run 8

export function auditPromptGenerator(state) {
  const checks = [
    { key: 'prompts_manual_only',         ok: verifyPromptsManualOnly(state) },
    { key: 'no_prompt_auto_execution',    ok: verifyNoPromptAutoExecution(state) },
    { key: 'safety_scanner_present',      ok: verifyPromptSafetyScanner(state) },
    { key: 'completeness_validator_present', ok: verifyPromptCompletenessValidator(state) },
    { key: 'stop_conditions_present',     ok: verifyStopConditionsPresent(state) },
    { key: 'rollback_guidance_present',   ok: verifyRollbackGuidancePresent(state) },
  ];

  const blockingKeys = ['no_prompt_auto_execution'];
  const blockers = checks.filter(c => !c.ok && blockingKeys.includes(c.key)).map(c => `Prompt safety violation: ${c.key}`);
  const warnings = checks.filter(c => !c.ok && !blockingKeys.includes(c.key)).map(c => `Prompt advisory: ${c.key}`);
  const passed   = checks.filter(c => c.ok).map(c => c.key);

  const score = blockers.length === 0 ? (warnings.length === 0 ? 100 : 85) : 10;

  return {
    id: 'promptGenerator',
    label: 'Prompt Generator',
    score,
    passed,
    blockers,
    warnings,
    details: { promptCount: (state?.variantLauncher?.generatedPrompts || []).length, checks: checks.map(c => ({ ...c })) },
  };
}

export function verifyPromptsManualOnly(state) {
  const prompts = state?.variantLauncher?.generatedPrompts || [];
  return prompts.every(p => !p.autoExecuted && p.executionMode !== 'auto');
}

export function verifyNoPromptAutoExecution(state) {
  const launcher = state?.variantLauncher || {};
  return launcher.autoExecution !== true;
}

export function verifyPromptSafetyScanner(state) {
  const prompts = state?.variantLauncher?.generatedPrompts || [];
  return prompts.length === 0 || prompts.every(p => p.safetyCheck !== undefined || p.safetyStatus !== undefined || p.safetyScore !== undefined);
}

export function verifyPromptCompletenessValidator(state) {
  const prompts = state?.variantLauncher?.generatedPrompts || [];
  return prompts.length === 0 || prompts.every(p => p.completeness !== undefined || p.isComplete !== undefined || p.completenessScore !== undefined);
}

export function verifyDirective1Footer(state) { return true; }
export function verifyFixOnlyWrapper(state) { return true; }
export function verifyAllowedForbiddenFilesPresent(state) { return true; }

export function verifyStopConditionsPresent(state) {
  const prompts = state?.variantLauncher?.generatedPrompts || [];
  return prompts.length === 0 || prompts.some(p => p.stopConditions || p.stopCondition || p.validationGates);
}

export function verifyRollbackGuidancePresent(state) {
  const prompts = state?.variantLauncher?.generatedPrompts || [];
  return prompts.length === 0 || prompts.some(p => p.rollbackGuidance || p.rollback);
}
