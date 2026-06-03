// 4P3X AgentSafetyBoundary — RUN 3

import React from 'react';

const BOUNDARIES = [
  { icon: '✗', label: 'No file editing', color: '#ff4455' },
  { icon: '✗', label: 'No code rewrites', color: '#ff4455' },
  { icon: '✗', label: 'No external API calls (automatic)', color: '#ff4455' },
  { icon: '✗', label: 'No blueprint direct modification', color: '#ff4455' },
  { icon: '✗', label: 'No destructive actions', color: '#ff4455' },
  { icon: '✗', label: 'No autonomous behaviour', color: '#ff4455' },
  { icon: '✗', label: 'No secrets in output', color: '#ff4455' },
  { icon: '✓', label: 'Advisory analysis only', color: 'var(--green-bright)' },
  { icon: '✓', label: 'Local state inspection only', color: 'var(--green-bright)' },
  { icon: '✓', label: 'Recommendation queue (via SSOT)', color: 'var(--green-bright)' },
  { icon: '✓', label: 'User controls all actions', color: 'var(--green-bright)' },
  { icon: '✓', label: 'All outputs sanitised before display', color: 'var(--green-bright)' },
];

export function AgentSafetyBoundary({ compact = false }) {
  return (
    <div style={{
      background: 'rgba(255,68,85,0.06)',
      border: '1px solid rgba(255,68,85,0.2)',
      borderRadius: 8, padding: compact ? '10px 14px' : '14px 18px',
    }}>
      {!compact && (
        <div style={{ fontSize: 12, fontWeight: 700, color: '#ff6677', marginBottom: 10, letterSpacing: '0.05em' }}>
          AGENT SAFETY BOUNDARY — RUN 3
        </div>
      )}
      <div style={{ display: compact ? 'flex' : 'block', flexWrap: 'wrap', gap: compact ? 6 : 0 }}>
        {BOUNDARIES.map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: compact ? '2px 0' : '4px 0',
            borderBottom: compact ? 'none' : (i < BOUNDARIES.length - 1 ? '1px solid rgba(255,68,85,0.08)' : 'none'),
          }}>
            <span style={{ color: b.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{b.icon}</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{b.label}</span>
          </div>
        ))}
      </div>
      {!compact && (
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Agents are advisory, local-first, limited-authority, and non-destructive.
          All final decisions remain with the user.
        </div>
      )}
    </div>
  );
}

export default AgentSafetyBoundary;
