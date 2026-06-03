// 4P3X Variant Profile page — RUN 1

import React, { useState, useEffect } from 'react';
import variantConfig from '../config/variantConfig.js';
import { getState, setState as setStorageState, subscribe } from '../state/storage.js';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';

export function VariantProfile() {
  const [appState, setAppState] = useState(() => getState());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = subscribe((s) => setAppState({ ...s }));
    return unsub;
  }, []);

  function handleSelect(variantId) {
    const variant = variantConfig.find((v) => v.id === variantId);
    if (!variant) return;

    const result = setStorageState((prev) => ({
      ...prev,
      activeVariant: {
        id: variant.id,
        name: variant.name,
        type: variant.type,
      },
    }));

    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const activeId = appState.activeVariant?.id || 'base';

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Variant Profile</div>
        <div className="page-subtitle">
          Select an active transformation profile. Variants are defined — but not yet built. RUN 2 builds the Transformation Layer.
        </div>
      </div>

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          Profile saved successfully.
        </div>
      )}

      <div className="grid-2">
        {variantConfig.map((variant) => {
          const isActive = variant.id === activeId;
          const isBase = variant.id === 'base';

          return (
            <Card
              key={variant.id}
              variant={isActive ? 'gold' : undefined}
              style={{ cursor: isBase || isActive ? 'default' : 'pointer', transition: 'all 0.15s' }}
              onClick={() => handleSelect(variant.id)}
            >
              <div className="row-between" style={{ marginBottom: 8 }}>
                <span style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isActive ? 'var(--gold-bright)' : 'var(--text-primary)',
                }}>
                  {variant.name}
                </span>
                <div className="row" style={{ gap: 6 }}>
                  {isActive && <Badge variant="gold">Active</Badge>}
                  <Badge variant="neutral">{variant.type}</Badge>
                  {variant.id !== 'base' && <Badge variant="reserved">Run 2+</Badge>}
                </div>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                {variant.description}
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                Recommended modules:
              </div>
              <div className="row" style={{ flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {variant.recommendedModules.map((m) => (
                  <Badge key={m} variant="neutral">{m}</Badge>
                ))}
              </div>

              {variant.futureUse && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>
                  {variant.futureUse}
                </div>
              )}

              {!isActive && (
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 10 }}
                  onClick={(e) => { e.stopPropagation(); handleSelect(variant.id); }}
                >
                  Select Profile
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default VariantProfile;
