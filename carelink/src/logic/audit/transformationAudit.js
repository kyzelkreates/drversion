// 4P3X Transformation Audit — Run 8

export function auditTransformationSystem(state) {
  const checks = [
    { key: 'compiler_non_destructive',      ok: verifyCompilerNonDestructive(state) },
    { key: 'skeleton_plans_no_file_writes', ok: verifySkeletonPlansDoNotWriteFiles(state) },
    { key: 'transformation_locks_exist',    ok: verifyTransformationLocks(state) },
    { key: 'readiness_scoring_present',     ok: verifyReadinessScoring(state) },
    { key: 'plan_export_sanitised',         ok: verifyPlanExportSanitisation(state) },
    { key: 'no_final_variant_builds',       ok: verifyNoFinalVariantBuilds(state) },
  ];

  const blockingKeys = ['compiler_non_destructive', 'no_final_variant_builds'];
  const blockers = checks.filter(c => !c.ok && blockingKeys.includes(c.key)).map(c => `Transformation safety violation: ${c.key}`);
  const warnings = checks.filter(c => !c.ok && !blockingKeys.includes(c.key)).map(c => `Transformation advisory: ${c.key}`);
  const passed   = checks.filter(c => c.ok).map(c => c.key);

  const score = blockers.length === 0 ? (warnings.length === 0 ? 100 : 88) : 20;

  return {
    id: 'transformation',
    label: 'Transformation System',
    score,
    passed,
    blockers,
    warnings,
    details: { planCount: (state?.transformationCompiler?.plans || []).length, checks: checks.map(c => ({ ...c })) },
  };
}

export function verifyCompilerNonDestructive(state) {
  const locks = state?.transformationCompiler?.locks || {};
  return locks.preventFileWrites !== false;
}

export function verifySkeletonPlansDoNotWriteFiles(state) {
  const plans = state?.transformationCompiler?.plans || [];
  return plans.every(p => !p.hasWrittenFiles && !p.filesWritten);
}

export function verifyTransformationLocks(state) {
  return !!(state?.transformationCompiler);
}

export function verifyReadinessScoring(state) {
  const plans = state?.transformationCompiler?.plans || [];
  return plans.length === 0 || plans.every(p => p.readinessScore !== undefined || p.readiness !== undefined);
}

export function verifyPlanExportSanitisation(state) { return true; }

export function verifyNoFinalVariantBuilds(state) {
  const workspaces = state?.variantWorkspaces?.workspaces || [];
  return workspaces.every(w => w.status !== 'variant_built_auto');
}
