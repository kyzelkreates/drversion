// 4P3X State Selectors
// RUN 1 — Read-only derived values from SSOT

import { getState } from './storage.js';

export const selectApp = () => getState().app;
export const selectActiveVariant = () => getState().activeVariant;
export const selectModules = () => getState().modules;
export const selectPreferences = () => getState().preferences;
export const selectHealth = () => getState().health;
export const selectAiSettings = () => getState().aiSettings;
export const selectAudit = () => getState().audit;

export const selectIsModuleEnabled = (moduleId) =>
  getState().modules?.[moduleId]?.enabled ?? false;

export const selectAiConfigStatus = () => getState().health?.aiConfig ?? 'not_configured';
export const selectStorageStatus = () => getState().health?.storage ?? 'unknown';

// Run 7 — Export System Selectors
export const selectExportSystem      = () => getState().exportSystem || {};
export const selectExportPacks       = () => getState().exportSystem?.exportPacks || [];
export const selectActiveExportPack  = () => {
  const es = getState().exportSystem || {};
  return (es.exportPacks || []).find((ep) => ep.id === es.activeExportPackId) || null;
};
export const selectDeploymentReadiness = () => getState().exportSystem?.deploymentReadiness || {};
export const selectExportSystemLocks   = () => getState().exportSystem?.locks || {};
