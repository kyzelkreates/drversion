// 4P3X State Schema Audit — Run 8

const REQUIRED_RUN_SECTIONS = {
  run1: ['app', 'activeVariant', 'modules', 'preferences', 'health', 'aiSettings', 'audit'],
  run2: ['blueprints'],
  run3: ['agentSystem'],
  run4: ['transformationCompiler'],
  run5: ['variantLauncher'],
  run6: ['variantWorkspaces'],
  run7: ['exportSystem'],
  run8: ['finalAudit'],
};

export function auditStateSchema(state) {
  const blockers = [];
  const warnings = [];
  const passed   = [];

  const run1Check = validateRequiredTopLevelState(state, 'run1');
  if (!run1Check.ok) { blockers.push(`Core run 1 state missing: ${run1Check.missing.join(', ')}`); }
  else passed.push('run1_state_present');

  ['run2','run3','run4','run5','run6','run7','run8'].forEach(run => {
    const check = validateRequiredTopLevelState(state, run);
    if (!check.ok) warnings.push(`${run} state section missing: ${check.missing.join(', ')}`);
    else passed.push(`${run}_state_present`);
  });

  const migrationSafe = validateStateMigrationSafety(state);
  if (!migrationSafe) warnings.push('State migration safety could not be fully confirmed');
  else passed.push('no_shape_risks');

  const score = blockers.length === 0 ? Math.max(60, 100 - warnings.length * 5) : 30;

  return {
    id: 'stateSchema',
    label: 'State Schema',
    score,
    passed,
    blockers,
    warnings,
    details: { presentKeys: Object.keys(state || {}), requiredSections: REQUIRED_RUN_SECTIONS },
  };
}

export function validateRequiredTopLevelState(state, run) {
  const required = REQUIRED_RUN_SECTIONS[run] || [];
  const missing  = required.filter(k => !(k in (state || {})));
  return { ok: missing.length === 0, missing };
}

export function validateStateMigrationSafety(state) {
  return state && typeof state === 'object' && !Array.isArray(state);
}

export function validateInitialStateAlignment(state) {
  return validateRequiredTopLevelState(state, 'run1').ok;
}

export function detectMissingRunStateSections(state) {
  const missing = [];
  Object.entries(REQUIRED_RUN_SECTIONS).forEach(([run, keys]) => {
    keys.forEach(k => { if (!(k in (state || {}))) missing.push(`${run}:${k}`); });
  });
  return missing;
}

export function detectStateShapeRisks(state) {
  const risks = [];
  if (Array.isArray(state)) risks.push('state is an array instead of object');
  if (!state) risks.push('state is null/undefined');
  return risks;
}
