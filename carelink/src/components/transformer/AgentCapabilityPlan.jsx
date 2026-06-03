// 4P3X — AgentCapabilityPlan — RUN 4
import React from 'react';

export default function AgentCapabilityPlan({ agentCapabilityPlan }) {
  if (!agentCapabilityPlan) return <div style={styles.empty}>No agent capability plan generated yet.</div>;
  const { requiredAgents = [], allowedCapabilities = [], forbiddenCapabilities = [], autonomyAllowed, gaps = [] } = agentCapabilityPlan;

  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>🤖 Agent Capability Plan</h4>

      <div style={styles.boundary}>
        <span style={{ color: '#22c55e', fontWeight: 700 }}>Autonomy Allowed: {autonomyAllowed ? 'YES ⚠️' : 'NO ✓'}</span>
        <span style={{ color: '#22c55e', marginLeft: 20 }}>File Edits: {agentCapabilityPlan.fileEditAllowed ? 'YES ⚠️' : 'NO ✓'}</span>
        <span style={{ color: '#22c55e', marginLeft: 20 }}>External Calls: {agentCapabilityPlan.externalCallsAllowed ? 'YES ⚠️' : 'NO ✓'}</span>
      </div>

      <div style={styles.grid}>
        <div style={styles.col}>
          <strong style={{ ...styles.colLabel, color: '#22c55e' }}>Required Agents ({requiredAgents.length})</strong>
          {requiredAgents.map((a, i) => <div key={i} style={styles.agentChip}>{a}</div>)}
          {!requiredAgents.length && <div style={styles.none}>None specified</div>}
        </div>
        <div style={styles.col}>
          <strong style={{ ...styles.colLabel, color: '#60a5fa' }}>Allowed Capabilities ({allowedCapabilities.length})</strong>
          {allowedCapabilities.slice(0, 8).map((c, i) => <div key={i} style={styles.allowChip}>{c}</div>)}
          {allowedCapabilities.length > 8 && <div style={styles.more}>+{allowedCapabilities.length - 8} more</div>}
        </div>
        <div style={styles.col}>
          <strong style={{ ...styles.colLabel, color: '#ef4444' }}>Forbidden ({forbiddenCapabilities.length})</strong>
          {forbiddenCapabilities.slice(0, 8).map((c, i) => <div key={i} style={styles.forbidChip}>{c}</div>)}
          {forbiddenCapabilities.length > 8 && <div style={styles.more}>+{forbiddenCapabilities.length - 8} more</div>}
        </div>
      </div>

      {gaps.length > 0 && (
        <div style={styles.gapBox}>
          <strong style={{ color: '#f59e0b' }}>⚠ Capability Gaps:</strong>
          {gaps.map((g, i) => <div key={i} style={styles.gapItem}>{g.gap}</div>)}
        </div>
      )}

      <p style={styles.note}>{agentCapabilityPlan.note}</p>
    </div>
  );
}

const styles = {
  wrap:      { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:   { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 12px' },
  empty:     { color: '#6b7280', fontSize: 13, padding: 16 },
  boundary:  { background: '#0a1a0a', border: '1px solid #166534', borderRadius: 6, padding: '8px 12px', marginBottom: 16, fontSize: 12 },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 14 },
  col:       { background: '#1a1a1a', borderRadius: 6, padding: 12 },
  colLabel:  { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 },
  agentChip: { color: '#22c55e', background: '#0a1a0a', borderRadius: 4, padding: '3px 8px', fontSize: 12, marginBottom: 4, fontFamily: 'monospace' },
  allowChip: { color: '#93c5fd', background: '#001530', borderRadius: 4, padding: '2px 7px', fontSize: 11, marginBottom: 3 },
  forbidChip:{ color: '#fca5a5', background: '#1f0000', borderRadius: 4, padding: '2px 7px', fontSize: 11, marginBottom: 3 },
  more:      { color: '#6b7280', fontSize: 11, marginTop: 4 },
  none:      { color: '#6b7280', fontSize: 12 },
  gapBox:    { background: '#1c1200', border: '1px solid #78350f', borderRadius: 6, padding: 12, marginBottom: 12 },
  gapItem:   { color: '#fde68a', fontSize: 12, marginTop: 4 },
  note:      { color: '#6b7280', fontSize: 11, margin: 0, fontStyle: 'italic' },
};
