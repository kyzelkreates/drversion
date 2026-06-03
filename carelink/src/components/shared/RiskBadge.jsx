import React from 'react';

const RISK_CONFIG = {
  low:           { label: 'Low',            color: 'var(--green-mid)',    bg: 'var(--green-glow)',   border: 'var(--border-green)' },
  medium:        { label: 'Medium',         color: 'var(--gold-bright)',  bg: 'var(--gold-glow)',    border: 'var(--border-gold)'  },
  high:          { label: 'High',           color: '#ff6644',             bg: 'rgba(255,100,68,0.12)',border: 'rgba(255,100,68,0.3)'},
  urgent_review: { label: 'Urgent Review',  color: '#ff4455',             bg: 'rgba(255,68,85,0.15)',border: 'rgba(255,68,85,0.4)' },
};

export function RiskBadge({ level, size = 'sm' }) {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG.low;
  const pad = size === 'lg' ? '6px 14px' : '3px 10px';
  const fs  = size === 'lg' ? '13px' : '11px';
  return (
    <span style={{
      display: 'inline-block', padding: pad, borderRadius: '20px',
      fontSize: fs, fontWeight: 700, letterSpacing: '0.04em',
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      textTransform: 'uppercase',
    }}>
      {cfg.label}
    </span>
  );
}
export default RiskBadge;
