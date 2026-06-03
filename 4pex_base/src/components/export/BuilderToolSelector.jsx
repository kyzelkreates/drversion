import React from 'react';
import { getAllBuilderTools } from '../../config/builderToolTemplates.js';

const TOOL_ICONS = { base44: '⬡', manus: '🤖', replit: '🔁', cursor: '✦', github: '🐙', vercel: '▲', generic: '📦' };

export function BuilderToolSelector({ selected, onChange }) {
  const tools = getAllBuilderTools();
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Select target builder tool:</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {tools.map((t) => (
          <button
            key={t.id}
            className={`btn btn-sm ${selected === t.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => onChange(t.id)}
          >
            <span>{TOOL_ICONS[t.id] || '⊡'}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          {tools.find((t) => t.id === selected)?.purpose || ''}
        </div>
      )}
    </div>
  );
}
export default BuilderToolSelector;
