// 4P3X — CompilerControlPanel — RUN 4
import React from 'react';

export default function CompilerControlPanel({ blueprint, readiness, depStatus, locks, compileMode, onCompile, compiling, canCompile, blockReasons = [] }) {
  const score  = readiness?.score ?? 0;
  const level  = readiness?.level ?? 'not_ready';
  const colors = { ready: '#22c55e', ready_with_warnings: '#f59e0b', partial: '#f59e0b', not_ready: '#ef4444' };
  const scoreColor = colors[level] || '#6b7280';

  return (
    <div style={styles.wrap}>
      <h3 style={styles.heading}>⚙️ Compiler Control Panel</h3>
      <p style={styles.note}>
        Compilation is <strong style={{ color: '#22c55e' }}>non-destructive</strong>. It creates a product skeleton plan only. No files are written.
      </p>

      <div style={styles.grid}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Active Blueprint</span>
          <span style={styles.statVal}>{blueprint?.name || <em style={{ color: '#6b7280' }}>None selected</em>}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Product Type</span>
          <span style={styles.statVal}>{blueprint?.productType || '—'}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Readiness Score</span>
          <span style={{ ...styles.statVal, color: scoreColor }}>{score}/100 — {level.replace(/_/g, ' ')}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Compile Mode</span>
          <span style={{ ...styles.statVal, color: '#22c55e' }}>{compileMode || 'non_destructive'}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Dependency Map</span>
          <span style={{ ...styles.statVal, color: depStatus ? '#22c55e' : '#f59e0b' }}>{depStatus ? 'Loaded' : 'Using defaults'}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Lock Status</span>
          <span style={{ ...styles.statVal, color: '#22c55e' }}>
            {Object.values(locks || {}).every(v => v === true) ? 'All locks active ✓' : 'Some locks inactive ⚠'}
          </span>
        </div>
      </div>

      {blockReasons.length > 0 && (
        <div style={styles.blockerBox}>
          <strong style={{ color: '#f87171' }}>Cannot compile — blockers:</strong>
          {blockReasons.map((r, i) => <div key={i} style={styles.blockerItem}>⛔ {r}</div>)}
        </div>
      )}

      <button
        onClick={onCompile}
        disabled={!canCompile || compiling}
        style={{ ...styles.btn, opacity: (!canCompile || compiling) ? 0.45 : 1 }}
      >
        {compiling ? '⟳ Compiling…' : '▶ Compile Transformation Plan'}
      </button>
    </div>
  );
}

const styles = {
  wrap:        { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:     { color: '#d4a843', fontSize: 16, fontWeight: 700, margin: '0 0 8px' },
  note:        { color: '#9ca3af', fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 16 },
  stat:        { background: '#1a1a1a', borderRadius: 6, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 3 },
  statLabel:   { color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' },
  statVal:     { color: '#e5e7eb', fontSize: 13, fontWeight: 600 },
  blockerBox:  { background: '#1f0000', border: '1px solid #7f1d1d', borderRadius: 6, padding: 12, marginBottom: 14 },
  blockerItem: { color: '#fca5a5', fontSize: 12, marginTop: 4 },
  btn:         { background: '#d4a843', color: '#000', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' },
};
