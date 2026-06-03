// 4P3X Export Pack Readiness — Run 7

export function calculateExportPackReadiness(exportPack, state) {
  const blockers = findExportPackBlockers(exportPack, state);
  const warnings = findExportPackWarnings(exportPack, state);
  const score    = computeScore(exportPack, state, blockers, warnings);
  const level    = determineExportPackReadinessLevel(score, blockers, warnings);
  const nextAction = determineExportPackNextAction(exportPack, state);
  return { score, level, blockers, warnings, nextAction };
}

function computeScore(exportPack, state, blockers, warnings) {
  let score = 0;
  if (exportPack.identity?.appName) score += 10;
  if (exportPack.handoffInstructions) score += 20;
  if (exportPack.envExample?.containsPlaceholdersOnly) score += 15;
  if (exportPack.sanitisation?.passed) score += 20;
  if (exportPack.sanitisation?.rawKeysDetected === false) score += 10;
  if ((exportPack.handoffInstructions?.stopConditions || []).length > 0) score += 10;
  if ((exportPack.handoffInstructions?.rollbackGuidance || []).length > 0) score += 10;
  if (exportPack.linkedWorkspaceId || exportPack.linkedBlueprintId) score += 5;
  score -= blockers.length * 10;
  score -= warnings.length * 3;
  return Math.max(0, Math.min(100, score));
}

export function findExportPackBlockers(exportPack, state) {
  const b = [];
  if (!exportPack.handoffInstructions) b.push('Handoff instructions not generated — click "Generate Handoff Instructions".');
  if (!exportPack.sanitisation?.passed) b.push('No-secrets guard has not passed — run sanitisation check.');
  if (exportPack.envExample?.containsPlaceholdersOnly === false) b.push('.env.example contains non-placeholder values — review and correct.');
  return b;
}

export function findExportPackWarnings(exportPack, _state) {
  const w = [];
  if (!exportPack.linkedWorkspaceId && !exportPack.linkedBlueprintId) w.push('No linked assets — consider linking a workspace or blueprint.');
  if ((exportPack.linkedPromptIds || []).length === 0 && exportPack.type === 'variant_handoff') w.push('No generated prompts linked for variant handoff.');
  return w;
}

export function determineExportPackNextAction(exportPack, _state) {
  if (!exportPack.handoffInstructions) return 'Open Handoff Pack Builder and generate instructions for the selected builder tool.';
  if (!exportPack.sanitisation?.passed) return 'Run the no-secrets sanitisation check before exporting.';
  if ((exportPack.readiness?.score || 0) < 70) return 'Link required assets and complete the deployment readiness checklist.';
  return 'Export pack is ready. Export as JSON or text for handoff.';
}

export function determineExportPackReadinessLevel(score, blockers, _warnings) {
  if (blockers.length > 0) return 'not_ready';
  if (score >= 90) return 'ready';
  if (score >= 70) return 'ready_with_warnings';
  if (score >= 40) return 'partial';
  return 'not_ready';
}
