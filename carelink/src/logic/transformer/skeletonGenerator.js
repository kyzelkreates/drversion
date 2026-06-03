// 4P3X Skeleton Generator — RUN 4
// Generates plan objects only. Does NOT create files. Does NOT execute code.

import { planFoldersForProductType, planFilesForProductType } from './fileStructurePlanner.js';
import { planModuleActivation } from './moduleActivationPlanner.js';
import { planDataModels } from './dataModelPlanner.js';
import { planPages, planComponents, planLayouts, planRequiredUiStates, detectMissingUxStates } from './uiComponentPlanner.js';
import { planStateTransitions } from './stateTransitionPlanner.js';
import { planApiIntegrations } from './apiIntegrationPlanner.js';
import { planAgentCapabilities } from './agentCapabilityPlanner.js';
import { planSafetyCompliance } from './safetyCompliancePlanner.js';
import { generateFutureRunSequence } from './futureRunPlanner.js';

export function generateProductSkeleton(context) {
  if (!context || !context.blueprint) {
    return { ok: false, error: 'No blueprint in context — cannot generate skeleton.' };
  }
  const { blueprint, state, agentRegistry } = context;
  return {
    ok: true,
    fileStructurePlan:    generateFolderSkeleton(context),
    moduleActivationPlan: generateModuleSkeleton(context),
    dataModelPlan:        { entities: generateStateSkeleton(context) },
    uiComponentPlan:      generatePageSkeleton(context),
    stateTransitionPlan:  { transitions: generateValidationSkeleton(context) },
    apiIntegrationPlan:   planApiIntegrations(blueprint, state?.aiSettings),
    agentCapabilityPlan:  planAgentCapabilities(blueprint, agentRegistry || []),
    safetyCompliancePlan: planSafetyCompliance(blueprint),
    futureRunSequence:    generateFutureRunSkeleton(context),
  };
}

export function generateFolderSkeleton(context) {
  const type = context?.blueprint?.productType || 'foundation';
  const folders = planFoldersForProductType(type, context);
  const files   = planFilesForProductType(type, context);
  return { folders, files };
}

export function generateFileSkeleton(context) {
  const type = context?.blueprint?.productType || 'foundation';
  return planFilesForProductType(type, context);
}

export function generateModuleSkeleton(context) {
  const { blueprint, state } = context || {};
  const depMap = state?.transformation?.dependencyMap || {};
  const modReg = state?.modules?.registry || [];
  return planModuleActivation(blueprint, depMap, modReg);
}

export function generatePageSkeleton(context) {
  const bp = context?.blueprint;
  const pages      = planPages(bp);
  const components = planComponents(bp);
  const layouts    = planLayouts(bp);
  const requiredStates = planRequiredUiStates(bp);
  const missingStates  = detectMissingUxStates(bp);
  return { pages, components, layouts, requiredStates, missingUxStates: missingStates, runToBuild: 'Run 5' };
}

export function generateComponentSkeleton(context) {
  return planComponents(context?.blueprint);
}

export function generateStateSkeleton(context) {
  return planDataModels(context?.blueprint, context?.state?.transformation?.dependencyMap);
}

export function generateValidationSkeleton(context) {
  return planStateTransitions(context?.blueprint);
}

export function generateFutureRunSkeleton(context) {
  return generateFutureRunSequence(context?.blueprint, null);
}
