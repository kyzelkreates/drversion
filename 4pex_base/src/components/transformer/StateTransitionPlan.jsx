// 4P3X — StateTransitionPlan — RUN 4
import React, { useState } from 'react';

export default function StateTransitionPlan({ stateTransitionPlan }) {
  const [filter, setFilter] = useState('all');
  if (!stateTransitionPlan?.transitions?.length) return <div style={styles.empty}>No state transition plan generated yet.</div>;

  const all     = stateTransitionPlan.transitions;
  const display = filter === 'validated' ? all.filter(t => t.validationRequired) : all;

  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>🔄 State Transition Plan</h4>
      <p style={styles.note}>{all.length} transitions planned. All state must flow through storage.js SSOT.</p>

      <div style={styles.pills}>
        <button onClick={() => setFilter('all')}       style={{ ...styles.pill, background: filter === 'all'       ? '#d4a843' : '#222', color: filter === 'all'       ? '#000' : '#aaa' }}>All ({all.length})</button>
        <button onClick={() => setFilter('validated')} style={{ ...styles.pill, background: filter === 'validated' ? '#d4a843' : '#222', color: filter === 'validated' ? '#000' : '#aaa' }}>Validation Required ({all.filter(t => t.validationRequired).length})</button>
      </div>

      <div style={styles.table}>
        <div style={styles.thead}>
          <span>Transition</span><span>From</span><span>To</span><span>Validation</span>
        </div>
        {display.map((t, i) => (
          <div key={i} style={styles.trow}>
            <div>
              <span style={styles.tname}>{t.name}</span>
              <span style={styles.trigger}>{t.trigger}</span>
            </div>
            <span style={styles.state}>{t.from}</span>
            <span style={styles.state}>{t.to}</span>
            <span style={{ color: t.validationRequired ? '#22c55e' : '#6b7280', fontSize: 12 }}>{t.validationRequired ? '✓ Required' : 'Optional'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap:    { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading: { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 6px' },
  note:    { color: '#9ca3af', fontSize: 12, margin: '0 0 12px' },
  empty:   { color: '#6b7280', fontSize: 13, padding: 16 },
  pills:   { display: 'flex', gap: 6, marginBottom: 14 },
  pill:    { border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  table:   { display: 'flex', flexDirection: 'column', gap: 4 },
  thead:   { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, padding: '4px 10px', color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' },
  trow:    { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, background: '#1a1a1a', borderRadius: 6, padding: '8px 10px', alignItems: 'center' },
  tname:   { color: '#e5e7eb', fontSize: 13, fontWeight: 600, display: 'block' },
  trigger: { color: '#6b7280', fontSize: 11, display: 'block', marginTop: 2 },
  state:   { color: '#9ca3af', fontSize: 12, fontFamily: 'monospace' },
};
