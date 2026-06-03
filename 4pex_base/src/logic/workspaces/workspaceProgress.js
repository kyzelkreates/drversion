// 4P3X Workspace Progress — Run 6
// Manual-only progress tracking. Never executes runs.

export function calculateProgressPercent(workspace) {
  const bp = workspace.buildProgress;
  if (!bp || !bp.totalRuns || bp.totalRuns === 0) return 0;
  const completed = (bp.completedRuns || []).length;
  return Math.round((completed / bp.totalRuns) * 100);
}

export function determineNextRun(workspace, runSequence) {
  const bp          = workspace.buildProgress;
  const completedSet = new Set(bp?.completedRuns || []);
  const allRuns     = runSequence?.runs?.map((r) => r.runNumber) || [];
  return allRuns.find((r) => !completedSet.has(r)) || null;
}

export function markRunComplete(workspaceId, runNumber, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };

  const valid = validateRunStatusTransition(ws.buildProgress?.activeRun === runNumber ? 'in_progress' : 'planned', 'complete');
  if (!valid.ok) return { error: valid.error };

  const completed = [...new Set([...(ws.buildProgress?.completedRuns || []), runNumber])];
  const blocked   = (ws.buildProgress?.blockedRuns || []).filter((r) => r !== runNumber);
  const total     = ws.buildProgress?.totalRuns || 3;
  const pct       = Math.round((completed.length / total) * 100);
  const nextRun   = null; // will be recalculated externally

  const updatedProgress = {
    ...ws.buildProgress,
    completedRuns:   completed,
    blockedRuns:     blocked,
    activeRun:       ws.buildProgress?.activeRun === runNumber ? null : ws.buildProgress?.activeRun,
    progressPercent: pct,
    currentRun:      runNumber,
  };

  return { workspace: { ...ws, buildProgress: updatedProgress }, error: null };
}

export function markRunBlocked(workspaceId, runNumber, reason, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };

  const blocked = [...new Set([...(ws.buildProgress?.blockedRuns || []), runNumber])];
  const updatedProgress = { ...ws.buildProgress, blockedRuns: blocked };

  return { workspace: { ...ws, buildProgress: updatedProgress, status: 'blocked' }, error: null };
}

export function markRunInProgress(workspaceId, runNumber, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };

  const updatedProgress = { ...ws.buildProgress, activeRun: runNumber, currentRun: runNumber };
  return { workspace: { ...ws, buildProgress: updatedProgress, status: 'in_progress' }, error: null };
}

export function resetWorkspaceProgress(workspaceId, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };

  const reset = {
    currentRun:      null,
    totalRuns:       ws.buildProgress?.totalRuns || 3,
    completedRuns:   [],
    activeRun:       null,
    blockedRuns:     [],
    nextRun:         null,
    progressPercent: 0,
  };

  return { workspace: { ...ws, buildProgress: reset, status: 'planning' }, error: null };
}

export function validateRunStatusTransition(currentStatus, nextStatus) {
  const allowed = {
    planned:     ['in_progress'],
    in_progress: ['complete', 'blocked', 'planned'],
    complete:    ['planned'],
    blocked:     ['in_progress', 'planned'],
  };

  const validNext = allowed[currentStatus] || [];
  if (!validNext.includes(nextStatus)) {
    return { ok: false, error: `Cannot transition run from "${currentStatus}" to "${nextStatus}".` };
  }
  return { ok: true };
}
