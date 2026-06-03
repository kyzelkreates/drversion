// 4P3X Modules page — RUN 1 + RUN 2

import React from 'react';
import moduleRegistry from '../config/moduleRegistry.js';
import { getActiveAgents, getReservedAgents } from '../config/agentRegistry.js';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';

function ModuleCard({ mod }) {
  const isActive = mod.status === 'active';
  const isRun2   = mod.runToBuild === 2;
  return (
    <Card style={{ opacity: isActive ? 1 : 0.65 }} variant={isRun2 && isActive ? 'green' : undefined}>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {mod.label}
        </span>
        <div style={{ display: 'flex', gap: 5 }}>
          <Badge variant={isActive ? 'active' : 'reserved'}>{isActive ? 'Active' : 'Reserved'}</Badge>
          <Badge variant={isRun2 ? 'info' : 'neutral'}>Run {mod.runToBuild}</Badge>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{mod.description}</div>
      <div style={{ fontSize: 11, color: 'var(--silver-dim)' }}>
        Route: <code style={{ color: 'var(--text-secondary)' }}>{mod.route}</code>
        <span style={{ marginLeft: 10, color: mod.canEnable ? 'var(--green-bright)' : '#ff6677' }}>
          {mod.canEnable ? '● Can Enable' : '○ Cannot Enable Yet'}
        </span>
      </div>
    </Card>
  );
}

function AgentCard({ agent }) {
  const isActive = agent.status === 'active';
  const isRun2Visible = agent.visibleInRun2;
  return (
    <Card style={{ opacity: isActive ? 1 : 0.65 }} variant={isRun2Visible && !isActive ? 'purple' : undefined}>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {agent.name}
        </span>
        <div style={{ display: 'flex', gap: 5 }}>
          <Badge variant={isActive ? 'active' : 'reserved'}>{isActive ? 'Active' : 'Reserved'}</Badge>
          <Badge variant="neutral">Run {agent.runToBuild}</Badge>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{agent.description}</div>
      <div className="row" style={{ gap: 5, flexWrap: 'wrap' }}>
        <Badge variant="neutral">{agent.category}</Badge>
        <Badge variant={agent.safetyLevel === 'high-risk' ? 'error' : agent.safetyLevel === 'medium-risk' ? 'warn' : 'info'}>
          {agent.safetyLevel}
        </Badge>
        {isRun2Visible && <Badge variant="info">Visible in Run 2</Badge>}
        {agent.panelType && <Badge variant="neutral">{agent.panelType}</Badge>}
      </div>
    </Card>
  );
}

export function Modules() {
  const run1Active   = moduleRegistry.filter((m) => m.status === 'active' && (m.runToBuild === 1 || m.runToBuild === 'Run 1'));
  const run2Active   = moduleRegistry.filter((m) => m.status === 'active' && (m.runToBuild === 2 || m.runToBuild === 'Run 2'));
  const run3Active   = moduleRegistry.filter((m) => m.status === 'active' && m.runToBuild === 'Run 3');
  const run4Active   = moduleRegistry.filter((m) => m.status === 'active' && m.runToBuild === 'Run 4');
  const run5Active   = moduleRegistry.filter((m) => m.status === 'active' && m.runToBuild === 'Run 5');
  const run6Active   = moduleRegistry.filter((m) => m.status === 'active' && m.runToBuild === 'Run 6');
  const run7Active   = moduleRegistry.filter((m) => m.status === 'active' && m.runToBuild === 'Run 7');
  const run8Active   = moduleRegistry.filter((m) => m.status === 'active' && m.runToBuild === 'Run 8');
  const run9Active   = moduleRegistry.filter((m) => m.status === 'active' && m.runToBuild === 'Run 9');
  const reserved     = moduleRegistry.filter((m) => m.status === 'reserved');
  const activeAgents = getActiveAgents();
  const reservedAgents = getReservedAgents();

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Modules</div>
        <div className="page-subtitle">
          Active and reserved module slots. Navigation is driven by moduleRegistry.js.
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="section-header">Run 1 Active Modules ({run1Active.length})</div>
        <div className="grid-2">{run1Active.map((m) => <ModuleCard key={m.id} mod={m} />)}</div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="section-header">Run 2 Active Modules ({run2Active.length})</div>
        <div className="grid-2">{run2Active.map((m) => <ModuleCard key={m.id} mod={m} />)}</div>
        {run3Active.length > 0 && <><div className="section-header">Run 3 Active Modules ({run3Active.length})</div><div className="grid-2">{run3Active.map((m) => <ModuleCard key={m.id} mod={m} />)}</div></>}
        {run4Active.length > 0 && <><div className="section-header">Run 4 Active Modules ({run4Active.length})</div><div className="grid-2">{run4Active.map((m) => <ModuleCard key={m.id} mod={m} />)}</div></>}
        {run5Active.length > 0 && <><div className="section-header">Run 5 Active Modules ({run5Active.length})</div><div className="grid-2">{run5Active.map((m) => <ModuleCard key={m.id} mod={m} />)}</div></>}
        {run6Active.length > 0 && <><div className="section-header">Run 6 Active Modules ({run6Active.length})</div><div className="grid-2">{run6Active.map((m) => <ModuleCard key={m.id} mod={m} />)}</div></>}
        {run7Active.length > 0 && <><div className="section-header">Run 7 Active Modules ({run7Active.length})</div><div className="grid-2">{run7Active.map((m) => <ModuleCard key={m.id} mod={m} />)}</div></>}
        {run8Active.length > 0 && <><div className="section-header">Run 8 Active Modules ({run8Active.length})</div><div className="grid-2">{run8Active.map((m) => <ModuleCard key={m.id} mod={m} />)}</div></>}
        {run9Active.length > 0 && <><div className="section-header">Run 9 Active Modules ({run9Active.length})</div><div className="grid-2">{run9Active.map((m) => <ModuleCard key={m.id} mod={m} />)}</div></> }
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="section-header">Reserved Modules — Future Runs ({reserved.length})</div>
        <div className="grid-2">{reserved.map((m) => <ModuleCard key={m.id} mod={m} />)}</div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="section-header">Active Agents ({activeAgents.length})</div>
        <div className="grid-2">{activeAgents.map((a) => <AgentCard key={a.id} agent={a} />)}</div>
      </div>

      <div>
        <div className="section-header">Reserved Agents ({reservedAgents.length})</div>
        <div className="grid-2">{reservedAgents.map((a) => <AgentCard key={a.id} agent={a} />)}</div>
      </div>
    </div>
  );
}

export default Modules;
