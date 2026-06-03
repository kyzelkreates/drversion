// 4P3X AgentStatusBadge — RUN 3

import React from 'react';

const STATUS_STYLES = {
  active:    { bg: 'rgba(0,255,136,0.12)', border: 'rgba(0,255,136,0.3)', color: 'var(--green-bright)', dot: '#00ff88' },
  reserved:  { bg: 'rgba(120,80,220,0.12)', border: 'rgba(120,80,220,0.3)', color: 'var(--purple-bright)', dot: '#9966ff' },
  disabled:  { bg: 'rgba(100,100,100,0.12)', border: 'rgba(100,100,100,0.3)', color: 'var(--text-muted)', dot: '#666' },
  advisory:  { bg: 'rgba(74,158,255,0.12)', border: 'rgba(74,158,255,0.3)', color: '#4a9eff', dot: '#4a9eff' },
};

export function AgentStatusBadge({ status = 'reserved', label }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.reserved;
  const displayLabel = label || status;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {displayLabel}
    </span>
  );
}

export default AgentStatusBadge;
