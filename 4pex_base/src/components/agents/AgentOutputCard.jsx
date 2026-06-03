// 4P3X AgentOutputCard — RUN 3
// Displays a full agent run output.

import React, { useState } from 'react';
import Badge from '../ui/Badge.jsx';

function Section({ label, items, color, emptyText, collapsed = false }) {
  const [open, setOpen] = useState(!collapsed);
  if (!items || items.length === 0) {
    if (emptyText) return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 4 }}>{label} (0)</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{emptyText}</div>
      </div>
    );
    return null;
  }
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 0 6px 0', width: '100%', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', fontWeight: 600 }}>
          {label}
        </span>
        <Badge variant="neutral" style={{ fontSize: 10 }}>{items.length}</Badge>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && items.map((item, i) => (
        <div key={i} style={{
          fontSize: 12, color: color || 'var(--text-secondary)',
          padding: '5px 10px', marginBottom: 3,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderLeft: `3px solid ${color || 'var(--border-card)'}`,
          borderRadius: 4, lineHeight: 1.5,
        }}>
          {item}
        </div>
      ))}
    </div>
  );
}

export function AgentOutputCard({ agentRun, agentName }) {
  if (!agentRun) return (
    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
      No output yet. Select an agent and run analysis.
    </div>
  );

  return (
    <div>
      {/* Summary */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-card)',
        borderRadius: 6, padding: '12px 14px', marginBottom: 14,
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
          {agentName || agentRun.agentId} · {agentRun.createdAt?.slice(0, 19)?.replace('T', ' ')} · {agentRun.status}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {agentRun.summary}
        </div>
      </div>

      <Section label="Findings"        items={agentRun.findings}        color="var(--text-secondary)" emptyText="No findings." />
      <Section label="Warnings"        items={agentRun.warnings}        color="var(--gold-bright)"   emptyText="No warnings." />
      <Section label="Blockers"        items={agentRun.blockers}        color="#ff6677"              emptyText="No blockers." />
      <Section label="Recommendations" items={agentRun.recommendations} color="#4a9eff"              emptyText="No recommendations." />
      <Section label="Next Actions"    items={agentRun.nextActions}     color="var(--purple-bright)" emptyText="No next actions." />
      <Section label="Safety Flags"    items={agentRun.safetyFlags}     color="#ff8844"              emptyText="No safety flags." collapsed />
    </div>
  );
}

export default AgentOutputCard;
