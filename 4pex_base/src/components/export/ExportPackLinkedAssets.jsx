import React from 'react';
import { Card } from '../ui/Card.jsx';

export function ExportPackLinkedAssets({ exportPack, state, onLinkWorkspace, onLinkBlueprint, onLinkPlan, onLinkPrompt, onUnlinkPrompt }) {
  const workspaces = (state?.variantWorkspaces?.workspaces || []).filter((w) => w.status !== 'archived');
  const blueprints = state?.blueprints?.blueprints || [];
  const plans      = state?.transformationCompiler?.plans || [];
  const prompts    = state?.variantLauncher?.generatedPrompts || [];

  const linkedWS      = workspaces.find((w) => w.id === exportPack?.linkedWorkspaceId);
  const linkedBP      = blueprints.find((b) => b.id === exportPack?.linkedBlueprintId);
  const linkedPlan    = plans.find((p) => p.id === exportPack?.linkedTransformationPlanId);
  const linkedPrompts = (exportPack?.linkedPromptIds || []).map((id) => prompts.find((p) => p.id === id)).filter(Boolean);

  const sel = { background: '#111', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 6, padding: '5px 8px', fontSize: 11, width: '100%' };
  const row = { fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 };

  const AssetRow = ({ label, value, color = '#22c55e', children }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {value ? (
        <div style={{ background: '#0a1a0a', border: `1px solid ${color}44`, borderRadius: 6, padding: '7px 10px', fontSize: 12, color }}>{value}</div>
      ) : children}
    </div>
  );

  return (
    <Card variant="default">
      <div className="card-title">Linked Assets</div>
      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 12 }}>Assets are linked by ID only. Source records are never mutated.</div>

      <AssetRow label="WORKSPACE" value={linkedWS?.name} color="var(--gold)">
        {onLinkWorkspace && workspaces.length > 0 ? (
          <select style={sel} onChange={(e) => e.target.value && onLinkWorkspace(e.target.value)} defaultValue="">
            <option value="">Link workspace...</option>
            {workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        ) : <div style={row}>No workspace linked.</div>}
      </AssetRow>

      <AssetRow label="BLUEPRINT" value={linkedBP?.name} color="#22c55e">
        {onLinkBlueprint && blueprints.length > 0 ? (
          <select style={sel} onChange={(e) => e.target.value && onLinkBlueprint(e.target.value)} defaultValue="">
            <option value="">Link blueprint...</option>
            {blueprints.map((b) => <option key={b.id} value={b.id}>{b.name || b.id}</option>)}
          </select>
        ) : <div style={row}>No blueprint linked.</div>}
      </AssetRow>

      <AssetRow label="TRANSFORMATION PLAN" value={linkedPlan?.name || linkedPlan?.title} color="#8b5cf6">
        {onLinkPlan && plans.length > 0 ? (
          <select style={sel} onChange={(e) => e.target.value && onLinkPlan(e.target.value)} defaultValue="">
            <option value="">Link plan...</option>
            {plans.map((p) => <option key={p.id} value={p.id}>{p.name || p.title || p.id}</option>)}
          </select>
        ) : <div style={row}>No transformation plan linked.</div>}
      </AssetRow>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>GENERATED PROMPTS ({linkedPrompts.length})</div>
        {linkedPrompts.map((p) => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a1a', border: '1px solid #2d1b6944', borderRadius: 6, padding: '5px 10px', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#8b5cf6' }}>{p.title}</span>
            {onUnlinkPrompt && <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => onUnlinkPrompt(p.id)}>Unlink</button>}
          </div>
        ))}
        {onLinkPrompt && prompts.filter((p) => !(exportPack?.linkedPromptIds || []).includes(p.id)).length > 0 && (
          <select style={{ ...sel, marginTop: 4 }} onChange={(e) => e.target.value && onLinkPrompt(e.target.value)} defaultValue="">
            <option value="">Link prompt...</option>
            {prompts.filter((p) => !(exportPack?.linkedPromptIds || []).includes(p.id)).map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        )}
        {linkedPrompts.length === 0 && !onLinkPrompt && <div style={row}>No prompts linked.</div>}
      </div>
    </Card>
  );
}
export default ExportPackLinkedAssets;
