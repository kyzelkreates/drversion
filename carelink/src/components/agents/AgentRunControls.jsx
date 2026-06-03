// 4P3X AgentRunControls — RUN 3

import React from 'react';

export function AgentRunControls({
  selectedAgentId,
  onRunSelected,
  onRunAll,
  onClearRuns,
  isRunning = false,
  hasRuns = false,
}) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <button
        className="btn btn-primary btn-sm"
        onClick={onRunSelected}
        disabled={!selectedAgentId || isRunning}
      >
        {isRunning ? '⏳ Running…' : '▶ Run Selected Agent'}
      </button>

      <button
        className="btn btn-secondary btn-sm"
        onClick={onRunAll}
        disabled={isRunning}
      >
        {isRunning ? '⏳ Running all…' : '▶▶ Run All Agents'}
      </button>

      {hasRuns && (
        <button
          className="btn btn-danger btn-sm"
          onClick={onClearRuns}
          disabled={isRunning}
        >
          Clear Run History
        </button>
      )}

      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
        Advisory only · No external API calls · No file edits
      </span>
    </div>
  );
}

export default AgentRunControls;
