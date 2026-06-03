// 4P3X Workspace Risk Scanner — Run 6

const DEMO_TERMS = [/\bdemo\b/i, /\bmock\b/i, /\bfake\b/i, /\bdummy\b/i, /\btoy\b/i, /sample.only/i];
const SECRET_PATTERNS = [/sk-[a-zA-Z0-9]{20,}/, /eyJ[a-zA-Z0-9._-]{50,}/, /service_role_key\s*=\s*["'][^"']+["']/i];

export function scanWorkspaceRisks(workspace, state) {
  return [
    ...detectMissingBlueprintRisk(workspace, state),
    ...detectMissingTransformationPlanRisk(workspace, state),
    ...detectMissingPromptRisk(workspace, state),
    ...detectPromptSafetyRisk(workspace, state),
    ...detectOpenCriticalBlockers(workspace),
    ...detectCrossWorkspaceRisk(workspace, state),
    ...detectBaseMutationRisk(workspace),
    ...detectSecretExposureRisk(workspace, state),
    ...detectDemoLanguageRisk(workspace),
  ];
}

export function detectMissingBlueprintRisk(workspace, state) {
  if (!workspace.linkedBlueprintId) {
    return [{ id: 'missing_blueprint', severity: 'warning', message: 'No blueprint linked to this workspace.' }];
  }
  const bp = (state?.blueprints?.blueprints || []).find((b) => b.id === workspace.linkedBlueprintId);
  if (!bp) {
    return [{ id: 'blueprint_not_found', severity: 'critical', message: `Linked blueprint "${workspace.linkedBlueprintId}" not found in state.` }];
  }
  return [];
}

export function detectMissingTransformationPlanRisk(workspace, state) {
  if (!workspace.linkedTransformationPlanId) {
    return [{ id: 'missing_plan', severity: 'warning', message: 'No transformation plan linked to this workspace.' }];
  }
  const plan = (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId);
  if (!plan) {
    return [{ id: 'plan_not_found', severity: 'critical', message: `Linked transformation plan "${workspace.linkedTransformationPlanId}" not found.` }];
  }
  if (!['ready_for_variant_run', 'ready_with_warnings'].includes(plan.status)) {
    return [{ id: 'plan_not_ready', severity: 'warning', message: `Linked transformation plan status is "${plan.status}" — not ready for build.` }];
  }
  return [];
}

export function detectMissingPromptRisk(workspace, state) {
  if ((workspace.linkedPromptIds || []).length === 0) {
    return [{ id: 'no_prompts_linked', severity: 'info', message: 'No generated run prompts linked to this workspace.' }];
  }
  const missing = (workspace.linkedPromptIds || []).filter(
    (id) => !(state?.variantLauncher?.generatedPrompts || []).some((p) => p.id === id)
  );
  if (missing.length > 0) {
    return [{ id: 'prompts_not_found', severity: 'warning', message: `${missing.length} linked prompt(s) not found in state.` }];
  }
  return [];
}

export function detectPromptSafetyRisk(workspace, state) {
  const prompts = (workspace.linkedPromptIds || [])
    .map((id) => (state?.variantLauncher?.generatedPrompts || []).find((p) => p.id === id))
    .filter(Boolean);
  const failed = prompts.filter((p) => !p.safety?.passed);
  if (failed.length > 0) {
    return [{ id: 'prompt_safety_failed', severity: 'critical', message: `${failed.length} linked prompt(s) failed safety scan.` }];
  }
  return [];
}

export function detectOpenCriticalBlockers(workspace) {
  const critical = (workspace.blockers || []).filter((b) => b.severity === 'critical' && b.status === 'open');
  return critical.map((b) => ({ id: `blocker_${b.id}`, severity: 'critical', message: `Critical blocker open: "${b.title}"` }));
}

export function detectCrossWorkspaceRisk(workspace, state) {
  const risks = [];
  const allWS = state?.variantWorkspaces?.workspaces || [];
  for (const other of allWS) {
    if (other.id === workspace.id) continue;
    for (const noteId of (workspace.notes || []).map((n) => n.id)) {
      if ((other.notes || []).some((n) => n.id === noteId)) {
        risks.push({ id: 'note_id_collision', severity: 'warning', message: `Note ID collision with workspace "${other.name}".` });
      }
    }
  }
  return risks;
}

export function detectBaseMutationRisk(workspace) {
  const risks = [];
  const text = [
    workspace.name,
    workspace.description,
    ...(workspace.notes || []).map((n) => n.body),
  ].join(' ').toLowerCase();

  const dangerTerms = ['overwrite storage.js', 'replace initialstate', 'delete run 1', 'delete run 2', 'delete run 3', 'delete run 4', 'delete run 5'];
  for (const term of dangerTerms) {
    if (text.includes(term)) {
      risks.push({ id: `base_mutation_${term.replace(/\s/g, '_')}`, severity: 'critical', message: `Workspace content references base mutation: "${term}"` });
    }
  }
  return risks;
}

export function detectSecretExposureRisk(workspace, _state) {
  const text = JSON.stringify(workspace);
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      return [{ id: 'secret_exposure', severity: 'critical', message: 'Workspace data contains a possible raw secret key or token.' }];
    }
  }
  return [];
}

export function detectDemoLanguageRisk(workspace) {
  const risks = [];
  const text = [workspace.name, workspace.description, ...(workspace.notes || []).map((n) => n.body)].join(' ');
  for (const pattern of DEMO_TERMS) {
    if (pattern.test(text)) {
      const match = text.match(pattern)?.[0];
      risks.push({ id: `demo_language_${match}`, severity: 'warning', message: `Workspace contains flagged term: "${match}"` });
    }
  }
  return risks;
}
