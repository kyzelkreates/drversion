// 4P3X CareLink Dashboard™ — API Config Guard
// Prevents unsafe secrets from being exposed in frontend code.

const FORBIDDEN_ENV_KEYS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'GROQ_API_KEY',
  'STRIPE_SECRET_KEY',
  'DATABASE_URL',
  'JWT_SECRET',
  'PRIVATE_KEY',
  'WEBHOOK_SECRET',
];

export function checkForExposedSecrets(config = {}) {
  const violations = [];
  for (const key of FORBIDDEN_ENV_KEYS) {
    if (config[key] || (typeof window !== 'undefined' && window[key])) {
      violations.push(key);
    }
  }
  if (violations.length > 0) {
    console.error('[4P3X Guard] UNSAFE: Exposed secrets detected:', violations);
  }
  return { safe: violations.length === 0, violations };
}

export function assertSafeConfig(config = {}) {
  const { safe, violations } = checkForExposedSecrets(config);
  if (!safe) throw new Error(`[4P3X Guard] Unsafe config: ${violations.join(', ')}`);
}

export default { checkForExposedSecrets, assertSafeConfig };
