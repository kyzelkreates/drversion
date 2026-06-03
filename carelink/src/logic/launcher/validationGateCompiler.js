// 4P3X Validation Gate Compiler — Run 5
// Compiles validation gates, post-run tests, and safety checks for generated prompts.

import { getRunForProduct } from '../../config/productRunSequences.js';

const UNIVERSAL_PRE_EDIT_GATES = [
  'Run 1 files exist and are intact',
  'Run 2 files exist and are intact',
  'Run 3 files exist and are intact',
  'Run 4 files exist and are intact',
  'Run 5 files exist and are intact',
  'storage.js exists and is unmodified structurally',
  'Build passes before starting',
  'No unrelated product is being overwritten',
  'No second SSOT is being created',
];

const UNIVERSAL_POST_EDIT_GATES = [
  'Build passes without errors (npm run build)',
  'Run 1 pages still load and function',
  'Run 2 blueprint pages still load and function',
  'Run 3 agent pages still load and function',
  'Run 4 compiler pages still load and function',
  'Run 5 launcher pages still load and function',
  'Dashboard renders all run cards',
  'Sidebar navigation still functions',
  'No duplicate state keys in storage',
  'No localStorage direct mutations in components',
  'No raw API keys in state or exports',
  'No external API calls triggered automatically',
  'No demo/mock/fake wording in any component',
];

const UNIVERSAL_SAFETY_GATES = [
  'No backend secrets exposed',
  'No service role keys in frontend bundle',
  'No autonomous agent file modifications',
  'No destructive refactoring of working systems',
  'No final product variants built in this run',
  'No generated prompts executed automatically',
  'All new state persists through storage.js SSOT only',
];

export function compileValidationGates(productType, runNumber, transformationPlan) {
  const runDef = getRunForProduct(productType, runNumber);
  const fromRunDef = runDef?.requiredValidation || [];
  const productSpecific = compileProductSpecificGates(productType, runNumber);

  return [
    ...UNIVERSAL_PRE_EDIT_GATES,
    ...UNIVERSAL_POST_EDIT_GATES,
    ...UNIVERSAL_SAFETY_GATES,
    ...fromRunDef,
    ...productSpecific,
  ];
}

export function compilePostRunTests(productType, runNumber, transformationPlan) {
  const runDef = getRunForProduct(productType, runNumber);
  const runChecks = runDef
    ? [
        `${runNumber} route is accessible`,
        `${runNumber} module appears in sidebar`,
        `${runNumber} state persists after page refresh`,
        `${runNumber} module is listed as active in Modules page`,
      ]
    : [];

  return [
    ...runChecks,
    'Browser refresh — confirm state persists',
    'All existing routes still work',
    'Search project for "demo", "mock", "fake", "dummy", "toy" — remove if found',
  ];
}

export function compileBuildValidation(_productType, _runNumber) {
  return [
    'npm install completes without errors',
    'npm run build completes without errors',
    'npm run dev starts without errors',
    'No TypeScript/ESLint blocking errors',
    'No missing module imports',
    'No broken dynamic imports',
  ];
}

export function compileSafetyValidation(_productType, _runNumber) {
  return [
    ...UNIVERSAL_SAFETY_GATES,
    'Prompt generation does not execute builds',
    'Exported prompts do not contain raw API keys',
    'Imported prompts pass validation before saving',
    'Delete actions require confirmation',
  ];
}

function compileProductSpecificGates(productType, runNumber) {
  const gates = {
    supabaseHybridSaaS: [
      'Supabase keys are never hardcoded in source files',
      'Service role key is never exposed in frontend bundle',
      'RLS policies are documented in the prompt',
    ],
    aiAnalysisPlatform: [
      'AI provider API keys are user-supplied only',
      'No API key is stored in raw state',
      'Results are sanitized before display',
    ],
    learningPlatform: [
      'Certificate generation is local-only',
      'Learner data does not expose PII without consent flow',
    ],
    employeeInductionPlatform: [
      'Policy acknowledgements are timestamped',
      'Inductee data does not expose PII without consent flow',
    ],
    fleetDashboard: [
      'No live GPS or mapping APIs called without user API key configuration',
      'Driver data does not expose PII without consent flow',
    ],
  };

  return gates[productType] || [];
}
