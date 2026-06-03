// 4P3X Prompt Template Factory — Run 5
// Assembles full prompt text from context and section templates.

import PROMPT_SECTIONS, { DIRECTIVE_1_FOOTER } from '../../config/runPromptTemplates.js';
import PRODUCT_RUN_SEQUENCES from '../../config/productRunSequences.js';
import appConfig from '../../config/appConfig.js';

export function getTemplateForProductType(productType) {
  return PRODUCT_RUN_SEQUENCES[productType] || null;
}

export function getTemplateForRun(productType, runNumber) {
  const seq = getTemplateForProductType(productType);
  if (!seq) return null;
  return seq.runs.find((r) => r.runNumber === runNumber) || null;
}

export function buildPromptSections(context) {
  const sections = [];

  sections.push(PROMPT_SECTIONS.enforcementHeader(context));
  sections.push(PROMPT_SECTIONS.projectIdentitySection(context));
  sections.push(PROMPT_SECTIONS.currentStatusSection(context));
  sections.push(PROMPT_SECTIONS.missionSection(context));
  sections.push(PROMPT_SECTIONS.scopeSection(context));
  sections.push(PROMPT_SECTIONS.allowedFilesSection(context));
  sections.push(PROMPT_SECTIONS.forbiddenFilesSection(context));
  sections.push(PROMPT_SECTIONS.ssotRulesSection());
  sections.push(PROMPT_SECTIONS.implementationRequirementsSection(context));
  sections.push(PROMPT_SECTIONS.uiUxRequirementsSection(context));
  sections.push(PROMPT_SECTIONS.stateLogicSection(context));
  sections.push(PROMPT_SECTIONS.validationGatesSection(context));
  sections.push(PROMPT_SECTIONS.acceptanceCriteriaSection(context));
  sections.push(PROMPT_SECTIONS.stopConditionsSection(context));
  sections.push(PROMPT_SECTIONS.rollbackGuidanceSection(context));
  sections.push(PROMPT_SECTIONS.finalChecklistSection(context));
  sections.push(PROMPT_SECTIONS.directive1Footer());

  return sections;
}

export function injectProjectIdentity(context) {
  return {
    ...context,
    projectName: appConfig.name || '4P3X Reusable Base Structure™',
    projectPoweredBy: '4P3X Intelligent AI',
    projectCreatedBy: 'Kyzel Kreates',
    projectPartOf: '4P3X Verse',
  };
}

export function injectRunScope(context, runScope) {
  return {
    ...context,
    allowedFiles: runScope.allowedFiles || [],
    forbiddenFiles: runScope.forbiddenFiles || [],
    requiredModules: runScope.allowedModules || [],
  };
}

export function injectSafetyRules(context) {
  return {
    ...context,
    implementationRequirements: [
      ...(context.implementationRequirements || []),
      'The app must not require a backend',
      'The app must not require Supabase (unless this is a Supabase product run)',
      'The app must not require paid APIs',
      'The app must not hardcode API keys',
      'The app must not expose backend secrets',
      'The app must not call external AI APIs automatically',
      'The launcher must not execute generated prompts',
      'The launcher must not write variant files into the live app',
    ],
  };
}

export function injectDirective1Footer(_context) {
  return DIRECTIVE_1_FOOTER;
}

export function assembleFullPromptText(sections) {
  return sections.filter(Boolean).join('\n\n');
}
