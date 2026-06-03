// 4P3X Handoff Builder — Run 7

import { getBuilderToolTemplate } from '../../config/builderToolTemplates.js';
import appConfig from '../../config/appConfig.js';

const PROJECT_IDENTITY = {
  appName:    '4P3X Reusable Base Structure™',
  poweredBy:  '4P3X Intelligent AI',
  createdBy:  'Kyzel Kreates',
  ecosystem:  '4P3X Verse',
  tagline:    'Reusable, safe, non-destructive product transformation base.',
};

export function buildHandoffInstructions(exportPack, state) {
  const tool = exportPack?.builderTool || 'generic';
  return buildBuilderToolInstructions(tool, exportPack, state);
}

export function buildBuilderToolInstructions(builderTool, exportPack, state) {
  const tpl = getBuilderToolTemplate(builderTool);
  const assets = resolveAssets(exportPack, state);
  const identity = exportPack?.identity || PROJECT_IDENTITY;

  return {
    summary: `Handoff instructions for ${tpl.label}: ${tpl.purpose}.`,
    builderTool,
    projectIdentity: identity,
    currentStatus:   buildCurrentStatus(exportPack, state),
    linkedAssets:    assets,
    mission:         buildMission(exportPack, assets),
    steps:           tpl.handoffSteps,
    allowedActions:  tpl.allowedActions,
    forbiddenActions:tpl.forbiddenActions,
    validationSteps: tpl.validationSteps,
    stopConditions:  tpl.stopConditions,
    rollbackGuidance:tpl.rollbackGuidance,
    secretSafetyRules: tpl.secretSafetyRules,
    directive1: 'Directive 1: Adapt the skill set to the task. Preserve SSOT, prevent feature creep, and protect working systems.',
    generatedAt: new Date().toISOString(),
  };
}

export function buildBase44Handoff(exportPack, state)   { return buildBuilderToolInstructions('base44',  exportPack, state); }
export function buildManusHandoff(exportPack, state)    { return buildBuilderToolInstructions('manus',   exportPack, state); }
export function buildReplitHandoff(exportPack, state)   { return buildBuilderToolInstructions('replit',  exportPack, state); }
export function buildCursorHandoff(exportPack, state)   { return buildBuilderToolInstructions('cursor',  exportPack, state); }
export function buildGitHubHandoff(exportPack, state)   { return buildBuilderToolInstructions('github',  exportPack, state); }
export function buildVercelHandoff(exportPack, state)   { return buildBuilderToolInstructions('vercel',  exportPack, state); }
export function buildGenericHandoff(exportPack, state)  { return buildBuilderToolInstructions('generic', exportPack, state); }

function buildCurrentStatus(exportPack, state) {
  const plans     = state?.transformationCompiler?.plans || [];
  const workspaces = state?.variantWorkspaces?.workspaces || [];
  const activePlan = plans.find((p) => p.id === exportPack?.linkedTransformationPlanId) || null;
  const activeWS   = workspaces.find((w) => w.id === exportPack?.linkedWorkspaceId) || null;

  return {
    transformationPlanStatus: activePlan?.status || 'not_linked',
    workspaceStatus:          activeWS?.status   || 'not_linked',
    generatedPromptCount:     (state?.variantLauncher?.generatedPrompts || []).filter(
      (p) => (exportPack?.linkedPromptIds || []).includes(p.id)
    ).length,
    deploymentReadiness: state?.exportSystem?.deploymentReadiness?.overallStatus || 'not_checked',
  };
}

function buildMission(exportPack, assets) {
  if (exportPack?.type === 'base_handoff') {
    return 'Hand off the 4P3X Reusable Base Structure™ to the target builder tool or deployment environment. Preserve all existing Run 1–7 systems. Do not build final product variants yet.';
  }
  if (exportPack?.type === 'variant_handoff') {
    return `Hand off the "${assets.workspaceName || 'selected variant'}" workspace to the target builder tool. Begin building the linked product variant using the generated run prompts in manual copy-paste mode only.`;
  }
  if (exportPack?.type === 'deployment_preparation') {
    return 'Prepare the app for deployment. Complete the GitHub, Vercel, PWA, and environment readiness checklists. Do not deploy automatically.';
  }
  return 'Hand off the export pack to the target environment safely.';
}

function resolveAssets(exportPack, state) {
  if (!exportPack) return {};
  const bp   = (state?.blueprints?.blueprints || []).find((b) => b.id === exportPack.linkedBlueprintId);
  const plan = (state?.transformationCompiler?.plans || []).find((p) => p.id === exportPack.linkedTransformationPlanId);
  const ws   = (state?.variantWorkspaces?.workspaces || []).find((w) => w.id === exportPack.linkedWorkspaceId);
  const prompts = (exportPack.linkedPromptIds || [])
    .map((id) => (state?.variantLauncher?.generatedPrompts || []).find((p) => p.id === id))
    .filter(Boolean);

  return {
    blueprintName:   bp?.name || null,
    planName:        plan?.name || plan?.title || null,
    workspaceName:   ws?.name || null,
    promptTitles:    prompts.map((p) => p.title),
  };
}
