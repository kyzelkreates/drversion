// 4P3X — DataModelPlan — RUN 4
import React, { useState } from 'react';

const SOT_COLOR = { 'storage.js': '#22c55e', 'supabase_future': '#a78bfa', 'hybrid_future': '#f59e0b' };

export default function DataModelPlan({ dataModelPlan }) {
  const [expanded, setExpanded] = useState(null);
  if (!dataModelPlan?.entities?.length) return <div style={styles.empty}>No data model plan generated yet.</div>;

  return (
    <div style={styles.wrap}>
      <h4 style={styles.heading}>🗄️ Data Model Plan</h4>
      <p style={styles.note}>{dataModelPlan.entities.length} entities planned. Source of truth is assigned per entity.</p>
      <div style={styles.list}>
        {dataModelPlan.entities.map((e, i) => {
          const sotColor = SOT_COLOR[e.sourceOfTruth] || '#9ca3af';
          const open     = expanded === i;
          return (
            <div key={i} style={styles.card} onClick={() => setExpanded(open ? null : i)}>
              <div style={styles.cardTop}>
                <span style={styles.entityName}>{e.name}</span>
                <div style={styles.badges}>
                  <span style={{ ...styles.badge, color: sotColor, background: sotColor + '22' }}>{e.sourceOfTruth}</span>
                  <span style={styles.runBadge}>{e.runToBuild}</span>
                </div>
              </div>
              <div style={styles.purpose}>{e.purpose}</div>
              {open && (
                <div style={styles.fields}>
                  <strong style={styles.fieldsLabel}>Fields:</strong>
                  <div style={styles.fieldChips}>
                    {(e.fields || []).map((f, fi) => <span key={fi} style={styles.fieldChip}>{f}</span>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap:        { background: '#111', border: '1px solid #333', borderRadius: 8, padding: 20 },
  heading:     { color: '#d4a843', fontSize: 15, fontWeight: 700, margin: '0 0 6px' },
  note:        { color: '#9ca3af', fontSize: 12, margin: '0 0 14px' },
  empty:       { color: '#6b7280', fontSize: 13, padding: 16 },
  list:        { display: 'flex', flexDirection: 'column', gap: 8 },
  card:        { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
  cardTop:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, gap: 8 },
  entityName:  { color: '#e5e7eb', fontSize: 14, fontWeight: 700 },
  badges:      { display: 'flex', gap: 6, flexShrink: 0 },
  badge:       { fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 },
  runBadge:    { fontSize: 10, background: '#222', color: '#9ca3af', padding: '2px 7px', borderRadius: 10 },
  purpose:     { color: '#9ca3af', fontSize: 12 },
  fields:      { marginTop: 10 },
  fieldsLabel: { color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 },
  fieldChips:  { display: 'flex', flexWrap: 'wrap', gap: 5 },
  fieldChip:   { background: '#111', color: '#60a5fa', border: '1px solid #1e3a5f', borderRadius: 4, padding: '2px 7px', fontSize: 11, fontFamily: 'monospace' },
};
