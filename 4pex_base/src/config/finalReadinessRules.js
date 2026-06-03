// 4P3X Final Readiness Rules — Run 8

export const FINAL_READINESS_CRITERIA = {
  baseReadyForVariants: {
    label: 'Base Ready for Real Variants',
    requires: [
      { key: 'overallScore',             op: 'gte', value: 90,   description: 'Overall audit score ≥ 90' },
      { key: 'noCriticalBlockers',       op: 'eq',  value: true, description: 'No critical blockers' },
      { key: 'ssotVerified',             op: 'eq',  value: true, description: 'SSOT integrity verified' },
      { key: 'modulesVerified',          op: 'eq',  value: true, description: 'Module registry verified' },
      { key: 'routesVerified',           op: 'eq',  value: true, description: 'Route integrity verified' },
      { key: 'secretsCleared',           op: 'eq',  value: true, description: 'Secret exposure audit passed' },
      { key: 'noDemoLanguageVerified',   op: 'eq',  value: true, description: 'No-demo-language audit passed' },
      { key: 'transformationSafe',       op: 'eq',  value: true, description: 'Transformation compiler safe' },
      { key: 'promptsSafe',              op: 'eq',  value: true, description: 'Prompt generator safe' },
      { key: 'workspacesSafe',           op: 'eq',  value: true, description: 'Workspace isolation safe' },
      { key: 'exportsSafe',              op: 'eq',  value: true, description: 'Export/handoff safe' },
    ],
  },
  exportReady: {
    label: 'Export Ready',
    requires: [
      { key: 'exportPacksValid',         op: 'eq',  value: true, description: 'Export packs are valid' },
      { key: 'noSecretsGuardPassed',     op: 'eq',  value: true, description: 'No-secrets guard passed' },
      { key: 'envExamplePlaceholders',   op: 'eq',  value: true, description: '.env.example uses placeholders only' },
      { key: 'handoffInstructionsValid', op: 'eq',  value: true, description: 'Handoff instructions are valid' },
    ],
  },
  zipHandoffReady: {
    label: 'Zip Handoff Ready',
    requires: [
      { key: 'buildReadinessPassed',     op: 'eq',  value: true, description: 'Build readiness audit passed' },
      { key: 'readmeExists',             op: 'eq',  value: true, description: 'README is present' },
      { key: 'packageJsonExists',        op: 'eq',  value: true, description: 'package.json is present' },
      { key: 'pwaManifestExists',        op: 'eq',  value: true, description: 'PWA manifest is present' },
      { key: 'exportHandoffReady',       op: 'eq',  value: true, description: 'Export/handoff pack is ready' },
    ],
  },
  canStartVariantBuilds: {
    label: 'Can Start Real Variant Builds',
    requires: [
      { key: 'baseReadyForVariants',     op: 'eq',  value: true, description: 'Base is ready for variants' },
      { key: 'exportReady',              op: 'eq',  value: true, description: 'Export is ready' },
      { key: 'transformationLockActive', op: 'eq',  value: true, description: 'Transformation readiness lock is active' },
      { key: 'noCriticalBlockers',       op: 'eq',  value: true, description: 'No critical blockers remain' },
    ],
  },
};

export const READINESS_LEVELS = [
  { level: 'not_ready',           minScore: 0,   label: 'Not Ready',             color: '#ef4444' },
  { level: 'partial',             minScore: 50,  label: 'Partial',               color: '#f59e0b' },
  { level: 'ready_with_warnings', minScore: 75,  label: 'Ready With Warnings',   color: '#f59e0b' },
  { level: 'ready',               minScore: 90,  label: 'Ready',                 color: '#22c55e' },
];

export function getReadinessLevel(score, blockers = []) {
  if (blockers.length > 0) return 'not_ready';
  if (score >= 90) return 'ready';
  if (score >= 75) return 'ready_with_warnings';
  if (score >= 50) return 'partial';
  return 'not_ready';
}

export function getReadinessColor(level) {
  return READINESS_LEVELS.find(r => r.level === level)?.color || '#6b7280';
}
