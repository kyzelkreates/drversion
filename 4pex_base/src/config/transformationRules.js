// 4P3X Transformation Rules — RUN 2
// Defines safe rules for future product transformation.
// All rules are config-only. No enforcement code runs automatically.

const transformationRules = [

  // ─── Foundation Protection ──────────────────────────────────────────
  {
    id: 'fp_no_replace_storage',
    category: 'foundationProtectionRules',
    label: 'Do not replace storage.js',
    description: 'storage.js is the Single Source of Truth. It must never be deleted or replaced with a different state system.',
    severity: 'critical',
    appliesTo: ['all'],
  },
  {
    id: 'fp_no_duplicate_ssot',
    category: 'foundationProtectionRules',
    label: 'No duplicate SSOT',
    description: 'Only one state management system may exist. No parallel localStorage managers, context stores, or global variables may replace storage.js.',
    severity: 'critical',
    appliesTo: ['all'],
  },
  {
    id: 'fp_no_business_logic_in_components',
    category: 'foundationProtectionRules',
    label: 'No hardcoded business logic in components',
    description: 'All business rules, config, and module definitions must remain in config and state layers, not inside UI components.',
    severity: 'warning',
    appliesTo: ['all'],
  },
  {
    id: 'fp_no_delete_working_systems',
    category: 'foundationProtectionRules',
    label: 'Do not delete working Run 1 or Run 2 systems',
    description: 'Extend existing systems. Never remove a working foundation module unless a validated replacement exists.',
    severity: 'critical',
    appliesTo: ['all'],
  },

  // ─── Local-First Rules ───────────────────────────────────────────────
  {
    id: 'lf_state_through_storage',
    category: 'localFirstRules',
    label: 'All state flows through storage.js',
    description: 'No component may directly read from or write to localStorage. All state mutations must go through storage.js SSOT functions.',
    severity: 'critical',
    appliesTo: ['all'],
  },
  {
    id: 'lf_export_import_reset',
    category: 'localFirstRules',
    label: 'Export/import/reset must remain functional',
    description: 'The state export, import, and reset functions in storage.js must remain operational in every future run.',
    severity: 'warning',
    appliesTo: ['all'],
  },
  {
    id: 'lf_offline_first',
    category: 'localFirstRules',
    label: 'Preserve offline-first behaviour',
    description: 'Local-first products must remain functional without a network connection. Any online features must degrade gracefully.',
    severity: 'warning',
    appliesTo: ['local-first', 'hybrid'],
  },

  // ─── Supabase Future Rules ──────────────────────────────────────────
  {
    id: 'sb_optional_until_enabled',
    category: 'supabaseFutureRules',
    label: 'Supabase is optional until its run is built',
    description: 'No Supabase connection, client, or schema should be added until the dedicated Supabase sync run is executed.',
    severity: 'critical',
    appliesTo: ['supabase', 'hybrid'],
  },
  {
    id: 'sb_backend_ssot',
    category: 'supabaseFutureRules',
    label: 'Backend schema becomes backend SSOT when Supabase is enabled',
    description: 'When Supabase is enabled, the database schema becomes the authoritative source for server-side data. Local state must sync accordingly.',
    severity: 'info',
    appliesTo: ['supabase', 'hybrid'],
  },
  {
    id: 'sb_rls_required',
    category: 'supabaseFutureRules',
    label: 'Row Level Security must be explicitly defined',
    description: 'All Supabase tables must have RLS policies explicitly stated and reviewed before deployment.',
    severity: 'critical',
    appliesTo: ['supabase', 'hybrid'],
  },

  // ─── AI Safety Rules ────────────────────────────────────────────────
  {
    id: 'ai_no_uncontrolled_autonomy',
    category: 'aiSafetyRules',
    label: 'No uncontrolled AI autonomy',
    description: 'AI agents must never take actions without explicit user approval. All agent actions must be logged, reversible where possible, and bounded by their allowedActions list.',
    severity: 'critical',
    appliesTo: ['all'],
  },
  {
    id: 'ai_no_auto_api_calls',
    category: 'aiSafetyRules',
    label: 'No automatic external AI API calls',
    description: 'No AI provider endpoint may be called without explicit user action (e.g. pressing Test or Generate). No background polling or silent calls.',
    severity: 'critical',
    appliesTo: ['all'],
  },
  {
    id: 'ai_no_raw_keys_in_exports',
    category: 'aiSafetyRules',
    label: 'No raw API keys in exports',
    description: 'All exports (state, blueprints, reports) must mask or strip any API keys. Raw keys must never appear in JSON exports.',
    severity: 'critical',
    appliesTo: ['all'],
  },
  {
    id: 'ai_no_backend_secrets_in_frontend',
    category: 'aiSafetyRules',
    label: 'No backend secrets in frontend code',
    description: 'Service role keys, database URLs, JWT secrets, private keys, and admin tokens must never be placed in frontend code or environment variables accessible to the client.',
    severity: 'critical',
    appliesTo: ['all'],
  },

  // ─── Product-Specific Safety Rules ─────────────────────────────────
  {
    id: 'ps_fleet_safety_critical',
    category: 'productSpecificSafetyRules',
    label: 'Fleet products are safety-critical',
    description: 'Vehicle routing and fleet management products affect real-world safety. All route changes, driver assignments, and trip data must be logged and validated.',
    severity: 'critical',
    appliesTo: ['fleet'],
  },
  {
    id: 'ps_cybersecurity_defensive_only',
    category: 'productSpecificSafetyRules',
    label: 'Cybersecurity products must remain defensive',
    description: 'Any security-related product must be strictly defensive. No offensive tools, vulnerability exploitation code, or attack simulation without explicit legal scope.',
    severity: 'critical',
    appliesTo: ['cybersecurity', 'monitoring'],
  },
  {
    id: 'ps_no_proprietary_cloning',
    category: 'productSpecificSafetyRules',
    label: 'Do not clone proprietary applications',
    description: 'App extraction or portfolio products must not replicate proprietary third-party applications, their UI, branding, or data structures without authorisation.',
    severity: 'critical',
    appliesTo: ['portfolio', 'custom'],
  },
  {
    id: 'ps_compliance_hr_safety',
    category: 'productSpecificSafetyRules',
    label: 'HR/compliance products require privacy controls',
    description: 'Employee induction, HR, and compliance products must not export private employee data without explicit consent and must comply with applicable privacy regulations.',
    severity: 'critical',
    appliesTo: ['induction', 'compliance-critical'],
  },

  // ─── Refactor Rules ─────────────────────────────────────────────────
  {
    id: 'rf_extend_not_replace',
    category: 'refactorRules',
    label: 'Extend instead of replace',
    description: 'Each new run must extend existing foundations. Replacing working systems wholesale without validated replacements is forbidden.',
    severity: 'warning',
    appliesTo: ['all'],
  },
  {
    id: 'rf_patch_not_destroy',
    category: 'refactorRules',
    label: 'Patch instead of destroy',
    description: 'When modifying existing files, patch only the required sections. Do not rewrite complete files unless the entire system is being superseded in the same run.',
    severity: 'warning',
    appliesTo: ['all'],
  },
  {
    id: 'rf_preserve_working_modules',
    category: 'refactorRules',
    label: 'Preserve working modules',
    description: 'Active modules from previous runs must continue to function after any transformation run. Breaking changes require explicit migration paths.',
    severity: 'critical',
    appliesTo: ['all'],
  },
  {
    id: 'rf_run_based_transformation',
    category: 'refactorRules',
    label: 'Use run-based transformation',
    description: 'All major system changes must be scoped to a numbered run. Changes must be documented, reversible, and must not mix concerns from multiple future runs.',
    severity: 'info',
    appliesTo: ['all'],
  },
];

/**
 * Get rules by category.
 */
export function getRulesByCategory(category) {
  return transformationRules.filter((r) => r.category === category);
}

/**
 * Get critical rules only.
 */
export function getCriticalRules() {
  return transformationRules.filter((r) => r.severity === 'critical');
}

/**
 * Get rules that apply to a given product type.
 */
export function getRulesForProductType(productType) {
  return transformationRules.filter(
    (r) => r.appliesTo.includes('all') || r.appliesTo.includes(productType)
  );
}

export default transformationRules;
