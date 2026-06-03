// 4P3X No-Demo Language Audit — Run 8
import { findForbiddenTerms, suggestReplacement, isInAllowedContext } from '../../config/noDemoLanguageRules.js';
import moduleRegistry from '../../config/moduleRegistry.js';

export function auditNoDemoLanguage(state) {
  const modFindings       = scanModuleDescriptions();
  const exportFindings    = scanExportPacks(state);
  const promptFindings    = scanGeneratedPrompts(state);
  const blueprintFindings = scanBlueprints(state);
  const planFindings      = scanTransformationPlans(state);
  const wsFindings        = scanWorkspaces(state);

  const allFindings = [...modFindings, ...exportFindings, ...promptFindings, ...blueprintFindings, ...planFindings, ...wsFindings];

  const blockers = [];
  const warnings = [];
  const passed   = [];

  if (modFindings.length > 0)    warnings.push(`Forbidden terms in module descriptions: ${modFindings.map(f => f.term).join(', ')}`);
  else passed.push('no_demo_in_modules');

  if (blueprintFindings.length > 0) warnings.push(`Forbidden terms in blueprints: ${blueprintFindings.map(f => f.term).join(', ')}`);
  else passed.push('no_demo_in_blueprints');

  if (promptFindings.length > 0) warnings.push(`Forbidden terms in prompts: ${promptFindings.map(f => f.term).join(', ')}`);
  else passed.push('no_demo_in_prompts');

  if (wsFindings.length > 0)     warnings.push(`Forbidden terms in workspace content: ${wsFindings.map(f => f.term).join(', ')}`);
  else passed.push('no_demo_in_workspaces');

  if (exportFindings.length > 0) warnings.push(`Forbidden terms in export packs: ${exportFindings.map(f => f.term).join(', ')}`);
  else passed.push('no_demo_in_export_packs');

  const score = blockers.length === 0 ? (warnings.length === 0 ? 100 : Math.max(70, 100 - warnings.length * 8)) : 40;

  return {
    id: 'noDemoLanguage',
    label: 'No-Demo Language',
    score,
    passed,
    blockers,
    warnings,
    details: { allFindings },
  };
}

export function scanProductFacingText(state) {
  return [...scanModuleDescriptions(), ...scanBlueprints(state), ...scanWorkspaces(state)];
}

export function scanModuleDescriptions() {
  const findings = [];
  moduleRegistry.forEach(m => {
    const text = `${m.label || ''} ${m.description || ''}`;
    findForbiddenTerms(text).forEach(term => {
      if (!isInAllowedContext(text)) findings.push({ area: 'module', id: m.id, term, replacement: suggestReplacement(term) });
    });
  });
  return findings;
}

export function scanExportPacks(state) {
  const findings = [];
  (state?.exportSystem?.exportPacks || []).forEach(ep => {
    const text = JSON.stringify(ep?.handoffInstructions || {});
    findForbiddenTerms(text).forEach(term => {
      if (!isInAllowedContext(text)) findings.push({ area: 'exportPack', id: ep.id, term, replacement: suggestReplacement(term) });
    });
  });
  return findings;
}

export function scanGeneratedPrompts(state) {
  const findings = [];
  (state?.variantLauncher?.generatedPrompts || []).forEach(p => {
    const text = (p.title || '') + ' ' + (p.content || '');
    findForbiddenTerms(text).forEach(term => {
      if (!isInAllowedContext(text)) findings.push({ area: 'prompt', id: p.id, term, replacement: suggestReplacement(term) });
    });
  });
  return findings;
}

export function scanBlueprints(state) {
  const findings = [];
  (state?.blueprints?.items || []).forEach(b => {
    const text = (b.name || '') + ' ' + (b.description || '');
    findForbiddenTerms(text).forEach(term => {
      if (!isInAllowedContext(text)) findings.push({ area: 'blueprint', id: b.id, term, replacement: suggestReplacement(term) });
    });
  });
  return findings;
}

export function scanTransformationPlans(state) {
  const findings = [];
  (state?.transformationCompiler?.plans || []).forEach(p => {
    const text = (p.name || '') + ' ' + (p.title || '');
    findForbiddenTerms(text).forEach(term => {
      if (!isInAllowedContext(text)) findings.push({ area: 'plan', id: p.id, term, replacement: suggestReplacement(term) });
    });
  });
  return findings;
}

export function scanWorkspaces(state) {
  const findings = [];
  (state?.variantWorkspaces?.workspaces || []).forEach(w => {
    const text = (w.name || '') + ' ' + (w.notes || '') + ' ' + (w.description || '');
    findForbiddenTerms(text).forEach(term => {
      if (!isInAllowedContext(text)) findings.push({ area: 'workspace', id: w.id, term, replacement: suggestReplacement(term) });
    });
  });
  return findings;
}

export function findForbiddenLanguage(content) { return findForbiddenTerms(content); }
export function suggestProductionReplacement(term) { return suggestReplacement(term); }
