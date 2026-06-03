// 4P3X ID Utilities
// RUN 1

let _counter = 0;

/**
 * Generate a lightweight unique ID.
 */
export function generateId(prefix = 'id') {
  _counter += 1;
  return `${prefix}_${Date.now()}_${_counter}`;
}
