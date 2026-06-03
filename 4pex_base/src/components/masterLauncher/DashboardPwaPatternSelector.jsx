// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// DashboardPwaPatternSelector.jsx — Run 10
import { DASHBOARD_PWA_PATTERNS } from '../../config/dashboardPwaPatterns.js';

export default function DashboardPwaPatternSelector({ selectedId, onSelect }) {
  return (
    <div>
      <div className="section-header">Select Dashboard + PWA Pattern</div>
      <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
        Every variant must follow the Dashboard + Connected PWA structure.
        Select the pattern that matches your chosen product variant.
      </p>
      <div className="grid-2">
        {DASHBOARD_PWA_PATTERNS.map((p) => (
          <div
            key={p.id}
            className="card"
            onClick={() => onSelect(p.id)}
            style={{
              cursor: 'pointer',
              border: selectedId === p.id ? '2px solid #22c55e' : '1px solid #334155',
              background: selectedId === p.id ? '#052e16' : '#1e293b',
              transition: 'all 0.15s',
            }}
          >
            <div className="card-title" style={{ fontSize: 14, marginBottom: 6 }}>{p.label}</div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#6366f1' }}>Dashboard:</span>{' '}
              <span style={{ color: '#e2e8f0' }}>{p.dashboardName}</span>
            </div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#22c55e' }}>PWA:</span>{' '}
              <span style={{ color: '#e2e8f0' }}>{p.pwaName}</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{p.relationship}</div>
            {p.safetyWarning && (
              <div style={{ fontSize: 10, color: '#ef4444', marginTop: 6 }}>
                ⚠ {p.safetyWarning.slice(0, 80)}…
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
