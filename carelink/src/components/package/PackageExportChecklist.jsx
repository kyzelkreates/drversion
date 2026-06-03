// 4P3X Package Export Checklist — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { useState } from 'react';

const CHECKLIST = [
  { id: 'no_env',           label: '.env files excluded (never packaged)' },
  { id: 'no_node_modules',  label: 'node_modules excluded' },
  { id: 'no_secrets',       label: 'No real API keys in any file' },
  { id: 'no_dist',          label: 'dist/ excluded (unless opted in)' },
  { id: 'readme_present',   label: 'README.md present and up to date' },
  { id: 'env_example',      label: '.env.example present with placeholders only' },
  { id: 'package_json',     label: 'package.json present' },
  { id: 'src_present',      label: 'src/ folder complete' },
  { id: 'public_present',   label: 'public/ folder present (manifest.json + icons)' },
  { id: 'manifest_gen',     label: 'Package manifest generated' },
  { id: 'validation_run',   label: 'Package validation run — no blockers' },
  { id: 'branding_correct', label: 'Branding: "Powered by 4P3X Intelligent AI — Created by Kyzel Kreates"' },
  { id: 'no_variants',      label: 'No product-specific variant files included' },
  { id: 'manual_zip',       label: 'Zip will be created manually — no auto-deploy' },
];

export function PackageExportChecklist() {
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const allDone = CHECKLIST.every((c) => checked[c.id]);
  const count = CHECKLIST.filter((c) => checked[c.id]).length;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Pre-Zip Export Checklist</h3>
        <span className="text-zinc-400 text-sm">{count}/{CHECKLIST.length}</span>
      </div>

      <p className="text-zinc-400 text-xs">
        Tick each item manually after verifying. The zip is prepared manually — this checklist is advisory.
      </p>

      <div className="space-y-2">
        {CHECKLIST.map((item) => (
          <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() => toggle(item.id)}
              className="w-4 h-4 rounded accent-green-500"
            />
            <span className={`text-sm transition ${
              checked[item.id] ? 'text-green-300 line-through' : 'text-zinc-300 group-hover:text-white'
            }`}>{item.label}</span>
          </label>
        ))}
      </div>

      <div className={`rounded p-3 text-sm font-semibold text-center transition ${
        allDone
          ? 'bg-green-900/30 text-green-300 border border-green-800/40'
          : 'bg-zinc-800 text-zinc-400'
      }`}>
        {allDone
          ? '✓ All checks complete — ready to zip manually'
          : `${CHECKLIST.length - count} item${CHECKLIST.length - count !== 1 ? 's' : ''} remaining`}
      </div>
    </div>
  );
}

export default PackageExportChecklist;
