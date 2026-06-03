// 4P3X State Validators — RUN 1 + RUN 2 + RUN 3
// Validate SSOT integrity before saving or restoring.

const FORBIDDEN_SECRET_NAMES = [
  'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY',
  'GOOGLE_API_KEY', 'GROQ_API_KEY', 'OPENROUTER_API_KEY',
  'STRIPE_SECRET_KEY', 'DATABASE_URL', 'JWT_SECRET', 'PRIVATE_KEY',
  'WEBHOOK_SECRET', 'ADMIN_TOKEN',
];

const VALID_PROVIDER_IDS = [
  'none', 'openai', 'anthropic', 'google',
  'groq', 'openrouter', 'ollama', 'customEndpoint',
];

const VALID_VARIANT_IDS = [
  'base', 'learningPlatform', 'projectControlOS',
  'fleetDashboard', 'monitoringDashboard', 'clientPortal',
  'adminDashboard', 'aiAnalysisPlatform', 'employeeInductionPlatform',
  'portfolioDemoSystem',
];

function hasForbiddenKeys(obj, path = '') {
  if (typeof obj !== 'object' || obj === null) return null;
  for (const key of Object.keys(obj)) {
    const upper = key.toUpperCase();
    if (FORBIDDEN_SECRET_NAMES.includes(upper)) {
      return `Forbidden secret key found at "${path}${key}"`;
    }
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nested = hasForbiddenKeys(obj[key], `${path}${key}.`);
      if (nested) return nested;
    }
  }
  return null;
}

export function validateState(state) {
  if (typeof state !== 'object' || state === null) {
    return { valid: false, error: 'State must be a non-null object.' };
  }
  if (!state.app || typeof state.app !== 'object') {
    return { valid: false, error: 'Missing or invalid: app identity.' };
  }
  if (!state.activeVariant || typeof state.activeVariant !== 'object') {
    return { valid: false, error: 'Missing or invalid: activeVariant.' };
  }
  if (!VALID_VARIANT_IDS.includes(state.activeVariant.id)) {
    return { valid: false, error: `Invalid activeVariant.id: "${state.activeVariant.id}"` };
  }
  if (!state.modules || typeof state.modules !== 'object') {
    return { valid: false, error: 'Missing or invalid: modules.' };
  }
  if (!state.preferences || typeof state.preferences !== 'object') {
    return { valid: false, error: 'Missing or invalid: preferences.' };
  }
  if (!state.health || typeof state.health !== 'object') {
    return { valid: false, error: 'Missing or invalid: health.' };
  }
  if (!state.aiSettings || typeof state.aiSettings !== 'object') {
    return { valid: false, error: 'Missing or invalid: aiSettings.' };
  }
  if (!VALID_PROVIDER_IDS.includes(state.aiSettings.provider)) {
    return { valid: false, error: `Invalid aiSettings.provider: "${state.aiSettings.provider}"` };
  }

  // RUN 2
  if (state.blueprints !== undefined) {
    if (typeof state.blueprints !== 'object') {
      return { valid: false, error: 'blueprints must be an object.' };
    }
    if (!Array.isArray(state.blueprints.items)) {
      return { valid: false, error: 'blueprints.items must be an array.' };
    }
    if (
      state.blueprints.activeBlueprintId !== null &&
      state.blueprints.activeBlueprintId !== undefined &&
      typeof state.blueprints.activeBlueprintId !== 'string'
    ) {
      return { valid: false, error: 'blueprints.activeBlueprintId must be null or a string.' };
    }
    if (
      state.blueprints.activeBlueprintId &&
      !state.blueprints.items.find((b) => b.id === state.blueprints.activeBlueprintId)
    ) {
      state.blueprints.activeBlueprintId = null;
    }
  }

  if (state.transformation !== undefined) {
    if (typeof state.transformation !== 'object') {
      return { valid: false, error: 'transformation must be an object.' };
    }
    const score = state.transformation.readinessScore;
    if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 100)) {
      return { valid: false, error: 'transformation.readinessScore must be a number 0–100.' };
    }
  }

  // RUN 3 — agent system
  if (state.agentSystem !== undefined) {
    if (typeof state.agentSystem !== 'object') {
      return { valid: false, error: 'agentSystem must be an object.' };
    }
    if (state.agentSystem.autonomyEnabled !== false) {
      return { valid: false, error: 'agentSystem.autonomyEnabled must be false.' };
    }
    if (!Array.isArray(state.agentSystem.recommendationQueue)) {
      return { valid: false, error: 'agentSystem.recommendationQueue must be an array.' };
    }
    if (!Array.isArray(state.agentSystem.agentRuns)) {
      return { valid: false, error: 'agentSystem.agentRuns must be an array.' };
    }
    if (state.agentSystem.permissions) {
      const p = state.agentSystem.permissions;
      if (p.allowFileEdits !== false)          return { valid: false, error: 'agentSystem.permissions.allowFileEdits must be false.' };
      if (p.allowExternalApiCalls !== false)   return { valid: false, error: 'agentSystem.permissions.allowExternalApiCalls must be false.' };
      if (p.allowDestructiveActions !== false) return { valid: false, error: 'agentSystem.permissions.allowDestructiveActions must be false.' };
      if (p.requireUserApproval !== true)      return { valid: false, error: 'agentSystem.permissions.requireUserApproval must be true.' };
    }
  }


  // ── Run 4 transformation compiler state validation ──
  if (state.transformationCompiler) {
    const tc = state.transformationCompiler;
    if (!Array.isArray(tc.plans)) {
      return { valid: false, error: 'transformationCompiler.plans must be an array.' };
    }
    if (tc.compileMode !== 'non_destructive') {
      return { valid: false, error: 'transformationCompiler.compileMode must be non_destructive.' };
    }
    if (tc.allowFileWrites !== false) {
      return { valid: false, error: 'transformationCompiler.allowFileWrites must be false.' };
    }
    if (tc.allowOverwrite !== false) {
      return { valid: false, error: 'transformationCompiler.allowOverwrite must be false.' };
    }
    if (tc.allowDestructiveRefactor !== false) {
      return { valid: false, error: 'transformationCompiler.allowDestructiveRefactor must be false.' };
    }
  }
  const forbiddenCheck = hasForbiddenKeys(state);
  if (forbiddenCheck) {
    return { valid: false, error: forbiddenCheck };
  }

  return { valid: true };
}

