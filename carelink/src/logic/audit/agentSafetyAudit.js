// 4P3X Agent Safety Audit — Run 8

export function auditAgentSafety(state) {
  const checks = [
    { key: 'agents_advisory_only',             ok: verifyAgentsAdvisoryOnly(state) },
    { key: 'no_autonomy',                       ok: verifyNoAutonomy(state) },
    { key: 'no_file_editing',                  ok: verifyNoFileEditing(state) },
    { key: 'no_external_api_auto_calls',       ok: verifyNoExternalApiAutoCalls(state) },
    { key: 'no_destructive_actions',           ok: verifyNoDestructiveActions(state) },
    { key: 'recommendations_do_not_mutate',    ok: verifyRecommendationsDoNotMutateSourceRecords(state) },
  ];

  const blockingKeys = ['no_autonomy', 'no_external_api_auto_calls', 'no_destructive_actions'];
  const blockers = checks.filter(c => !c.ok && blockingKeys.includes(c.key)).map(c => `Agent safety violation: ${c.key}`);
  const warnings = checks.filter(c => !c.ok && !blockingKeys.includes(c.key)).map(c => `Agent safety advisory: ${c.key}`);
  const passed   = checks.filter(c => c.ok).map(c => c.key);

  const score = blockers.length === 0 ? (warnings.length === 0 ? 100 : 88) : 20;

  return {
    id: 'agentSafety',
    label: 'Agent Safety',
    score,
    passed,
    blockers,
    warnings,
    details: { checks: checks.map(c => ({ ...c })) },
  };
}

export function verifyAgentsAdvisoryOnly(state) {
  const perms = state?.agentSystem?.permissions || {};
  return perms.canDeployDirectly !== true && perms.canExecuteCode !== true;
}

export function verifyNoAutonomy(state) {
  const agents = state?.agentSystem?.agents || [];
  return agents.every(a => !a.autonomous);
}

export function verifyNoFileEditing(state) {
  const perms = state?.agentSystem?.permissions || {};
  return perms.canEditFiles !== true;
}

export function verifyNoExternalApiAutoCalls(state) {
  const perms = state?.agentSystem?.permissions || {};
  return perms.canCallExternalApis !== true;
}

export function verifyNoDestructiveActions(state) {
  const perms = state?.agentSystem?.permissions || {};
  return perms.canDestroyData !== true && perms.canDeleteRecords !== true;
}

export function verifyAgentOutputSanitisation(state) { return true; }

export function verifyRecommendationsDoNotMutateSourceRecords(state) {
  const recs = state?.agentSystem?.recommendationQueue || [];
  return recs.every(r => r.status !== 'auto_applied');
}
