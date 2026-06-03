// 4P3X BlueprintDataModelList — RUN 2

import React from 'react';
import Badge from '../ui/Badge.jsx';

export function BlueprintDataModelList({ entities = [] }) {
  const clean = (entities || []).filter(Boolean);
  if (clean.length === 0) {
    return <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No data entities defined.</div>;
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {clean.map((entity, i) => (
        <Badge key={i} variant="info">{entity}</Badge>
      ))}
    </div>
  );
}

export default BlueprintDataModelList;
