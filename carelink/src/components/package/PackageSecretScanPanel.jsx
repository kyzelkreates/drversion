// 4P3X Package Secret Scan Panel — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

export function PackageSecretScanPanel({ secretScan }) {
  if (!secretScan) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
        <p className="text-zinc-400 text-sm">Secret scan not run yet. Run Package Validation to trigger a scan.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Secret Scan</h3>
        <span className={`text-sm font-semibold ${secretScan.ok ? 'text-green-400' : 'text-red-400'}`}>
          {secretScan.ok ? '✓ Clear' : '✗ Issues Found'}
        </span>
      </div>

      {secretScan.blockers?.length > 0 ? (
        <div className="bg-red-900/20 border border-red-800/40 rounded p-3 space-y-1">
          <p className="text-red-300 text-xs font-semibold">Secret Blockers</p>
          {secretScan.blockers.map((b, i) => (
            <p key={i} className="text-red-400 text-xs">• {b}</p>
          ))}
        </div>
      ) : (
        <div className="bg-green-900/20 border border-green-800/40 rounded p-3">
          <p className="text-green-300 text-xs">No raw secret patterns detected in state.</p>
        </div>
      )}

      {secretScan.findings?.length > 0 && (
        <div>
          <p className="text-zinc-400 text-xs font-semibold mb-1">Findings (masked)</p>
          {secretScan.findings.map((f, i) => (
            <p key={i} className={`text-xs ${f.severity === 'blocker' ? 'text-red-400' : 'text-yellow-400'}`}>
              [{f.type}] {f.match}
            </p>
          ))}
        </div>
      )}

      <p className="text-zinc-500 text-xs border-t border-zinc-700 pt-3">
        All secret values are masked. Raw keys are never displayed. This scan checks state only — manually verify file contents before zipping.
      </p>
    </div>
  );
}

export default PackageSecretScanPanel;
