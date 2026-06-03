// 4P3X RefactorPlannerPanel — RUN 2
// Read-only structured preview panel for refactorPlannerAgent.
// No autonomous actions. No AI calls. No file editing.
// Real functionality reserved for Run 3.

import React from 'react';
import { getAgentById } from '../../config/agentRegistry.js';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';

export function RefactorPlannerPanel() {
  const agent = getAgentById('refactorPlannerAgent');
  if (!agent) return null;

  return (
    <Card variant="purple">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--purple-bright)', marginBottom: 2 }}>
            {agent.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Category: {agent.category}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <Badge variant="reserved">Reserved</Badge>
          <Badge variant="neutral">Run {agent.runToBuild}</Badge>
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
        {agent.previewDescription || agent.description}
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
          Allowed Future Purpose
        </div>
        <div style={{ fontSize: 12, color: 'var(--purple-bright)' }}>
          {agent.allowedFuturePurpose}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
          Safety Constraints
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {[
            { label: 'Autonomous', value: agent.autonomyAllowed, color: '#ff4455' },
            { label: 'File Editing', value: agent.fileEditAllowed, color: '#ff4455' },
            { label: 'External API', value: agent.externalApiCallsAllowed, color: '#ff4455' },
          ].map(({ label, value, color }) => (
            <span key={label} style={{
              fontSize: 11, padding: '3px 8px',
              background: value ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,85,0.1)',
              border: `1px solid ${value ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,85,0.3)'}`,
              color: value ? 'var(--green-bright)' : color,
              borderRadius: 4,
            }}>
              {label}: {value ? 'Allowed' : 'Forbidden'}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
          Forbidden Actions
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {agent.forbiddenActions.map((a) => (
            <Badge key={a} variant="error">{a}</Badge>
          ))}
        </div>
      </div>

      <div className="alert alert-warn" style={{ marginTop: 8, fontSize: 11 }}>
        This panel is a read-only preview. No AI functionality is active in Run 2.
        Full agent panels will be built in Run {agent.runToBuild}.
      </div>
    </Card>
  );
}

export default RefactorPlannerPanel;
