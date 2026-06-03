// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// VariantPromptBuilderPanel.jsx — Run 10
import { getVariantById }  from '../../config/finalVariantOptions.js';
import { getPatternById }  from '../../config/dashboardPwaPatterns.js';

export default function VariantPromptBuilderPanel({
  selectedVariantType,
  selectedPatternId,
  onGenerate,
  generating,
  canGenerate,
}) {
  const variant = getVariantById(selectedVariantType);
  const pattern = getPatternById(selectedPatternId);

  return (
    <div className="card">
      <div className="card-title">Variant Prompt Builder</div>
      <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
        Generate a strict, copy-paste-ready master variant transformation prompt
        for your selected variant. The prompt will not execute automatically.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: '#0f172a', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, marginBottom: 4 }}>SELECTED VARIANT</div>
          {variant
            ? <>
                <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{variant.label}</div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>{variant.productType}</div>
              </>
            : <div style={{ color: '#ef4444', fontSize: 13 }}>None selected</div>
          }
        </div>
        <div style={{ background: '#0f172a', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, marginBottom: 4 }}>SELECTED PATTERN</div>
          {pattern
            ? <>
                <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{pattern.dashboardName}</div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>+ {pattern.pwaName}</div>
              </>
            : <div style={{ color: '#ef4444', fontSize: 13 }}>None selected</div>
          }
        </div>
      </div>

      <div style={{ background: '#1e1b4b', border: '1px solid #4338ca', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12, color: '#a5b4fc' }}>
        ⚠ This creates prompts for separate product builds only. It does not build variants inside the base.
        Generated prompts require manual copy-paste into a new isolated builder project.
      </div>

      <button
        className="btn btn-primary"
        onClick={onGenerate}
        disabled={!canGenerate || generating}
        style={{ opacity: canGenerate && !generating ? 1 : 0.5 }}
      >
        {generating ? 'Generating…' : 'Generate Master Variant Prompt'}
      </button>

      {!canGenerate && (
        <div style={{ fontSize: 12, color: '#ef4444', marginTop: 8 }}>
          Select a variant type and Dashboard + PWA pattern to enable generation.
        </div>
      )}
    </div>
  );
}
