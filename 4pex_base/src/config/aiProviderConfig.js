// 4P3X External AI Provider Configuration
// RUN 1 — Supported provider slot definitions.
// No providers are called automatically.
// Users must manually configure and test.

const aiProviderConfig = [
  {
    id: 'none',
    label: 'None (Disabled)',
    description: 'No external AI provider configured. Internal config agents only.',
    requiresApiKey: false,
    requiresBaseUrl: false,
    supportsLocalOnly: true,
    clientSafe: true,
    keyStorageWarning: false,
    defaultModelPlaceholder: '',
    enabledByDefault: true,
  },
  {
    id: 'openai',
    label: 'OpenAI',
    description: 'OpenAI GPT models via the OpenAI API.',
    requiresApiKey: true,
    requiresBaseUrl: false,
    supportsLocalOnly: false,
    clientSafe: false,
    keyStorageWarning: true,
    keyStorageWarningMessage:
      'Browser localStorage is not secure for production secrets. Use a backend proxy or server-side secret storage for production AI API keys.',
    defaultModelPlaceholder: 'gpt-4o',
    enabledByDefault: false,
  },
  {
    id: 'anthropic',
    label: 'Anthropic (Claude)',
    description: 'Anthropic Claude models via the Anthropic API.',
    requiresApiKey: true,
    requiresBaseUrl: false,
    supportsLocalOnly: false,
    clientSafe: false,
    keyStorageWarning: true,
    keyStorageWarningMessage:
      'Browser localStorage is not secure for production secrets. Use a backend proxy or server-side secret storage for production AI API keys.',
    defaultModelPlaceholder: 'claude-3-5-sonnet-20241022',
    enabledByDefault: false,
  },
  {
    id: 'google',
    label: 'Google Gemini',
    description: 'Google Gemini models via the Google AI API.',
    requiresApiKey: true,
    requiresBaseUrl: false,
    supportsLocalOnly: false,
    clientSafe: false,
    keyStorageWarning: true,
    keyStorageWarningMessage:
      'Browser localStorage is not secure for production secrets. Use a backend proxy or server-side secret storage for production AI API keys.',
    defaultModelPlaceholder: 'gemini-1.5-pro',
    enabledByDefault: false,
  },
  {
    id: 'groq',
    label: 'Groq',
    description: 'Fast inference models via the Groq API.',
    requiresApiKey: true,
    requiresBaseUrl: false,
    supportsLocalOnly: false,
    clientSafe: false,
    keyStorageWarning: true,
    keyStorageWarningMessage:
      'Browser localStorage is not secure for production secrets. Use a backend proxy or server-side secret storage for production AI API keys.',
    defaultModelPlaceholder: 'llama-3.1-70b-versatile',
    enabledByDefault: false,
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    description: 'Multiple AI models via the OpenRouter unified API.',
    requiresApiKey: true,
    requiresBaseUrl: false,
    supportsLocalOnly: false,
    clientSafe: false,
    keyStorageWarning: true,
    keyStorageWarningMessage:
      'Browser localStorage is not secure for production secrets. Use a backend proxy or server-side secret storage for production AI API keys.',
    defaultModelPlaceholder: 'openai/gpt-4o',
    enabledByDefault: false,
  },
  {
    id: 'ollama',
    label: 'Ollama (Local)',
    description: 'Self-hosted local AI models via Ollama. No API key required.',
    requiresApiKey: false,
    requiresBaseUrl: true,
    supportsLocalOnly: true,
    clientSafe: true,
    keyStorageWarning: false,
    defaultModelPlaceholder: 'llama3.2',
    baseUrlPlaceholder: 'http://localhost:11434',
    enabledByDefault: false,
  },
  {
    id: 'customEndpoint',
    label: 'Custom Endpoint',
    description: 'A custom AI-compatible API endpoint. Requires user confirmation and base URL.',
    requiresApiKey: false,
    requiresBaseUrl: true,
    supportsLocalOnly: false,
    clientSafe: false,
    keyStorageWarning: true,
    keyStorageWarningMessage:
      'Custom endpoints may handle sensitive data. Ensure the endpoint is trusted before saving any credentials.',
    defaultModelPlaceholder: 'custom-model',
    baseUrlPlaceholder: 'https://your-endpoint.example.com/v1',
    requiresUserConfirmation: true,
    enabledByDefault: false,
  },
];

/**
 * Get provider config by id.
 */
export function getProviderById(id) {
  return aiProviderConfig.find((p) => p.id === id) || null;
}

export default aiProviderConfig;
