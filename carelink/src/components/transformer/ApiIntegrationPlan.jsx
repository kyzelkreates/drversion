// 4P3X — ApiIntegrationPlan — RUN 4
import React from 'react';

export default function ApiIntegrationPlan({ apiIntegrationPlan }) {
  if (!apiIntegrationPlan) return <div style={styles.empty}>No API integration plan generated yet.</div>;
  const { providers = [], requiredKeys = [], clientSafeOnly, backendProxyRequired, secretRisks = [], missingConfig = [], runToBuild } = apiIntegrationPlan;

  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>🔌 API / Integration Plan</h4>
      <div style={styles.grid}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Providers</span>
          <span style={styles.statVal}>{providers.length || 'None declared'}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Client Safe Only</span>
          <span style={{ ...styles.statVal, color: clientSafeOnly ? '#22c55e' : '#f59e0b' }}>{clientSafeOnly ? 'Yes' : 'No — backend proxy required'}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Backend Proxy Required</span>
          <span style={{ ...styles.statVal, color: backendProxyRequired ? '#f59e0b' : '#22c55e' }}>{backendProxyRequired ? 'Yes — future backend run' : 'No'}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Planned For</span>
          <span style={styles.statVal}>{runToBuild || 'Run 5'}</span>
        </div>
      </div>

      {requiredKeys.length > 0 && (
        <div style={styles.section}>
          <strong style={styles.sectionLabel}>Required Keys (masked names only)</strong>
          {requiredKeys.map((k, i) => (
            <div key={i} style={styles.keyRow}>
              <span style={styles.keyName}>{k.keyName}</span>
              <span style={{ color: k.clientSafe ? '#22c55e' : '#f59e0b', fontSize: 11 }}>{k.clientSafe ? 'Client safe' : 'Backend proxy required'}</span>
              <span style={styles.keyNote}>{k.storageNote}</span>
            </div>
          ))}
        </div>
      )}

      {secretRisks.length > 0 && (
        <div style={styles.riskBox}>
          <strong style={{ color: '#f59e0b' }}>⚠ Secret Exposure Risks:</strong>
          {secretRisks.map((r, i) => <div key={i} style={styles.riskItem}>{r.risk} <em style={{ color: '#6b7280' }}>→ {r.mitigation}</em></div>)}
        </div>
      )}

      {missingConfig.length > 0 && (
        <div style={styles.missingBox}>
          <strong style={{ color: '#60a5fa' }}>ℹ Missing API Config:</strong>
          {missingConfig.map((m, i) => <div key={i} style={styles.missingItem}>{m.message}</div>)}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap:         { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:      { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 14px' },
  empty:        { color: '#6b7280', fontSize: 13, padding: 16 },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 16 },
  stat:         { background: '#1a1a1a', borderRadius: 6, padding: '10px 12px' },
  statLabel:    { color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 3 },
  statVal:      { color: '#e5e7eb', fontSize: 13, fontWeight: 600 },
  section:      { marginBottom: 14 },
  sectionLabel: { color: '#9ca3af', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 },
  keyRow:       { background: '#1a1a1a', borderRadius: 6, padding: '8px 12px', marginBottom: 5, display: 'flex', flexDirection: 'column', gap: 2 },
  keyName:      { color: '#e5e7eb', fontSize: 13, fontFamily: 'monospace', fontWeight: 600 },
  keyNote:      { color: '#6b7280', fontSize: 11 },
  riskBox:      { background: '#1c1200', border: '1px solid #78350f', borderRadius: 6, padding: 12, marginBottom: 10 },
  riskItem:     { color: '#fde68a', fontSize: 12, marginTop: 4 },
  missingBox:   { background: '#001530', border: '1px solid #1e3a5f', borderRadius: 6, padding: 12 },
  missingItem:  { color: '#93c5fd', fontSize: 12, marginTop: 4 },
};
