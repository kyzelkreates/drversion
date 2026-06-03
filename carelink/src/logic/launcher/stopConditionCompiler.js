// 4P3X Stop Condition Compiler — Run 5
// Compiles stop conditions for generated run prompts.

import { getRunForProduct } from '../../config/productRunSequences.js';

const GLOBAL_STOP_CONDITIONS = [
  'Run 1 files are missing or corrupted',
  'Run 2 files are missing or corrupted',
  'Run 3 files are missing or corrupted',
  'Run 4 files are missing or corrupted',
  'Run 5 files are missing or corrupted',
  'storage.js is being replaced or fully rewritten',
  'A second state management system is being created',
  'The app is not the 4P3X Reusable Base Structure™',
  'External AI APIs are being called automatically',
  'Backend secrets are being exposed in the frontend bundle',
  'Generated prompts are being executed automatically',
  'Variant files are being written into the live app',
  'Demo/mock/fake wording is being introduced into production code',
];

export function compileStopConditions(productType, runNumber, transformationPlan) {
  const archConditions = compileArchitectureStopConditions(transformationPlan);
  const safetyConditions = compileSafetyStopConditions(productType);
  const secretConditions = compileSecretStopConditions();
  const scopeConditions = compileScopeStopConditions();
  const runDef = getRunForProduct(productType, runNumber);
  const fromRunDef = runDef?.stopConditions || [];

  return [
    ...GLOBAL_STOP_CONDITIONS,
    ...archConditions,
    ...safetyConditions,
    ...secretConditions,
    ...scopeConditions,
    ...fromRunDef,
  ];
}

export function compileArchitectureStopConditions(transformationPlan) {
  const conditions = [
    'Request would overwrite Run 1, Run 2, Run 3, Run 4, or Run 5 architecture',
    'Request would create a second SSOT system',
    'Request would break storage.js SSOT contract',
    'Request would remove existing module registry entries',
    'Request would restructure existing route system',
  ];

  if (transformationPlan) {
    conditions.push('Active transformation plan has critical risk blockers that are unresolved');
    conditions.push('Transformation plan status is not ready_for_variant_run or ready_with_warnings');
  }

  return conditions;
}

export function compileSafetyStopConditions(productType) {
  const base = [
    'Request would create autonomous AI agents that modify files',
    'Request would create autonomous AI agents that call external APIs without user action',
    'Request would build the final product variant before its designated run',
    'Request would execute generated prompts automatically',
    'Request would write generated skeleton files into the live app',
    'Request would allow destructive refactoring of working systems',
  ];

  const productSpecific = {
    supabaseHybridSaaS: [
      'Request would embed Supabase service role key in the frontend',
      'Request would disable row-level security on any table',
    ],
    aiAnalysisPlatform: [
      'Request would hardcode any AI provider API key in source files',
    ],
    fleetDashboard: [
      'Request would expose driver PII without a consent and access control flow',
    ],
    learningPlatform: [
      'Request would expose learner PII without a consent flow',
    ],
    employeeInductionPlatform: [
      'Request would expose inductee personal data without consent flow',
    ],
  };

  return [...base, ...(productSpecific[productType] || [])];
}

export function compileSecretStopConditions() {
  return [
    'Request would expose deployment secrets',
    'Request would expose environment secrets (.env files)',
    'Request would expose backend-only secret values',
    'Request would expose API keys in exported files',
    'Request would store raw API keys in localStorage or state',
    'Request would embed Stripe secret key in frontend bundle',
    'Request would embed OpenAI API key in frontend bundle',
  ];
}

export function compileScopeStopConditions() {
  return [
    'Request would add features outside the defined run scope',
    'Request would build multiple product variants simultaneously',
    'Request would skip a required run dependency',
    'Request would introduce cross-product module contamination',
    'Request would modify files from other product type builds',
    'Request requires a backend service that does not exist yet',
    'Request introduces feature creep beyond the mission',
  ];
}
