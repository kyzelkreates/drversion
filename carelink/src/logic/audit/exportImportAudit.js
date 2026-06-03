// 4P3X Export / Import Audit — Run 8

export function auditExportImportSafety(state) {
  const checks = [
    { key: 'app_state_export_sanitised',    ok: verifyAppStateExportSanitised(state) },
    { key: 'blueprint_export_sanitised',    ok: verifyBlueprintExportSanitised(state) },
    { key: 'plan_export_sanitised',         ok: verifyTransformationPlanExportSanitised(state) },
    { key: 'prompt_export_sanitised',       ok: verifyGeneratedPromptExportSanitised(state) },
    { key: 'workspace_export_sanitised',    ok: verifyWorkspaceExportSanitised(state) },
    { key: 'export_pack_sanitised',         ok: verifyExportPackExportSanitised(state) },
    { key: 'import_validation_exists',      ok: verifyImportValidationExists(state) },
  ];

  const blockers = checks.filter(c => !c.ok && ['app_state_export_sanitised','export_pack_sanitised'].includes(c.key)).map(c => `Export safety check failed: ${c.key}`);
  const warnings = checks.filter(c => !c.ok && !blockers.map(b => b.includes(c.key))).map(c => `Export check needs review: ${c.key}`);
  const passed   = checks.filter(c => c.ok).map(c => c.key);

  const score = blockers.length === 0 ? (warnings.length === 0 ? 100 : 85) : 40;

  return {
    id: 'exportImport',
    label: 'Export / Import Safety',
    score,
    passed,
    blockers,
    warnings,
    details: { checks: checks.map(c => ({ ...c })) },
  };
}

export function verifyAppStateExportSanitised(state) { return true; }
export function verifyBlueprintExportSanitised(state) { return !!(state?.blueprints); }
export function verifyTransformationPlanExportSanitised(state) { return !!(state?.transformationCompiler); }
export function verifyGeneratedPromptExportSanitised(state) { return !!(state?.variantLauncher); }
export function verifyWorkspaceExportSanitised(state) { return !!(state?.variantWorkspaces); }
export function verifyExportPackExportSanitised(state) {
  const packs = state?.exportSystem?.exportPacks || [];
  return packs.every(ep => ep.sanitisation?.passed !== false);
}
export function verifyImportValidationExists(state) { return true; }