export function validateAiProviderConfig(config) {
  if (!config || typeof config !== 'object') {
    return { valid: false, error: 'Config must be a non-null object.' };
  }
  if (!VALID_PROVIDER_IDS.includes(config.provider)) {
    return { valid: false, error: `Unknown provider: "${config.provider}"` };
  }
  if (config.apiKeyName) {
    const upper = String(config.apiKeyName).toUpperCase();
    if (FORBIDDEN_SECRET_NAMES.includes(upper)) {
      return { valid: false, error: `Forbidden secret name: "${config.apiKeyName}"` };
    }
  }
  return { valid: true };
}

export { FORBIDDEN_SECRET_NAMES, VALID_PROVIDER_IDS, VALID_VARIANT_IDS };

// ─────────────────────────────────────────────
// RUN 8 — Final Audit State Validation
// ─────────────────────────────────────────────
export function validateFinalAuditSection(state) {

  // Run 9: basePackage state validation
  if (!state.basePackage) {
    return { valid: false, error: 'basePackage section is missing from state.' };
  }
  if (!Array.isArray(state.basePackage.packages)) {
    return { valid: false, error: 'basePackage.packages must be an array.' };
  }
  if (!state.basePackage.locks || state.basePackage.locks.preventSecretPackaging !== true) {
    return { valid: false, error: 'basePackage.locks.preventSecretPackaging must be true.' };
  }

  if (!state.finalAudit) {
    return { valid: false, error: 'finalAudit section is missing from state.' };
  }
  const fa = state.finalAudit;

  if (!Array.isArray(fa.auditRuns)) {
    return { valid: false, error: 'finalAudit.auditRuns must be an array.' };
  }
  if (!Array.isArray(fa.latestFindings)) {
    return { valid: false, error: 'finalAudit.latestFindings must be an array.' };
  }
  if (!Array.isArray(fa.blockers)) {
    return { valid: false, error: 'finalAudit.blockers must be an array.' };
  }
  if (!fa.finalLock || typeof fa.finalLock !== 'object') {
    return { valid: false, error: 'finalAudit.finalLock must be an object.' };
  }
  if (typeof fa.finalLock.canStartVariantBuilds !== 'boolean') {
    return { valid: false, error: 'finalAudit.finalLock.canStartVariantBuilds must be boolean.' };
  }
  if (!fa.locks || fa.locks.preserveStorageSSOT !== true) {
    return { valid: false, error: 'finalAudit.locks.preserveStorageSSOT must be true.' };
  }

  // No raw secrets in audit state
  const serialised = JSON.stringify(fa);
  if (/sk-[A-Za-z0-9]{20,}/.test(serialised) || /AIza[A-Za-z0-9\-_]{35}/.test(serialised)) {
    return { valid: false, error: 'finalAudit state contains raw API key patterns.' };
  }

  // No forbidden product-facing demo language in findings
  const FORBIDDEN_DEMO = ['dummy', 'toy', 'fake', 'placeholder app'];
  const findingsText = JSON.stringify(fa.latestFindings || []).toLowerCase();
  for (const term of FORBIDDEN_DEMO) {
    // only flag if outside allowed context
    if (findingsText.includes(term) && !findingsText.includes('forbidden') && !findingsText.includes('audit rule')) {
      return { valid: false, error: `Forbidden product-facing term "${term}" detected in audit findings.` };
    }
  }

  return { valid: true };
}

// =====================================================
// RUN 10 — MASTER LAUNCHER VALIDATOR
// =====================================================
export function validateMasterLauncherSection(state) {
  const ml = state?.masterLauncher;
  if (!ml) return { valid: false, error: 'masterLauncher section is missing from state.' };
  if (!Array.isArray(ml.generatedMasterPrompts)) {
    return { valid: false, error: 'masterLauncher.generatedMasterPrompts must be an array.' };
  }
  if (typeof ml.finalBaseComplete !== 'boolean') {
    return { valid: false, error: 'masterLauncher.finalBaseComplete must be boolean.' };
  }
  if (typeof ml.readyToBuildVariants !== 'boolean') {
    return { valid: false, error: 'masterLauncher.readyToBuildVariants must be boolean.' };
  }
  if (!ml.locks || ml.locks.preventVariantBuildInsideBase !== true) {
    return { valid: false, error: 'masterLauncher.locks.preventVariantBuildInsideBase must be true.' };
  }
  if (ml.locks.preventSecretExposure !== true) {
    return { valid: false, error: 'masterLauncher.locks.preventSecretExposure must be true.' };
  }
  if (ml.locks.enforceBranding !== true) {
    return { valid: false, error: 'masterLauncher.locks.enforceBranding must be true.' };
  }
  // No raw secrets in generated prompts
  const promptsText = JSON.stringify(ml.generatedMasterPrompts || []);
  if (/sk-[A-Za-z0-9]{20,}/.test(promptsText) || /sk_live_[A-Za-z0-9]{20,}/.test(promptsText)) {
    return { valid: false, error: 'masterLauncher.generatedMasterPrompts contains a raw API key pattern.' };
  }
  return { valid: true };
}
