// 4P3X — TransformationLockPanel — RUN 4
import React from 'react';
import { LOCK_DEFINITIONS } from '../../logic/transformer/transformationLocks.js';

export default function TransformationLockPanel({ locks = {}, violations = [], compileReasons = [] }) {
  const lockIds = Object.keys(LOCK_DEFINITIONS);

  return (
    <div style={styles.wrap}>
      <h3 style={styles.heading}>🔒 Transformation Locks</h3>
      <p style={styles.sub}>Non-destructive compile boundaries. All locks must pass before a plan can proceed.</p>
      <div style={styles.grid}>
        {lockIds.map((id) => {
          const def      = LOCK_DEFINITIONS[id];
          const enabled  = locks[id] !== false;
          const violated = violations.some(v => v.lockId === id);
          const blocked  = compileReasons.some(r => r.toLowerCase().includes(id.toLowerCase()));
          const status   = !enabled ? 'disabled' : violated ? 'violated' : blocked ? 'blocked' : 'passed';
          const colors   = { passed: '#22c55e', violated: '#ef4444', blocked: '#f59e0b', disabled: '#6b7280' };
          return (
            <div key={id} style={{ ...styles.row, borderLeft: `3px solid ${colors[status]}` }}>
              <span style={{ ...styles.dot, background: colors[status] }} />
              <div style={styles.info}>
                <span style={styles.label}>{def.label}</span>
                <span style={styles.desc}>{def.description}</span>
              </div>
              <span style={{ ...styles.badge, background: colors[status] + '22', color: colors[status] }}>
                {status.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
      {violations.length > 0 && (
        <div style={styles.violationsBox}>
          <strong style={{ color: '#ef4444' }}>Lock Violations:</strong>
          {violations.map((v, i) => (
            <div key={i} style={styles.violationItem}>⛔ {v.message}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap:  { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading: { color: '#d4a843', fontSize: 16, fontWeight: 700, margin: '0 0 6px' },
  sub:   { color: '#888', fontSize: 12, margin: '0 0 16px' },
  grid:  { display: 'flex', flexDirection: 'column', gap: 8 },
  row:   { display: 'flex', alignItems: 'flex-start', gap: 10, background: '#1a1a1a', borderRadius: 6, padding: '10px 12px' },
  dot:   { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5 },
  info:  { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  label: { color: '#e5e7eb', fontSize: 13, fontWeight: 600 },
  desc:  { color: '#9ca3af', fontSize: 11 },
  badge: { fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, flexShrink: 0 },
  violationsBox: { marginTop: 14, background: '#1f0000', border: '1px solid #7f1d1d', borderRadius: 6, padding: 12 },
  violationItem: { color: '#fca5a5', fontSize: 12, marginTop: 4 },
};
