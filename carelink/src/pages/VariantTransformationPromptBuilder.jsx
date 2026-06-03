// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// VariantTransformationPromptBuilder.jsx — Run 10
import { useAppState } from '../state/useAppState.js';
import VariantPromptPreview           from '../components/masterLauncher/VariantPromptPreview.jsx';
import VariantPromptSafetyPanel       from '../components/masterLauncher/VariantPromptSafetyPanel.jsx';
import VariantPromptCompletenessPanel from '../components/masterLauncher/VariantPromptCompletenessPanel.jsx';
import {
  exportMasterVariantPrompt,
  copyMasterVariantPrompt,
} from '../state/storage.js';
import { formatMasterVariantPromptAsText } from '../utils/masterVariantExport.js';
import { getVariantById }  from '../config/finalVariantOptions.js';
import { getPatternById }  from '../config/dashboardPwaPatterns.js';

export default function VariantTransformationPromptBuilder({ navigate, onNavigate }) {
  navigate = navigate || onNavigate || (() => {});
  const { state } = useAppState();
  const ml      = state?.masterLauncher || {};
  const prompts = ml.generatedMasterPrompts || [];
  const activeId = ml.activeMasterPromptId;
  const prompt   = prompts.find((p) => p.id === activeId) || prompts[prompts.length - 1] || null;

  const variant = getVariantById(prompt?.variantType || ml.selectedVariantType);
  const pattern = getPatternById(prompt?.patternId  || ml.selectedDashboardPwaPattern);

  const handleCopy = () => {
    if (!prompt) return;
    const text = formatMasterVariantPromptAsText(prompt);
    navigator.clipboard.writeText(text).catch(() => {});
    copyMasterVariantPrompt(prompt.id);
  };

  const handleExport = () => {
    if (!prompt) return;
    const text = formatMasterVariantPromptAsText(prompt);
    const blob = new Blob([text], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `4P3X-MasterVariantPrompt-${prompt.variantType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    exportMasterVariantPrompt(prompt.id);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Variant Transformation Prompt Builder</div>
        <div className="page-subtitle">
          Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
        </div>
      </div>

      {/* Summary */}
      {(variant || pattern) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {variant && (
            <div className="card">
              <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, marginBottom: 4 }}>VARIANT</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>{variant.label}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{variant.productType}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                Safety: <span style={{ color: variant.safetyLevel === 'critical' ? '#ef4444' : variant.safetyLevel === 'high' ? '#f59e0b' : '#22c55e' }}>
                  {variant.safetyLevel}
                </span>
              </div>
            </div>
          )}
          {pattern && (
            <div className="card">
              <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, marginBottom: 4 }}>DASHBOARD + PWA PATTERN</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{pattern.dashboardName}</div>
              <div style={{ fontSize: 13, color: '#86efac' }}>+ {pattern.pwaName}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{pattern.syncPoint}</div>
            </div>
          )}
        </div>
      )}

      {!prompt && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: 20, marginBottom: 20, textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: 14, marginBottom: 12 }}>
            No prompt generated yet. Go back to the Master Variant Launcher to select a variant and generate a prompt.
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/master-variant-launcher')}>
            ← Master Variant Launcher
          </button>
        </div>
      )}

      {/* Prompt list selector */}
      {prompts.length > 1 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Prompts ({prompts.length})</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {prompts.map((p) => (
              <button
                key={p.id}
                className={`btn btn-sm ${(prompt?.id === p.id) ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => {/* navigate to this prompt via storage */}}
              >
                {p.variantType}
              </button>
            ))}
          </div>
        </div>
      )}

      <VariantPromptPreview
        prompt={prompt}
        onCopy={handleCopy}
        onExport={handleExport}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <VariantPromptSafetyPanel       prompt={prompt} />
        <VariantPromptCompletenessPanel prompt={prompt} />
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/master-variant-launcher')}>
          ← Back to Launcher
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/final-base-completion')}>
          → Final Base Completion
        </button>
      </div>
    </div>
  );
}
