// 4P3X Package Validation Panel — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

export function PackageValidationPanel({ validation, onRun, loading }) {
  if (!validation) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-4">
        <h3 className="text-white font-semibold">Package Validation</h3>
        <p className="text-zinc-400 text-sm">No validation run yet.</p>
        {onRun && (
          <button onClick={onRun} disabled={loading}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white text-sm rounded transition">
            {loading ? 'Running…' : 'Run Package Validation'}
          </button>
        )}
      </div>
    );
  }

  const checks = [
    { label: 'Final Audit Passed',   ok: validation.finalAuditPassed },
    { label: 'SSOT Verified',        ok: validation.ssotPassed },
    { label: 'Routes Verified',      ok: validation.routesPassed },
    { label: 'Build Readiness',      ok: validation.buildPassed },
    { label: 'No Secrets',           ok: validation.noSecretsPassed },
    { label: 'No Unsafe Language',   ok: validation.noUnsafeLanguagePassed },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Package Validation</h3>
        {onRun && (
          <button onClick={onRun} disabled={loading}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white text-xs rounded transition">
            {loading ? 'Running…' : 'Re-Run'}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className={c.ok ? 'text-green-400' : 'text-red-400'}>{c.ok ? '✓' : '✗'}</span>
            <span className={c.ok ? 'text-zinc-200' : 'text-zinc-400'}>{c.label}</span>
          </div>
        ))}
      </div>

      {validation.blockers?.length > 0 && (
        <div className="bg-red-900/20 border border-red-800/40 rounded p-3 space-y-1">
          <p className="text-red-300 text-xs font-semibold">Blockers ({validation.blockers.length})</p>
          {validation.blockers.map((b, i) => <p key={i} className="text-red-400 text-xs">• {b}</p>)}
        </div>
      )}

      {validation.warnings?.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-800/40 rounded p-3 space-y-1">
          <p className="text-yellow-300 text-xs font-semibold">Warnings ({validation.warnings.length})</p>
          {validation.warnings.map((w, i) => <p key={i} className="text-yellow-400 text-xs">• {w}</p>)}
        </div>
      )}

      <div className={`rounded p-3 text-sm font-semibold text-center ${
        validation.zipReady
          ? 'bg-green-900/30 text-green-300 border border-green-800/40'
          : 'bg-zinc-800 text-zinc-400'
      }`}>
        {validation.zipReady ? '✓ Ready to Zip — Prepare Manually' : 'Not yet ready to zip'}
      </div>

      {validation.nextAction && (
        <p className="text-zinc-400 text-xs">{validation.nextAction}</p>
      )}
    </div>
  );
}

export default PackageValidationPanel;
