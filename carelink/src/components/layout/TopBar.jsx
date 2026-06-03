// 4P3X TopBar — RUN 1

import React from 'react';
import Badge from '../ui/Badge.jsx';
import { getModuleByRoute } from '../../config/moduleRegistry.js';

function healthVariant(status) {
  if (status === 'ready' || status === 'connected' || status === 'configured') return 'active';
  if (status === 'not_configured' || status === 'not_connected') return 'neutral';
  if (status === 'error') return 'error';
  return 'neutral';
}

function aiConfigVariant(status) {
  if (status === 'configured') return 'active';
  if (status === 'not_configured') return 'warn';
  return 'neutral';
}

export function TopBar({ currentRoute, activeVariant, health }) {
  const module = getModuleByRoute(currentRoute);
  const pageTitle = module ? module.label : 'Page Not Found';

  const aiStatus = health?.aiConfig || 'not_configured';
  const storageStatus = health?.storage || 'unknown';

  return (
    <header className="app-topbar">
      <div className="topbar-title">{pageTitle}</div>

      <div className="topbar-badges">
        <Badge variant="gold">
          {activeVariant?.name || 'Base'}
        </Badge>

        <Badge variant={healthVariant(storageStatus)}>
          <span
            className={`health-dot ${storageStatus === 'ready' ? 'health-dot-ok' : 'health-dot-neutral'}`}
            style={{ marginRight: 3 }}
          />
          Storage
        </Badge>

        <Badge variant={aiConfigVariant(aiStatus)}>
          AI: {aiStatus === 'configured' ? 'Configured' : 'Not Set'}
        </Badge>
      </div>
    </header>
  );
}

export default TopBar;
