import React from 'react';
import { Card } from '../ui/Card.jsx';

const levelColors = { ready: '#22c55e', ready_with_warnings: '#f59e0b', partial: '#8b5cf6', not_ready: '#ef4444' };
const typeLabels  = { base_handoff: 'Base Handoff', variant_handoff: 'Variant Handoff', deployment_preparation: 'Deployment Prep', builder_tool_pack: 'Builder Tool Pack' };

export function ExportPackCard({ exportPack, isActive, onOpen, onDuplicate, onDelete }) {
  const r     = exportPack.readiness || {};
  const color = levelColors[r.level] || '#6b7280';

  return (
    <Card variant={isActive ? 'gold' : 'default'} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{exportPack.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {typeLabels[exportPack.type] || exportPack.type} · {exportPack.builderTool}
          </div>
        </div>
        <span style={{ fontSize: 10, background: color + '22', color, border: `1px solid ${color}44`, borderRadius: 4, padding: '2px 7px', textTransform: 'uppercase', fontWeight: 700 }}>
          {exportPack.status}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color }}>Score: <strong>{r.score ?? 0}/100</strong></span>
        <span style={{ fontSize: 11, color, textTransform: 'capitalize' }}>{r.level?.replace(/_/g, ' ') || 'not_ready'}</span>
        {exportPack.handoffInstructions && <span style={{ fontSize: 11, color: '#22c55e' }}>✓ Instructions</span>}
        {exportPack.sanitisation?.passed && <span style={{ fontSize: 11, color: '#22c55e' }}>✓ Sanitised</span>}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-sm" onClick={() => onOpen(exportPack.id)}>Open →</button>
        {onDuplicate && <button className="btn btn-ghost btn-sm" onClick={() => onDuplicate(exportPack.id)}>Duplicate</button>}
        {onDelete    && <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => onDelete(exportPack.id)}>Delete</button>}
      </div>
    </Card>
  );
}
export default ExportPackCard;
