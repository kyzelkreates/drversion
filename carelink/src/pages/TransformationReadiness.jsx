// 4P3X Transformation Readiness — RUN 2

import React, { useState, useEffect } from 'react';
import {
  getState, subscribe, calculateTransformationReadiness,
} from '../state/storage.js';
import transformationRules, { getCriticalRules, getRulesByCategory } from '../config/transformationRules.js';
import BlueprintReadinessScore from '../components/blueprints/BlueprintReadinessScore.jsx';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';

const RULE_CATEGORIES = [
  { id: 'foundationProtectionRules',  label: 'Foundation Protection' },
  { id: 'localFirstRules',            label: 'Local-First Rules' },
  { id: 'supabaseFutureRules',        label: 'Supabase Future Rules' },
  { id: 'aiSafetyRules',              label: 'AI Safety Rules' },
  { id: 'productSpecificSafetyRules', label: 'Product Safety Rules' },
  { id: 'refactorRules',              label: 'Refactor Rules' },
];

const SEVERITY_VARIANT = { critical: 'error', warning: 'warn', info: 'info' };

export function TransformationReadiness({ onNavigate }) {
  const [appState, setAppState] = useState(() => getState());
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    const unsub = subscribe((s) => setAppState({ ...s }));
    return unsub;
  }, []);

  function handleCalculate() {
    calculateTransformationReadiness();
    setCalculated(true);
  }

  const items       = appState.blueprints?.items || [];
  const activeId    = appState.blueprints?.activeBlueprintId;
  const activeBp    = activeId ? items.find((b) => b.id === activeId) : items[0] || null;
  const transState  = appState.transformation || {};
  const criticals   = getCriticalRules();

  const safeToProceeed =
    transState.readinessScore >= 70 &&
    transState.missingRequirements?.length === 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Transformation Readiness</div>
        <div className="page-subtitle">
          Evaluate blueprint readiness and verify transformation rules before proceeding to future runs.
        </div>
      </div>

      {/* Big safety notice */}
      <div className="alert alert-warn" style={{ marginBottom: 20 }}>
        <strong>Important:</strong> This system prepares transformation only.
        It does NOT perform destructive refactoring. No files are changed. No products are built.
        All decisions remain with the developer.
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
            No blueprints defined yet
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/blueprints')}>
            Create a Blueprint
          </button>
        </div>
      ) : (
        <>
          {/* Active blueprint summary */}
          {activeBp && (
            <Card variant="gold" style={{ marginBottom: 20 }}>
              <div className="row-between" style={{ marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold-bright)' }}>
                    Active Blueprint: {activeBp.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {activeBp.productType} · {activeBp.stateMode} · {activeBp.safetyLevel}
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/blueprint-detail')}>
                  Edit Blueprint →
                </button>
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleCalculate}>
                Calculate Readiness
              </button>
            </Card>
          )}

          {/* Readiness result */}
          {calculated && (
            <div className="grid-2" style={{ marginBottom: 20 }}>
              <Card>
                <div className="card-title">Overall Readiness</div>
                <BlueprintReadinessScore
                  score={transState.readinessScore || 0}
                  level={transState.readinessLevel || 'not_ready'}
                  missing={transState.missingRequirements || []}
                  warnings={[]}
                />
              </Card>

              <Card variant={safeToProceeed ? 'green' : 'purple'}>
                <div className="card-title">Safe to Proceed?</div>
                <div style={{
                  fontSize: 20, fontWeight: 800,
                  color: safeToProceeed ? 'var(--green-bright)' : '#ff6677',
                  marginBottom: 8,
                }}>
                  {safeToProceeed ? '✓ Yes — Ready' : '✗ Not Yet Ready'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  {safeToProceeed
                    ? 'Blueprint meets minimum readiness threshold. Recommended next run: ' + (transState.recommendedNextRun || 'Run 3')
                    : 'Complete all missing requirements before proceeding.'}
                </div>
                {transState.missingRequirements?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
                      Missing
                    </div>
                    {transState.missingRequirements.map((m, i) => (
                      <div key={i} style={{ fontSize: 11, color: '#ff6677', padding: '2px 0' }}>• {m}</div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Transformation rules checklist */}
          <div style={{ marginBottom: 20 }}>
            {RULE_CATEGORIES.map(({ id, label }) => {
              const rules = getRulesByCategory(id);
              return (
                <div key={id} style={{ marginBottom: 16 }}>
                  <div className="section-header">{label} ({rules.length} rules)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {rules.map((rule) => (
                      <div key={rule.id} style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-card)',
                        borderRadius: 8,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}>
                        <Badge variant={SEVERITY_VARIANT[rule.severity] || 'neutral'} style={{ flexShrink: 0, marginTop: 1 }}>
                          {rule.severity}
                        </Badge>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                            {rule.label}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rule.description}</div>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--silver-dim)', flexShrink: 0 }}>
                          {rule.appliesTo.includes('all') ? 'All' : rule.appliesTo.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommended next run */}
          <Card variant="gold">
            <div className="card-title">Run 4 — Transformation Compiler is Ready</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
              This blueprint has been validated. You can now compile a transformation plan in the Transformation Compiler.
            </div>
            <div style={{ marginTop: 10, marginBottom: 12 }}>
              {[
                'Compile a non-destructive product skeleton plan',
                'Review all risks, locks, and blockers before proceeding',
                'Export/import transformation plans safely',
                'No files are written — plan review only',
              ].map((item, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-muted)', padding: '3px 0' }}>→ {item}</div>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/transformation-compiler')}>
              Open Transformation Compiler →
            </button>
          </Card>
        </>
      )}
    </div>
  );
}

export default TransformationReadiness;
