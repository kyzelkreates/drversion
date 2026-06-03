// 4P3X Export Pack Export Utils — Run 7

import { maskSensitiveValues, scanExportForSecrets } from '../logic/export/noSecretsExportGuard.js';

function safeStringify(obj) {
  try { return JSON.stringify(obj, null, 2); } catch { return '{}'; }
}

export function exportPackToJson(exportPack) {
  const sanitized = sanitizeExportPackForExport(exportPack);
  return safeStringify(sanitized);
}

export function exportPackToText(exportPack, state) {
  const summary = summarizeExportPack(exportPack, state);
  return summary;
}

export function importExportPackFromJson(json) {
  try {
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== 'object') return { valid: false, error: 'Invalid JSON object.' };
    const scan = scanExportForSecrets(obj);
    if (!scan.passed) return { valid: false, error: `Secret detected in import: ${scan.findings[0]?.label || 'unknown'}` };
    if (!obj.id || !obj.name || !obj.type) return { valid: false, error: 'Export pack is missing required fields (id, name, type).' };
    return { valid: true, exportPack: obj };
  } catch (e) {
    return { valid: false, error: `JSON parse error: ${e.message}` };
  }
}

export function sanitizeExportPackForExport(exportPack) {
  const json     = maskSensitiveValues(safeStringify(exportPack));
  const sanitized = JSON.parse(json);
  // Remove any fields that could expose internal state
  delete sanitized._raw;
  delete sanitized._internal;
  return sanitized;
}

export function summarizeExportPack(exportPack, _state) {
  if (!exportPack) return 'No export pack selected.';
  const lines = [
    `=== ${exportPack.name} ===`,
    `Type: ${exportPack.type}`,
    `Builder Tool: ${exportPack.builderTool}`,
    `Status: ${exportPack.status}`,
    `Readiness: ${exportPack.readiness?.score ?? 0}/100 (${exportPack.readiness?.level?.replace(/_/g,' ') || 'not_ready'})`,
    '',
    '--- Identity ---',
    `App Name: ${exportPack.identity?.appName}`,
    `Powered By: ${exportPack.identity?.poweredBy}`,
    `Created By: ${exportPack.identity?.createdBy}`,
    `Ecosystem: ${exportPack.identity?.ecosystem}`,
    '',
    '--- Linked Assets ---',
    `Workspace ID: ${exportPack.linkedWorkspaceId || 'None'}`,
    `Blueprint ID: ${exportPack.linkedBlueprintId || 'None'}`,
    `Transformation Plan ID: ${exportPack.linkedTransformationPlanId || 'None'}`,
    `Linked Prompt IDs: ${(exportPack.linkedPromptIds || []).join(', ') || 'None'}`,
    '',
  ];

  if (exportPack.handoffInstructions) {
    const h = exportPack.handoffInstructions;
    lines.push('--- Handoff Instructions ---');
    lines.push(`Summary: ${h.summary || ''}`);
    lines.push('');
    lines.push('Steps:');
    (h.steps || []).forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
    lines.push('');
    lines.push('Allowed Actions:');
    (h.allowedActions || []).forEach((a) => lines.push(`  ✓ ${a}`));
    lines.push('');
    lines.push('Forbidden Actions:');
    (h.forbiddenActions || []).forEach((a) => lines.push(`  ⛔ ${a}`));
    lines.push('');
    lines.push('Stop Conditions:');
    (h.stopConditions || []).forEach((s) => lines.push(`  ⛔ ${s}`));
    lines.push('');
    lines.push('Rollback Guidance:');
    (h.rollbackGuidance || []).forEach((r, i) => lines.push(`  ${i + 1}. ${r}`));
    lines.push('');
    lines.push('Secret Safety Rules:');
    (h.secretSafetyRules || []).forEach((r) => lines.push(`  ⊡ ${r}`));
    lines.push('');
    if (h.directive1) lines.push(`Directive 1: ${h.directive1}`);
  }

  if (exportPack.envExample?.content) {
    lines.push('');
    lines.push('--- .env.example (placeholders only) ---');
    lines.push(exportPack.envExample.content);
  }

  if ((exportPack.readiness?.blockers || []).length > 0) {
    lines.push('');
    lines.push('--- Blockers ---');
    exportPack.readiness.blockers.forEach((b) => lines.push(`  ⛔ ${b}`));
  }

  if ((exportPack.readiness?.warnings || []).length > 0) {
    lines.push('');
    lines.push('--- Warnings ---');
    exportPack.readiness.warnings.forEach((w) => lines.push(`  ⚠ ${w}`));
  }

  lines.push('');
  lines.push(`Generated: ${exportPack.audit?.updatedAt || new Date().toISOString()}`);
  lines.push('Export packs prepare safe manual handoff only. They do not deploy, push code, execute prompts, or write product files.');

  return lines.join('\n');
}

export function copyExportPackText(text) {
  return navigator.clipboard?.writeText(text).catch(() => null);
}

export function downloadExportPackJson(exportPack) {
  const json = exportPackToJson(exportPack);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `export-pack-${exportPack.name.replace(/\s+/g, '-').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadExportPackText(exportPack, state) {
  const text = exportPackToText(exportPack, state);
  const blob = new Blob([text], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `export-pack-${exportPack.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
