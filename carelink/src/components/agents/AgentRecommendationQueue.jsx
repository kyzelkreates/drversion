// 4P3X AgentRecommendationQueue — RUN 3

import React from 'react';
import Badge from '../ui/Badge.jsx';

const PRIORITY_VARIANT = { critical: 'error', high: 'warn', medium: 'info', low: 'neutral' };
const STATUS_VARIANT   = {
  open: 'neutral', accepted: 'active', dismissed: 'neutral',
  converted_to_future_run: 'info',
};
const CATEGORY_COLORS = {
  architecture: 'var(--gold-bright)',  ux: '#4a9eff',
  validation: 'var(--green-bright)',   refactor: 'var(--purple-bright)',
  api: 'var(--silver-bright)',         safety: '#ff6677',  strategy: '#ffaa44',
};

export function AgentRecommendationQueue({
  recommendations = [],
  onAccept,
  onDismiss,
  onConvertToFutureRun,
}) {
  if (recommendations.length === 0) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>No recommendations yet</div>
        <div style={{ fontSize: 12 }}>Run agents in the Agent Workbench to generate recommendations.</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {recommendations.map((rec) => {
        const catColor = CATEGORY_COLORS[rec.category] || 'var(--text-muted)';
        const isDone = rec.status !== 'open';
        return (
          <div key={rec.id} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderLeft: `3px solid ${catColor}`,
            borderRadius: 8, padding: '12px 14px',
            opacity: isDone ? 0.7 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)', marginBottom: 2 }}>
                  {rec.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {rec.agentId} · {rec.category} · {rec.suggestedRun || 'Run 4'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
                <Badge variant={PRIORITY_VARIANT[rec.priority] || 'neutral'}>{rec.priority}</Badge>
                <Badge variant={STATUS_VARIANT[rec.status] || 'neutral'}>
                  {rec.status?.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
              {rec.description}
            </div>

            {rec.status === 'open' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-green btn-sm" onClick={() => onAccept(rec.id)}>Accept</button>
                <button className="btn btn-ghost btn-sm" onClick={() => onConvertToFutureRun(rec.id)}>→ Future Run</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDismiss(rec.id)}>Dismiss</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AgentRecommendationQueue;
