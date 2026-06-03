// 4P3X Secret Audit Rules — Run 8
// These names may appear ONLY inside forbidden lists, safety rules, warnings, or documentation.
// They must NEVER appear with real values anywhere in the app.

export const FORBIDDEN_SECRET_NAMES = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GOOGLE_API_KEY',
  'GROQ_API_KEY',
  'OPENROUTER_API_KEY',
  'STRIPE_SECRET_KEY',
  'DATABASE_URL',
  'JWT_SECRET',
  'PRIVATE_KEY',
  'WEBHOOK_SECRET',
  'ADMIN_TOKEN',
];

// Regex patterns that suggest a raw API key value
export const RAW_API_KEY_PATTERNS = [
  /sk-[A-Za-z0-9]{20,}/,
  /sk-ant-[A-Za-z0-9\-_]{20,}/,
  /AIza[A-Za-z0-9\-_]{35}/,
  /eyJ[A-Za-z0-9\-_]{20,}/,    // JWT
  /[A-Za-z0-9]{32,}(?=["'\s])/,  // Generic 32+ char alphanumeric (broad)
];

export const SECRET_RULES = {
  mayAppearInForbiddenListsOnly: true,
  mustNeverHaveRealValues: true,
  exportsMustMaskOrRemove: true,
  envExamplePlaceholdersOnly: true,
  frontendMustNotRequireBackendOnlySecrets: true,
  productionSecretsRequireBackendProxyInFutureRun: true,
};

export function detectForbiddenSecretNames(content = '') {
  if (!content) return [];
  return FORBIDDEN_SECRET_NAMES.filter(name => content.includes(name));
}

export function detectRawApiKeyPatterns(content = '') {
  if (!content) return [];
  return RAW_API_KEY_PATTERNS
    .filter(pattern => pattern.test(content))
    .map(p => p.toString());
}

export function maskSecretValue(value = '') {
  if (!value || value.length < 6) return '***';
  return value.slice(0, 3) + '*'.repeat(Math.min(value.length - 3, 12)) + '…';
}
