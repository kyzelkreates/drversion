// 4P3X App Root
import React, { useState } from 'react';
import { routes, NotFound } from './routes.js';
import AppShell from '../components/layout/AppShell.jsx';
import '../styles/globals.css';

import { getState } from '../state/storage.js';
getState();

// Routes that render fullscreen (no sidebar/topbar shell)
const FULLSCREEN_ROUTES = ['/carelink'];

export function App() {
  const [currentRoute, setCurrentRoute] = useState('/carelink');
  const [routeParams, setRouteParams]   = useState({});

  function navigate(path, params) {
    setCurrentRoute(path);
    setRouteParams(params || {});
    window.scrollTo(0, 0);
  }

  const matchedRoute  = routes.find((r) => r.path === currentRoute);
  const PageComponent = matchedRoute ? matchedRoute.component : null;

  // CareLink renders fullscreen — no sidebar/topbar
  if (FULLSCREEN_ROUTES.includes(currentRoute)) {
    return PageComponent
      ? <PageComponent onNavigate={navigate} {...routeParams} />
      : <NotFound onNavigate={navigate} />;
  }

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
