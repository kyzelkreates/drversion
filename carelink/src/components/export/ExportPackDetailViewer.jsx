import React from 'react';
import { ExportPackReadinessPanel } from './ExportPackReadinessPanel.jsx';
import { HandoffInstructionPanel } from './HandoffInstructionPanel.jsx';
import { NoSecretsGuardPanel } from './NoSecretsGuardPanel.jsx';
import { DashboardPwaStructurePanel } from './DashboardPwaStructurePanel.jsx';
import { ExportCopyDownloadPanel } from './ExportCopyDownloadPanel.jsx';

const typeLabels  = { base_handoff: 'Base Handoff', variant_handoff: 'Variant Handoff', deployment_preparation: 'Deployment Prep', builder_tool_pack: 'Builder Tool Pack' };
const statusColor = { draft: '#9ca3af', validated: '#22c55e', needs_review: '#ef4444', ready_for_handoff: '#22c55e' };

export function ExportPackDetailViewer({ exportPack, state, onRunScan, onRecalculate }) {
  if (!exportPack) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header info */}
      <div style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 8, padding: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
          <span style={{ fontSize: 11, background: '#222', color: 'var(--text-muted)', borderRadius: 4, padding: '2px 8px' }}>{typeLabels[exportPack.type] || exportPack.type}</span>
          <span style={{ fontSize: 11, background: '#222', color: 'var(--text-muted)', borderRadius: 4, padding: '2px 8px' }}>{exportPack.builderTool}</span>
          <span style={{ fontSize: 11, color: statusColor[exportPack.status] || '#9ca3af', fontWeight: 700 }}>{exportPack.status}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Created: {exportPack.audit?.createdAt ? new Date(exportPack.audit.createdAt).toLocaleString() : '—'} ·
          Updated: {exportPack.audit?.updatedAt ? new Date(exportPack.audit.updatedAt).toLocaleString() : '—'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        <ExportPackReadinessPanel readiness={exportPack.readiness} onRecalculate={onRecalculate} />
        <NoSecretsGuardPanel sanitisation={exportPack.sanitisation} onRunScan={onRunScan} />
        <DashboardPwaStructurePanel structure={exportPack.dashboardPwaStructure} />
      </div>

      <HandoffInstructionPanel instructions={exportPack.handoffInstructions} />

      {exportPack.envExample?.content && (
        <div style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 6 }}>.env.example (placeholders only)</div>
          <pre style={{ fontSize: 11, color: '#22c55e', overflow: 'auto', maxHeight: 160 }}>{exportPack.envExample.content}</pre>
          {exportPack.envExample.containsPlaceholdersOnly
            ? <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>✓ Placeholders only — safe to share.</div>
            : <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>⛔ Non-placeholder values detected.</div>}
        </div>
      )}

      <ExportCopyDownloadPanel exportPack={exportPack} state={state} />
    </div>
  );
}
export default ExportPackDetailViewer;
