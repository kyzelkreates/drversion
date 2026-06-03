// 4P3X Package Instruction Panel — Run 9
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { useState } from 'react';
import TEMPLATES from '../../config/packageInstructionTemplates.js';

const TARGETS = [
  { key: 'base44',  label: 'Base44' },
  { key: 'manus',   label: 'Manus' },
  { key: 'replit',  label: 'Replit' },
  { key: 'cursor',  label: 'Cursor' },
  { key: 'github',  label: 'GitHub' },
  { key: 'vercel',  label: 'Vercel' },
  { key: 'generic', label: 'Generic' },
];

export function PackageInstructionPanel({ instructions }) {
  const [selected, setSelected] = useState('base44');
  const src = instructions?.[selected] || TEMPLATES[selected] || [];
  const steps = Array.isArray(src) ? src : src.steps || [];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 space-y-4">
      <h3 className="text-white font-semibold">Builder Attachment Instructions</h3>

      <div className="flex flex-wrap gap-2">
        {TARGETS.map((t) => (
          <button key={t.key}
            onClick={() => setSelected(t.key)}
            className={`px-3 py-1 text-xs rounded transition ${
              selected === t.key
                ? 'bg-blue-700 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3 text-sm bg-zinc-800 rounded p-3">
            <span className="text-zinc-500 font-mono shrink-0">{i + 1}.</span>
            <span className="text-zinc-300">{step}</span>
          </div>
        ))}
      </div>

      <p className="text-zinc-500 text-xs border-t border-zinc-700 pt-3">
        These instructions are advisory only. No automatic deployment, push, or zip is triggered.
      </p>
    </div>
  );
}

export default PackageInstructionPanel;
