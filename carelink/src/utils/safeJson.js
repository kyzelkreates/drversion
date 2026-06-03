// 4P3X Safe JSON Utilities
// RUN 1

/**
 * Safely parse JSON. Returns { ok: true, data } or { ok: false, error }.
 */
export function safeParseJson(value) {
  try {
    if (typeof value !== 'string') return { ok: false, error: 'Input must be a string.' };
    const data = JSON.parse(value);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: 'Invalid JSON: ' + e.message };
  }
}

/**
 * Safely stringify JSON. Returns { ok: true, value } or { ok: false, error }.
 */
export function safeStringifyJson(value, indent = 2) {
  try {
    const str = JSON.stringify(value, null, indent);
    return { ok: true, value: str };
  } catch (e) {
    return { ok: false, error: 'Stringify failed: ' + e.message };
  }
}
