// 4P3X — ModuleActivationPlan — RUN 4
import React from 'react';

function Section({ label, items, color }) {
  if (!items?.length) return null;
  return (
    <div style={styles.section}>
      <strong style={{ ...styles.sectionLabel, color }}>{label}</strong>
      <div style={styles.chips}>
        {items.map((m, i) => (
          <span key={i} style={{ ...styles.chip, color, borderColor: color + '44' }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

export default function ModuleActivationPlan({ moduleActivationPlan }) {
  if (!moduleActivationPlan) return <div style={styles.empty}>No module activation plan generated yet.</div>;
  const { activeModules = [], reservedModules = [], futureModules = [], blockedModules = [] } = moduleActivationPlan;
  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>📦 Module Activation Plan</h4>
      <Section label={`✅ Active Now (${activeModules.length})`}   items={activeModules}   color="#22c55e" />
      <Section label={`🔵 Reserved (${reservedModules.length})`}   items={reservedModules}  color="#60a5fa" />
      <Section label={`🔮 Future (${futureModules.length})`}       items={futureModules}    color="#a78bfa" />
      <Section label={`⛔ Blocked (${blockedModules.length})`}     items={blockedModules}   color="#ef4444" />
      {blockedModules.length > 0 && (
        <p style={styles.warn}>Blocked modules have unmet dependencies. Resolve dependencies before activating.</p>
      )}
    </div>
  );
}

const styles = {
  wrap:         { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:      { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 14px' },
  empty:        { color: '#6b7280', fontSize: 13, padding: 16 },
  section:      { marginBottom: 14 },
  sectionLabel: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 7 },
  chips:        { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip:         { background: '#1a1a1a', border: '1px solid', borderRadius: 10, padding: '3px 10px', fontSize: 12 },
  warn:         { color: '#fca5a5', fontSize: 12, marginTop: 8 },
};
