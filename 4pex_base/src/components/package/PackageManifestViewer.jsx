// 4P3X Package Manifest Viewer — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

export function PackageManifestViewer({ manifest, onExport }) {
  if (!manifest) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
        <p className="text-zinc-400 text-sm">No manifest generated yet. Use the Base Package Builder to generate one.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-semibold">Package Manifest</h3>
          <p className="text-zinc-400 text-xs mt-1">{manifest.identity?.brandingLine}</p>
        </div>
        <span className="text-zinc-500 text-xs font-mono">v{manifest.schemaVersion}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-zinc-800 rounded p-3">
          <p className="text-zinc-400 text-xs mb-1">App</p>
          <p className="text-white font-medium">{manifest.metadata?.appName}</p>
        </div>
        <div className="bg-zinc-800 rounded p-3">
          <p className="text-zinc-400 text-xs mb-1">Final Audit Locked</p>
          <p className={manifest.metadata?.finalAuditLocked ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
            {manifest.metadata?.finalAuditLocked ? 'YES' : 'NO'}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-zinc-300 text-sm font-semibold mb-2">Required Files ({manifest.requiredFiles?.length})</h4>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          {(manifest.requiredFiles || []).map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-green-400 mt-0.5 shrink-0">+</span>
              <span className="text-white font-mono">{f.pattern}</span>
              <span className="text-zinc-500 ml-auto shrink-0 text-right max-w-[40%]">{f.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-zinc-300 text-sm font-semibold mb-2">Forbidden Files ({manifest.forbiddenFiles?.length})</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {(manifest.forbiddenFiles || []).map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-red-400 mt-0.5 shrink-0">✗</span>
              <span className="text-white font-mono">{f.pattern}</span>
              <span className="text-zinc-500 ml-auto shrink-0 text-right max-w-[40%]">{f.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-zinc-500 text-xs border-t border-zinc-700 pt-3">{manifest.safetyNote}</p>

      {onExport && (
        <button onClick={onExport}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded transition">
          Export Manifest
        </button>
      )}
    </div>
  );
}

export default PackageManifestViewer;
