// 4P3X Dashboard + PWA Export Planner — Run 7
// Structural planning only. Does not build product variants.

import { getDashboardPwaPattern, STRUCTURE_RULES } from '../../config/dashboardPwaStructureRules.js';

export function planDashboardPwaStructure(productType, _state) {
  const pattern = getDashboardPwaPattern(productType);
  return {
    productType,
    dashboardRole:           pattern.dashboardRole,
    pwaRole:                 pattern.pwaRole,
    monitoringRelationship:  pattern.monitoringRelationship,
    stateSeparation:         pattern.stateSeparation,
    optionalSupabaseSyncLater: pattern.optionalSupabaseSyncLater,
    safetyNotes:             pattern.safetyNotes || [],
    structureRules:          STRUCTURE_RULES,
    note:                    'Structural planning only. This does not build the variant.',
  };
}

export function deriveDashboardRole(productType) {
  return getDashboardPwaPattern(productType).dashboardRole;
}

export function derivePwaRole(productType) {
  return getDashboardPwaPattern(productType).pwaRole;
}

export function deriveMonitoringRelationship(productType) {
  return getDashboardPwaPattern(productType).monitoringRelationship;
}

export function validateDashboardPwaSeparation(plan) {
  const issues = [];
  if (!plan.dashboardRole)  issues.push('Dashboard role is not defined.');
  if (!plan.pwaRole)        issues.push('PWA role is not defined.');
  if (!plan.stateSeparation) issues.push('State separation policy is not defined.');
  if (!plan.monitoringRelationship) issues.push('Monitoring relationship is not defined.');
  return { valid: issues.length === 0, issues };
}

export function generateDashboardPwaHandoffSection(plan) {
  return `
## Dashboard + Connected PWA Structure

**Dashboard Role:** ${plan.dashboardRole || 'Not defined'}
**PWA Role:** ${plan.pwaRole || 'Not defined'}
**Monitoring Relationship:** ${plan.monitoringRelationship || 'Not defined'}
**State Separation:** Required. Dashboard and PWA state must remain isolated.
**Optional Supabase Sync:** Planned for a future controlled backend run only.

### Safety Notes
${(plan.safetyNotes || []).map((n) => `- ${n}`).join('\n')}

### Structure Rules
${STRUCTURE_RULES.map((r) => `- ${r}`).join('\n')}
`.trim();
}
