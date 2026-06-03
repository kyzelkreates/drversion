// 4P3X BlueprintModuleMapper — RUN 2

import React from 'react';
import moduleRegistry from '../../config/moduleRegistry.js';
import Badge from '../ui/Badge.jsx';

export function BlueprintModuleMapper({ coreModules = [], optionalModules = [] }) {
  const allActive   = moduleRegistry.filter((m) => m.status === 'active').map((m) => m.id);
  const allReserved = moduleRegistry.filter((m) => m.status === 'reserved').map((m) => m.id);

  const allBlueprintModules = [...new Set([...coreModules, ...optionalModules])];
  const missingFromRegistry = allBlueprintModules.filter(
    (mid) => !moduleRegistry.find((m) => m.id === mid)
  );

  return (
    <div>
      <div className="section-header">Core Modules</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {coreModules.filter(Boolean).length === 0
          ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No core modules defined.</span>
          : coreModules.filter(Boolean).map((mid) => {
              const inRegistry = moduleRegistry.find((m) => m.id === mid);
              const isActive   = allActive.includes(mid);
              return (
                <Badge key={mid} variant={isActive ? 'active' : inRegistry ? 'reserved' : 'warn'}>
                  {mid} {!inRegistry ? '⚠' : ''}
                </Badge>
              );
            })}
      </div>

      <div className="section-header">Optional Modules</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {optionalModules.filter(Boolean).length === 0
          ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>None.</span>
          : optionalModules.filter(Boolean).map((mid) => {
              const isActive = allActive.includes(mid);
              return (
                <Badge key={mid} variant={isActive ? 'active' : 'reserved'}>{mid}</Badge>
              );
            })}
      </div>

      {missingFromRegistry.length > 0 && (
        <div className="alert alert-warn">
          Modules not in registry: {missingFromRegistry.join(', ')} — these will need to be added in a future run.
        </div>
      )}
    </div>
  );
}

export default BlueprintModuleMapper;
