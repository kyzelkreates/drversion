// 4P3X Module Registry Audit — Run 8
import moduleRegistry from '../../config/moduleRegistry.js';

export function auditModuleRegistry(state) {
  const duplicates    = findDuplicateModuleIds(moduleRegistry);
  const noRoute       = findActiveModulesWithoutRoutes(moduleRegistry);
  const badRunValues  = validateRunToBuildValues(moduleRegistry);
  const noDesc        = validateModuleDescriptions(moduleRegistry);

  const blockers = [];
  const warnings = [];
  const passed   = [];

  if (duplicates.length > 0) blockers.push(`Duplicate module IDs: ${duplicates.join(', ')}`);
  else passed.push('no_duplicate_ids');

  if (noRoute.length > 0) blockers.push(`Active modules without routes: ${noRoute.join(', ')}`);
  else passed.push('active_modules_have_routes');

  if (badRunValues.length > 0) warnings.push(`Invalid runToBuild values: ${badRunValues.join(', ')}`);
  else passed.push('run_to_build_values_valid');

  if (noDesc.length > 0) warnings.push(`Modules missing descriptions: ${noDesc.join(', ')}`);
  else passed.push('descriptions_present');

  const score = blockers.length === 0 ? (warnings.length === 0 ? 100 : 88) : 30;

  return {
    id: 'moduleRegistry',
    label: 'Module Registry',
    score,
    passed,
    blockers,
    warnings,
    details: {
      totalModules: moduleRegistry.length,
      activeModules: moduleRegistry.filter(m => m.status === 'active').length,
      reservedModules: moduleRegistry.filter(m => m.status === 'reserved').length,
      duplicates, noRoute, badRunValues,
    },
  };
}

export function findDuplicateModuleIds(registry) {
  const seen = {};
  const dups = [];
  registry.forEach(m => { seen[m.id] = (seen[m.id] || 0) + 1; });
  Object.entries(seen).forEach(([id, count]) => { if (count > 1) dups.push(id); });
  return dups;
}

export function findActiveModulesWithoutRoutes(registry) {
  return registry.filter(m => m.status === 'active' && !m.route).map(m => m.id);
}

export function findReservedModulesMarkedActiveIncorrectly(registry) {
  return registry.filter(m => m.status === 'active' && m.runToBuild && parseInt(m.runToBuild.replace('Run ', '')) > 8).map(m => m.id);
}

export function validateRunToBuildValues(registry) {
  const valid = ['Run 1','Run 2','Run 3','Run 4','Run 5','Run 6','Run 7','Run 8'];
  return registry.filter(m => m.runToBuild && !valid.includes(m.runToBuild)).map(m => m.id);
}

export function validateModuleDescriptions(registry) {
  return registry.filter(m => !m.description || m.description.length < 10).map(m => m.id);
}
