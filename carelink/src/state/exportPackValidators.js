// 4P3X Export Pack Validators — Run 7

import { scanExportForSecrets } from '../logic/export/noSecretsExportGuard.js';

export function validateExportPack(exportPack) {
  const issues = [];
  if (!exportPack)                    return { valid: false, issues: ['Export pack is null.'] };
  if (!exportPack.id)                 issues.push('Export pack is missing an id.');
  if (!exportPack.name?.trim())       issues.push('Export pack name is required.');
  if (!exportPack.type)               issues.push('Export pack type is required.');
  const validTypes = ['base_handoff', 'variant_handoff', 'deployment_preparation', 'builder_tool_pack'];
  if (!validTypes.includes(exportPack.type)) issues.push(`Invalid export pack type: ${exportPack.type}`);
  const validTools = ['base44', 'manus', 'replit', 'cursor', 'github', 'vercel', 'generic'];
  if (exportPack.builderTool && !validTools.includes(exportPack.builderTool)) issues.push(`Invalid builder tool: ${exportPack.builderTool}`);
  if (!Array.isArray(exportPack.linkedPromptIds)) issues.push('linkedPromptIds must be an array.');
  return { valid: issues.length === 0, issues };
}

export function validateExportPackLinks(exportPack, state) {
  const issues = [];
  if (!exportPack) return { valid: false, issues: ['No export pack provided.'] };
  const bps   = state?.blueprints?.blueprints || [];
  const plans = state?.transformationCompiler?.plans || [];
  const prompts = state?.variantLauncher?.generatedPrompts || [];
  const wss   = state?.variantWorkspaces?.workspaces || [];
  if (exportPack.linkedBlueprintId && !bps.some((b) => b.id === exportPack.linkedBlueprintId))
    issues.push(`Linked blueprint "${exportPack.linkedBlueprintId}" not found.`);
  if (exportPack.linkedTransformationPlanId && !plans.some((p) => p.id === exportPack.linkedTransformationPlanId))
    issues.push(`Linked transformation plan not found.`);
  if (exportPack.linkedWorkspaceId && !wss.some((w) => w.id === exportPack.linkedWorkspaceId))
    issues.push(`Linked workspace not found.`);
  for (const id of exportPack.linkedPromptIds || []) {
    if (!prompts.some((p) => p.id === id)) issues.push(`Linked prompt "${id}" not found.`);
  }
  return { valid: issues.length === 0, issues };
}

export function validateExportPackReadiness(exportPack, _state) {
  const issues = [];
  if (!exportPack.handoffInstructions) issues.push('Handoff instructions not generated.');
  if (!exportPack.sanitisation?.passed) issues.push('No-secrets sanitisation has not passed.');
  return { valid: issues.length === 0, issues };
}

export function validateHandoffInstructions(instructions) {
  const issues = [];
  if (!instructions)                        return { valid: false, issues: ['No instructions provided.'] };
  if (!instructions.steps?.length)          issues.push('Handoff steps are empty.');
  if (!instructions.stopConditions?.length) issues.push('Stop conditions are required.');
  if (!instructions.rollbackGuidance?.length) issues.push('Rollback guidance is required.');
  return { valid: issues.length === 0, issues };
}

export function validateEnvExample(envContent) {
  const issues = [];
  if (!envContent?.trim()) return { valid: false, issues: ['Env example content is empty.'] };
  const scan = scanExportForSecrets(envContent);
  if (!scan.passed) issues.push(...scan.findings.map((f) => `Secret detected: ${f.label}`));
  return { valid: issues.length === 0, issues };
}

export function validateNoSecrets(exportContent) {
  const scan = scanExportForSecrets(exportContent);
  return { valid: scan.passed, issues: scan.findings.map((f) => f.label) };
}

export function validateDashboardPwaStructure(structure) {
  const issues = [];
  if (!structure)             return { valid: false, issues: ['No structure provided.'] };
  if (!structure.dashboardRole) issues.push('Dashboard role is not defined.');
  if (!structure.pwaRole)       issues.push('PWA role is not defined.');
  return { valid: issues.length === 0, issues };
}

export function validateExportPackImport(rawObj) {
  if (!rawObj || typeof rawObj !== 'object') return { valid: false, issues: ['Import must be a valid JSON object.'] };
  const base = validateExportPack(rawObj);
  if (!base.valid) return base;
  const secretCheck = validateNoSecrets(rawObj);
  if (!secretCheck.valid) return { valid: false, issues: secretCheck.issues.map((i) => `Secret detected in import: ${i}`) };
  return { valid: true, issues: [] };
}

export function validateExportPackExport(exportPack) {
  const base = validateExportPack(exportPack);
  if (!base.valid) return base;
  const secretCheck = validateNoSecrets(exportPack);
  if (!secretCheck.valid) return { valid: false, issues: secretCheck.issues.map((i) => `Cannot export — secret detected: ${i}`) };
  return { valid: true, issues: [] };
}
