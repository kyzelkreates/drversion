// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// MasterVariantLauncher.jsx — Run 10
import { useAppState } from '../state/useAppState.js';
import ProductVariantSelector      from '../components/masterLauncher/ProductVariantSelector.jsx';
import DashboardPwaPatternSelector from '../components/masterLauncher/DashboardPwaPatternSelector.jsx';
import VariantPromptBuilderPanel   from '../components/masterLauncher/VariantPromptBuilderPanel.jsx';
import VariantPackageInstructionPanel from '../components/masterLauncher/VariantPackageInstructionPanel.jsx';
import {
  selectMasterVariantType,
  selectDashboardPwaPattern,
  generateMasterVariantPrompt,
} from '../state/storage.js';
import {
  validateBaseReadyForVariantLaunch,
} from '../logic/masterLauncher/masterVariantLauncher.js';

export default function MasterVariantLauncher({ navigate, onNavigate }) {
  navigate = navigate || onNavigate || (() => {});
  const { state } = useAppState();
  const ml = state?.masterLauncher || {};

  const baseValidation = validateBaseReadyForVariantLaunch(state);
  const canGenerate    = !!ml.selectedVariantType && !!ml.selectedDashboardPwaPattern;

  const handleSelectVariant = (id) => selectMasterVariantType(id);
  const handleSelectPattern = (id) => selectDashboardPwaPattern(id);
  const handleGenerate      = () => {
    generateMasterVariantPrompt();
    navigate('/variant-transformation-prompt-builder');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Master Variant Launcher</div>
        <div className="page-subtitle">
          Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
        </div>
      </div>

      {/* Base readiness banner */}
      <div style={{
        background: baseValidation.canLaunch ? '#052e16' : '#450a0a',
        border: `1px solid ${baseValidation.canLaunch ? '#166534' : '#7f1d1d'}`,
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: baseValidation.canLaunch ? '#4ade80' : '#ef4444' }}>
            {baseValidation.canLaunch ? '✓ Base is ready for variant launch' : '✗ Base not yet ready for variant launch'}
          </div>
          {baseValidation.errors.length > 0 && (
            <div style={{ fontSize: 11, color: '#fca5a5', marginTop: 4 }}>
              {baseValidation.errors.join(' | ')}
            </div>
          )}
          {baseValidation.warnings.length > 0 && (
            <div style={{ fontSize: 11, color: '#fcd34d', marginTop: 2 }}>
              {baseValidation.warnings.join(' | ')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/final-system-audit')}>
            Final Audit
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/base-package-builder')}>
            Package Builder
          </button>
        </div>
      </div>

      {/* Safety notice */}
      <div style={{
        background: '#1e1b4b',
        border: '1px solid #4338ca',
        borderRadius: 8,
        padding: '10px 14px',
        marginBottom: 24,
        fontSize: 12,
        color: '#a5b4fc',
      }}>
        ⚠ This creates prompts for <strong>separate product builds only</strong>.
        It does not build variants inside the base.
        Generated prompts require manual copy-paste into a new isolated builder project.
      </div>

      {/* Step 1: Variant selector */}
      <ProductVariantSelector
        selectedId={ml.selectedVariantType}
        onSelect={handleSelectVariant}
      />

      <div style={{ marginTop: 24 }} />

      {/* Step 2: Pattern selector */}
      <DashboardPwaPatternSelector
        selectedId={ml.selectedDashboardPwaPattern}
        onSelect={handleSelectPattern}
      />

      <div style={{ marginTop: 24 }} />

      {/* Step 3: Generate */}
      <VariantPromptBuilderPanel
        selectedVariantType={ml.selectedVariantType}
        selectedPatternId={ml.selectedDashboardPwaPattern}
        onGenerate={handleGenerate}
        generating={false}
        canGenerate={canGenerate}
      />

      <div style={{ marginTop: 24 }} />

      {/* Zip attachment instructions */}
      <VariantPackageInstructionPanel state={state} />

      {/* Generated prompts history */}
      {ml.generatedMasterPrompts?.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div className="section-header">
            Generated Prompts ({ml.generatedMasterPrompts.length})
          </div>
          <div className="grid-2">
            {ml.generatedMasterPrompts.map((p) => (
              <div
                key={p.id}
                className="card"
                onClick={() => {
                  selectMasterVariantType(p.variantType);
                  navigate('/variant-transformation-prompt-builder');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-title" style={{ fontSize: 14 }}>{p.variantType}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  Pattern: {p.patternId} · {p.wordCount?.toLocaleString()} words
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {p.generatedAt ? new Date(p.generatedAt).toLocaleString() : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/final-base-completion')}
        >
          → Final Base Completion
        </button>
      </div>
    </div>
  );
}
