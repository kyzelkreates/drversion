// 4P3X Package File Tree Panel — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { planPackageFileTree } from '../../logic/package/packageFileTreePlanner.js';
import { useAppState } from '../../state/useAppState.js';

export function PackageFileTreePanel() {
  const state = useAppState();
  const { required, forbidden, advisory } = planPackageFileTree(state);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-5">
      <h3 className="text-white font-semibold">File Tree Plan</h3>
      <p className="text-zinc-400 text-xs">
        This is the planned file tree for the base zip. Verify each section before packaging.
      </p>

      <div>
        <h4 className="text-green-400 text-sm font-semibold mb-2">Include ({required.length} patterns)</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {required.map((r, i) => (
            <div key={i} className="text-xs font-mono text-zinc-300 flex gap-2">
              <span className="text-green-500 shrink-0">+</span>
              <span>{r.pattern}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-red-400 text-sm font-semibold mb-2">Exclude ({forbidden.length} patterns)</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {forbidden.map((f, i) => (
            <div key={i} className="text-xs font-mono text-zinc-300 flex gap-2">
              <span className="text-red-500 shrink-0">✗</span>
              <span>{f.pattern}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-zinc-300 text-sm font-semibold mb-2">Advisory File Paths</h4>
        <div className="space-y-1">
          {advisory.map((a, i) => (
            <div key={i} className="text-xs flex gap-2">
              <span className="text-zinc-500 font-mono shrink-0">{a.path}</span>
              <span className="text-zinc-500">—</span>
              <span className="text-zinc-400">{a.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PackageFileTreePanel;
