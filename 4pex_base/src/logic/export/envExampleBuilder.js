// 4P3X Env Example Builder — Run 7

import { ENV_SAFETY_RULES } from '../../config/envSafetyRules.js';

export function generateEnvExample(_state) {
  return ENV_SAFETY_RULES.safeEnvExampleContent;
}

export function generateClientSafeEnvExample(state) {
  const appName = state?.activeVariant?.appName || '4P3X Reusable Base Structure';
  return `# 4P3X Reusable Base Structure™ — .env.example
# Safe to commit. Placeholder values only.

VITE_PUBLIC_APP_NAME=${appName}
VITE_PUBLIC_APP_VERSION=1.0.0
VITE_PUBLIC_API_MODE=local-first
VITE_PUBLIC_ENABLE_AI_CONFIG=false
VITE_PUBLIC_BUILD_MODE=production
`;
}

export function blockForbiddenSecretNames(envContent) {
  let content = envContent;
  for (const name of ENV_SAFETY_RULES.forbiddenSecretNames) {
    const re = new RegExp(`^(${name}\\s*=\\s*)(.+)$`, 'gmi');
    content = content.replace(re, `$1[BLOCKED_SECRET]`);
  }
  return content;
}

export function validateEnvExample(envContent) {
  const lines = envContent.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  const issues = [];

  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    const value = rest.join('=').trim();

    if (!key) continue;
    const keyUpper = key.trim().toUpperCase();

    // Check for forbidden names
    if (ENV_SAFETY_RULES.forbiddenSecretNames.some((f) => keyUpper.includes(f))) {
      if (value && !['your_value_here', '[placeholder]', '', 'false', 'true'].some((p) => value.toLowerCase().includes(p))) {
        issues.push(`Forbidden secret key with non-placeholder value: ${key.trim()}`);
      }
    }

    // Check for obvious real secrets
    if (/^sk-[a-zA-Z0-9]{20,}$/.test(value) || /^eyJ[a-zA-Z0-9._-]{50,}$/.test(value)) {
      issues.push(`Real API key detected in .env.example for key: ${key.trim()}`);
    }
  }

  return { valid: issues.length === 0, issues };
}

export function explainEnvSafety(_envContent) {
  return [
    ...ENV_SAFETY_RULES.envExampleRules,
    ENV_SAFETY_RULES.backendProxyRecommendation,
  ];
}
