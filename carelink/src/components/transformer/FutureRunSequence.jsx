// 4P3X — FutureRunSequence — RUN 4
import React, { useState } from 'react';

export default function FutureRunSequence({ futureRunSequence = [] }) {
  const [open, setOpen] = useState(null);

  if (!futureRunSequence.length) return <div style={styles.empty}>No future run sequence generated yet.</div>;

  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>🗓️ Future Run Sequence</h4>
      <p style={styles.note}>These runs are planned only. None are executed by this compiler.</p>

      <div style={styles.list}>
        {futureRunSequence.map((run, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={styles.card}>
              <div style={styles.cardTop} onClick={() => setOpen(isOpen ? null : i)}>
                <div>
                  <span style={styles.runBadge}>{run.run}</span>
                  <span style={styles.title}>{run.title}</span>
                </div>
                <span style={styles.toggle}>{isOpen ? '▲' : '▼'}</span>
              </div>
              <div style={styles.mission}>{run.mission}</div>

              {isOpen && (
                <div style={styles.detail}>
                  <Section label="✅ Allowed Files" items={run.allowedFiles}    color="#22c55e" />
                  <Section label="🔒 Forbidden Files" items={run.forbiddenFiles} color="#ef4444" />
                  <Section label="✓ Validation Gates" items={run.validationGates} color="#60a5fa" />
                  <Section label="⛔ Stop Conditions" items={run.stopConditions} color="#f59e0b" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({ label, items, color }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <strong style={{ fontSize: 11, color, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 5 }}>{label}</strong>
      {items.map((item, i) => (
        <div key={i} style={{ color: '#d1d5db', fontSize: 12, padding: '2px 0', paddingLeft: 8, borderLeft: `2px solid ${color}40`, marginBottom: 2 }}>{item}</div>
      ))}
    </div>
  );
}

const styles = {
  wrap:     { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:  { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 6px' },
  note:     { color: '#9ca3af', fontSize: 12, margin: '0 0 14px' },
  empty:    { color: '#6b7280', fontSize: 13, padding: 16 },
  list:     { display: 'flex', flexDirection: 'column', gap: 8 },
  card:     { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, padding: '12px 14px' },
  cardTop:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 4 },
  runBadge: { background: '#d4a843', color: '#000', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, marginRight: 8 },
  title:    { color: '#e5e7eb', fontSize: 13, fontWeight: 600 },
  toggle:   { color: '#9ca3af', fontSize: 12 },
  mission:  { color: '#9ca3af', fontSize: 12, lineHeight: 1.5 },
  detail:   { marginTop: 12, borderTop: '1px solid #2a2a2a', paddingTop: 12 },
};
