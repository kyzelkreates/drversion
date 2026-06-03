// 4P3X Agent Validators — RUN 3
// Validates agent runs, recommendations, and agent system state.

const VALID_INPUT_SOURCES  = ['active_blueprint', 'transformation_readiness', 'api_config', 'manual_context'];
const VALID_RUN_STATUSES   = ['queued', 'completed', 'failed'];
const VALID_PRIORITIES     = ['low', 'medium', 'high', 'critical'];
const VALID_CATEGORIES     = ['architecture', 'ux', 'validation', 'refactor', 'api', 'safety', 'strategy'];
const VALID_REC_STATUSES   = ['open', 'accepted', 'dismissed', 'converted_to_future_run'];

const FORBIDDEN_SECRET_NAMES = [
  'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY',
  'GOOGLE_API_KEY', 'STRIPE_SECRET_KEY', 'JWT_SECRET', 'PRIVATE_KEY',
  '_rawKey', 'apiKey', 'secretKey', 'accessToken', 'serviceRoleKey',
];

const FORBIDDEN_VALUE_RE = /sk-[a-zA-Z0-9\-_]{20,}|eyJ[a-zA-Z0-9+/=._-]{20,}|sb_[a-zA-Z0-9\-_]{20,}/;

const FORBIDDEN_DEMO_WORDS = ['demo data', 'mock data', 'fake data', 'dummy data', 'toy app', 'simulated product'];

function containsSecret(str) {
  if (typeof str !== 'string') return false;
  if (FORBIDDEN_VALUE_RE.test(str)) return true;
  return FORBIDDEN_SECRET_NAMES.some((k) => str.toUpperCase().includes(k.toUpperCase()));
}

function containsDemoLanguage(str) {
  if (typeof str !== 'string') return false;
  const lower = str.toLowerCase();
  return FORBIDDEN_DEMO_WORDS.some((w) => lower.includes(w));
}

function scanArrayForIssues(arr, label) {
  const errors = [];
  if (!Array.isArray(arr)) { errors.push(`${label} must be an array.`); return errors; }
  arr.forEach((item, i) => {
    if (containsSecret(item))      errors.push(`${label}[${i}] contains a potential secret — sanitize before saving.`);
    if (containsDemoLanguage(item)) errors.push(`${label}[${i}] contains forbidden production language.`);
  });
  return errors;
}

// ─── validateAgentRun ────────────────────────────────────────────────────────

export function validateAgentRun(agentRun) {
  const errors = [];
  if (!agentRun || typeof agentRun !== 'object') return { valid: false, errors: ['agentRun must be a non-null object.'] };

  if (!agentRun.id || typeof agentRun.id !== 'string') errors.push('agentRun.id is required.');
  if (!agentRun.agentId || typeof agentRun.agentId !== 'string') errors.push('agentRun.agentId is required.');
  if (!VALID_INPUT_SOURCES.includes(agentRun.inputSource)) errors.push(`agentRun.inputSource must be one of: ${VALID_INPUT_SOURCES.join(', ')}.`);
  if (!VALID_RUN_STATUSES.includes(agentRun.status)) errors.push(`agentRun.status must be one of: ${VALID_RUN_STATUSES.join(', ')}.`);
  if (typeof agentRun.summary !== 'string') errors.push('agentRun.summary must be a string.');
  if (!agentRun.createdAt) errors.push('agentRun.createdAt is required.');

  errors.push(...scanArrayForIssues(agentRun.findings, 'findings'));
  errors.push(...scanArrayForIssues(agentRun.warnings, 'warnings'));
  errors.push(...scanArrayForIssues(agentRun.blockers, 'blockers'));
  errors.push(...scanArrayForIssues(agentRun.recommendations, 'recommendations'));
  errors.push(...scanArrayForIssues(agentRun.nextActions, 'nextActions'));
  errors.push(...scanArrayForIssues(agentRun.safetyFlags, 'safetyFlags'));

  if (containsSecret(agentRun.summary)) errors.push('agentRun.summary contains a potential secret.');

  return { valid: errors.length === 0, errors };
}

