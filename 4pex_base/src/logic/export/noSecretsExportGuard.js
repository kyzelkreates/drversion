// 4P3X No-Secrets Export Guard — Run 7

import { ENV_SAFETY_RULES } from '../../config/envSafetyRules.js';

const SECRET_PATTERNS = [
  { id: 'raw_sk_key',     pattern: /sk-[a-zA-Z0-9]{20,}/g,                  label: 'Raw OpenAI-style secret key' },
  { id: 'raw_jwt',        pattern: /eyJ[a-zA-Z0-9._-]{50,}/g,               label: 'Raw JWT token' },
  { id: 'service_role',   pattern: /service_role_key\s*=\s*["'][^"']+["']/gi, label: 'Supabase service role key' },
  { id: 'supabase_key',   pattern: /supabase_service_role\s*=\s*["'][^"']+["']/gi, label: 'Supabase key assignment' },
  { id: 'stripe_secret',  pattern: /sk_live_[a-zA-Z0-9]{20,}/g,             label: 'Stripe live secret key' },
  { id: 'stripe_test',    pattern: /sk_test_[a-zA-Z0-9]{20,}/g,             label: 'Stripe test secret key' },
  { id: 'private_key_pem',pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/,label: 'PEM private key' },
];

export function scanExportForSecrets(exportContent) {
  const text = typeof exportContent === 'object' ? JSON.stringify(exportContent) : String(exportContent);
  const findings = [];

  for (const { id, pattern, label } of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) findings.push({ id, label, severity: 'critical' });
  }

  const upperText = text.toUpperCase();
  for (const name of ENV_SAFETY_RULES.forbiddenSecretNames) {
    if (upperText.includes(name + '=') || upperText.includes(name + ' =') || upperText.includes(name + ':')) {
      if (!findings.some((f) => f.id === `forbidden_${name}`)) {
        findings.push({ id: `forbidden_${name}`, label: `Forbidden secret name: ${name}`, severity: 'critical' });
      }
    }
  }

  return { passed: findings.length === 0, findings };
}

export function detectRawApiKeys(exportContent) {
  const text = typeof exportContent === 'object' ? JSON.stringify(exportContent) : String(exportContent);
  return SECRET_PATTERNS.filter(({ pattern }) => { pattern.lastIndex = 0; return pattern.test(text); }).map((p) => p.label);
}

export function detectForbiddenSecretNames(exportContent) {
  const text = (typeof exportContent === 'object' ? JSON.stringify(exportContent) : String(exportContent)).toUpperCase();
  return ENV_SAFETY_RULES.forbiddenSecretNames.filter((n) => text.includes(n + '=') || text.includes(n + ':'));
}

export function maskSensitiveValues(exportContent) {
  let text = typeof exportContent === 'string' ? exportContent : JSON.stringify(exportContent, null, 2);
  for (const { pattern } of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    text = text.replace(pattern, '[REDACTED]');
  }
  return text;
}

export function validateNoSecretsExport(exportContent) {
  const result = scanExportForSecrets(exportContent);
  return { valid: result.passed, findings: result.findings };
}

export function explainSecretFindings(findings) {
  if (!findings || findings.length === 0) return '✓ No secrets detected.';
  return findings.map((f) => `⛔ ${f.label} — ${f.severity}`).join('\n');
}
