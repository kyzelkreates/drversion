// 4P3X Workspace Manager — Run 6
// All workspace create/update/delete operations. Never writes to localStorage directly.

import { WORKSPACE_TEMPLATES } from '../../config/workspaceTemplates.js';
import { WORKSPACE_LOCK_RULES } from '../../config/workspaceLockRules.js';

function nowIso() { return new Date().toISOString(); }
function uid()    { return 'ws_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now(); }
function noteId() { return 'note_' + Math.random().toString(36).slice(2, 9); }
function blkId()  { return 'blk_'  + Math.random().toString(36).slice(2, 9); }

function buildDefaultLocks() {
  return {
    isolateFromOtherWorkspaces:    true,
    preserveBaseFoundation:        true,
    manualPromptExecutionOnly:     true,
    allowAutoBuild:                false,
    allowBaseOverwrite:            false,
    allowCrossWorkspaceMutation:   false,
  };
}

function buildDefaultReadiness() {
  return {
    score: 0,
    level: 'not_ready',
    blockers: ['No blueprint linked', 'No transformation plan linked'],
    warnings: [],
    nextAction: 'Link a blueprint and transformation plan to this workspace.',
  };
}

function buildDefaultBuildProgress(totalRuns) {
  return {
    currentRun:      null,
    totalRuns:       totalRuns || 3,
    completedRuns:   [],
    activeRun:       null,
    blockedRuns:     [],
    nextRun:         null,
    progressPercent: 0,
  };
}

export function createWorkspace(input, _state) {
  if (!input?.name || !input.name.trim()) {
    return { error: 'Workspace name is required.' };
  }
  if (!input?.productType) {
    return { error: 'Product type is required.' };
  }

  const workspace = {
    id:                       uid(),
    name:                     input.name.trim(),
    productType:              input.productType,
    status:                   input.status || 'planning',
    description:              input.description || '',
    linkedBlueprintId:        input.linkedBlueprintId || null,
    linkedTransformationPlanId: input.linkedTransformationPlanId || null,
    linkedPromptIds:          input.linkedPromptIds || [],
    linkedRecommendationIds:  input.linkedRecommendationIds || [],
    buildProgress:            buildDefaultBuildProgress(input.expectedRunCount),
    readiness:                buildDefaultReadiness(),
    locks:                    buildDefaultLocks(),
    assets: {
      blueprintName:           '',
      transformationPlanName:  '',
      generatedPromptTitles:   [],
      exportPackIds:           [],
    },
    notes:    [],
    blockers: [],
    audit: {
      createdAt:  nowIso(),
      updatedAt:  nowIso(),
      archivedAt: null,
    },
  };

  return { workspace, error: null };
}

export function createWorkspaceFromTemplate(templateId, state) {
  const tpl = WORKSPACE_TEMPLATES[templateId];
  if (!tpl) return { error: `Workspace template "${templateId}" not found.` };

  const input = {
    name:            tpl.label + ' Workspace',
    productType:     tpl.productType,
    description:     tpl.description,
    status:          tpl.defaultStatus || 'planning',
    expectedRunCount: tpl.expectedRunCount || 3,
  };

  const result = createWorkspace(input, state);
  if (result.error) return result;

  const ws = result.workspace;

  // Apply template notes
  if (tpl.defaultNotes?.length) {
    ws.notes = tpl.defaultNotes.map((n) => ({
      id:        noteId(),
      title:     n.title,
      body:      n.body,
      category:  n.category || 'general',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }));
  }

  // Apply safety warnings as info blockers
  if (tpl.safetyWarnings?.length) {
    ws.blockers = tpl.safetyWarnings.map((w) => ({
      id:          blkId(),
      title:       'Safety Notice',
      description: w,
      severity:    'info',
      status:      'open',
      createdAt:   nowIso(),
      updatedAt:   nowIso(),
    }));
  }

  return { workspace: ws, error: null };
}

export function updateWorkspace(workspaceId, updates, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };

  // Never allow overwriting locks with unsafe values
  const safeLocks = updates.locks
    ? {
        ...ws.locks,
        ...updates.locks,
        allowAutoBuild:              false,  // always false
        allowBaseOverwrite:          false,  // always false
        allowCrossWorkspaceMutation: false,  // always false
      }
    : ws.locks;

  const updated = {
    ...ws,
    ...updates,
    id:     ws.id,
    locks:  safeLocks,
    audit:  { ...ws.audit, updatedAt: nowIso() },
  };

  return { workspace: updated, error: null };
}

