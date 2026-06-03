// 4P3X Workspace Locks — Run 6

import { WORKSPACE_LOCK_RULES } from '../../config/workspaceLockRules.js';

export function getWorkspaceLocks(workspace) {
  return workspace?.locks || {
    isolateFromOtherWorkspaces:    true,
    preserveBaseFoundation:        true,
    manualPromptExecutionOnly:     true,
    allowAutoBuild:                false,
    allowBaseOverwrite:            false,
    allowCrossWorkspaceMutation:   false,
  };
}

export function enforceWorkspaceLocks(workspace, _state) {
  const locks = getWorkspaceLocks(workspace);
  const violations = detectWorkspaceLockViolations(workspace, _state);
  return { locks, violations, enforced: violations.length === 0 };
}

export function detectWorkspaceLockViolations(workspace, _state) {
  const violations = [];
  const locks = workspace?.locks || {};

  if (locks.allowAutoBuild === true) {
    violations.push('Lock violation: allowAutoBuild must be false — auto-build is never permitted.');
  }
  if (locks.allowBaseOverwrite === true) {
    violations.push('Lock violation: allowBaseOverwrite must be false — base overwrite is never permitted.');
  }
  if (locks.allowCrossWorkspaceMutation === true) {
    violations.push('Lock violation: allowCrossWorkspaceMutation must be false — cross-workspace mutation is never permitted.');
  }
  if (!locks.preserveBaseFoundation) {
    violations.push('Lock violation: preserveBaseFoundation must be true.');
  }
  if (!locks.isolateFromOtherWorkspaces) {
    violations.push('Lock violation: isolateFromOtherWorkspaces must be true.');
  }
  if (!locks.manualPromptExecutionOnly) {
    violations.push('Lock violation: manualPromptExecutionOnly must be true.');
  }

  return violations;
}

export function canWorkspaceProceedToBuild(workspace, state) {
  const violations = detectWorkspaceLockViolations(workspace, state);
  if (violations.length > 0) return { ok: false, reasons: violations };

  const blockers = (workspace.blockers || []).filter((b) => b.severity === 'critical' && b.status === 'open');
  if (blockers.length > 0) {
    return { ok: false, reasons: blockers.map((b) => `Critical blocker: "${b.title}"`) };
  }

  if (!workspace.linkedBlueprintId) {
    return { ok: false, reasons: ['No blueprint linked.'] };
  }
  if (!workspace.linkedTransformationPlanId) {
    return { ok: false, reasons: ['No transformation plan linked.'] };
  }

  return { ok: true, reasons: [] };
}

export function explainWorkspaceBlockedLocks(workspace, _state) {
  const violations = detectWorkspaceLockViolations(workspace, _state);
  if (violations.length === 0) return 'All workspace locks are enforced correctly.';
  return violations.join('\n');
}
