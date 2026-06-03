// 4P3X AgentPermissionsMatrix — RUN 3

import React from 'react';
import { getAllAgentPermissions } from '../../logic/agents/agentPermissions.js';

const COL_LABELS = [
  { key: 'readBlueprint',       label: 'Read Blueprint' },
  { key: 'readApiConfig',       label: 'Read API Config' },
  { key: 'writeRecommendations',label: 'Write Recs' },
  { key: 'modifyBlueprint',     label: 'Modify Blueprint' },
  { key: 'callExternalApi',     label: 'Call External API' },
  { key: 'editFiles',           label: 'Edit Files' },
  { key: 'destructiveAction',   label: 'Destructive Action' },
];

function Cell({ value }) {
  return (
    <td style={{
      padding: '7px 10px', textAlign: 'center', fontSize: 12,
      color: value ? 'var(--green-bright)' : '#ff4455',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {value ? '✓' : '✗'}
    </td>
  );
}

export function AgentPermissionsMatrix() {
  const rows = getAllAgentPermissions();

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, borderBottom: '1px solid var(--border-card)', whiteSpace: 'nowrap' }}>
              Agent
            </th>
            {COL_LABELS.map((col) => (
              <th key={col.key} style={{
                padding: '8px 6px', textAlign: 'center',
                color: ['modifyBlueprint', 'callExternalApi', 'editFiles', 'destructiveAction'].includes(col.key)
                  ? '#ff6677' : 'var(--text-muted)',
                fontSize: 10, fontWeight: 600,
                borderBottom: '1px solid var(--border-card)',
                whiteSpace: 'nowrap',
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.agentId} style={{ background: 'transparent' }}>
              <td style={{ padding: '7px 10px', color: 'var(--text-primary)', fontWeight: 600, fontSize: 12, borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>
                {row.agentName}
              </td>
              {COL_LABELS.map((col) => (
                <Cell key={col.key} value={row[col.key]} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
        ✓ = Allowed &nbsp;·&nbsp; ✗ = Permanently forbidden in Run 3
      </div>
    </div>
  );
}

export default AgentPermissionsMatrix;
