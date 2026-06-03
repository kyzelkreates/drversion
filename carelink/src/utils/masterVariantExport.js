// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// masterVariantExport.js — Run 10
// Safe export utilities for master variant prompts.
// Never exposes secrets. Never executes prompts.

import { BRANDING_LINE } from '../config/masterVariantPromptTemplates.js';

const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9]{20,}/g,
  /sk_live_[A-Za-z0-9]{20,}/g,
  /sk_test_[A-Za-z0-9]{20,}/g,
  /AIza[A-Za-z0-9]{30,}/g,
  /ghp_[A-Za-z0-9]{20,}/g,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^\s<]{10,}/g,
  /DATABASE_URL\s*=\s*postgres:\/\/[^\s<]{5,}/g,
];

// =====================================================
// SANITISE PROMPT FOR EXPORT
// =====================================================
export function sanitiseMasterVariantPromptForExport(prompt) {
  if (!prompt) return null;
  let text = prompt.promptText || '';

  SECRET_PATTERNS.forEach((pattern) => {
    text = text.replace(pattern, '[REDACTED — DO NOT INCLUDE REAL KEYS]');
  });

  return {
    id:           prompt.id,
    variantType:  prompt.variantType,
    patternId:    prompt.patternId,
    generatedAt:  prompt.generatedAt,
    branding:     BRANDING_LINE,
    promptText:   text,
    characterCount: text.length,
    wordCount:      text.split(/\s+/).length,
    exportedAt:   new Date().toISOString(),
    exportSafe:   true,
    note:         'This prompt is for manual copy-paste use only. It does not execute automatically.',
  };
}

// =====================================================
// FORMAT PROMPT AS PLAIN TEXT
// =====================================================
export function formatMasterVariantPromptAsText(prompt) {
  if (!prompt) return '';
  const safe = sanitiseMasterVariantPromptForExport(prompt);
  return [
    `// ${BRANDING_LINE}`,
    `// Variant: ${safe.variantType}`,
    `// Pattern: ${safe.patternId}`,
    `// Generated: ${safe.generatedAt}`,
    `// COPY-PASTE USE ONLY — DO NOT EXECUTE AUTOMATICALLY`,
    '',
    safe.promptText,
  ].join('\n');
}

// =====================================================
// FORMAT MULTIPLE PROMPTS AS EXPORT PACK
// =====================================================
export function formatPromptExportPack(prompts) {
  if (!Array.isArray(prompts) || prompts.length === 0) return '';
  const lines = [
    `${BRANDING_LINE}`,
    `Master Variant Prompt Export Pack`,
    `Exported: ${new Date().toISOString()}`,
    `Total Prompts: ${prompts.length}`,
    '====================================================',
    '',
  ];
  prompts.forEach((p, i) => {
    lines.push(`--- PROMPT ${i + 1} ---`);
    lines.push(formatMasterVariantPromptAsText(p));
    lines.push('');
  });
  return lines.join('\n');
}

// =====================================================
// STRIP ANY SECRETS BEFORE DISPLAY
// =====================================================
export function maskSecretsInText(text) {
  if (!text || typeof text !== 'string') return text;
  let result = text;
  SECRET_PATTERNS.forEach((pattern) => {
    result = result.replace(pattern, '[REDACTED]');
  });
  return result;
}
