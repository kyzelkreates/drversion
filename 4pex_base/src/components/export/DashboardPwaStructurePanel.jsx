import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';
import { getAllPatterns } from '../../config/dashboardPwaStructureRules.js';
import { planDashboardPwaStructure } from '../../logic/export/dashboardPwaExportPlanner.js';

export function DashboardPwaStructurePanel({ structure, onUpdate }) {
  const [selected, setSelected] = useState('');
  const patterns = getAllPatterns();

  function handleSelect(productType) {
    setSelected(productType);
    const plan = planDashboardPwaStructure(productType, {});
    if (onUpdate) onUpdate({
      dashboardRequired: true,
      connectedPwaRequired: true,
      dashboardRole: plan.dashboardRole,
      pwaRole: plan.pwaRole,
      monitoringRelationship: plan.monitoringRelationship,
      stateSeparationRequired: true,
      optionalSupabaseSyncLater: true,
    });
  }

  return (
    <Card variant="default">
      <div className="card-title">Dashboard + Connected PWA Structure</div>
      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 10 }}>
        Structural planning only — no product variants are built here.
      </div>

      {onUpdate && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Apply a product pattern:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {patterns.map((p) => (
              <button key={p.productType} className={`btn btn-ghost btn-sm ${selected === p.productType ? 'btn-primary' : ''}`}
                style={{ fontSize: 10 }} onClick={() => handleSelect(p.productType)}>
                {p.productType}
              </button>
            ))}
          </div>
        </div>
      )}

      {structure?.dashboardRequired ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            <div style={{ background: '#111', borderRadius: 6, padding: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Dashboard Role</div>
              <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, marginTop: 2 }}>{structure.dashboardRole || '—'}</div>
            </div>
            <div style={{ background: '#111', borderRadius: 6, padding: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>PWA Role</div>
              <div style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 600, marginTop: 2 }}>{structure.pwaRole || '—'}</div>
            </div>
          </div>
          <div style={{ background: '#0a0a0a', borderRadius: 6, padding: '8px 12px', marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>Monitoring Relationship</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{structure.monitoringRelationship || '—'}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: structure.stateSeparationRequired ? '#22c55e' : '#ef4444' }}>
              {structure.stateSeparationRequired ? '✓' : '⛔'} State Separation Required
            </span>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>
              ⊡ Supabase Sync: {structure.optionalSupabaseSyncLater ? 'Optional — future run' : 'Not planned'}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          No structure defined. Select a product pattern above or set manually.
        </div>
      )}
    </Card>
  );
}
export default DashboardPwaStructurePanel;
