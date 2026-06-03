// 4P3X AgentWorkbenchPanel — RUN 3

import React from 'react';
import { getActiveAgents } from '../../config/agentRegistry.js';
import AgentRunControls from './AgentRunControls.jsx';

export function AgentWorkbenchPanel({
  selectedAgentId,
  onSelectAgent,
  onRunSelected,
  onRunAll,
  onClearRuns,
  isRunning,
  hasRuns,
  activeBlueprintName,
}) {
  const agents = getActiveAgents();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Blueprint context */}
      <div style={{
        padding: '10px 14px',
        background: activeBlueprintName ? 'rgba(212,160,23,0.08)' : 'rgba(255,100,119,0.08)',
        border: `1px solid ${activeBlueprintName ? 'rgba(212,160,23,0.3)' : 'rgba(255,100,119,0.3)'}`,
        borderRadius: 6,
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active Blueprint: </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: activeBlueprintName ? 'var(--gold-bright)' : '#ff6677' }}>
          {activeBlueprintName || 'None — create and select a blueprint in Blueprint Engine first.'}
        </span>
      </div>

      {/* Agent selector */}
      <div>
        <label className="form-label">Select Agent</label>
        <select
          className="form-input"
          value={selectedAgentId || ''}
          onChange={(e) => onSelectAgent(e.target.value)}
        >
          <option value="">— Select advisory agent —</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.category})
            </option>
          ))}
        </select>
      </div>

      {/* Run controls */}
      <AgentRunControls
        selectedAgentId={selectedAgentId}
        onRunSelected={onRunSelected}
        onRunAll={onRunAll}
        onClearRuns={onClearRuns}
        isRunning={isRunning}
        hasRuns={hasRuns}
      />

      {/* Advisory notice */}
      <div style={{
        fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6,
        padding: '8px 12px', background: 'var(--bg-secondary)',
        borderRadius: 6, border: '1px solid var(--border-subtle)',
      }}>
        Agent analysis is advisory only. It does not edit files, call external APIs, or perform destructive actions.
        All recommendations require your review and approval before acting on them.
      </div>
    </div>
  );
}

export default AgentWorkbenchPanel;