// ─── validateRecommendation ──────────────────────────────────────────────────

export function validateRecommendation(rec) {
  const errors = [];
  if (!rec || typeof rec !== 'object') return { valid: false, errors: ['recommendation must be a non-null object.'] };

  if (!rec.id || typeof rec.id !== 'string') errors.push('recommendation.id is required.');
  if (!rec.agentId || typeof rec.agentId !== 'string') errors.push('recommendation.agentId is required.');
  if (!rec.title || rec.title.trim().length < 2) errors.push('recommendation.title must be at least 2 characters.');
  if (!rec.description || rec.description.trim().length < 2) errors.push('recommendation.description is required.');
  if (!VALID_PRIORITIES.includes(rec.priority)) errors.push(`recommendation.priority must be: ${VALID_PRIORITIES.join(', ')}.`);
  if (!VALID_CATEGORIES.includes(rec.category)) errors.push(`recommendation.category must be: ${VALID_CATEGORIES.join(', ')}.`);
  if (!VALID_REC_STATUSES.includes(rec.status)) errors.push(`recommendation.status must be: ${VALID_REC_STATUSES.join(', ')}.`);
  if (!rec.createdAt) errors.push('recommendation.createdAt is required.');
  if (!rec.updatedAt) errors.push('recommendation.updatedAt is required.');

  if (containsSecret(rec.title))       errors.push('recommendation.title contains a potential secret.');
  if (containsSecret(rec.description)) errors.push('recommendation.description contains a potential secret.');
  if (containsDemoLanguage(rec.title) || containsDemoLanguage(rec.description)) {
    errors.push('recommendation contains forbidden production language.');
  }

  return { valid: errors.length === 0, errors };
}

// ─── validateAgentSystem ─────────────────────────────────────────────────────

export function validateAgentSystem(agentSystem) {
  const errors = [];
  if (!agentSystem || typeof agentSystem !== 'object') return { valid: false, errors: ['agentSystem must be a non-null object.'] };

  if (!['ready', 'error', 'disabled'].includes(agentSystem.status)) errors.push('agentSystem.status must be ready/error/disabled.');
  if (!['local-advisory'].includes(agentSystem.mode)) errors.push('agentSystem.mode must be "local-advisory" in Run 3.');
  if (agentSystem.autonomyEnabled !== false) errors.push('agentSystem.autonomyEnabled must be false.');
  if (!Array.isArray(agentSystem.recommendationQueue)) errors.push('agentSystem.recommendationQueue must be an array.');
  if (!Array.isArray(agentSystem.agentRuns)) errors.push('agentSystem.agentRuns must be an array.');

  return { valid: errors.length === 0, errors };
}

// ─── validateAgentPermissions ────────────────────────────────────────────────

export function validateAgentPermissions(permissions) {
  const errors = [];
  if (!permissions || typeof permissions !== 'object') return { valid: false, errors: ['permissions must be a non-null object.'] };

  if (permissions.allowFileEdits !== false)          errors.push('permissions.allowFileEdits must be false.');
  if (permissions.allowExternalApiCalls !== false)   errors.push('permissions.allowExternalApiCalls must be false.');
  if (permissions.allowDestructiveActions !== false) errors.push('permissions.allowDestructiveActions must be false.');
  if (permissions.requireUserApproval !== true)      errors.push('permissions.requireUserApproval must be true.');

  return { valid: errors.length === 0, errors };
}

// ─── validateAgentOutputSafety ───────────────────────────────────────────────

export function validateAgentOutputSafety(output) {
  const errors = [];
  if (!output || typeof output !== 'object') return { valid: false, errors: ['output must be a non-null object.'] };

  const allFields = ['summary', ...((output.findings || []))
    , ...(output.warnings || []), ...(output.blockers || [])
    , ...(output.recommendations || []), ...(output.nextActions || [])
    , ...(output.safetyFlags || [])];

  for (const text of allFields) {
    if (typeof text !== 'string') continue;
    if (containsSecret(text))       errors.push('Output contains a potential secret value.');
    if (containsDemoLanguage(text)) errors.push('Output contains forbidden production language.');
  }

  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}
