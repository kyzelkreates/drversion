// 4P3X App Root — RUN 1 + RUN 2 + RUN 3
// Simple internal router. Supports routeParams for passing data to pages.

import React, { useState } from 'react';
import { routes, NotFound } from './routes.js';
import AppShell from '../components/layout/AppShell.jsx';
import '../styles/globals.css';

// Initialise SSOT on app load — triggers load + validation + migration
import { getState } from '../state/storage.js';
getState();

export function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [routeParams, setRouteParams]   = useState({});

  function navigate(path, params) {
    setCurrentRoute(path);
    setRouteParams(params || {});
    window.scrollTo(0, 0);
  }

  const matchedRoute  = routes.find((r) => r.path === currentRoute);
  const PageComponent = matchedRoute ? matchedRoute.component : null;

  return (
    <AppShell currentRoute={currentRoute} onNavigate={navigate}>
      {PageComponent ? (
        <PageComponent onNavigate={navigate} {...routeParams} />
      ) : (
        <NotFound onNavigate={navigate} />
      )}
    </AppShell>
  );
}

export default App;
