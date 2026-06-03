// 4P3X Export Pack Manager — Run 7

import { EXPORT_PACK_TEMPLATES } from '../../config/exportPackTemplates.js';
import { buildHandoffInstructions } from './handoffBuilder.js';
import { generateEnvExample } from './envExampleBuilder.js';
import { calculateDeploymentReadiness } from './deploymentReadiness.js';
import { scanExportForSecrets } from './noSecretsExportGuard.js';
import { getDashboardPwaPattern } from '../../config/dashboardPwaStructureRules.js';

function nowIso() { return new Date().toISOString(); }
function uid()    { return 'ep_' + Math.random().toString(36).slice(2,9) + '_' + Date.now(); }

const PROJECT_IDENTITY = {
  appName:   '4P3X Reusable Base Structure™',
  poweredBy: '4P3X Intelligent AI',
  createdBy: 'Kyzel Kreates',
  ecosystem: '4P3X Verse',
  tagline:   'Reusable, safe, non-destructive product transformation base.',
};

function buildDefaultLocks() {
  return {
    preventSecretExport:          true,
    preventBackendSecretExposure: true,
    preventAutoDeployment:        true,
    preventAutoGitPush:           true,
    preventAutoVercelConnect:     true,
    preventGeneratedFileWrites:   true,
    preventPromptExecution:       true,
    preventDemoLanguage:          true,
    requireManualHandoff:         true,
    requireExportSanitisation:    true,
  };
}

export function createExportPack(input, _state) {
  if (!input?.name?.trim()) return { error: 'Export pack name is required.' };
  if (!input?.type)         return { error: 'Export pack type is required.' };

  const ep = {
    id:                    uid(),
    name:                  input.name.trim(),
    type:                  input.type,
    status:                'draft',
    builderTool:           input.builderTool || 'generic',
    linkedWorkspaceId:     input.linkedWorkspaceId     || null,
    linkedBlueprintId:     input.linkedBlueprintId     || null,
    linkedTransformationPlanId: input.linkedTransformationPlanId || null,
    linkedPromptIds:       input.linkedPromptIds        || [],
    linkedVariantBuildId:  input.linkedVariantBuildId   || null,
    linkedRecommendationIds: input.linkedRecommendationIds || [],
    identity:              { ...PROJECT_IDENTITY },
    dashboardPwaStructure: { dashboardRequired: false, connectedPwaRequired: false, dashboardRole: '', pwaRole: '', monitoringRelationship: '', stateSeparationRequired: true, optionalSupabaseSyncLater: true },
    handoffInstructions:   null,
    deploymentReadiness:   { pwaChecklist: [], githubChecklist: [], vercelChecklist: [], envChecklist: [], blockers: [], warnings: [] },
    envExample:            { content: '', containsPlaceholdersOnly: true, backendSecretsBlocked: true },
    sanitisation:          { secretsRemoved: false, rawKeysDetected: false, unsafeTermsDetected: false, passed: false, findings: [] },
    readiness:             { score: 0, level: 'not_ready', blockers: ['Handoff instructions not generated', 'No-secrets guard not run'], warnings: [], nextAction: 'Generate handoff instructions.' },
    audit:                 { createdAt: nowIso(), updatedAt: nowIso(), exportedAt: null },
  };

  return { exportPack: ep, error: null };
}

export function createExportPackFromTemplate(templateId, state) {
  const tpl = EXPORT_PACK_TEMPLATES[templateId];
  if (!tpl) return { error: `Export pack template "${templateId}" not found.` };

  return createExportPack({
    name:        tpl.label,
    type:        tpl.type,
    builderTool: 'generic',
  }, state);
}

export function updateExportPack(exportPackId, updates, state) {
  const ep = (state?.exportSystem?.exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { error: 'Export pack not found.' };
  const updated = { ...ep, ...updates, id: ep.id, audit: { ...ep.audit, updatedAt: nowIso() } };
  return { exportPack: updated, error: null };
}

export function deleteExportPack(exportPackId, state) {
  const ep = (state?.exportSystem?.exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { error: 'Export pack not found.' };
  return { exportPackId, error: null };
}

export function duplicateExportPack(exportPackId, state) {
  const ep = (state?.exportSystem?.exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { error: 'Export pack not found.' };
  return { exportPack: { ...ep, id: uid(), name: ep.name + ' (Copy)', status: 'draft', audit: { createdAt: nowIso(), updatedAt: nowIso(), exportedAt: null } }, error: null };
}

export function setActiveExportPack(exportPackId, _state) {
  return { exportPackId, error: null };
}

export function linkWorkspaceToExportPack(exportPackId, workspaceId, state) {
  return updateExportPack(exportPackId, { linkedWorkspaceId: workspaceId }, state);
}

export function linkBlueprintToExportPack(exportPackId, blueprintId, state) {
  return updateExportPack(exportPackId, { linkedBlueprintId: blueprintId }, state);
}

export function linkTransformationPlanToExportPack(exportPackId, planId, state) {
  return updateExportPack(exportPackId, { linkedTransformationPlanId: planId }, state);
}

export function linkPromptToExportPack(exportPackId, promptId, state) {
  const ep = (state?.exportSystem?.exportPacks || []).find((e) => e.id === exportPackId);
  if (!ep) return { error: 'Export pack not found.' };
  const ids = [...new Set([...(ep.linkedPromptIds || []), promptId])];
  return updateExportPack(exportPackId, { linkedPromptIds: ids }, state);
}

export function linkVariantBuildToExportPack(exportPackId, variantBuildId, state) {
  return updateExportPack(exportPackId, { linkedVariantBuildId: variantBuildId }, state);
}

export function validateExportPackLinks(exportPack, state) {
  const issues = [];
  if (exportPack.linkedBlueprintId && !(state?.blueprints?.blueprints || []).some((b) => b.id === exportPack.linkedBlueprintId)) {
    issues.push('Linked blueprint not found.');
  }
  if (exportPack.linkedTransformationPlanId && !(state?.transformationCompiler?.plans || []).some((p) => p.id === exportPack.linkedTransformationPlanId)) {
    issues.push('Linked transformation plan not found.');
  }
  for (const id of exportPack.linkedPromptIds || []) {
    if (!(state?.variantLauncher?.generatedPrompts || []).some((p) => p.id === id)) {
      issues.push(`Linked prompt "${id}" not found.`);
    }
  }
  return issues;
}
