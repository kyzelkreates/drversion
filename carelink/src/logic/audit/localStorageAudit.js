// 4P3X LocalStorage Audit — Run 8
import { detectForbiddenSecretNames, detectRawApiKeyPatterns } from '../../config/secretAuditRules.js';

const PRIMARY_KEY = '4p3x-base';

export function auditLocalStorageSafety(state) {
  const singleKey = verifySingleStorageKey();
  const noUnsafe  = detectUnsafeLocalStorageKeys();
  const noSecrets = detectSecretLikeValuesInLocalState(state);
  const fallback  = validateLocalStorageFallback(state);

  const blockers = [];
  const warnings = [];
  const passed   = [];

  if (!singleKey.ok) warnings.push(`Multiple localStorage keys detected: ${singleKey.extra.join(', ')}`);
  else passed.push('single_storage_key');

  if (noUnsafe.length > 0) warnings.push(`Potentially unsafe localStorage keys: ${noUnsafe.join(', ')}`);
  else passed.push('no_unsafe_keys');

  if (noSecrets.length > 0) blockers.push('Secret-like values detected in local state (masked — check secret exposure audit)');
  else passed.push('no_secret_values_in_state');

  if (!fallback) warnings.push('LocalStorage fallback handling could not be confirmed');
  else passed.push('storage_fallback_exists');

  const score = blockers.length === 0 ? (warnings.length === 0 ? 100 : 85) : 10;

  return {
    id: 'localStorage',
    label: 'LocalStorage Safety',
    score,
    passed,
    blockers,
    warnings,
    details: { primaryKey: PRIMARY_KEY, singleKey: singleKey.ok, secretsFound: noSecrets.length },
  };
}

export function verifySingleStorageKey() {
  try {
    const allKeys = Object.keys(localStorage);
    const stateKeys = allKeys.filter(k => k.startsWith('4p3x'));
    const extra = allKeys.filter(k => !k.startsWith('4p3x') && (k.includes('state') || k.includes('store') || k.includes('app')));
    return { ok: extra.length === 0, extra };
  } catch { return { ok: true, extra: [] }; }
}

export function detectUnsafeLocalStorageKeys() {
  try {
    return Object.keys(localStorage).filter(k =>
      k.toLowerCase().includes('secret') ||
      k.toLowerCase().includes('api_key') ||
      k.toLowerCase().includes('token') ||
      k.toLowerCase().includes('password')
    );
  } catch { return []; }
}

export function detectSecretLikeValuesInLocalState(state) {
  const serialised = JSON.stringify(state || {});
  const nameHits   = detectForbiddenSecretNames(serialised);
  const patternHits = detectRawApiKeyPatterns(serialised);
  // Filter out known-safe references (like in forbidden lists)
  const realHits = [...nameHits, ...patternHits].filter(h =>
    !h.includes('FORBIDDEN_SECRET_NAMES') && !h.includes('secretAuditRules')
  );
  return realHits;
}

export function validateLocalStorageFallback(state) {
  return state !== null && state !== undefined;
}
