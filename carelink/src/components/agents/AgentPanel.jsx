// 4P3X AgentPanel — RUN 3
// Reusable wrapper panel for agent sections.

import React from 'react';

export function AgentPanel({ title, subtitle, accentColor, children, style }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid var(--border-card)`,
      borderTop: accentColor ? `2px solid ${accentColor}` : undefined,
      borderRadius: 8,
      padding: '16px',
      ...style,
    }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 14 }}>
          {title && (
            <div style={{ fontSize: 13, fontWeight: 700, color: accentColor || 'var(--text-primary)', marginBottom: 2 }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{subtitle}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default AgentPanel;
