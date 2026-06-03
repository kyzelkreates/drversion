// 4P3X — TransformationRiskPanel — RUN 4
import React, { useState } from 'react';

const SEV_COLOR = { critical: '#ef4444', warning: '#f59e0b', info: '#60a5fa' };
const SEV_BG    = { critical: '#1f0000', warning: '#1c1200', info: '#001530' };

export default function TransformationRiskPanel({ risks = [] }) {
  const [filter, setFilter] = useState('all');

  const counts   = { critical: risks.filter(r => r.severity === 'critical').length, warning: risks.filter(r => r.severity === 'warning').length, info: risks.filter(r => r.severity === 'info').length };
  const filtered = filter === 'all' ? risks : risks.filter(r => r.severity === filter);

  if (risks.length === 0) return (
    <div style={styles.empty}>✅ No risks detected. All scans passed.</div>
  );

  return (
    <div style={styles.wrap}>
      <h3 style={styles.heading}>⚠️ Transformation Risk Scanner</h3>
      <div style={styles.pills}>
        {['all','critical','warning','info'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ ...styles.pill, background: filter === s ? '#d4a843' : '#222', color: filter === s ? '#000' : '#aaa' }}>
            {s.charAt(0).toUpperCase() + s.slice(1)} {s !== 'all' && counts[s] > 0 && `(${counts[s]})`}
          </button>
        ))}
      </div>

      <div style={styles.list}>
        {filtered.map((r, i) => (
          <div key={i} style={{ ...styles.card, borderLeft: `3px solid ${SEV_COLOR[r.severity]}`, background: SEV_BG[r.severity] }}>
            <div style={styles.top}>
              <span style={{ ...styles.sev, color: SEV_COLOR[r.severity] }}>{r.severity.toUpperCase()}</span>
              <span style={styles.cat}>{r.category}</span>
            </div>
            <p style={styles.msg}>{r.message}</p>
            <p style={styles.mit}><strong style={{ color: '#9ca3af' }}>Mitigation:</strong> {r.mitigation}</p>
          </div>
        ))}
      </div>

      {counts.critical > 0 && (
        <div style={styles.blocker}>
          ⛔ {counts.critical} critical risk(s) must be resolved before this plan can reach <strong>ready_for_variant_run</strong> status.
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap:    { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading: { color: '#f59e0b', fontSize: 16, fontWeight: 700, margin: '0 0 12px' },
  empty:   { background: '#0a1a0a', border: '1px solid #166534', borderRadius: 8, padding: 16, color: '#86efac', fontSize: 13 },
  pills:   { display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' },
  pill:    { border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  list:    { display: 'flex', flexDirection: 'column', gap: 10 },
  card:    { borderRadius: 6, padding: '10px 14px' },
  top:     { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 },
  sev:     { fontSize: 11, fontWeight: 700 },
  cat:     { fontSize: 11, color: '#6b7280', background: '#222', padding: '1px 6px', borderRadius: 10 },
  msg:     { color: '#e5e7eb', fontSize: 13, margin: '0 0 6px' },
  mit:     { color: '#d1d5db', fontSize: 12, margin: 0 },
  blocker: { marginTop: 14, background: '#1f0000', border: '1px solid #7f1d1d', borderRadius: 6, padding: 10, color: '#fca5a5', fontSize: 12 },
};
