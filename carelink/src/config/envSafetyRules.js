// 4P3X Environment Safety Rules — Run 7

export const ENV_SAFETY_RULES = {
  allowedPublicPrefixes: ['VITE_PUBLIC_', 'VITE_APP_'],

  forbiddenSecretNames: [
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
    'SENDGRID_API_KEY',
    'FIREBASE_SERVICE_ACCOUNT',
    'SERVICE_ROLE_KEY',
    'SECRET_KEY',
    'MASTER_KEY',
    'SIGNING_SECRET',
  ],

  envExampleRules: [
    'All values must be placeholders only (e.g. your_value_here or false).',
    'Never include real API keys, secrets, or passwords.',
    'Only VITE_PUBLIC_ or VITE_APP_ prefixed variables should be in the frontend .env.',
    'Backend-only secrets must use a future backend proxy run, never the frontend .env.',
    'The .env.example file must be safe to commit to a public repository.',
  ],

  exportSanitisationRules: [
    'Remove all raw API keys before export.',
    'Remove all backend service role keys.',
    'Remove all JWT secrets and signing keys.',
    'Replace real values with [REDACTED] if detected.',
    'Reject export if secrets cannot be safely removed.',
  ],

  frontendSafetyRules: [
    'Only client-safe environment variables should be accessed in frontend code.',
    'VITE_PUBLIC_ variables are bundled into the frontend — never put secrets there.',
    'Use an API config guard (src/config/apiConfig.js) to validate keys before use.',
    'Never hardcode API keys in source files.',
    'Never log API keys to the console.',
  ],

  backendProxyRecommendation: 'Backend-only secrets (Supabase service role, Stripe secret key, etc.) must be stored in a server-side environment in a future controlled backend run. They must never appear in the frontend bundle.',

  safeEnvExampleContent: `# 4P3X Reusable Base Structure™ — .env.example
# Safe to commit. Contains placeholder values only.
# Copy this file to .env.local and fill in your own values where required.

# ─── App Identity ─────────────────────────────────────────────
VITE_PUBLIC_APP_NAME=4P3X Reusable Base Structure
VITE_PUBLIC_APP_VERSION=1.0.0
VITE_PUBLIC_API_MODE=local-first
VITE_PUBLIC_ENABLE_AI_CONFIG=false

# ─── AI Provider (user-supplied via AI Config page) ────────────
# Never put real keys here. Users supply keys through the in-app AI Config.
VITE_PUBLIC_AI_PROVIDER=openai
# VITE_PUBLIC_OPENAI_KEY=your_openai_key_here  ← user-supplied only

# ─── Future Supabase (backend run only — NOT frontend) ─────────
# SUPABASE_URL=https://your-project.supabase.co  ← backend only
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  ← NEVER in frontend

# ─── Build ────────────────────────────────────────────────────
VITE_PUBLIC_BUILD_MODE=production
`,
};

export function isForbiddenSecretName(name) {
  return ENV_SAFETY_RULES.forbiddenSecretNames.some(
    (f) => name.toUpperCase().includes(f) || f.includes(name.toUpperCase())
  );
}

export function isClientSafeEnvVar(name) {
  return ENV_SAFETY_RULES.allowedPublicPrefixes.some((prefix) => name.startsWith(prefix));
}

export default ENV_SAFETY_RULES;
