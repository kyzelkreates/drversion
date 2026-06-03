// 4P3X API Integration Planner — RUN 4

const CLIENT_SAFE_PROVIDERS = ['openai_chat_client', 'openrouter', 'anthropic_client', 'groq', 'cohere', 'mistral'];
const BACKEND_PROXY_REQUIRED = ['stripe', 'supabase_service', 'sendgrid', 'twilio', 'aws_s3', 'firebase_admin'];

export function planApiIntegrations(blueprint, aiSettings) {
  const needs    = blueprint?.apiIntegrationNeeds || [];
  const aiProv   = aiSettings?.selectedProvider || null;
  const allProviders = [...new Set([...needs, ...(aiProv ? [aiProv] : [])])];

  const providers         = allProviders.map(String);
  const clientSafe        = detectClientSafeProviders(providers);
  const backendRequired   = detectBackendProxyRequirements(providers);
  const secretRisks       = detectForbiddenSecretRisks(providers);
  const missingConfig     = planMissingApiConfig(providers, aiSettings);

  // Build requiredKeys list (masked names only — never raw values)
  const requiredKeys = providers.map(p => ({
    provider: p,
    keyName: `${p.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY`,
    clientSafe: clientSafe.includes(p),
    backendProxy: backendRequired.includes(p),
    storageNote: 'Stored in aiSettings via AI Config page only — never hardcoded',
  }));

  return {
    providers,
    requiredKeys,
    clientSafeOnly: backendRequired.length === 0,
    backendProxyRequired: backendRequired.length > 0,
    secretRisks,
    missingConfig,
    runToBuild: backendRequired.length > 0 ? 'Run 6+' : 'Run 5',
  };
}

export function detectClientSafeProviders(providers) {
  return providers.filter(p => CLIENT_SAFE_PROVIDERS.includes(p.toLowerCase()));
}

export function detectBackendProxyRequirements(providers) {
  return providers.filter(p => BACKEND_PROXY_REQUIRED.includes(p.toLowerCase()));
}

export function detectForbiddenSecretRisks(providers) {
  const risks = [];
  for (const p of providers) {
    if (BACKEND_PROXY_REQUIRED.includes(p.toLowerCase())) {
      risks.push({
        provider: p,
        risk: `"${p}" requires backend-only secret keys. These must NOT be exposed client-side.`,
        mitigation: `Implement a backend proxy run before activating "${p}" integration.`,
      });
    }
  }
  return risks;
}

export function planMissingApiConfig(providers, aiSettings) {
  const missing = [];
  const configured = aiSettings?.selectedProvider ? [aiSettings.selectedProvider] : [];

  for (const p of providers) {
    if (!configured.includes(p)) {
      missing.push({
        provider: p,
        message: `"${p}" is required but not configured in AI Config.`,
        action: 'Configure via AI Config page before this integration can be used.',
      });
    }
  }
  return missing;
}
