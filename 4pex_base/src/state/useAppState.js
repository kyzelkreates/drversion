// 4P3X Reusable Base Structure™
// useAppState — React hook wrapping getState + subscribe
// Run 8.5 patch — provides useAppState to Run 8 pages.

import { useState, useEffect } from 'react';
import { getState, subscribe } from './storage.js';

/**
 * React hook: returns live app state and re-renders on every state change.
 */
export function useAppState() {
  const [state, setLocalState] = useState(() => getState());
  useEffect(() => {
    const unsub = subscribe(() => setLocalState(getState()));
    return unsub;
  }, []);
  return state;
}
