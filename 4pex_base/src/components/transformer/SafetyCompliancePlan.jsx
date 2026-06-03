// 4P3X — SafetyCompliancePlan — RUN 4
import React from 'react';

const LEVEL_COLOR = { safety_critical: '#ef4444', compliance_critical: '#f59e0b', safety_advisory: '#f59e0b', standard: '#22c55e' };

export default function SafetyCompliancePlan({ safetyCompliancePlan }) {
  if (!safetyCompliancePlan) return <div style={styles.empty}>No safety compliance plan generated yet.</div>;
  const { safetyLevel, requiredWarnings = [], humanOverrideRequired, disclaimersRequired, complianceBoundaries = [] } = safetyCompliancePlan;
  const lvlColor = LEVEL_COLOR[safetyLevel] || '#9ca3af';

  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>🛡️ Safety & Compliance Plan</h4>

      <div style={styles.levelBadge}>
        <span style={{ color: lvlColor, fontWeight: 700, fontSize: 14 }}>Safety Level: {safetyLevel?.replace(/_/g, ' ').toUpperCase()}</span>
        <div style={styles.flags}>
          {humanOverrideRequired && <span style={styles.flag}>⚠ Human Override Required</span>}
          {disclaimersRequired   && <span style={styles.flag}>📋 Disclaimers Required</span>}
        </div>
      </div>

      {requiredWarnings.length > 0 && (
        <div style={styles.section}>
          <strong style={styles.sLabel}>Required Warnings</strong>
          {requiredWarnings.map((w, i) => (
            <div key={i} style={styles.warning}>⚠ {w}</div>
          ))}
        </div>
      )}

      {complianceBoundaries.length > 0 && (
        <div style={styles.section}>
          <strong style={styles.sLabel}>Compliance Boundaries</strong>
          {complianceBoundaries.map((b, i) => (
            <div key={i} style={styles.boundary}>🔒 {b}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap:       { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:    { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 14px' },
  empty:      { color: '#6b7280', fontSize: 13, padding: 16 },
  levelBadge: { background: '#1a1a1a', borderRadius: 6, padding: '10px 14px', marginBottom: 16 },
  flags:      { display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' },
  flag:       { background: '#1c1200', border: '1px solid #78350f', borderRadius: 10, padding: '2px 10px', color: '#fde68a', fontSize: 11 },
  section:    { marginBottom: 14 },
  sLabel:     { color: '#9ca3af', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 },
  warning:    { color: '#fde68a', background: '#1c1200', border: '1px solid #78350f40', borderRadius: 5, padding: '6px 10px', fontSize: 12, marginBottom: 5 },
  boundary:   { color: '#e5e7eb', background: '#1a1a1a', borderRadius: 5, padding: '6px 10px', fontSize: 12, marginBottom: 5 },
};
