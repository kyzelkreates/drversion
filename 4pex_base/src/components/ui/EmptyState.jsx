// 4P3X EmptyState component — RUN 1

import React from 'react';

export function EmptyState({ icon, title, description }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      color: 'var(--text-muted)',
    }}>
      {icon && <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>}
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
        {title}
      </div>
      {description && <div style={{ fontSize: 12 }}>{description}</div>}
    </div>
  );
}

export default EmptyState;
