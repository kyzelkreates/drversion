import React, { useMemo } from 'react';
import { useAppState } from '../state/useAppState.js';
import { runProductionHardeningChecks } from '../logic/audit/productionHardening.js';
import { PRODUCTION_HARDENING_RULES }  from '../config/productionHardeningRules.js';
import { Card }  from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';

function HardeningRow({ rule, passed }) {
  const color = passed ? '#22c55e' : (rule.severity === 'critical' ? '#ef4444' : '#f59e0b');
  const icon  = passed ? '✓' : (rule.severity === 'critical' ? '⛔' : '⚠');
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #0f0f0f' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color }}>{icon} {rule.label}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{rule.description}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Applies to: {rule.appliesTo?.join(', ')}</div>
      </div>
      <div style={{ marginLeft: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 10, background: passed ? '#0f1a0f' : '#1a0505', border: `1px solid ${color}`, borderRadius: 4, padding: '2px 6px', color }}>{rule.severity}</span>
      </div>
    </div>
  );
}

export function ProductionHardening() {
  const state   = useAppState();
  const fa      = state.finalAudit || {};
  const h       = fa.hardening || {};

  const { gaps, score, recommendations } = useMemo(() => runProductionHardeningChecks(state), [fa.lastRunAt]);

  const gapIds  = new Set(gaps.map(g => g.ruleId));
  const passing = PRODUCTION_HARDENING_RULES.filter(r => !gapIds.has(r.id));
  const failing = PRODUCTION_HARDENING_RULES.filter(r => gapIds.has(r.id));

  const hardeningFlags = [
    { key: 'ssotVerified',           label: 'SSOT Verified'               },
    { key: 'routesVerified',         label: 'Routes Verified'             },
    { key: 'modulesVerified',        label: 'Modules Verified'            },
    { key: 'secretsCleared',         label: 'Secrets Cleared'             },
    { key: 'noDemoLanguageVerified', label: 'No-Demo Language Verified'   },
    { key: 'agentsSafe',             label: 'Agents Safe'                 },
    { key: 'transformationSafe',     label: 'Transformation Safe'         },
    { key: 'promptsSafe',            label: 'Prompts Safe'                },
    { key: 'workspacesSafe',         label: 'Workspaces Safe'             },
    { key: 'exportsSafe',            label: 'Exports Safe'                },
    { key: 'dashboardPwaReady',      label: 'Dashboard + PWA Ready'       },
    { key: 'pwaReady',               label: 'PWA Ready'                   },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Production Hardening</h1>
            <Badge variant="gold">Run 8</Badge>
          </div>
          <p className="page-subtitle">Hardening confirms production readiness and does not perform risky rewrites.</p>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: score >= 90 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444' }}>
          {score}/100
        </div>
      </div>

      <div style={{ background: '#0a1a0a', border: '1px solid #14532d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#86efac' }}>
        ℹ Hardening confirms production readiness and does not perform risky rewrites or replace working systems.
      </div>

      {/* Hardening flags grid */}
      <Card variant="gold">
        <div className="card-title" style={{ marginBottom: 10 }}>Hardening Status Flags</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
          {hardeningFlags.map(({ key, label }) => {
            const ok = h[key];
            return (
              <div key={key} style={{ background: ok ? '#0f1a0f' : '#1a0505', border: `1px solid ${ok ? '#166534' : '#7f1d1d'}`, borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: ok ? '#22c55e' : '#ef4444', fontSize: 13 }}>{ok ? '✓' : '✗'}</span>
                <span style={{ fontSize: 11, color: ok ? '#22c55e' : '#ef4444' }}>{label}</span>
              </div>
            );
          })}
        </div>
        {!fa.lastRunAt && (
          <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 8 }}>⚠ Run the Final System Audit to populate hardening flags.</div>
        )}
      </Card>

      {/* Rule checklist */}
      <div style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>HARDENING RULES ({PRODUCTION_HARDENING_RULES.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Card variant="default">
            <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 700, marginBottom: 8 }}>✓ Passing ({passing.length})</div>
            {passing.map(r => <HardeningRow key={r.id} rule={r} passed={true} />)}
          </Card>
          <Card variant="default">
            <div style={{ fontSize: 12, color: failing.length ? '#ef4444' : '#22c55e', fontWeight: 700, marginBottom: 8 }}>
              {failing.length ? `⛔ Gaps (${failing.length})` : '✓ No gaps detected'}
            </div>
            {failing.map(r => <HardeningRow key={r.id} rule={r} passed={false} />)}
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card variant="default" style={{ marginTop: 16 }}>
          <div className="card-title" style={{ color: '#f59e0b', marginBottom: 8 }}>Recommended Fixes</div>
          {recommendations.map((rec, i) => (
            <div key={i} style={{ background: '#1a0f00', border: '1px solid #78350f', borderRadius: 6, padding: '8px 12px', marginBottom: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>{rec.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{rec.fix}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
export default ProductionHardening;
