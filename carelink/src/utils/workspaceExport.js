// 4P3X Workspace Export Utilities — Run 6

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/g,
  /eyJ[a-zA-Z0-9._-]{50,}/g,
  /service_role_key\s*=\s*["'][^"']+["']/gi,
];

export function sanitizeWorkspaceForExport(workspace) {
  if (!workspace) return null;
  const sanitized = { ...workspace };

  // Scrub notes
  if (sanitized.notes) {
    sanitized.notes = sanitized.notes.map((n) => ({
      ...n,
      body: scrubSecrets(n.body || ''),
    }));
  }

  // Remove any accidental secret from description
  if (sanitized.description) sanitized.description = scrubSecrets(sanitized.description);

  return sanitized;
}

function scrubSecrets(text) {
  let t = text;
  for (const pattern of SECRET_PATTERNS) {
    t = t.replace(pattern, '[REDACTED]');
  }
  return t;
}

export function exportWorkspaceToJson(workspace, state) {
  const sanitized = sanitizeWorkspaceForExport(workspace);
  if (!sanitized) return null;

  // Include asset names for readability — IDs only for re-linking
  const bp   = workspace.linkedBlueprintId
    ? (state?.blueprints?.blueprints || []).find((b) => b.id === workspace.linkedBlueprintId)
    : null;
  const plan = workspace.linkedTransformationPlanId
    ? (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId)
    : null;
  const prompts = (workspace.linkedPromptIds || [])
    .map((id) => (state?.variantLauncher?.generatedPrompts || []).find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => ({ id: p.id, title: p.title, runNumber: p.runNumber }));

  const exportBundle = {
    exportedAt:   new Date().toISOString(),
    exportedFrom: '4P3X Reusable Base Structure™',
    workspace:    sanitized,
    assetSummary: {
      blueprintName:          bp?.name || null,
      transformationPlanName: plan?.name || plan?.title || null,
      linkedPromptSummaries:  prompts,
    },
  };

  return JSON.stringify(exportBundle, null, 2);
}

export function importWorkspaceFromJson(json) {
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;

    // Handle export bundle
    const ws = parsed.workspace || parsed;
    if (!ws || typeof ws !== 'object') return { valid: false, error: 'Invalid workspace JSON.' };

    // Required fields check
    const required = ['id', 'name', 'productType', 'status'];
    for (const field of required) {
      if (!ws[field]) return { valid: false, error: `Missing required field: "${field}".` };
    }

    // Secret check
    const text = JSON.stringify(ws);
    for (const pattern of SECRET_PATTERNS) {
      pattern.lastIndex = 0;
      if (pattern.test(text)) return { valid: false, error: 'Imported workspace contains a possible raw secret key — rejected.' };
    }

    // Lock enforcement
    const safeLocks = {
      ...(ws.locks || {}),
      allowAutoBuild:              false,
      allowBaseOverwrite:          false,
      allowCrossWorkspaceMutation: false,
      isolateFromOtherWorkspaces:  true,
      preserveBaseFoundation:      true,
      manualPromptExecutionOnly:   true,
    };

    const sanitized = sanitizeWorkspaceForExport({ ...ws, locks: safeLocks });
    return { valid: true, workspace: sanitized };
  } catch (e) {
    return { valid: false, error: `Failed to parse workspace JSON: ${e.message}` };
  }
}

export function exportWorkspaceSummary(workspace, state) {
  const bp   = workspace.linkedBlueprintId
    ? (state?.blueprints?.blueprints || []).find((b) => b.id === workspace.linkedBlueprintId)
    : null;
  const plan = workspace.linkedTransformationPlanId
    ? (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId)
    : null;

  return {
    id:              workspace.id,
    name:            workspace.name,
    productType:     workspace.productType,
    status:          workspace.status,
    readinessScore:  workspace.readiness?.score ?? 0,
    readinessLevel:  workspace.readiness?.level ?? 'not_ready',
    progressPercent: workspace.buildProgress?.progressPercent ?? 0,
    linkedBlueprint: bp?.name || null,
    linkedPlan:      plan?.name || plan?.title || null,
    promptCount:     (workspace.linkedPromptIds || []).length,
    openBlockers:    (workspace.blockers || []).filter((b) => b.status === 'open').length,
    noteCount:       (workspace.notes || []).length,
    createdAt:       workspace.audit?.createdAt || null,
  };
}

export function summarizeWorkspace(workspace, state) {
  return exportWorkspaceSummary(workspace, state);
}

export function groupWorkspaceBlockersBySeverity(workspace) {
  const blockers = workspace?.blockers || [];
  return {
    critical: blockers.filter((b) => b.severity === 'critical'),
    warning:  blockers.filter((b) => b.severity === 'warning'),
    info:     blockers.filter((b) => b.severity === 'info'),
  };
}

export function formatWorkspaceProgress(workspace) {
  const bp = workspace?.buildProgress;
  if (!bp) return 'No progress data.';
  return `${bp.completedRuns?.length || 0} of ${bp.totalRuns || 0} runs complete (${bp.progressPercent || 0}%)`;
}
