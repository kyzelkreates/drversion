import React from 'react';
import { compareWorkspaces } from '../../logic/workspaces/workspaceComparison.js';

const levelColors = { ready: '#22c55e', ready_with_warnings: '#f59e0b', partial: '#8b5cf6', not_ready: '#ef4444' };

export function WorkspaceComparisonTable({ workspaceIds, state }) {
  if (!workspaceIds || workspaceIds.length < 2) {
    return <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: 16 }}>Select at least two workspaces to compare.</div>;
  }

  const result = compareWorkspaces(workspaceIds, state);
  if (result.error) return <div style={{ fontSize: 12, color: '#ef4444', padding: 16 }}>{result.error}</div>;

  const rows = [
    { label: 'Product Type',       values: result.productTypes?.map((w) => w.productType || '—') },
    { label: 'Status',             values: result.progress?.map((w) => w.status || '—') },
    { label: 'Readiness Score',    values: result.readiness?.map((w) => `${w.score}/100`) },
    { label: 'Readiness Level',    values: result.readiness?.map((w) => ({ val: w.level?.replace(/_/g,' '), color: levelColors[w.level] })) },
    { label: 'Progress',           values: result.progress?.map((w) => `${w.progressPercent}% (${w.completedRuns}/${w.totalRuns})`) },
    { label: 'Active Run',         values: result.progress?.map((w) => w.activeRun || 'None') },
    { label: 'Blueprint Linked',   values: result.linkedAssets?.map((w) => w.hasBlueprint ? { val: '✓ Yes', color: '#22c55e' } : { val: '✗ No', color: '#ef4444' }) },
    { label: 'Plan Linked',        values: result.linkedAssets?.map((w) => w.hasTransformationPlan ? { val: '✓ Yes', color: '#22c55e' } : { val: '✗ No', color: '#ef4444' }) },
    { label: 'Prompts Linked',     values: result.linkedAssets?.map((w) => `${w.linkedPromptCount}`) },
    { label: 'Critical Blockers',  values: result.blockers?.map((w) => w.criticalOpen > 0 ? { val: w.criticalOpen, color: '#ef4444' } : { val: '0', color: '#22c55e' }) },
    { label: 'Next Action',        values: result.nextActions?.map((w) => w.nextAction) },
  ];

  const names = result.workspaces.map((w) => w.name);

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 10 }}>
        Comparison is read-only. Workspace state is never merged or mutated.
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '6px 10px', background: '#111', color: 'var(--gold)', fontSize: 11, borderBottom: '1px solid #2a2a2a' }}>Field</th>
            {names.map((n) => (
              <th key={n} style={{ textAlign: 'left', padding: '6px 10px', background: '#111', color: 'var(--text-primary)', fontSize: 11, borderBottom: '1px solid #2a2a2a' }}>{n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} style={{ background: i % 2 === 0 ? '#0a0a0a' : '#111' }}>
              <td style={{ padding: '6px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>{row.label}</td>
              {(row.values || []).map((v, j) => {
                const isObj = v && typeof v === 'object';
                return (
                  <td key={j} style={{ padding: '6px 10px', color: isObj ? v.color : 'var(--text-primary)' }}>
                    {isObj ? v.val : String(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default WorkspaceComparisonTable;
