// 4P3X External AI API Configuration page — RUN 1

import React, { useState, useEffect } from 'react';
import aiProviderConfig, { getProviderById } from '../config/aiProviderConfig.js';
import agentRegistry, { getActiveAgents, getReservedAgents } from '../config/agentRegistry.js';
import {
  getState,
  subscribe,
  saveAiProviderConfig,
  clearAiProviderConfig,
  testAiProviderConfig,
  maskApiKey,
} from '../state/storage.js';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';

const TEST_STATUS_VARIANT = {
  not_tested: 'neutral',
  testing:    'info',
  success:    'active',
  failed:     'error',
  disabled:   'neutral',
};

export function AiConfig() {
  const [appState, setAppState] = useState(() => getState());
  const [form, setForm] = useState({
    provider: appState.aiSettings?.provider || 'none',
    model:    appState.aiSettings?.model || '',
    apiKey:   '',
    baseUrl:  appState.aiSettings?.baseUrl || '',
  });
  const [message, setMessage] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const unsub = subscribe((s) => setAppState({ ...s }));
    return unsub;
  }, []);

  const providerMeta = getProviderById(form.provider);
  const aiSettings = appState.aiSettings || {};
  const activeAgents = getActiveAgents();
  const reservedAgents = getReservedAgents();

  function handleSave() {
    if (!form.provider) {
      setMessage({ type: 'error', text: 'Please select a provider.' });
      return;
    }

    const result = saveAiProviderConfig({
      provider:      form.provider,
      model:         form.model,
      apiKey:        form.apiKey,
      baseUrl:       form.baseUrl,
      localOnlyMode: form.provider === 'none' || form.provider === 'ollama',
    });

    if (result.ok) {
      setMessage({ type: 'success', text: 'Configuration saved.' });
      setForm((f) => ({ ...f, apiKey: '' })); // clear raw key from form
      setTestResult(null);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }

  function handleTest() {
    setMessage(null);
    setTestResult(null);

    const result = testAiProviderConfig({
      provider: form.provider,
      apiKey:   form.apiKey || undefined,
      baseUrl:  form.baseUrl || undefined,
    });

    setTestResult(result);
    setMessage({
      type: result.ok ? 'success' : 'error',
      text: result.ok
        ? 'Validation passed. Provider config looks good.'
        : 'Validation failed: ' + result.errors.join(' '),
    });
  }

  function handleClear() {
    clearAiProviderConfig();
    setForm({ provider: 'none', model: '', apiKey: '', baseUrl: '' });
    setMessage({ type: 'success', text: 'AI configuration cleared.' });
    setTestResult(null);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">External AI API Configuration</div>
        <div className="page-subtitle">
          Configure an external AI provider. No provider is called automatically.
          RUN 1 performs safe local validation only.
        </div>
      </div>

      {/* Security warning */}
      <div className="alert alert-warn" style={{ marginBottom: 20 }}>
        <strong>⚠ Security Notice:</strong> Browser localStorage is not secure for production secrets.
        Use a backend proxy or server-side secret storage for production AI API keys.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* Main config form */}
        <div>
          <Card>
            {/* Provider */}
            <div className="form-group">
              <label className="form-label">AI Provider</label>
              <select
                className="form-input"
                value={form.provider}
                onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value, apiKey: '', model: '' }))}
              >
                {aiProviderConfig.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              {providerMeta?.description && (
                <div className="form-hint">{providerMeta.description}</div>
              )}
            </div>

            {/* Model */}
            {form.provider !== 'none' && (
              <div className="form-group">
                <label className="form-label">Model Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={form.model}
                  placeholder={providerMeta?.defaultModelPlaceholder || 'Enter model name…'}
                  onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                />
              </div>
            )}

            {/* API Key */}
            {providerMeta?.requiresApiKey && (
              <div className="form-group">
                <label className="form-label">API Key</label>
                <input
                  className="form-input"
                  type="password"
                  value={form.apiKey}
                  placeholder={
                    aiSettings.apiKeyConfigured
                      ? `Saved: ${aiSettings.apiKeyMasked} — enter new key to replace`
                      : 'Enter API key…'
                  }
                  autoComplete="off"
                  onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                />
                {providerMeta.keyStorageWarning && (
                  <div className="form-warning">{providerMeta.keyStorageWarningMessage}</div>
                )}
              </div>
            )}

            {/* Base URL */}
            {providerMeta?.requiresBaseUrl && (
              <div className="form-group">
                <label className="form-label">Base URL</label>
                <input
                  className="form-input"
                  type="text"
                  value={form.baseUrl}
                  placeholder={providerMeta?.baseUrlPlaceholder || 'https://…'}
                  onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Config
              </button>
              <button className="btn btn-green" onClick={handleTest}>
                Test Connection
              </button>
              <button className="btn btn-danger" onClick={handleClear}>
                Clear Config
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}
                style={{ marginTop: 14 }}>
                {message.text}
              </div>
            )}
          </Card>
        </div>

        {/* Status sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Current provider status */}
          <Card>
            <div className="card-title">Provider Status</div>
            <div className="row-between" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Provider</span>
              <Badge variant={aiSettings.provider !== 'none' ? 'active' : 'neutral'}>
                {aiSettings.provider || 'none'}
              </Badge>
            </div>
            <div className="row-between" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>API Key</span>
              <span style={{ fontSize: 12, color: aiSettings.apiKeyConfigured ? 'var(--green-bright)' : 'var(--text-muted)' }}>
                {aiSettings.apiKeyConfigured ? aiSettings.apiKeyMasked : '—'}
              </span>
            </div>
            <div className="row-between" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Model</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{aiSettings.model || '—'}</span>
            </div>
            <div className="row-between">
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Test Status</span>
              <Badge variant={TEST_STATUS_VARIANT[aiSettings.testStatus] || 'neutral'}>
                {aiSettings.testStatus || 'not_tested'}
              </Badge>
            </div>
          </Card>

          {/* apiConfigAgent */}
          {activeAgents.map((agent) => (
            <Card key={agent.id} variant="green">
              <div className="row-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-bright)' }}>{agent.name}</span>
                <Badge variant="active">Active</Badge>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                {agent.description}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Allowed: {agent.allowedActions.join(', ')}
              </div>
            </Card>
          ))}

          {/* Reserved agents preview */}
          <Card>
            <div className="card-title">Reserved AI Agents</div>
            {reservedAgents.slice(0, 4).map((agent) => (
              <div key={agent.id} className="row-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{agent.name}</span>
                <Badge variant="reserved">Run {agent.runToBuild}</Badge>
              </div>
            ))}
            {reservedAgents.length > 4 && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                +{reservedAgents.length - 4} more reserved agents
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AiConfig;
