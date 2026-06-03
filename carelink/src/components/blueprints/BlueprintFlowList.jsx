// 4P3X BlueprintFlowList — RUN 2

import React from 'react';

export function BlueprintFlowList({ flows = [] }) {
  const clean = (flows || []).filter(Boolean);
  if (clean.length === 0) {
    return <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No user flows defined.</div>;
  }
  return (
    <ol style={{ paddingLeft: 18, margin: 0 }}>
      {clean.map((flow, i) => (
        <li key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          {flow}
        </li>
      ))}
    </ol>
  );
}

export default BlueprintFlowList;
