// 4P3X API Config Guard\u2122
// RUN 1 — Frontend-safe environment config detection.
// NEVER exposes backend-only secrets to the frontend.

/**
 * Forbidden backend-only secret env var names.
 * These must NEVER appear in frontend code or client-side config.
 */
export const FORBIDDEN_FRONTEND_SECRETS = [
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

/**
 * Allowed public/client-safe VITE_ env vars.
 * Only VITE_ prefixed vars are exposed by Vite to the client.
 */
export function getPublicEnvVar(key) {
  // Only allow VITE_ prefixed keys — Vite's public variable convention
  if (!key.startsWith('VITE_')) {
    console.warn(`[4P3X API Guard] Blocked: "${key}" is not a public VITE_ env var.`);
    return undefined;
  }
  // Ensure it's not accidentally a forbidden name without prefix
  const upperKey = key.replace(/^VITE_/, '').toUpperCase();
  if (FORBIDDEN_FRONTEND_SECRETS.includes(upperKey)) {
    console.warn(`[4P3X API Guard] Blocked: "${key}" resolves to a forbidden secret name.`);
    return undefined;
  }
  return import.meta.env?.[key];
}

/**
 * Check if a given key name is a forbidden backend secret.
 */
export function isForbiddenSecret(keyName) {
  if (!keyName || typeof keyName !== 'string') return false;
  const upper = keyName.toUpperCase().replace(/^VITE_/, '');
  return FORBIDDEN_FRONTEND_SECRETS.includes(upper);
}

/**
 * API Config Guard status.
 * Returns current guard status for UI display.
 */
export function getApiConfigGuardStatus() {
  return {
    guardActive: true,
    backendRequired: false,
    supabaseConnected: false,
    allowedPublicKeys: [],
    note: 'RUN 1: No API keys required. Guard is active. No secrets are configured.',
  };
}

/**
 * Safe feature flag — disable features that require unconfigured APIs.
 */
export function isFeatureAvailable(featureId) {
  const featureMap = {
    supabase: false,
    paymentGateway: false,
    externalAI: false, // Available after user manually configures in AI Config page
    webhooks: false,
    adminApi: false,
  };
  return featureMap[featureId] ?? false;
}
