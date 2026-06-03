import React from 'react';
import { Card } from '../ui/Card.jsx';
import { WorkspaceStatusBadge } from './WorkspaceStatusBadge.jsx';

export function WorkspaceCard({ workspace, isActive, onOpen, onDuplicate, onArchive, onDelete }) {
  const bp = workspace.buildProgress || {};
  return (
    <Card variant={isActive ? 'gold' : 'default'} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{workspace.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{workspace.productType}</div>
        </div>
        <WorkspaceStatusBadge status={workspace.status} />
      </div>

      {workspace.description && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{workspace.description}</div>
      )}

      <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Readiness: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{workspace.readiness?.score ?? 0}/100</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Progress: <span style={{ color: 'var(--green-bright)', fontWeight: 600 }}>{bp.progressPercent ?? 0}%</span>
        </div>
        {bp.activeRun && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Active: <span style={{ color: 'var(--purple-bright)' }}>{bp.activeRun}</span>
          </div>
        )}
        {workspace.linkedBlueprintId && (
          <div style={{ fontSize: 11, color: '#22c55e' }}>✓ Blueprint</div>
        )}
        {workspace.linkedTransformationPlanId && (
          <div style={{ fontSize: 11, color: '#22c55e' }}>✓ Plan</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-sm" onClick={() => onOpen(workspace.id)}>Open →</button>
        {onDuplicate && <button className="btn btn-ghost btn-sm" onClick={() => onDuplicate(workspace.id)}>Duplicate</button>}
        {workspace.status !== 'archived' && onArchive && (
          <button className="btn btn-ghost btn-sm" onClick={() => onArchive(workspace.id)}>Archive</button>
        )}
        {onDelete && (
          <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => onDelete(workspace.id)}>Delete</button>
        )}
      </div>
    </Card>
  );
}
export default WorkspaceCard;
