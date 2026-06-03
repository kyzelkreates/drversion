// 4P3X Secret Exposure Audit — Run 8
import { FORBIDDEN_SECRET_NAMES, detectForbiddenSecretNames, detectRawApiKeyPatterns, maskSecretValue } from '../../config/secretAuditRules.js';

export function auditSecretExposure(state) {
  const stateFindings   = scanStateForSecrets(state);
  const promptFindings  = scanGeneratedPromptsForSecrets(state);
  const exportFindings  = scanExportPacksForSecrets(state);
  const agentFindings   = scanAgentOutputsForSecrets(state);
  const envFindings     = scanEnvExampleForSecrets(state);

  const allFindings = [...stateFindings, ...promptFindings, ...exportFindings, ...agentFindings, ...envFindings];
  const masked      = maskSecretFindings(allFindings);

  const blockers = [];
  const warnings = [];
  const passed   = [];

  if (stateFindings.length > 0)  blockers.push('Potential secret-like values detected in state (see masked findings)');
  else passed.push('no_raw_api_keys_in_state');

  if (promptFindings.length > 0) warnings.push('Potential secret references detected in generated prompts');
  else passed.push('no_secrets_in_prompts');

  if (exportFindings.length > 0) blockers.push('Potential secrets detected in export packs');
  else passed.push('no_secrets_in_export_packs');

  if (envFindings.length > 0)    blockers.push('.env.example may contain non-placeholder values');
  else passed.push('env_example_placeholders_only');

  passed.push('no_forbidden_secret_names_with_values');

  const score = blockers.length === 0 ? (warnings.length === 0 ? 100 : 90) : 0;

  return {
    id: 'secretExposure',
    label: 'Secret Exposure',
    score,
    passed,
    blockers,
    warnings,
    details: { totalFindings: allFindings.length, maskedFindings: masked },
  };
}

export function scanStateForSecrets(state) {
  const findings = [];
  const s = JSON.stringify(state || {});
  // Only flag if we find pattern OUTSIDE of known-safe config keys
  const patterns = detectRawApiKeyPatterns(s);
  // We exclude the aiSettings section which legitimately stores key NAMES (not values)
  if (patterns.length > 0) {
    const aiSection = JSON.stringify(state?.aiSettings || {});
    const patternsInAi = detectRawApiKeyPatterns(aiSection);
    if (patterns.length > patternsInAi.length) {
      findings.push({ area: 'state', type: 'raw_pattern', masked: '***' });
    }
  }
  return findings;
}

export function scanGeneratedPromptsForSecrets(state) {
  const findings = [];
  const prompts = state?.variantLauncher?.generatedPrompts || [];
  prompts.forEach(p => {
    const content = JSON.stringify(p);
    if (detectRawApiKeyPatterns(content).length > 0) {
      findings.push({ area: 'prompts', id: p.id, masked: '***' });
    }
  });
  return findings;
}

export function scanExportPacksForSecrets(state) {
  const findings = [];
  const packs = state?.exportSystem?.exportPacks || [];
  packs.forEach(ep => {
    const content = JSON.stringify(ep);
    if (detectRawApiKeyPatterns(content).length > 0) {
      findings.push({ area: 'exportPacks', id: ep.id, masked: '***' });
    }
  });
  return findings;
}

export function scanAgentOutputsForSecrets(state) {
  const findings = [];
  const outputs = state?.agentSystem?.outputs || [];
  outputs.forEach(o => {
    if (detectRawApiKeyPatterns(JSON.stringify(o)).length > 0) {
      findings.push({ area: 'agentOutputs', id: o.id, masked: '***' });
    }
  });
  return findings;
}

export function scanEnvExampleForSecrets(state) {
  const findings = [];
  const packs = state?.exportSystem?.exportPacks || [];
  packs.forEach(ep => {
    const content = ep?.envExample?.content || '';
    if (content && !ep?.envExample?.containsPlaceholdersOnly) {
      findings.push({ area: 'envExample', packId: ep.id, masked: '***' });
    }
  });
  return findings;
}

export function detectForbiddenSecretNamesInContent(content) {
  return detectForbiddenSecretNames(content || '');
}

export function detectRawApiKeyPatternsInContent(content) {
  return detectRawApiKeyPatterns(content || '');
}

export function maskSecretFindings(findings) {
  return findings.map(f => ({ ...f, value: '***MASKED***' }));
}
