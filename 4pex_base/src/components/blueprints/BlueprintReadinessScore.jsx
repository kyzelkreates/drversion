// 4P3X BlueprintReadinessScore — RUN 2

import React from 'react';
import Badge from '../ui/Badge.jsx';

const LEVEL_COLORS = {
  not_ready:           { bar: '#505050', text: 'var(--text-muted)',    badge: 'neutral' },
  partial:             { bar: '#d4a017', text: 'var(--gold-bright)',   badge: 'warn' },
  ready_with_warnings: { bar: '#4a9eff', text: '#4a9eff',             badge: 'info' },
  ready:               { bar: '#00ff88', text: 'var(--green-bright)', badge: 'active' },
};

export function BlueprintReadinessScore({ score = 0, level = 'not_ready', missing = [], warnings = [], compact = false }) {
  const cfg = LEVEL_COLORS[level] || LEVEL_COLORS.not_ready;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `3px solid ${cfg.bar}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: cfg.text }}>{score}</span>
        </div>
        <div>
          <Badge variant={cfg.badge}>{level.replace(/_/g, ' ')}</Badge>
          {!compact && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {missing.length} missing · {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden', marginBottom: compact ? 0 : 10 }}>
        <div style={{
          height: '100%', width: `${score}%`,
          background: cfg.bar, borderRadius: 3,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {!compact && missing.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 4 }}>Missing</div>
          {missing.map((m, i) => (
            <div key={i} style={{ fontSize: 11, color: '#ff6677', padding: '2px 0' }}>• {m}</div>
          ))}
        </div>
      )}

      {!compact && warnings.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 4 }}>Warnings</div>
          {warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 11, color: 'var(--gold-bright)', padding: '2px 0' }}>{w}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlueprintReadinessScore;
