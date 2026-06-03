// 4P3X Base Package Builder — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { useAppState }        from '../state/useAppState.js';
import {
  createBasePackage,
  buildPackageManifest,
  validateBasePackage,
  setActiveBasePackage,
  getActiveBasePackage,
} from '../state/storage.js';
import { PackageBuilderPanel }      from '../components/package/PackageBuilderPanel.jsx';
import { PackageIncludeExcludePanel } from '../components/package/PackageIncludeExcludePanel.jsx';
import { PackageInstructionPanel }  from '../components/package/PackageInstructionPanel.jsx';
import { PackageExportChecklist }   from '../components/package/PackageExportChecklist.jsx';
import { PackageReadinessPanel }    from '../components/package/PackageReadinessPanel.jsx';

export default function BasePackageBuilder({ navigate, onNavigate }) {
  navigate = navigate || onNavigate || (() => {});
  const state    = useAppState();
  const bp       = state.basePackage || {};
  const activePkg = getActiveBasePackage() || (bp.packages || [])[0] || null;
  const validation = bp.latestValidation || activePkg?.validation || null;

  function handleBuild() {
    createBasePackage();
    buildPackageManifest();
  }

  function handleValidate() {
    if (!activePkg) return;
    validateBasePackage(activePkg.id);
  }

  function handleSetActive(id) {
    setActiveBasePackage(id);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Base Package Builder</h1>
        <p className="text-zinc-400 text-sm">Run 9 — Base ZIP / Project Package Builder</p>
        <p className="text-zinc-500 text-xs">Powered by 4P3X Intelligent AI — Created by Kyzel Kreates</p>
      </div>

      {/* Safety statement */}
      <div className="bg-blue-900/20 border border-blue-800/40 rounded p-3">
        <p className="text-blue-300 text-sm font-medium">
          This prepares the reusable base package only.
        </p>
        <p className="text-blue-400 text-xs mt-1">
          It does not create product variants, deploy automatically, execute generated prompts, or push to any external service.
        </p>
      </div>

      {/* Package builder */}
      <PackageBuilderPanel
        pkg={activePkg}
        onBuild={handleBuild}
        onValidate={handleValidate}
        onSetActive={handleSetActive}
      />

      {/* Readiness */}
      {validation && <PackageReadinessPanel validation={validation} />}

      {/* Zip status */}
      {bp.zipReady && (
        <div className="bg-green-900/20 border border-green-800/40 rounded p-4 text-center">
          <p className="text-green-300 font-semibold text-lg">✓ Ready to Zip</p>
          <p className="text-green-400 text-sm mt-1">
            Prepare the zip manually — exclude all forbidden files, then attach to your chosen builder.
          </p>
        </div>
      )}

      {/* All packages list */}
      {bp.packages?.length > 1 && (
        <div className="space-y-2">
          <h2 className="text-zinc-300 text-sm font-semibold">All Packages ({bp.packages.length})</h2>
          {bp.packages.map((p) => (
            <div key={p.id} className="bg-zinc-800 rounded p-3 flex items-center justify-between">
              <div>
                <p className="text-white text-sm">{p.name}</p>
                <p className="text-zinc-500 text-xs">{p.id}</p>
              </div>
              <button onClick={() => handleSetActive(p.id)}
                className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded transition text-zinc-300">
                Set Active
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Include/Exclude rules */}
      {activePkg && <PackageIncludeExcludePanel pkg={activePkg} />}

      {/* Builder instructions */}
      <PackageInstructionPanel instructions={activePkg?.builderInstructions} />

      {/* Export checklist */}
      <PackageExportChecklist />

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button onClick={() => navigate('/package-manifest')}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition">
          View Package Manifest →
        </button>
        <button onClick={() => navigate('/package-validation')}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition">
          View Package Validation →
        </button>
      </div>
    </div>
  );
}
