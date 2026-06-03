// 4P3X Date Utilities
// RUN 1

/**
 * Return current ISO timestamp string.
 */
export function nowIso() {
  return new Date().toISOString();
}

/**
 * Format an ISO string for display.
 */
export function formatDisplay(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}
