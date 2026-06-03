// 4P3X — UIComponentPlan — RUN 4
import React from 'react';

function ChipList({ label, items, color = '#9ca3af' }) {
  if (!items?.length) return null;
  return (
    <div style={styles.section}>
      <strong style={{ ...styles.label, color }}>{label} ({items.length})</strong>
      <div style={styles.chips}>{items.map((t, i) => <span key={i} style={{ ...styles.chip, borderColor: color + '44', color }}>{t}</span>)}</div>
    </div>
  );
}

export default function UIComponentPlan({ uiComponentPlan }) {
  if (!uiComponentPlan) return <div style={styles.empty}>No UI component plan generated yet.</div>;
  const { pages, components, layouts, requiredStates, missingUxStates } = uiComponentPlan;
  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>🖥️ UI / Component Plan</h4>
      <ChipList label="Pages"          items={pages}           color="#d4a843" />
      <ChipList label="Components"     items={components}      color="#60a5fa" />
      <ChipList label="Layouts"        items={layouts}         color="#a78bfa" />
      <ChipList label="Required States" items={requiredStates} color="#22c55e" />
      {missingUxStates?.length > 0 && (
        <div style={styles.missingBox}>
          <strong style={{ color: '#f59e0b' }}>⚠ Missing UX State Coverage:</strong>
          {missingUxStates.map((m, i) => (
            <div key={i} style={styles.missingItem}>State: <strong>{m.state}</strong> — {m.message}</div>
          ))}
        </div>
      )}
      <p style={styles.runNote}>Planned for: <strong>{uiComponentPlan.runToBuild || 'Run 5'}</strong></p>
    </div>
  );
}

const styles = {
  wrap:        { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:     { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 14px' },
  empty:       { color: '#6b7280', fontSize: 13, padding: 16 },
  section:     { marginBottom: 14 },
  label:       { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 },
  chips:       { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip:        { background: '#1a1a1a', border: '1px solid', borderRadius: 10, padding: '3px 10px', fontSize: 12 },
  missingBox:  { background: '#1c1200', border: '1px solid #78350f', borderRadius: 6, padding: 12, marginBottom: 12 },
  missingItem: { color: '#fde68a', fontSize: 12, marginTop: 4 },
  runNote:     { color: '#6b7280', fontSize: 12, margin: 0 },
};
