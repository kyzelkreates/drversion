// 4P3X — SkeletonPlanCard — RUN 4
import React from 'react';

const STATUS_COLOR = {
  draft:                 '#9ca3af',
  compiled:              '#60a5fa',
  blocked:               '#ef4444',
  ready_for_variant_run: '#22c55e',
};

export default function SkeletonPlanCard({ plan, onSelect, onDelete, active }) {
  if (!plan) return null;
  const sc   = STATUS_COLOR[plan.status] || '#9ca3af';
  const crit = (plan.risks || []).filter(r => r.severity === 'critical').length;

  return (
    <div style={{ ...styles.wrap, border: active ? '1px solid #d4a843' : '1px solid #333' }}>
      <div style={styles.top}>
        <div>
          <span style={styles.name}>{plan.blueprintName}</span>
          <span style={styles.type}>{plan.productType}</span>
        </div>
        <span style={{ ...styles.status, color: sc, background: sc + '22' }}>{plan.status.replace(/_/g, ' ')}</span>
      </div>

      <div style={styles.row}>
        <div style={styles.pill}>Readiness: <strong style={{ color: '#d4a843' }}>{plan.readiness?.score ?? 0}/100</strong></div>
        {crit > 0 && <div style={{ ...styles.pill, color: '#ef4444' }}>⛔ {crit} critical risk{crit > 1 ? 's' : ''}</div>}
        {(plan.blockers || []).length > 0 && <div style={{ ...styles.pill, color: '#f59e0b' }}>⚠ {plan.blockers.length} blocker{plan.blockers.length > 1 ? 's' : ''}</div>}
      </div>

      <div style={styles.meta}>Compiled: {plan.audit?.compiledAt ? new Date(plan.audit.compiledAt).toLocaleString() : 'Unknown'}</div>

      <div style={styles.actions}>
        <button onClick={() => onSelect?.(plan)} style={styles.btnPrimary}>Open Detail</button>
        <button onClick={() => onDelete?.(plan.id)} style={styles.btnDanger}>Delete</button>
      </div>
    </div>
  );
}

const styles = {
  wrap:       { background: '#111', borderRadius: 8, padding: 16 },
  top:        { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 },
  name:       { color: '#e5e7eb', fontSize: 14, fontWeight: 700, display: 'block' },
  type:       { color: '#9ca3af', fontSize: 12, display: 'block', marginTop: 2 },
  status:     { fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 10, flexShrink: 0, textTransform: 'uppercase' },
  row:        { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  pill:       { fontSize: 12, color: '#9ca3af', background: '#1a1a1a', borderRadius: 10, padding: '2px 8px' },
  meta:       { color: '#6b7280', fontSize: 11, marginBottom: 12 },
  actions:    { display: 'flex', gap: 8 },
  btnPrimary: { background: '#d4a843', color: '#000', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', flex: 1 },
  btnDanger:  { background: '#1f0000', color: '#f87171', border: '1px solid #7f1d1d', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
};
