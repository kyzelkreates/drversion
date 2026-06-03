// 4P3X AgentCard — RUN 3

import React from 'react';
import AgentStatusBadge from './AgentStatusBadge.jsx';
import Badge from '../ui/Badge.jsx';

const CATEGORY_COLORS = {
  architecture: 'var(--gold-bright)',
  ux:           '#4a9eff',
  validation:   'var(--green-bright)',
  planning:     'var(--purple-bright)',
  configuration:'var(--silver-bright)',
  compliance:   '#ff6677',
  strategy:     '#ffaa44',
};

const SAFETY_VARIANT = {
  'low-risk':    'info',
  'medium-risk': 'warn',
  'high-risk':   'error',
};

export function AgentCard({ agent, onOpenWorkbench, isRunning = false }) {
  if (!agent) return null;
  const catColor = CATEGORY_COLORS[agent.category] || 'var(--text-secondary)';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid var(--border-card)`,
      borderLeft: `3px solid ${catColor}`,
      borderRadius: 8,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
            {agent.name}
          </div>
          <div style={{ fontSize: 11, color: catColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {agent.category}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <AgentStatusBadge status={agent.status === 'active' ? 'advisory' : 'reserved'} label={agent.status === 'active' ? 'Advisory' : 'Reserved'} />
          <Badge variant={SAFETY_VARIANT[agent.safetyLevel] || 'neutral'}>{agent.safetyLevel}</Badge>
        </div>
      </div>

      {/* Purpose */}
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {agent.purpose || agent.description}
      </div>

      {/* Allowed outputs summary */}
      <div>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 5 }}>
          Allowed Actions
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(agent.allowedActions || []).slice(0, 4).map((a) => (
            <span key={a} style={{
              fontSize: 10, padding: '2px 7px',
              background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: 3, color: 'var(--green-bright)',
            }}>{a}</span>
          ))}
          {(agent.allowedActions || []).length > 4 && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{(agent.allowedActions || []).length - 4} more</span>
          )}
        </div>
      </div>

      {/* Forbidden summary */}
      <div>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 5 }}>
          Forbidden
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(agent.forbiddenActions || []).slice(0, 3).map((a) => (
            <span key={a} style={{
              fontSize: 10, padding: '2px 7px',
              background: 'rgba(255,68,85,0.08)', border: '1px solid rgba(255,68,85,0.2)',
              borderRadius: 3, color: '#ff6677',
            }}>{a}</span>
          ))}
          {(agent.forbiddenActions || []).length > 3 && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{(agent.forbiddenActions || []).length - 3} more</span>
          )}
        </div>
      </div>

      {/* Action */}
      {agent.status === 'active' && onOpenWorkbench && (
        <button
          className="btn btn-primary btn-sm"
          style={{ marginTop: 4 }}
          onClick={() => onOpenWorkbench(agent.id)}
          disabled={isRunning}
        >
          {isRunning ? 'Running…' : 'Open Workbench'}
        </button>
      )}
    </div>
  );
}

export default AgentCard;
