// 4P3X AppShell — RUN 1

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import { getState, subscribe } from '../../state/storage.js';

export function AppShell({ currentRoute, onNavigate, children }) {
  const [appState, setAppState] = useState(() => getState());

  useEffect(() => {
    const unsub = subscribe((s) => setAppState({ ...s }));
    return unsub;
  }, []);

  return (
    <div className="app-shell">
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />
      <div className="app-main">
        <TopBar
          currentRoute={currentRoute}
          activeVariant={appState.activeVariant}
          health={appState.health}
        />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
