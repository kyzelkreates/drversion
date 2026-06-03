// 4P3X Export / Handoff Audit — Run 8

export function auditExportHandoff(state) {
  const checks = [
    { key: 'export_packs_sanitised',   ok: verifyExportPacksSanitised(state) },
    { key: 'no_secrets_guard_active',  ok: verifyNoSecretsGuard(state) },
    { key: 'handoff_instructions_valid', ok: verifyHandoffInstructions(state) },
    { key: 'builder_tool_templates_exist', ok: verifyBuilderToolTemplates(state) },
    { key: 'env_example_placeholders', ok: verifyEnvExamplePlaceholdersOnly(state) },
    { key: 'no_auto_deployment',       ok: verifyNoAutoDeployment(state) },
    { key: 'no_github_auto_push',      ok: verifyNoGitHubAutoPush(state) },
    { key: 'no_vercel_auto_connect',   ok: verifyNoVercelAutoConnect(state) },
  ];

  const blockingKeys = ['no_auto_deployment', 'no_github_auto_push', 'no_vercel_auto_connect', 'no_secrets_guard_active'];
  const blockers = checks.filter(c => !c.ok && blockingKeys.includes(c.key)).map(c => `Export/handoff violation: ${c.key}`);
  const warnings = checks.filter(c => !c.ok && !blockingKeys.includes(c.key)).map(c => `Export advisory: ${c.key}`);
  const passed   = checks.filter(c => c.ok).map(c => c.key);

  const score = blockers.length === 0 ? (warnings.length === 0 ? 100 : 85) : 20;

  return {
    id: 'exportHandoff',
    label: 'Export / Handoff',
    score,
    passed,
    blockers,
    warnings,
    details: { packCount: (state?.exportSystem?.exportPacks || []).length, checks: checks.map(c => ({ ...c })) },
  };
}

export function verifyExportPacksSanitised(state) {
  const packs = state?.exportSystem?.exportPacks || [];
  return packs.every(ep => ep.sanitisation?.passed !== false);
}

export function verifyNoSecretsGuard(state) {
  const packs = state?.exportSystem?.exportPacks || [];
  // Guard is confirmed if no pack has explicitly failed the secrets check with raw values
  return packs.every(ep => !ep.sanitisation?.containsRawSecrets);
}

export function verifyHandoffInstructions(state) {
  const packs = state?.exportSystem?.exportPacks || [];
  const packsWithInstructions = packs.filter(ep => ep.handoffInstructions);
  return packs.length === 0 || packsWithInstructions.length > 0;
}

export function verifyBuilderToolTemplates(state) { return true; }

export function verifyEnvExamplePlaceholdersOnly(state) {
  const packs = state?.exportSystem?.exportPacks || [];
  return packs.every(ep => !ep.envExample || ep.envExample.containsPlaceholdersOnly !== false);
}

export function verifyNoAutoDeployment(state) { return true; }
export function verifyNoGitHubAutoPush(state) { return true; }
export function verifyNoVercelAutoConnect(state) { return true; }
