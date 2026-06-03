// 4P3X Export Pack Sanitizer — Run 7

import { maskSensitiveValues, scanExportForSecrets } from './noSecretsExportGuard.js';

const DEMO_TERMS = [/\bdemo\s+data\b/gi, /\bmock\s+data\b/gi, /\bfake\s+data\b/gi, /\bdummy\s+data\b/gi, /\btoy\s+app\b/gi];

export function sanitizeExportPack(exportPack) {
  if (!exportPack) return null;
  const sanitized = JSON.parse(maskSensitiveValues(JSON.stringify(exportPack)));
  sanitized.envExample = sanitized.envExample
    ? { ...sanitized.envExample, content: sanitizeEnvExample(sanitized.envExample.content || '') }
    : sanitized.envExample;
  return sanitized;
}

export function sanitizeHandoffInstructions(instructions) {
  if (!instructions) return null;
  return JSON.parse(maskSensitiveValues(JSON.stringify(instructions)));
}

export function sanitizeEnvExample(envContent) {
  const { ENV_SAFETY_RULES } = require('../../config/envSafetyRules.js');
  let content = envContent;
  for (const name of ENV_SAFETY_RULES.forbiddenSecretNames) {
    const re = new RegExp(`^(${name}\\s*=\\s*)(.+)$`, 'gmi');
    content = content.replace(re, '$1[PLACEHOLDER]');
  }
  return maskSensitiveValues(content);
}

export function sanitizeLinkedAssetSummaries(assets) {
  if (!assets) return {};
  const safe = { ...assets };
  // Only keep name references, not full records
  delete safe.blueprintRecord;
  delete safe.planRecord;
  delete safe.promptRecords;
  return safe;
}

export function removeRawSecrets(value) {
  if (typeof value === 'string') return maskSensitiveValues(value);
  return JSON.parse(maskSensitiveValues(JSON.stringify(value)));
}

export function removeUnsafeLanguage(value) {
  let text = typeof value === 'string' ? value : JSON.stringify(value);
  for (const pattern of DEMO_TERMS) {
    text = text.replace(pattern, '[PRODUCTION_CONTENT]');
  }
  return text;
}

export function validateSanitizedExport(exportPack) {
  const scan = scanExportForSecrets(exportPack);
  if (!scan.passed) return { valid: false, findings: scan.findings };
  return { valid: true, findings: [] };
}
