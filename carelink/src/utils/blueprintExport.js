// 4P3X Blueprint Export Utilities — RUN 2
// Safe export/import for blueprint objects.
// Raw API keys and backend secrets are never exported.

import { safeParseJson, safeStringifyJson } from './safeJson.js';
import { validateBlueprint } from '../state/blueprintValidators.js';

// Forbidden key names (case-insensitive match on key)
const FORBIDDEN_KEY_NAMES = [
  'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY',
  'GOOGLE_API_KEY', 'GROQ_API_KEY', 'OPENROUTER_API_KEY',
  'STRIPE_SECRET_KEY', 'DATABASE_URL', 'JWT_SECRET', 'PRIVATE_KEY',
  'WEBHOOK_SECRET', 'ADMIN_TOKEN', '_rawKey', 'apiKey',
  '_injectedSecret', 'secretKey', 'accessToken', 'refreshToken',
];

// Value patterns that look like secrets (regex)
const SECRET_VALUE_PATTERNS = [
  /^sk-[a-zA-Z0-9\-_]{10,}$/,          // OpenAI-style keys
  /^eyJ[a-zA-Z0-9+/=._-]{20,}/,           // JWT tokens
  /^sb_[a-zA-Z0-9\-_]{10,}$/,           // Supabase keys
  /^xoxb-[0-9]+-[a-zA-Z0-9\-]+$/,       // Slack bot tokens
  /^AIza[a-zA-Z0-9\-_]{35,}$/,          // Google API keys
  /^ghp_[a-zA-Z0-9]{36,}$/,             // GitHub tokens
];

function isSecretValue(val) {
  if (typeof val !== 'string') return false;
  return SECRET_VALUE_PATTERNS.some((re) => re.test(val));
}

/**
 * Deep-scan object for forbidden key names and suspicious secret values.
 * Replaces with masked value rather than exposing.
 */
function stripForbiddenKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const clean = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    const upperKey = key.toUpperCase();
    const isForbiddenKey = FORBIDDEN_KEY_NAMES.some(
      (fk) => upperKey === fk.toUpperCase() || upperKey.includes('SECRET') || upperKey.includes('_RAWKEY')
    );
    const val = obj[key];
    const isForbiddenVal = typeof val === 'string' && isSecretValue(val);

    if (isForbiddenKey || isForbiddenVal) {
      clean[key] = '••••••••';
    } else if (typeof val === 'object' && val !== null) {
      clean[key] = stripForbiddenKeys(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Sanitize a blueprint for safe export.
 * Strips all forbidden keys and raw secrets.
 */
export function sanitizeBlueprintForExport(blueprint) {
  if (!blueprint || typeof blueprint !== 'object') return null;
  return stripForbiddenKeys({ ...blueprint });
}

/**
 * Export a blueprint to a JSON string.
 * Returns { ok: true, json: string } or { ok: false, error: string }
 */
export function exportBlueprintToJson(blueprint) {
  if (!blueprint || typeof blueprint !== 'object') {
    return { ok: false, error: 'No blueprint provided.' };
  }
  const safe = sanitizeBlueprintForExport(blueprint);
  const { ok, value, error } = safeStringifyJson(safe, 2);
  if (!ok) return { ok: false, error };
  return { ok: true, json: value };
}

/**
 * Import and validate a blueprint from a JSON string or object.
 * For imports, we use a relaxed validation that allows drafts with empty targetUsers.
 * Returns { ok: true, blueprint } or { ok: false, error: string }
 */
export function importBlueprintFromJson(json) {
  let data;

  if (typeof json === 'string') {
    const { ok, data: parsed, error } = safeParseJson(json);
    if (!ok) return { ok: false, error: 'Invalid JSON: ' + error };
    data = parsed;
  } else if (typeof json === 'object' && json !== null) {
    data = json;
  } else {
    return { ok: false, error: 'Import must be a JSON string or object.' };
  }

  // Strip forbidden keys before any validation
  const clean = stripForbiddenKeys(data);

  // Structural validation — check minimum blueprint shape
  const structuralErrors = [];
  if (!clean.name || typeof clean.name !== 'string' || clean.name.trim().length < 2) {
    structuralErrors.push('Blueprint must have a name (minimum 2 characters).');
  }
  if (!clean.productType || typeof clean.productType !== 'string') {
    structuralErrors.push('Blueprint must have a productType.');
  }

  if (structuralErrors.length > 0) {
    return { ok: false, error: 'Blueprint validation failed: ' + structuralErrors.join('; ') };
  }

  // Ensure arrays exist (graceful defaults for imported/partial blueprints)
  const VALID_STATE_MODES   = ['local-first', 'supabase', 'hybrid'];
  const VALID_SAFETY_LEVELS = ['standard', 'sensitive', 'safety-critical', 'compliance-critical'];

  const normalised = {
    ...clean,
    targetUsers:          Array.isArray(clean.targetUsers) ? clean.targetUsers : [],
    coreModules:          Array.isArray(clean.coreModules) ? clean.coreModules : [],
    optionalModules:      Array.isArray(clean.optionalModules) ? clean.optionalModules : [],
    requiredDataEntities: Array.isArray(clean.requiredDataEntities) ? clean.requiredDataEntities : [],
    mainUserFlows:        Array.isArray(clean.mainUserFlows) ? clean.mainUserFlows : [],
    aiAgentNeeds:         Array.isArray(clean.aiAgentNeeds) ? clean.aiAgentNeeds : [],
    apiIntegrationNeeds:  Array.isArray(clean.apiIntegrationNeeds) ? clean.apiIntegrationNeeds : [],
    futureRuns:           Array.isArray(clean.futureRuns) ? clean.futureRuns : [],
    lockedRules:          Array.isArray(clean.lockedRules) ? clean.lockedRules : [],
    stateMode:            VALID_STATE_MODES.includes(clean.stateMode) ? clean.stateMode : 'local-first',
    safetyLevel:          VALID_SAFETY_LEVELS.includes(clean.safetyLevel) ? clean.safetyLevel : 'standard',
    pwaRequired:          Boolean(clean.pwaRequired),
    identity:             (clean.identity && typeof clean.identity === 'object') ? clean.identity : { appName: clean.name },
    status:               clean.status || 'draft',
  };

  return { ok: true, blueprint: normalised };
}
