// 4P3X Internal AI Agents Page — RUN 3

import React, { useState, useEffect } from 'react';
import { getState, subscribe } from '../state/storage.js';
import { getAdvisoryAgents } from '../config/agentRegistry.js';
import AgentCard from '../components/agents/AgentCard.jsx';
import AgentSafetyBoundary from '../components/agents/AgentSafetyBoundary.jsx';
import AgentPermissionsMatrix from '../components/agents/AgentPermissionsMatrix.jsx';
import AgentStatusBadge from '../components/agents/AgentStatusBadge.jsx';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';
import { getRecommendationCounts, sortRecommendationsByPriority } from '../utils/agentOutput.js';

export function AiAgents({ onNavigate }) {
  const [state, setState] = useState(() => getState());

  useEffect(() => {
    const unsub = subscribe((s) => setState({ ...s }));
    return unsub;
  }, []);

  const advisoryAgents = getAdvisoryAgents();
  const agentSystem    = state.agentSystem || {};
  const recQueue       = agentSystem.recommendationQueue || [];
  const agentRuns      = agentSystem.agentRuns || [];
  const counts         = getRecommendationCounts(recQueue);
  const openRecs       = recQueue.filter((r) => r.status === 'open');
  const criticalRecs   = openRecs.filter((r) => r.priority === 'critical');
  const lastRun        = agentRuns.length > 0 ? agentRuns[agentRuns.length - 1] : null;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Internal AI Agents</div>
        <div className="page-subtitle">Advisory · Local-First · Limited-Authority · Non-Destructive</div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <strong>Agents are advisory, local-first, limited-authority, and non-destructive.</strong>
        {' '}They inspect existing local state and generate recommendations only.
        They do not edit files, call external APIs, modify blueprints directly, or perform any autonomous actions.
        All final decisions rest with you.
      </div>

      {/* Summary cards */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <Card>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>AGENT SYSTEM</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <AgentStatusBadge status="active" label={agentSystem.status || 'ready'} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{agentSystem.mode || 'local-advisory'}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{advisoryAgents.length} active advisory agents</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Last run: {agentSystem.lastRunAt ? agentSystem.lastRunAt.slice(0, 19).replace('T', ' ') : 'Never'}
          </div>
        </Card>

        <Card style={{ cursor: 'pointer' }} onClick={() => onNavigate('/agent-recommendations')}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>RECOMMENDATIONS</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold-bright)', marginBottom: 4 }}>
            {openRecs.length}
            <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>open</span>
          </div>
          {criticalRecs.length > 0 && <Badge variant="error">{criticalRecs.length} critical</Badge>}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{counts.total} total · Click to review →</div>
        </Card>

        <Card style={{ cursor: 'pointer' }} onClick={() => onNavigate('/agent-workbench')}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>AGENT WORKBENCH</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--purple-bright)', marginBottom: 4 }}>
            {agentRuns.length}
            <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>runs</span>
          </div>
          {lastRun && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last: {lastRun.agentId}</div>}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Run individual or all agents →</div>
        </Card>
      </div>

      {/* Quick nav */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => onNavigate('/agent-workbench')}>Open Agent Workbench</button>
        <button className="btn btn-secondary" onClick={() => onNavigate('/agent-recommendations')}>View Recommendations ({counts.total})</button>
      </div>

      {/* Agent cards */}
      <div className="section-header" style={{ marginBottom: 12 }}>Advisory Agents ({advisoryAgents.length})</div>
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {advisoryAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onOpenWorkbench={(id) => onNavigate('/agent-workbench', { initialAgentId: id })} />
        ))}
      </div>

      {/* Safety boundary */}
      <div className="section-header" style={{ marginBottom: 12 }}>Safety Boundary</div>
      <div style={{ marginBottom: 24 }}><AgentSafetyBoundary /></div>

      {/* Permissions matrix */}
      <div className="section-header" style={{ marginBottom: 12 }}>Agent Permissions Matrix</div>
      <Card style={{ marginBottom: 24 }}><AgentPermissionsMatrix /></Card>

      {/* System permission locks */}
      <Card variant="neutral" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
          System Permission Locks — Run 3
        </div>
        {[
          ['Autonomy', agentSystem.permissions?.requireUserApproval === true, 'User approval required for all actions'],
          ['File Edits', agentSystem.permissions?.allowFileEdits === false, 'Permanently disabled'],
          ['External API Calls', agentSystem.permissions?.allowExternalApiCalls === false, 'Disabled by default'],
          ['Destructive Actions', agentSystem.permissions?.allowDestructiveActions === false, 'Permanently disabled'],
        ].map(([key, isOk, label]) => (
          <div key={key} className="row-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{key}: {label}</span>
            <Badge variant={isOk ? 'active' : 'error'}>{isOk ? 'Enforced' : 'VIOLATED'}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default AiAgents;
