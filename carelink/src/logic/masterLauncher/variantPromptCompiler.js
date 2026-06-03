// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// variantPromptCompiler.js — Run 10
// Compiles a full master variant transformation prompt.
// Prompts are copy-paste-ready. They never execute automatically.

import { buildFullPromptTemplate, BRANDING_LINE } from '../../config/masterVariantPromptTemplates.js';
import { getVariantById }  from '../../config/finalVariantOptions.js';
import { getPatternById }  from '../../config/dashboardPwaPatterns.js';

// =====================================================
// COMPILE MASTER VARIANT PROMPT
// =====================================================
export function compileMasterVariantPrompt(variantType, state) {
  const variantOption = getVariantById(variantType);
  if (!variantOption) {
    return { success: false, error: `Unknown variant type: ${variantType}` };
  }

  const patternId = state?.masterLauncher?.selectedDashboardPwaPattern;
  const pattern   = getPatternById(patternId) || getPatternById('generic');

  const context = {
    variantOption,
    pattern,
    runNumber: variantOption.suggestedFirstVariantRun?.split(' — ')[0] || 'Run 1',
    prevRun: 'previous',
    missionStatement: _buildMissionStatement(variantOption),
    variantSpecificAcceptance: _buildAcceptanceCriteria(variantOption),
    variantSpecificWarnings: [],
  };

  const promptText = buildFullPromptTemplate(context);
  const promptId   = `mp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    success: true,
    promptId,
    variantType,
    patternId: pattern?.id || 'generic',
    generatedAt: new Date().toISOString(),
    branding: BRANDING_LINE,
    promptText,
    characterCount: promptText.length,
    wordCount: promptText.split(/\s+/).length,
  };
}

// =====================================================
// SECTION COMPILERS (individual sections for preview)
// =====================================================
export function compilePromptIdentitySection(context) {
  const { variantOption } = context;
  if (!variantOption) return '';
  return [
    `Project: ${variantOption.productName}`,
    `Type: ${variantOption.productType}`,
    `Dashboard Role: ${variantOption.dashboardRole}`,
    `PWA Role: ${variantOption.pwaRole}`,
    `Relationship: ${variantOption.monitoringRelationship}`,
    `Branding: ${BRANDING_LINE}`,
  ].join('\n');
}

export function compilePromptDashboardPwaSection(context) {
  const { pattern } = context;
  if (!pattern) return 'No pattern selected.';
  return [
    `Dashboard: ${pattern.dashboardName}`,
    `PWA: ${pattern.pwaName}`,
    `Dashboard Role: ${pattern.dashboardRole}`,
    `PWA Role: ${pattern.pwaRole}`,
    `Relationship: ${pattern.relationship}`,
    `State Isolation: ${pattern.stateIsolation}`,
    `Sync Point: ${pattern.syncPoint}`,
    `Export Path: ${pattern.exportPath}`,
    `PWA Offline: ${pattern.pwaOfflineCapability}`,
  ].join('\n');
}

export function compilePromptScopeSection(context) {
  const { variantOption, runNumber } = context;
  return [
    `Run Scope: ${runNumber || 'Run 1'}`,
    `Recommended Total Runs: ${variantOption?.recommendedRunCount || 8}`,
    `Safety Level: ${variantOption?.safetyLevel || 'standard'}`,
    `First Variant Run: ${variantOption?.suggestedFirstVariantRun || 'Run 1'}`,
  ].join('\n');
}

export function compilePromptSafetySection(context) {
  const { variantOption, pattern } = context;
  const warnings = [
    ...(variantOption?.requiredWarnings || []),
    ...(pattern?.safetyWarning ? [pattern.safetyWarning] : []),
    'Do NOT expose raw API keys or secrets in the frontend.',
    'Do NOT build multiple variants inside this project.',
    'Do NOT overwrite the reusable base zip.',
    'Do NOT execute generated prompts automatically.',
  ];
  return warnings.map((w, i) => `${i + 1}. ${w}`).join('\n');
}

export function compilePromptValidationSection(context) {
  const { runNumber } = context;
  return [
    `1. npm run build must pass (zero errors).`,
    `2. Dashboard loads at /.`,
    `3. All active routes load.`,
    `4. State persists on browser refresh.`,
    `5. PWA shell loads and is installable.`,
    `6. SSOT confirmed — all writes through storage.js.`,
    `7. No raw secrets present.`,
    `8. No unsafe product-facing language.`,
    `Run: ${runNumber || 'Run 1'} — validate after every change.`,
  ].join('\n');
}

export function compilePromptFinalChecklist(context) {
  const { variantOption, runNumber } = context;
  return [
    `[ ] ${runNumber || 'Run 1'} only`,
    `[ ] Previous runs preserved`,
    `[ ] Dashboard loads`,
    `[ ] All active routes load`,
    `[ ] PWA shell loads`,
    `[ ] State persists`,
    `[ ] SSOT maintained`,
    `[ ] No raw secrets`,
    `[ ] No unsafe wording`,
    `[ ] No multi-variant build`,
    `[ ] No base overwrite`,
    `[ ] Build passes`,
    `[ ] Branding: ${BRANDING_LINE}`,
    ...(variantOption?.requiredWarnings?.map((w) => `[ ] WARNING checked: ${w.slice(0, 60)}...`) || []),
  ].join('\n');
}

// =====================================================
// INTERNAL HELPERS
// =====================================================
function _buildMissionStatement(variantOption) {
  return (
    `Build Run 1 of the ${variantOption.productName} — a ${variantOption.productType}.\n\n` +
    `This is the core foundation run. Set up the base folder structure, ` +
    `initial state schema, routing, app shell, dashboard skeleton, and PWA shell.\n\n` +
    `Dashboard Role: ${variantOption.dashboardRole}\n` +
    `PWA Role: ${variantOption.pwaRole}\n\n` +
    `Relationship: ${variantOption.monitoringRelationship}\n\n` +
    `This run must NOT build the full feature set. It must create the clean, buildable foundation ` +
    `that subsequent runs will expand. Local-first. No external API calls. No secrets exposed.`
  );
}

function _buildAcceptanceCriteria(variantOption) {
  return [
    `- App shell loads at /.`,
    `- Dashboard skeleton renders with correct role label: ${variantOption.dashboardRole}.`,
    `- PWA shell is installable and renders with correct role label: ${variantOption.pwaRole}.`,
    `- Initial state schema is defined and persists on refresh.`,
    `- All placeholder routes load without errors.`,
    `- Branding present: ${BRANDING_LINE}`,
  ].join('\n');
}