export function deleteWorkspace(workspaceId, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  return { workspaceId, error: null };
}

export function archiveWorkspace(workspaceId, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  return {
    workspace: { ...ws, status: 'archived', audit: { ...ws.audit, updatedAt: nowIso(), archivedAt: nowIso() } },
    error: null,
  };
}

export function duplicateWorkspace(workspaceId, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  return {
    workspace: {
      ...ws,
      id:    uid(),
      name:  ws.name + ' (Copy)',
      status: 'planning',
      audit:  { createdAt: nowIso(), updatedAt: nowIso(), archivedAt: null },
    },
    error: null,
  };
}

export function setActiveWorkspace(workspaceId, state) {
  const exists = (state?.variantWorkspaces?.workspaces || []).some((w) => w.id === workspaceId);
  if (!exists) return { error: 'Workspace not found.' };
  return { workspaceId, error: null };
}

export function linkBlueprintToWorkspace(workspaceId, blueprintId, state) {
  return updateWorkspace(workspaceId, { linkedBlueprintId: blueprintId }, state);
}

export function linkTransformationPlanToWorkspace(workspaceId, planId, state) {
  return updateWorkspace(workspaceId, { linkedTransformationPlanId: planId }, state);
}

export function linkPromptToWorkspace(workspaceId, promptId, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  const existing = ws.linkedPromptIds || [];
  if (existing.includes(promptId)) return { workspace: ws, error: null };
  return updateWorkspace(workspaceId, { linkedPromptIds: [...existing, promptId] }, state);
}

export function unlinkPromptFromWorkspace(workspaceId, promptId, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  return updateWorkspace(workspaceId, { linkedPromptIds: (ws.linkedPromptIds || []).filter((id) => id !== promptId) }, state);
}

export function addWorkspaceNote(workspaceId, note, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  if (!note?.title?.trim()) return { error: 'Note title is required.' };
  const newNote = {
    id:        noteId(),
    title:     note.title.trim(),
    body:      note.body || '',
    category:  note.category || 'general',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  return { workspace: { ...ws, notes: [...(ws.notes || []), newNote], audit: { ...ws.audit, updatedAt: nowIso() } }, error: null };
}

export function updateWorkspaceNote(workspaceId, noteId, updates, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  const notes = (ws.notes || []).map((n) =>
    n.id === noteId ? { ...n, ...updates, id: n.id, updatedAt: nowIso() } : n
  );
  return { workspace: { ...ws, notes, audit: { ...ws.audit, updatedAt: nowIso() } }, error: null };
}

export function deleteWorkspaceNote(workspaceId, noteId, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  return { workspace: { ...ws, notes: (ws.notes || []).filter((n) => n.id !== noteId), audit: { ...ws.audit, updatedAt: nowIso() } }, error: null };
}

export function addWorkspaceBlocker(workspaceId, blocker, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  if (!blocker?.title?.trim()) return { error: 'Blocker title is required.' };
  const newBlocker = {
    id:          blkId(),
    title:       blocker.title.trim(),
    description: blocker.description || '',
    severity:    blocker.severity || 'warning',
    status:      'open',
    createdAt:   nowIso(),
    updatedAt:   nowIso(),
  };
  return { workspace: { ...ws, blockers: [...(ws.blockers || []), newBlocker], audit: { ...ws.audit, updatedAt: nowIso() } }, error: null };
}

export function resolveWorkspaceBlocker(workspaceId, blockerId, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  const blockers = (ws.blockers || []).map((b) =>
    b.id === blockerId ? { ...b, status: 'resolved', updatedAt: nowIso() } : b
  );
  return { workspace: { ...ws, blockers, audit: { ...ws.audit, updatedAt: nowIso() } }, error: null };
}

export function updateWorkspaceBuildProgress(workspaceId, progress, state) {
  const ws = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === workspaceId);
  if (!ws) return { error: 'Workspace not found.' };
  const updated = { ...ws, buildProgress: { ...ws.buildProgress, ...progress }, audit: { ...ws.audit, updatedAt: nowIso() } };
  return { workspace: updated, error: null };
}
