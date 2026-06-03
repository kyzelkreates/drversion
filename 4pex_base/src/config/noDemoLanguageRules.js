// 4P3X No-Demo Language Rules — Run 8
// These terms are forbidden in product-facing areas.
// They MAY appear only inside forbidden-wording lists, audit rules, or safety documentation.

export const FORBIDDEN_DEMO_TERMS = [
  'demo',
  'mock',
  'mocked',
  'fake',
  'dummy',
  'toy',
  'sample-only',
  'throwaway',
  'placeholder app',
  'simulated product',
  'showcase-only',
];

export const PRODUCTION_SAFE_REPLACEMENTS = {
  'demo':              'starter configuration',
  'mock':              'non-destructive preview',
  'mocked':            'non-destructive preview',
  'fake':              'starter configuration',
  'dummy':             'reserved module',
  'toy':               'production foundation',
  'sample-only':       'readiness check',
  'throwaway':         'transformation plan',
  'placeholder app':   'builder handoff',
  'simulated product': 'product skeleton plan',
  'showcase-only':     'local validation',
};

// Areas that ARE allowed to contain forbidden terms (for documentation/warning purposes)
export const ALLOWED_CONTEXT_PATTERNS = [
  'forbidden',
  'do not use',
  'avoid',
  'not allowed',
  'audit rule',
  'warning:',
  'noDemoLanguageRules',
  'FORBIDDEN_DEMO_TERMS',
  'secretAuditRules',
];

export function suggestReplacement(term) {
  const key = term.toLowerCase();
  return PRODUCTION_SAFE_REPLACEMENTS[key] || 'production-appropriate term';
}

export function isInAllowedContext(surroundingText = '') {
  const lower = surroundingText.toLowerCase();
  return ALLOWED_CONTEXT_PATTERNS.some(p => lower.includes(p));
}

export function findForbiddenTerms(text = '') {
  if (!text) return [];
  const lower = text.toLowerCase();
  return FORBIDDEN_DEMO_TERMS.filter(term => lower.includes(term));
}
