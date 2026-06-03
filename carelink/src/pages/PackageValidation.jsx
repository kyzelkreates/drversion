// 4P3X Package Validation — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { useState }               from 'react';
import { useAppState }             from '../state/useAppState.js';
import { validateBasePackage, buildPackageManifest } from '../state/storage.js';
import { scanPackageForSecretRisks } from '../logic/package/packageSecretScanner.js';
import { PackageValidationPanel }  from '../components/package/PackageValidationPanel.jsx';
import { PackageSecretScanPanel }  from '../components/package/PackageSecretScanPanel.jsx';
import { PackageReadinessPanel }   from '../components/package/PackageReadinessPanel.jsx';

export default function PackageValidation({ navigate, onNavigate }) {
  navigate = navigate || onNavigate || (() => {});
  const state    = useAppState();
  const [loading, setLoading] = useState(false);
  const bp       = state.basePackage || {};
  const activePkg = (bp.packages || []).find((p) => p.id === bp.activePackageId) || (bp.packages || [])[0] || null;
  const validation = bp.latestValidation || null;
  const secretScan = validation ? scanPackageForSecretRisks(state) : null;
  const fa = state.finalAudit || {};

  const hardening = fa.hardening || {};
  const lockStatus = fa.finalLock || {};

  function handleRunValidation() {
    if (!activePkg) return;
    setLoading(true);
    buildPackageManifest();
    validateBasePackage(activePkg.id);
    setTimeout(() => setLoading(false), 400);
  }

  const checks = [
    { label: 'Final System Audit',    ok: lockStatus.canStartVariantBuilds === true },
    { label: 'SSOT Verified',         ok: hardening.ssotVerified !== false },
    { label: 'Routes Verified',       ok: hardening.routesVerified !== false },
    { label: 'Modules Verified',      ok: hardening.modulesVerified !== false },
    { label: 'No Demo Language',      ok: hardening.noDemoLanguageVerified !== false },
    { label: 'Agents Safe',           ok: hardening.agentsSafe !== false },
    { label: 'Transformation Safe',   ok: hardening.transformationSafe !== false },
    { label: 'Prompts Safe',          ok: hardening.promptsSafe !== false },
    { label: 'Workspaces Safe',       ok: hardening.workspacesSafe !== false },
    { label: 'Exports Safe',          ok: hardening.exportsSafe !== false },
    { label: 'PWA Ready',             ok: hardening.pwaReady !== false },
    { label: 'Dashboard + PWA Ready', ok: hardening.dashboardPwaReady !== false },
    { label: 'Package Manifest',      ok: !!bp.latestManifest },
    { label: 'Package Validation',    ok: !!bp.latestValidation },
  ];

  const blockerCount = checks.filter((c) => !c.ok).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Package Validation</h1>
        <p className="text-zinc-400 text-sm">Run 9 — Full Validation Before Base Zip Preparation</p>
        <p className="text-zinc-500 text-xs">Powered by 4P3X Intelligent AI — Created by Kyzel Kreates</p>
      </div>

      {/* Run validation CTA */}
      <div className="bg-zinc-900 border border-zinc-700 rounded p-4 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium">
            {activePkg ? activePkg.name : 'No package created yet'}
          </p>
          <p className="text-zinc-500 text-xs mt-0.5">
            {bp.zipReady ? 'Ready to zip ✓' : 'Validation pending'}
          </p>
        </div>
        <button onClick={handleRunValidation} disabled={loading || !activePkg}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white text-sm rounded transition">
          {loading ? 'Running…' : 'Run Package Validation'}
        </button>
      </div>

      {/* System checks overview */}
      <div className="bg-zinc-900 border border-zinc-700 rounded p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">System Checks</h3>
          <span className={`text-sm font-semibold ${blockerCount === 0 ? 'text-green-400' : 'text-red-400'}`}>
            {checks.filter((c) => c.ok).length}/{checks.length} passed
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className={c.ok ? 'text-green-400' : 'text-zinc-600'}>{c.ok ? '✓' : '○'}</span>
              <span className={c.ok ? 'text-zinc-300' : 'text-zinc-500'}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Validation detail */}
      <PackageValidationPanel validation={validation} onRun={handleRunValidation} loading={loading} />

      {/* Readiness */}
      {validation && <PackageReadinessPanel validation={validation} />}

      {/* Secret scan */}
      {secretScan && <PackageSecretScanPanel secretScan={secretScan} />}

      {/* Zip result */}
      <div className={`rounded p-5 text-center space-y-2 border ${
        bp.zipReady
          ? 'bg-green-900/20 border-green-800/40'
          : 'bg-zinc-900 border-zinc-700'
      }`}>
        <p className={`text-xl font-bold ${bp.zipReady ? 'text-green-300' : 'text-zinc-400'}`}>
          {bp.zipReady ? '✓ Ready to Zip' : 'Not yet ready to zip'}
        </p>
        <p className={`text-sm ${bp.zipReady ? 'text-green-400' : 'text-zinc-500'}`}>
          {bp.zipReady
            ? 'Prepare the zip manually. Exclude all forbidden files. No automatic deployment.'
            : 'Run validation and resolve all blockers before preparing the zip.'}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button onClick={() => navigate('/base-package-builder')}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition">
          ← Package Builder
        </button>
        <button onClick={() => navigate('/package-manifest')}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition">
          Package Manifest →
        </button>
      </div>
    </div>
  );
}
