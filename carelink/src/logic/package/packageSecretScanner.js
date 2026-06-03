// 4P3X Package Secret Scanner — Run 9
// Detects forbidden secret patterns and masks findings for safe reporting.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

const FORBIDDEN_SECRET_NAMES = [
  'api_key', 'apikey', 'api-key',
  'secret_key', 'secretkey', 'secret-key',
  'private_key', 'privatekey', 'private-key',
  'service_role', 'service-role', 'servicerole',
  'access_token', 'accesstoken', 'access-token',
  'bearer_token', 'bearertoken',
  'auth_token', 'authtoken',
  'client_secret', 'clientsecret',
  'webhook_secret', 'webhooksecret',
  'jwt_secret', 'jwtsecret',
  'database_url', 'databaseurl', 'db_url',
  'postgres_url', 'postgresurl',
  'mongodb_uri', 'mongodburi',
  'supabase_service_role_key',
  'stripe_secret_key',
  'openai_api_key',
  'anthropic_api_key',
  'admin_token', 'admintoken',
  'password', 'passwd',
  'credentials',
];

const RAW_KEY_PATTERNS = [
  /sk-[A-Za-z0-9]{20,}/,                          // OpenAI-style secret key
  /sk_live_[A-Za-z0-9]{20,}/,                     // Stripe live secret
  /sk_test_[A-Za-z0-9]{20,}/,                     // Stripe test secret
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,   // JWT token
  /service_role=[A-Za-z0-9._-]{20,}/i,            // Supabase service role
  /AIza[A-Za-z0-9_-]{30,}/,                       // Google API key
  /[A-Za-z0-9]{32,40}:[A-Za-z0-9]{32,64}/,       // Generic key:secret pair
  /xoxb-[0-9]+-[0-9]+-[A-Za-z0-9]+/,             // Slack bot token
  /xoxa-[0-9]+-[0-9]+-[A-Za-z0-9]+/,             // Slack app token
  /ghp_[A-Za-z0-9]{36}/,                          // GitHub personal access token
  /github_pat_[A-Za-z0-9_]{82}/,                  // GitHub fine-grained PAT
];

/**
 * Scan state for secret risks.
 * Returns { ok, findings, blockers, warnings }
 */
export function scanPackageForSecretRisks(state) {
  const stateStr = JSON.stringify(state || {});
  const findings = [];
  const blockers = [];

  const nameHits = detectForbiddenSecretNames(stateStr);
  if (nameHits.length > 0) {
    nameHits.forEach((hit) => {
      findings.push({ type: 'forbidden_name', match: hit.masked, severity: 'warning' });
    });
  }

  const patternHits = detectRawKeyPatterns(stateStr);
  if (patternHits.length > 0) {
    patternHits.forEach((hit) => {
      findings.push({ type: 'raw_key_pattern', match: hit.masked, severity: 'blocker' });
      blockers.push(`Raw secret pattern detected: ${hit.masked}`);
    });
  }

  const envHits = detectEnvFileReferences(stateStr);
  envHits.forEach((hit) => {
    findings.push({ type: 'env_reference', match: hit, severity: 'warning' });
  });

  return {
    ok: blockers.length === 0,
    findings: maskSecretFindings(findings),
    blockers,
    warnings: findings.filter((f) => f.severity === 'warning').map((f) => f.match),
  };
}

export function detectForbiddenSecretNames(content) {
  const hits = [];
  const lower = (content || '').toLowerCase();
  FORBIDDEN_SECRET_NAMES.forEach((name) => {
    if (lower.includes(name)) {
      hits.push({ raw: name, masked: `[MASKED:${name.slice(0, 4)}****]` });
    }
  });
  return hits;
}

export function detectRawKeyPatterns(content) {
  const hits = [];
  RAW_KEY_PATTERNS.forEach((pattern) => {
    const match = (content || '').match(pattern);
    if (match) {
      hits.push({ raw: match[0], masked: `[MASKED:${match[0].slice(0, 6)}****]` });
    }
  });
  return hits;
}

export function detectEnvFileReferences(content) {
  const hits = [];
  ['.env.local', '.env.production', '.env.development'].forEach((f) => {
    if ((content || '').includes(f)) hits.push(`Reference to ${f} found — verify it is excluded from package.`);
  });
  return hits;
}

export function maskSecretFindings(findings) {
  return (findings || []).map((f) => ({
    ...f,
    match: f.match ? f.match.replace(/[A-Za-z0-9_-]{8,}/g, (m) => m.slice(0, 4) + '****') : f.match,
  }));
}

export default {
  scanPackageForSecretRisks,
  detectForbiddenSecretNames,
  detectRawKeyPatterns,
  maskSecretFindings,
};
