// CareSignal OS™ — App Root
// Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™

import React, { useState } from 'react';
import { routes, NotFound } from './routes.js';
import AppShell from '../components/layout/AppShell.jsx';
import '../styles/globals.css';

import { getState } from '../state/storage.js';
try { getState(); } catch(e) { console.warn('[4P3X] state init failed:', e); }

// Routes that render fullscreen (no sidebar/topbar shell)
const FULLSCREEN_ROUTES = ['/', '/carelink'];

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

  // Landing + CareLink render fullscreen — no sidebar/topbar
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
