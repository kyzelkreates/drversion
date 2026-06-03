// 4P3X Run Scope Compiler — Run 5
// Compiles allowed/forbidden files, modules, and required outputs for a given run.
// Does not execute builds. Does not write files.

import { getRunForProduct } from '../../config/productRunSequences.js';

const ALWAYS_PROTECTED_FILES = [
  'src/state/storage.js',
  'src/state/initialState.js',
  'src/config/appConfig.js',
  'src/config/moduleRegistry.js',
  'src/config/variantConfig.js',
  'src/app/App.jsx',
  'src/components/layout/AppShell.jsx',
  'src/components/layout/Sidebar.jsx',
  'src/components/layout/TopBar.jsx',
  'src/logic/agents/',
  'src/logic/transformer/',
  'src/logic/launcher/',
  '.env',
  '.env.local',
  '.env.production',
  'public/manifest.json',
];

const RUN_5_PROTECTED_FILES = [
  'src/pages/VariantBuildLauncher.jsx',
  'src/pages/RunPromptGenerator.jsx',
  'src/pages/GeneratedPromptDetail.jsx',
  'src/logic/launcher/',
  'src/components/launcher/',
];

export function compileRunScope(productType, runNumber, transformationPlan) {
  const runDef = getRunForProduct(productType, runNumber);
  return {
    productType,
    runNumber,
    allowedFiles: compileAllowedFiles(productType, runNumber, transformationPlan),
    forbiddenFiles: compileForbiddenFiles(productType, runNumber, transformationPlan),
    allowedModules: compileAllowedModules(productType, runNumber, transformationPlan),
    forbiddenModules: compileForbiddenModules(productType, runNumber, transformationPlan),
    requiredOutputs: compileRequiredOutputs(productType, runNumber, transformationPlan),
    missionPoints: runDef?.mission ? [runDef.mission] : [],
    dependsOn: runDef?.dependsOn || [],
  };
}

export function compileAllowedFiles(productType, runNumber, transformationPlan) {
  const runDef = getRunForProduct(productType, runNumber);
  const fromRunDef = runDef?.allowedFiles || [];

  // Always allow these baseline files for any run
  const baseline = [
    'src/app/routes.js',
    'src/config/moduleRegistry.js',
    'src/state/initialState.js (extend only)',
    'src/state/storage.js (extend only)',
    'src/styles/globals.css',
    'README.md',
  ];

  // Allow plan-specific files if available
  const fromPlan = transformationPlan?.fileStructure?.files
    ? transformationPlan.fileStructure.files
        .filter((f) => f.action === 'create' || f.action === 'extend')
        .map((f) => f.path)
    : [];

  return [...new Set([...fromRunDef, ...baseline, ...fromPlan])];
}

export function compileForbiddenFiles(productType, runNumber, transformationPlan) {
  const runDef = getRunForProduct(productType, runNumber);
  const fromRunDef = runDef?.forbiddenFiles || [];

  // Always forbidden
  const alwaysForbidden = [...ALWAYS_PROTECTED_FILES, ...RUN_5_PROTECTED_FILES];

  // Add files from previous runs that are not in allowedFiles
  const previousRunFiles = [
    'src/pages/TransformationCompiler.jsx',
    'src/pages/ProductSkeletonGenerator.jsx',
    'src/pages/TransformationPlanDetail.jsx',
    'src/pages/AiAgents.jsx',
    'src/pages/AgentWorkbench.jsx',
    'src/pages/BlueprintEngine.jsx',
    'src/pages/BlueprintDetail.jsx',
    'src/pages/TransformationReadiness.jsx',
    'src/components/transformer/',
    'src/components/agents/',
    'src/components/blueprints/',
    'src/logic/agents/',
    'src/logic/transformer/',
    'src/logic/launcher/',
  ];

  return [...new Set([...fromRunDef, ...alwaysForbidden, ...previousRunFiles])];
}

export function compileAllowedModules(productType, runNumber, transformationPlan) {
  const runDef = getRunForProduct(productType, runNumber);
  const fromRunDef = runDef?.requiredModules || [];

  const fromPlan = transformationPlan?.moduleActivation?.modulesToActivate
    ? transformationPlan.moduleActivation.modulesToActivate
    : [];

  return [...new Set([...fromRunDef, ...fromPlan])];
}

export function compileForbiddenModules(productType, runNumber, _transformationPlan) {
  // Modules from other product types are forbidden in any single-product run
  const crossProductModules = [
    'fleet',
    'monitoring',
    'lms',
    'crm',
    'analytics',
    'billing',
    'supabaseAuth',
    'inductionEngine',
  ];

  // Core system modules are always forbidden to overwrite
  const coreModules = [
    'dashboard (structural rewrite)',
    'blueprintEngine (structural rewrite)',
    'transformationCompiler (structural rewrite)',
    'variantBuildLauncher (structural rewrite)',
    'agentWorkbench (structural rewrite)',
  ];

  return [...crossProductModules, ...coreModules];
}

export function compileRequiredOutputs(productType, runNumber, transformationPlan) {
  const runDef = getRunForProduct(productType, runNumber);
  const fromRunDef = runDef ? [
    `${runNumber} pages created and routed`,
    `${runNumber} modules registered in moduleRegistry.js`,
    `${runNumber} state added to initialState.js`,
    `${runNumber} storage functions added to storage.js`,
    'Build passes without errors',
    'Run 1-5 still working',
  ] : [];

  const fromPlan = transformationPlan?.futureRunSequence?.runs
    ? transformationPlan.futureRunSequence.runs
        .filter((r) => r.runNumber === runNumber)
        .flatMap((r) => r.deliverables || [])
    : [];

  return [...new Set([...fromRunDef, ...fromPlan])];
}
