// 4P3X Package Builder Panel — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { useState } from 'react';

export function PackageBuilderPanel({ pkg, onBuild, onValidate, onSetActive }) {
  const [confirming, setConfirming] = useState(false);

  const readiness = pkg?.readiness || {};
  const levelColor = {
    ready: 'text-green-400',
    ready_with_warnings: 'text-yellow-400',
    partial: 'text-orange-400',
    not_ready: 'text-red-400',
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">{pkg?.name || 'No package created yet'}</h3>
          <p className="text-zinc-400 text-sm mt-1">{pkg?.identity?.brandingLine || ''}</p>
        </div>
        {pkg && (
          <span className={`text-xs font-mono px-2 py-1 rounded ${
            pkg.status === 'ready_to_zip' ? 'bg-green-900/40 text-green-300' :
            pkg.status === 'blocked'      ? 'bg-red-900/40 text-red-300' :
            pkg.status === 'validated'    ? 'bg-blue-900/40 text-blue-300' :
            'bg-zinc-800 text-zinc-400'
          }`}>{pkg.status}</span>
        )}
      </div>

      {pkg ? (
        <>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-zinc-800 rounded p-3">
              <p className="text-zinc-400 text-xs mb-1">Readiness Score</p>
              <p className={`font-bold text-xl ${levelColor[readiness.level] || 'text-zinc-300'}`}>
                {readiness.score ?? 0}/100
              </p>
            </div>
            <div className="bg-zinc-800 rounded p-3">
              <p className="text-zinc-400 text-xs mb-1">Level</p>
              <p className={`font-semibold capitalize ${levelColor[readiness.level] || 'text-zinc-300'}`}>
                {(readiness.level || 'not_ready').replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          {readiness.nextAction && (
            <p className="text-zinc-400 text-sm border-l-2 border-zinc-600 pl-3">{readiness.nextAction}</p>
          )}

          <div className="flex gap-3 flex-wrap">
            <button onClick={onValidate}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded transition">
              Run Validation
            </button>
            {!pkg.isActive && (
              <button onClick={() => onSetActive(pkg.id)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition">
                Set Active
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-zinc-400 text-sm">
            No base package created yet. Create one to begin preparing the reusable base for zip export.
          </p>
          {!confirming ? (
            <button onClick={() => setConfirming(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded transition">
              Create Base Package
            </button>
          ) : (
            <div className="bg-zinc-800 border border-zinc-600 rounded p-3 space-y-3">
              <p className="text-yellow-300 text-sm">
                This creates the reusable base package record only. It does not build a product variant, deploy automatically, or execute any prompt.
              </p>
              <div className="flex gap-3">
                <button onClick={() => { onBuild(); setConfirming(false); }}
                  className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded transition">
                  Confirm — Create Package
                </button>
                <button onClick={() => setConfirming(false)}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PackageBuilderPanel;
