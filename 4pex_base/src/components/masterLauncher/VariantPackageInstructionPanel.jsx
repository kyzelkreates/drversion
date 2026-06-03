// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// VariantPackageInstructionPanel.jsx — Run 10
import { useState } from 'react';
import {
  buildZipAttachmentInstructions,
  buildBase44VariantInstructions,
  buildManusVariantInstructions,
  buildCursorVariantInstructions,
  buildReplitVariantInstructions,
} from '../../logic/masterLauncher/variantPackageInstructionBuilder.js';

const BUILDERS = [
  { id: 'general',  label: 'General (Any Tool)', fn: buildZipAttachmentInstructions },
  { id: 'base44',   label: 'Base44',             fn: buildBase44VariantInstructions },
  { id: 'manus',    label: 'Manus',              fn: buildManusVariantInstructions },
  { id: 'cursor',   label: 'Cursor',             fn: buildCursorVariantInstructions },
  { id: 'replit',   label: 'Replit',             fn: buildReplitVariantInstructions },
];

export default function VariantPackageInstructionPanel({ state }) {
  const [activeBuilder, setActiveBuilder] = useState('base44');
  const [copied, setCopied] = useState(false);

  const builder  = BUILDERS.find((b) => b.id === activeBuilder) || BUILDERS[0];
  const text     = builder.fn(state || {});

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="card-title" style={{ margin: 0 }}>Zip Attachment Instructions</div>
        <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {BUILDERS.map((b) => (
          <button
            key={b.id}
            className={`btn btn-sm ${activeBuilder === b.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveBuilder(b.id)}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div style={{
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 8,
        padding: 14,
        fontFamily: 'monospace',
        fontSize: 11,
        color: '#94a3b8',
        maxHeight: 360,
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.7,
      }}>
        {text}
      </div>
    </div>
  );
}
