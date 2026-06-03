// 4P3X Package Include/Exclude Panel — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

export function PackageIncludeExcludePanel({ pkg }) {
  const include = pkg?.includeRules || [];
  const exclude = pkg?.excludeRules || [];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-4">
      <h3 className="text-white font-semibold">Include / Exclude Rules</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-green-400 text-sm font-semibold mb-2">Include ({include.length})</h4>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {include.length === 0 && (
              <p className="text-zinc-500 text-xs">No include rules defined. Create a package first.</p>
            )}
            {include.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-xs bg-zinc-800 rounded px-2 py-1">
                <span className="text-green-400 shrink-0">+</span>
                <span className="font-mono text-zinc-300">{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-red-400 text-sm font-semibold mb-2">Exclude ({exclude.length})</h4>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {exclude.length === 0 && (
              <p className="text-zinc-500 text-xs">No exclude rules defined.</p>
            )}
            {exclude.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-xs bg-zinc-800 rounded px-2 py-1">
                <span className="text-red-400 shrink-0">✗</span>
                <span className="font-mono text-zinc-300">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-zinc-500 text-xs border-t border-zinc-700 pt-3">
        These rules are advisory. Apply them manually when creating the zip. Verify that all excluded patterns are absent before sharing the package.
      </p>
    </div>
  );
}

export default PackageIncludeExcludePanel;
