// 4P3X Agent Safety — RUN 3
// All agent output passes through this layer before being stored or displayed.
// Nothing in this file calls external APIs or modifies state.

const FORBIDDEN_SECRET_PATTERNS_KEYS = [
  'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY',
  'GOOGLE_API_KEY', 'GROQ_API_KEY', 'OPENROUTER_API_KEY',
  'STRIPE_SECRET_KEY', 'DATABASE_URL', 'JWT_SECRET', 'PRIVATE_KEY',
  'WEBHOOK_SECRET', 'ADMIN_TOKEN', '_rawKey', 'apiKey', 'secretKey',
  'accessToken', 'refreshToken', 'serviceRoleKey',
];

const FORBIDDEN_SECRET_VALUE_RE = [
  /sk-[a-zA-Z0-9\-_]{20,}/,
  /eyJ[a-zA-Z0-9+/=._-]{20,}/,
  /sb_[a-zA-Z0-9\-_]{20,}/,
  /xoxb-[0-9]+-[a-zA-Z0-9\-]+/,
  /AIza[a-zA-Z0-9\-_]{35,}/,
  /ghp_[a-zA-Z0-9]{36,}/,
];

const FORBIDDEN_ACTION_KEYWORDS = [
  'edit file', 'edit files', 'rewrite storage', 'rewrite code', 'delete file',
  'deploy to', 'call api automatically', 'call external', 'run autonomously',
  'auto-call', 'uncontrolled autonomy', 'modify blueprint directly',
  'overwrite existing', 'destructive action',
];

const FORBIDDEN_DEMO_WORDS = [
  'demo', 'mock data', 'fake data', 'dummy data', 'toy app', 'sample-only',
  'simulated product', 'placeholder app', 'throwaway prototype',
];

const FORBIDDEN_UNSAFE_PATTERNS = [
  'exploit vulnerability', 'offensive security', 'attack simulation',
  'proprietary clone', 'clone proprietary', 'replicate third-party branding',
  'legal certainty', 'guaranteed legal', 'legally approved',
];

/**
 * Scan a string for embedded secret values.
 * Returns array of warning strings.
 */
function scanStringForSecrets(str) {
  const warnings = [];
  if (typeof str !== 'string') return warnings;
  for (const re of FORBIDDEN_SECRET_VALUE_RE) {
    if (re.test(str)) {
      warnings.push(`Potential secret value detected and blocked (pattern: ${re.toString().slice(1, 20)}…)`);
    }
  }
  for (const key of FORBIDDEN_SECRET_PATTERNS_KEYS) {
    if (str.toUpperCase().includes(key.toUpperCase())) {
      warnings.push(`Forbidden secret key name detected: "${key}"`);
    }
  }
  return warnings;
}

/**
 * Sanitize a string — redact secret values.
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  let s = str;
  for (const re of FORBIDDEN_SECRET_VALUE_RE) {
    s = s.replace(new RegExp(re.source, 'g'), '••••••••');
  }
  return s;
}

/**
 * Sanitize an array of strings.
 */
function sanitizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(sanitizeString);
}

/**
 * Sanitize a full agent output object.
 * Returns a clean copy — never mutates input.
 */
export function sanitizeAgentOutput(output) {
  if (!output || typeof output !== 'object') return output;
  return {
    summary:         sanitizeString(output.summary || ''),
    findings:        sanitizeArray(output.findings),
    warnings:        sanitizeArray(output.warnings),
    blockers:        sanitizeArray(output.blockers),
    recommendations: sanitizeArray(output.recommendations),
    nextActions:     sanitizeArray(output.nextActions),
    safetyFlags:     sanitizeArray(output.safetyFlags),
  };
}

/**
 * Detect secrets in agent output.
 * Returns array of warning strings.
 */
export function detectSecretsInAgentOutput(output) {
  const warnings = [];
  if (!output || typeof output !== 'object') return warnings;
  const allStrings = [
    output.summary,
    ...(output.findings || []),
    ...(output.warnings || []),
    ...(output.blockers || []),
    ...(output.recommendations || []),
    ...(output.nextActions || []),
    ...(output.safetyFlags || []),
  ].filter(Boolean);

  for (const s of allStrings) {
    warnings.push(...scanStringForSecrets(s));
  }
  return [...new Set(warnings)];
}

/**
 * Detect if a proposed action is forbidden.
 * Returns { forbidden: boolean, reason: string | null }
 */
export function detectForbiddenAgentAction(action) {
  if (!action || typeof action !== 'string') return { forbidden: false, reason: null };
  const lower = action.toLowerCase();

  for (const kw of FORBIDDEN_ACTION_KEYWORDS) {
    if (lower.includes(kw)) {
      return { forbidden: true, reason: `Forbidden action keyword: "${kw}"` };
    }
  }
  for (const kw of FORBIDDEN_UNSAFE_PATTERNS) {
    if (lower.includes(kw)) {
      return { forbidden: true, reason: `Unsafe pattern: "${kw}"` };
    }
  }
  return { forbidden: false, reason: null };
}

/**
 * Enforce no-autonomy rule on an agent config object.
 * Returns { safe: boolean, violations: string[] }
 */
export function enforceNoAutonomy(agent) {
  const violations = [];
  if (!agent) return { safe: false, violations: ['No agent provided.'] };
  if (agent.autonomyAllowed === true)          violations.push('autonomyAllowed must be false.');
  if (agent.fileEditAllowed === true)          violations.push('fileEditAllowed must be false.');
  if (agent.externalApiCallsAllowed === true)  violations.push('externalApiCallsAllowed must be false.');
  if (agent.destructiveActionsAllowed === true) violations.push('destructiveActionsAllowed must be false.');
  return { safe: violations.length === 0, violations };
}

/**
 * Enforce no demo/mock/fake language in output.
 * Returns array of violations found.
 */
export function enforceNoDemoLanguage(output) {
  const violations = [];
  if (!output) return violations;
  const allText = typeof output === 'string'
    ? output
    : JSON.stringify(output);
  const lower = allText.toLowerCase();
  for (const word of FORBIDDEN_DEMO_WORDS) {
    if (lower.includes(word)) {
      violations.push(`Forbidden demo language: "${word}"`);
    }
  }
  return violations;
}

/**
 * Full output validation.
 * Returns { valid: boolean, errors: string[], sanitized: object }
 */
export function validateAgentOutput(output) {
  const errors = [];

  if (!output || typeof output !== 'object') {
    return { valid: false, errors: ['Output must be a non-null object.'], sanitized: null };
  }
  if (typeof output.summary !== 'string') errors.push('Output must have a summary string.');
  if (!Array.isArray(output.findings))     errors.push('Output must have a findings array.');
  if (!Array.isArray(output.warnings))     errors.push('Output must have a warnings array.');
  if (!Array.isArray(output.blockers))     errors.push('Output must have a blockers array.');
  if (!Array.isArray(output.recommendations)) errors.push('Output must have a recommendations array.');
  if (!Array.isArray(output.nextActions))  errors.push('Output must have a nextActions array.');
  if (!Array.isArray(output.safetyFlags))  errors.push('Output must have a safetyFlags array.');

  const secretWarnings = detectSecretsInAgentOutput(output);
  if (secretWarnings.length > 0) errors.push(...secretWarnings);

  const demoViolations = enforceNoDemoLanguage(output);
  if (demoViolations.length > 0) errors.push(...demoViolations);

  const sanitized = sanitizeAgentOutput(output);
  return { valid: errors.length === 0, errors, sanitized };
}
