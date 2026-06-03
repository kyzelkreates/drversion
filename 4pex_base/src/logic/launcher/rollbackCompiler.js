// 4P3X Rollback Compiler — Run 5
// Compiles specific rollback guidance for generated run prompts.

import { getRunForProduct } from '../../config/productRunSequences.js';

export function compileRollbackGuidance(productType, runNumber, transformationPlan) {
  const fileRollback = compileFileRollback({ productType, runNumber });
  const stateRollback = compileStateRollback({ productType, runNumber });
  const moduleRollback = compileModuleRollback({ productType, runNumber });
  const promptRollback = compilePromptRollback({ productType, runNumber });
  const runDef = getRunForProduct(productType, runNumber);
  const fromRunDef = runDef?.rollbackGuidance || [];

  return [
    ...fileRollback,
    ...stateRollback,
    ...moduleRollback,
    ...promptRollback,
    ...fromRunDef,
    'Do not delete working Run 1, Run 2, Run 3, Run 4, or Run 5 systems.',
    'Report the exact file causing failure before rolling back.',
  ];
}

export function compileFileRollback(runScope) {
  const { productType, runNumber } = runScope;
  const runDef = getRunForProduct(productType, runNumber);
  const pages = runDef?.requiredUiScreens || [];
  const modules = runDef?.requiredModules || [];

  return [
    `Revert only files changed in ${runNumber}.`,
    `Remove ${runNumber}-specific page files if they cause errors.`,
    ...pages.map((p) => `Remove src/pages/${p}.jsx if it causes a build failure.`),
    ...modules.map((m) => `Remove src/components/${productType}/${m}/ if it causes a build failure.`),
    `Remove src/logic/${productType}/ folder if logic causes build failure.`,
  ];
}

export function compileStateRollback(runScope) {
  const { productType, runNumber } = runScope;

  return [
    `Remove ${runNumber}-specific state keys from initialState.js`,
    `Remove ${runNumber}-specific storage functions from storage.js if they cause errors`,
    `If localStorage is corrupted, use the in-app reset/export tool to restore from last good export`,
    `Do not manually clear all localStorage — use the in-app reset function only`,
    `Confirm state migration handles missing ${runNumber} keys gracefully`,
  ];
}

export function compileModuleRollback(runScope) {
  const { productType, runNumber } = runScope;
  const runDef = getRunForProduct(productType, runNumber);
  const modules = runDef?.requiredModules || [];

  return [
    `Remove ${runNumber} module entries from moduleRegistry.js if navigation breaks`,
    ...modules.map((m) => `Remove moduleRegistry entry for "${m}" to restore previous navigation`),
    `Remove ${runNumber} routes from routes.js if routing breaks`,
  ];
}

export function compilePromptRollback(runScope) {
  const { runNumber } = runScope;

  return [
    `If prompt generation fails, check that a valid transformation plan exists in state`,
    `If prompt safety scanner crashes, check promptSafetyRules.js for malformed patterns`,
    `If prompt export fails, check promptExport.js sanitization function`,
    `Generated prompts are safe to delete — they do not affect app functionality`,
  ];
}
