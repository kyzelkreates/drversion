// 4P3X Package Readiness Panel — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

export function PackageReadinessPanel({ validation }) {
  if (!validation) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
        <p className="text-zinc-400 text-sm">No validation run yet. Use Run Validation on the Package Builder page.</p>
      </div>
    );
  }

  const checks = [
    { label: 'Final Audit Passed',       ok: validation.finalAuditPassed },
    { label: 'SSOT Verified',            ok: validation.ssotPassed },
    { label: 'Routes Verified',          ok: validation.routesPassed },
    { label: 'Build Readiness',          ok: validation.buildPassed },
    { label: 'No Secrets',               ok: validation.noSecretsPassed },
    { label: 'No Unsafe Language',       ok: validation.noUnsafeLanguagePassed },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Package Readiness</h3>
        <div className={`text-lg font-bold ${
          validation.zipReady ? 'text-green-400' : 'text-red-400'
        }`}>
          {validation.readinessScore ?? 0}/100
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className={c.ok ? 'text-green-400' : 'text-red-400'}>{c.ok ? '✓' : '✗'}</span>
            <span className={c.ok ? 'text-zinc-300' : 'text-zinc-400'}>{c.label}</span>
          </div>
        ))}
      </div>

      {validation.blockers?.length > 0 && (
        <div className="bg-red-900/20 border border-red-800/40 rounded p-3">
          <p className="text-red-300 text-xs font-semibold mb-2">Blockers</p>
          {validation.blockers.map((b, i) => (
            <p key={i} className="text-red-400 text-xs">• {b}</p>
          ))}
        </div>
      )}

      {validation.warnings?.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-800/40 rounded p-3">
          <p className="text-yellow-300 text-xs font-semibold mb-2">Warnings</p>
          {validation.warnings.map((w, i) => (
            <p key={i} className="text-yellow-400 text-xs">• {w}</p>
          ))}
        </div>
      )}

      <div className={`rounded p-3 text-sm font-semibold text-center ${
        validation.zipReady
          ? 'bg-green-900/30 text-green-300 border border-green-800/40'
          : 'bg-zinc-800 text-zinc-400'
      }`}>
        {validation.zipReady ? '✓ Ready to Zip' : 'Not yet ready to zip'}
      </div>

      {validation.nextAction && (
        <p className="text-zinc-400 text-xs">{validation.nextAction}</p>
      )}
    </div>
  );
}

export default PackageReadinessPanel;
