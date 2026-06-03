// 4P3X Workspace Validators — Run 6

const SECRET_PATTERNS = [/sk-[a-zA-Z0-9]{20,}/, /eyJ[a-zA-Z0-9._-]{50,}/, /service_role_key\s*=\s*/i];
const DEMO_TERMS = [/\bdemo\s+data\b/i, /\bmock\s+data\b/i, /\bfake\s+data\b/i, /\bdummy\s+data\b/i, /\btoy\s+app\b/i];
const VALID_STATUSES = ['planning', 'ready_for_build_prompt', 'in_progress', 'blocked', 'paused', 'completed', 'archived'];

export function validateWorkspace(workspace) {
  if (!workspace || typeof workspace !== 'object') return { valid: false, error: 'Workspace must be a non-null object.' };
  if (!workspace.id)          return { valid: false, error: 'Workspace missing id.' };
  if (!workspace.name?.trim()) return { valid: false, error: 'Workspace name is required.' };
  if (!workspace.productType) return { valid: false, error: 'Workspace productType is required.' };
  if (!VALID_STATUSES.includes(workspace.status)) return { valid: false, error: `Invalid workspace status: "${workspace.status}".` };
  if (!Array.isArray(workspace.linkedPromptIds))  return { valid: false, error: 'Workspace linkedPromptIds must be an array.' };
  if (!Array.isArray(workspace.notes))            return { valid: false, error: 'Workspace notes must be an array.' };
  if (!Array.isArray(workspace.blockers))         return { valid: false, error: 'Workspace blockers must be an array.' };
  if (!workspace.audit?.createdAt)                return { valid: false, error: 'Workspace missing audit.createdAt.' };
  return { valid: true };
}

export function validateWorkspaceLinks(workspace, state) {
  const issues = [];
  if (workspace.linkedBlueprintId) {
    const bp = (state?.blueprints?.blueprints || []).find((b) => b.id === workspace.linkedBlueprintId);
    if (!bp) issues.push('Linked blueprint not found.');
  }
  if (workspace.linkedTransformationPlanId) {
    const plan = (state?.transformationCompiler?.plans || []).find((p) => p.id === workspace.linkedTransformationPlanId);
    if (!plan) issues.push('Linked transformation plan not found.');
  }
  return { valid: issues.length === 0, issues };
}

export function validateWorkspaceReadiness(workspace, _state) {
  const r = workspace?.readiness;
  if (!r) return { valid: false, error: 'Workspace missing readiness object.' };
  if (typeof r.score !== 'number') return { valid: false, error: 'Readiness score must be a number.' };
  return { valid: true };
}

export function validateWorkspaceLocks(workspace, _state) {
  const locks = workspace?.locks;
  if (!locks) return { valid: false, error: 'Workspace missing locks object.' };
  if (locks.allowAutoBuild === true)            return { valid: false, error: 'Lock violation: allowAutoBuild must be false.' };
  if (locks.allowBaseOverwrite === true)        return { valid: false, error: 'Lock violation: allowBaseOverwrite must be false.' };
  if (locks.allowCrossWorkspaceMutation === true) return { valid: false, error: 'Lock violation: allowCrossWorkspaceMutation must be false.' };
  return { valid: true };
}

export function validateWorkspaceProgress(workspace) {
  const bp = workspace?.buildProgress;
  if (!bp) return { valid: false, error: 'Workspace missing buildProgress object.' };
  if (typeof bp.totalRuns !== 'number') return { valid: false, error: 'buildProgress.totalRuns must be a number.' };
  if (!Array.isArray(bp.completedRuns)) return { valid: false, error: 'buildProgress.completedRuns must be an array.' };
  return { valid: true };
}

export function validateWorkspaceNote(note) {
  if (!note || typeof note !== 'object') return { valid: false, error: 'Note must be a non-null object.' };
  if (!note.title?.trim()) return { valid: false, error: 'Note title is required.' };
  const validCategories = ['architecture', 'build', 'risk', 'validation', 'deployment', 'general'];
  if (!validCategories.includes(note.category)) return { valid: false, error: `Invalid note category: "${note.category}".` };
  return { valid: true };
}

export function validateWorkspaceBlocker(blocker) {
  if (!blocker || typeof blocker !== 'object') return { valid: false, error: 'Blocker must be a non-null object.' };
  if (!blocker.title?.trim()) return { valid: false, error: 'Blocker title is required.' };
  const validSeverities = ['info', 'warning', 'critical'];
  if (!validSeverities.includes(blocker.severity)) return { valid: false, error: `Invalid blocker severity: "${blocker.severity}".` };
  return { valid: true };
}

export function validateWorkspaceImport(workspace) {
  const basic = validateWorkspace(workspace);
  if (!basic.valid) return basic;

  // Secret check
  const text = JSON.stringify(workspace);
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) return { valid: false, error: 'Imported workspace contains a possible raw secret key — rejected.' };
  }

  // Lock check
  return validateWorkspaceLocks(workspace);
}

export function validateWorkspaceExport(workspace) {
  const basic = validateWorkspace(workspace);
  if (!basic.valid) return basic;

  const text = JSON.stringify(workspace);
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) return { valid: false, error: 'Workspace export contains a possible raw secret key.' };
  }
  return { valid: true };
}
