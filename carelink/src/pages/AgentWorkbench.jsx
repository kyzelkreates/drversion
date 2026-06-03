// 4P3X Agent Workbench Page — RUN 3

import React, { useState, useEffect } from 'react';
import { getState, subscribe, runAgent, runAllAgents, clearAgentRuns } from '../state/storage.js';
import { getAgentById } from '../config/agentRegistry.js';
import AgentWorkbenchPanel from '../components/agents/AgentWorkbenchPanel.jsx';
import AgentOutputCard from '../components/agents/AgentOutputCard.jsx';
import AgentSafetyBoundary from '../components/agents/AgentSafetyBoundary.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { summarizeAgentRun } from '../utils/agentOutput.js';

export function AgentWorkbench({ onNavigate, initialAgentId }) {
  const [state, setState]              = useState(() => getState());
  const [selectedAgentId, setSelected] = useState(initialAgentId || '');
  const [isRunning, setIsRunning]      = useState(false);
  const [currentOutput, setCurrentOutput] = useState(null);
  const [currentAgentName, setCurrentAgentName] = useState('');
  const [runErrors, setRunErrors]      = useState([]);
  const [allRunResults, setAllRunResults] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const unsub = subscribe((s) => setState({ ...s }));
    return unsub;
  }, []);

  const agentSystem = state.agentSystem || {};
  const agentRuns   = agentSystem.agentRuns || [];
  const blueprints  = state.blueprints || {};
  const bpItems     = blueprints.items || [];
  const activeBp    = bpItems.find((b) => b.id === blueprints.activeBlueprintId) || bpItems[0] || null;

  function handleRunSelected() {
    if (!selectedAgentId) return;
    setIsRunning(true); setRunErrors([]); setAllRunResults(null);
    try {
      const result = runAgent(selectedAgentId);
      if (result.ok) {
        setCurrentOutput(result.agentRun);
        setCurrentAgentName(getAgentById(selectedAgentId)?.name || selectedAgentId);
        setRunErrors([]);
      } else {
        setRunErrors(result.errors || ['Unknown error running agent.']);
      }
    } catch (e) { setRunErrors([e.message]); }
    finally { setIsRunning(false); }
  }

  function handleRunAll() {
    setIsRunning(true); setRunErrors([]); setAllRunResults(null);
    try {
      const results = runAllAgents();
      setAllRunResults(results);
      const last = [...results].reverse().find((r) => r.ok);
      if (last) {
        setCurrentOutput(last.agentRun);
        setCurrentAgentName(getAgentById(last.agentId)?.name || last.agentId);
      }
    } catch (e) { setRunErrors([e.message]); }
    finally { setIsRunning(false); }
  }

  function handleClearRuns() {
    if (!showClearConfirm) { setShowClearConfirm(true); return; }
    clearAgentRuns();
    setCurrentOutput(null); setAllRunResults(null); setShowClearConfirm(false);
  }

  const runsByAgent = agentRuns.reduce((acc, run) => {
    if (!acc[run.agentId]) acc[run.agentId] = [];
    acc[run.agentId].push(run);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Agent Workbench</div>
        <div className="page-subtitle">Run advisory agents against your active blueprint and transformation state</div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        Agent analysis is advisory only. It does not edit files, call external APIs, or perform destructive actions.
        All recommendations require your review.
      </div>

      {runErrors.length > 0 && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          {runErrors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      {allRunResults && (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
            All Agents Run — {allRunResults.length} agents
          </div>
          {allRunResults.map((r) => {
            const agent = getAgentById(r.agentId);
            return (
              <div key={r.agentId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginRight: 8 }}>{agent?.name || r.agentId}</span>
                  {r.agentRun && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{summarizeAgentRun(r.agentRun)}</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge variant={r.ok ? 'active' : 'error'}>{r.ok ? 'OK' : 'Error'}</Badge>
                  {r.ok && r.agentRun && (
                    <button className="btn btn-ghost btn-sm" onClick={() => { setCurrentOutput(r.agentRun); setCurrentAgentName(agent?.name || r.agentId); }}>
                      View
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div className="card-title" style={{ marginBottom: 14 }}>Run Controls</div>
            <AgentWorkbenchPanel
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelected}
              onRunSelected={handleRunSelected}
              onRunAll={handleRunAll}
              onClearRuns={handleClearRuns}
              isRunning={isRunning}
              hasRuns={agentRuns.length > 0}
              activeBlueprintName={activeBp?.name}
            />
            {showClearConfirm && (
              <div className="alert alert-warn" style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, marginBottom: 8 }}>Confirm: clear all run history?</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-danger btn-sm" onClick={handleClearRuns}>Yes, Clear All</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowClearConfirm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </Card>

          {Object.keys(runsByAgent).length > 0 && (
            <Card>
              <div className="card-title" style={{ marginBottom: 10 }}>Run History ({agentRuns.length})</div>
              {Object.entries(runsByAgent).map(([agentId, runs]) => {
                const agent = getAgentById(agentId);
                return (
                  <div key={agentId} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {agent?.name || agentId} ({runs.length})
                    </div>
                    {[...runs].reverse().slice(0, 3).map((run) => (
                      <button key={run.id} className="btn btn-ghost btn-sm"
                        style={{ width: '100%', textAlign: 'left', marginBottom: 3, fontSize: 11 }}
                        onClick={() => { setCurrentOutput(run); setCurrentAgentName(agent?.name || agentId); }}>
                        {run.createdAt?.slice(0, 19).replace('T', ' ')} · {run.blockers?.length > 0 ? `${run.blockers.length} blockers` : `${run.findings?.length || 0} findings`}
                      </button>
                    ))}
                  </div>
                );
              })}
            </Card>
          )}

          <Card>
            <div className="card-title" style={{ marginBottom: 10 }}>Safety Boundary</div>
            <AgentSafetyBoundary compact />
          </Card>
        </div>

        {/* Right output */}
        <Card>
          <div className="row-between" style={{ marginBottom: 14 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              {currentOutput ? `Output — ${currentAgentName}` : 'Agent Output'}
            </div>
            {currentOutput && (
              <Badge variant={currentOutput.blockers?.length > 0 ? 'error' : currentOutput.warnings?.length > 0 ? 'warn' : 'active'}>
                {currentOutput.blockers?.length > 0 ? `${currentOutput.blockers.length} blockers` : currentOutput.warnings?.length > 0 ? `${currentOutput.warnings.length} warnings` : 'Clean'}
              </Badge>
            )}
          </div>
          {isRunning ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>⏳</div>
              <div>Running advisory analysis…</div>
              <div style={{ fontSize: 11, marginTop: 6 }}>Local analysis only — no external API calls.</div>
            </div>
          ) : (
            <AgentOutputCard agentRun={currentOutput} agentName={currentAgentName} />
          )}
        </Card>
      </div>
    </div>
  );
}

export default AgentWorkbench;
