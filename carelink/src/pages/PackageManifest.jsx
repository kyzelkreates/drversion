// 4P3X Package Manifest — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { useAppState }           from '../state/useAppState.js';
import { buildPackageManifest, exportPackageManifest, exportPackageInstructions } from '../state/storage.js';
import { PackageManifestViewer } from '../components/package/PackageManifestViewer.jsx';
import { PackageFileTreePanel }  from '../components/package/PackageFileTreePanel.jsx';
import { PackageInstructionPanel } from '../components/package/PackageInstructionPanel.jsx';
import { useState } from 'react';

export default function PackageManifest({ navigate, onNavigate }) {
  navigate = navigate || onNavigate || (() => {});
  const state    = useAppState();
  const bp       = state.basePackage || {};
  const manifest = bp.latestManifest || null;
  const activePkg = (bp.packages || []).find((p) => p.id === bp.activePackageId) || (bp.packages || [])[0] || null;

  const [exported, setExported] = useState(false);
  const [exportedInstructions, setExportedInstructions] = useState(null);

  function handleGenerate() {
    buildPackageManifest();
    setExported(false);
  }

  function handleExportManifest() {
    if (!activePkg) return;
    const result = exportPackageManifest(activePkg.id);
    // Simulate copy to clipboard
    try {
      navigator.clipboard?.writeText(result.text || JSON.stringify(result.json, null, 2));
    } catch {}
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  function handleExportInstructions() {
    if (!activePkg) return;
    const result = exportPackageInstructions(activePkg.id);
    setExportedInstructions(result);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Package Manifest</h1>
        <p className="text-zinc-400 text-sm">Run 9 — Base Package File Manifest & Include/Exclude Rules</p>
        <p className="text-zinc-500 text-xs">Powered by 4P3X Intelligent AI — Created by Kyzel Kreates</p>
      </div>

      {/* Identity block */}
      <div className="bg-zinc-900 border border-zinc-700 rounded p-4 space-y-1">
        <p className="text-white font-semibold">4P3X Reusable Base Structure™</p>
        <p className="text-zinc-400 text-sm">Powered by 4P3X Intelligent AI — Created by Kyzel Kreates</p>
        <p className="text-zinc-500 text-xs">Part of the 4P3X Verse</p>
        {manifest && <p className="text-zinc-600 text-xs">Manifest generated: {manifest.generatedAt}</p>}
      </div>

      {/* Generate / Regenerate */}
      <div className="flex gap-3 items-center">
        <button onClick={handleGenerate}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded transition">
          {manifest ? 'Regenerate Manifest' : 'Generate Manifest'}
        </button>
        {exported && <span className="text-green-400 text-xs">Copied to clipboard ✓</span>}
      </div>

      {/* Manifest viewer */}
      <PackageManifestViewer manifest={manifest} onExport={manifest ? handleExportManifest : null} />

      {/* File tree */}
      <PackageFileTreePanel />

      {/* Builder instructions */}
      <PackageInstructionPanel instructions={activePkg?.builderInstructions} />

      {/* Exported instructions preview */}
      {exportedInstructions && (
        <div className="bg-zinc-900 border border-zinc-700 rounded p-4 space-y-2">
          <p className="text-zinc-300 text-sm font-semibold">Exported Builder Instructions</p>
          {Object.keys(exportedInstructions).map((target) => (
            <div key={target}>
              <p className="text-zinc-400 text-xs font-mono uppercase">{target}</p>
              <pre className="text-zinc-500 text-xs mt-1 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {exportedInstructions[target]?.text}
              </pre>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleExportInstructions}
        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition">
        Export All Builder Instructions
      </button>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button onClick={() => navigate('/base-package-builder')}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition">
          ← Package Builder
        </button>
        <button onClick={() => navigate('/package-validation')}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition">
          Package Validation →
        </button>
      </div>
    </div>
  );
}
