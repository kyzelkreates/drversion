// 4P3X Acceptance Criteria Compiler — Run 5
// Compiles acceptance criteria for generated run prompts.

import { getRunForProduct } from '../../config/productRunSequences.js';

const UNIVERSAL_CRITERIA = [
  'Run 1 still works',
  'Run 2 still works',
  'Run 3 still works',
  'Run 4 still works',
  'Run 5 still works',
  'Dashboard still loads',
  'Existing routes still work',
  'Build passes without errors',
];

const UNIVERSAL_STATE_CRITERIA = [
  'All new state persists through storage.js',
  'No duplicate state keys exist',
  'State survives page refresh',
  'Export/import still functions correctly',
  'No raw API keys in state',
];

const UNIVERSAL_SAFETY_CRITERIA = [
  'No builds executed automatically',
  'No external AI API calls made',
  'No backend secrets exposed',
  'No destructive refactoring occurred',
  'No demo/mock/fake wording remains',
];

export function compileAcceptanceCriteria(productType, runNumber, transformationPlan) {
  const fromRunDef = compileRequiredFeatureAcceptance(productType, runNumber);
  const stateAC = compileStateAcceptance(productType, runNumber);
  const uiAC = compileUiAcceptance(productType, runNumber);
  const safetyAC = compileSafetyAcceptance(productType, runNumber);

  return [
    ...UNIVERSAL_CRITERIA,
    ...fromRunDef,
    ...stateAC,
    ...uiAC,
    ...safetyAC,
  ];
}

export function compileRequiredFeatureAcceptance(productType, runNumber) {
  const runDef = getRunForProduct(productType, runNumber);
  if (!runDef) return [];

  const criteria = [
    ...(runDef.acceptanceCriteria || []),
    ...(runDef.requiredModules || []).map((m) => `Module "${m}" is registered and active`),
    ...(runDef.requiredDataModels || []).map((m) => `Data model "${m}" persists via storage.js`),
    ...(runDef.requiredUiScreens || []).map((s) => `UI screen "${s}" renders without errors`),
  ];

  return criteria;
}

export function compileStateAcceptance(productType, runNumber) {
  const runDef = getRunForProduct(productType, runNumber);
  const transitions = runDef?.requiredStateTransitions || [];

  return [
    ...UNIVERSAL_STATE_CRITERIA,
    ...transitions.map((t) => `State transition "${t}" functions correctly`),
  ];
}

export function compileUiAcceptance(productType, runNumber) {
  const runDef = getRunForProduct(productType, runNumber);
  const screens = runDef?.requiredUiScreens || [];

  const criteria = [
    ...screens.map((s) => `"${s}" shows empty state when no data exists`),
    ...screens.map((s) => `"${s}" shows error state when data fails to load`),
    'Sidebar shows new modules',
    'All new pages are mobile responsive',
    'All new pages use existing style system (black/gold/silver)',
    'No placeholder or dummy text visible',
  ];

  return criteria;
}

export function compileSafetyAcceptance(_productType, _runNumber) {
  return UNIVERSAL_SAFETY_CRITERIA;
}
