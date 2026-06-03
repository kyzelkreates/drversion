import React, { useState } from 'react';
import { groupAuditFindingsBySeverity } from '../../utils/auditExport.js';

const sevColors = { critical: '#ef4444', warning: '#f59e0b', info: '#8b5cf6' };
const sevIcons  = { critical: '⛔', warning: '⚠', info: 'ℹ' };

export function AuditFindingList({ findings = [], onResolve, onAcceptRisk }) {
  const [filter, setFilter] = useState('all');
  const grouped = groupAuditFindingsBySeverity(findings);
  const shown = filter === 'all' ? findings : grouped[filter] || [];

  if (!findings.length) return (
    <div style={{ fontSize: 12, color: '#22c55e', padding: '12px 0' }}>✓ No findings.</div>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {['all','critical','warning','info'].map(f => (
          <button key={f} className={`btn btn-ghost btn-sm ${filter === f ? 'btn-primary' : ''}`} style={{ fontSize: 10 }} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${findings.length})` : `${sevIcons[f]} ${f} (${grouped[f]?.length || 0})`}
          </button>
        ))}
      </div>
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {shown.map(f => (
          <div key={f.id} style={{ background: '#0a0a0a', border: `1px solid ${sevColors[f.severity]}33`, borderRadius: 6, padding: '8px 12px', marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: sevColors[f.severity], fontWeight: 600 }}>{sevIcons[f.severity]} [{f.category}] {f.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{f.affectedArea} · {f.status}</div>
                {f.recommendedFix && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>→ {f.recommendedFix}</div>}
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {onResolve && f.status === 'open' && <button className="btn btn-ghost btn-sm" style={{ fontSize: 9 }} onClick={() => onResolve(f.id)}>Resolve</button>}
                {onAcceptRisk && f.status === 'open' && !f.blocking && <button className="btn btn-ghost btn-sm" style={{ fontSize: 9 }} onClick={() => onAcceptRisk(f.id)}>Accept</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AuditFindingList;
