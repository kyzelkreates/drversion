// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// ProductVariantSelector.jsx — Run 10
import { FINAL_VARIANT_OPTIONS } from '../../config/finalVariantOptions.js';

const SAFETY_COLOURS = { standard: '#22c55e', high: '#f59e0b', critical: '#ef4444' };

export default function ProductVariantSelector({ selectedId, onSelect }) {
  return (
    <div>
      <div className="section-header">Select Product Variant</div>
      <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
        Choose the variant you want to build. Each variant becomes its own isolated project — not built inside this base.
      </p>
      <div className="grid-2">
        {FINAL_VARIANT_OPTIONS.map((v) => (
          <div
            key={v.id}
            className={`card${selectedId === v.id ? ' card-selected' : ''}`}
            onClick={() => onSelect(v.id)}
            style={{
              cursor: 'pointer',
              border: selectedId === v.id ? '2px solid #6366f1' : '1px solid #334155',
              background: selectedId === v.id ? '#1e1b4b' : '#1e293b',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="card-title" style={{ fontSize: 14, marginBottom: 4 }}>{v.label}</div>
              <span style={{
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 4,
                background: SAFETY_COLOURS[v.safetyLevel] + '22',
                color: SAFETY_COLOURS[v.safetyLevel],
                fontWeight: 600,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                marginLeft: 8,
              }}>{v.safetyLevel}</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>{v.productType}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              <span style={{ color: '#6366f1' }}>Dashboard:</span> {v.dashboardRole}
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              <span style={{ color: '#22c55e' }}>PWA:</span> {v.pwaRole}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              ≈ {v.recommendedRunCount} runs recommended
            </div>
            {v.requiredWarnings && v.requiredWarnings.length > 0 && (
              <div style={{ fontSize: 10, color: SAFETY_COLOURS[v.safetyLevel], marginTop: 4 }}>
                ⚠ {v.requiredWarnings.length} safety warning(s)
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
