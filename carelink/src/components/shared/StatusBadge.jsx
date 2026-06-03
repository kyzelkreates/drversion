import React from 'react';

const STATUS_CONFIG = {
  active:    { label: 'Active',    color: 'var(--green-mid)',   bg: 'var(--green-glow)',  border: 'var(--border-green)'  },
  inactive:  { label: 'Inactive',  color: 'var(--silver-mid)', bg: 'rgba(80,80,80,0.2)', border: 'var(--border-subtle)' },
  pending:   { label: 'Pending',   color: 'var(--gold-bright)', bg: 'var(--gold-glow)',  border: 'var(--border-gold)'   },
  synced:    { label: 'Synced',    color: 'var(--green-mid)',   bg: 'var(--green-glow)', border: 'var(--border-green)'  },
  offline:   { label: 'Offline',   color: 'var(--silver-mid)', bg: 'rgba(80,80,80,0.2)', border: 'var(--border-subtle)' },
  discharged:{ label: 'Discharged',color: 'var(--purple-bright)',bg:'var(--purple-glow)',border:'var(--border-purple)'  },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em',
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      textTransform: 'uppercase',
    }}>
      {cfg.label}
    </span>
  );
}
export default StatusBadge;
