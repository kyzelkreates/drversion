import React from 'react';
import { Card } from '../ui/Card.jsx';

export function WorkspaceLinkedAssets({ workspace, blueprints, plans, prompts, recommendations, onLinkBlueprint, onLinkPlan, onLinkPrompt, onUnlinkPrompt, onNavigate }) {
  const linkedBp   = blueprints?.find((b) => b.id === workspace.linkedBlueprintId);
  const linkedPlan = plans?.find((p) => p.id === workspace.linkedTransformationPlanId);
  const linkedPrompts = (workspace.linkedPromptIds || []).map((id) => prompts?.find((p) => p.id === id)).filter(Boolean);

  return (
    <Card variant="default">
      <div className="card-title">Linked Assets</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
        Linked assets are read-only references. This workspace stores IDs only and does not mutate source records.
      </div>

      {/* Blueprint */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>BLUEPRINT</div>
        {linkedBp ? (
          <div style={{ background: '#0a1a0a', border: '1px solid #166534', borderRadius: 6, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>{linkedBp.name || linkedBp.productTypeName || 'Blueprint'}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ID: {linkedBp.id}</div>
            </div>
            {onNavigate && <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => onNavigate('/blueprint-detail')}>View →</button>}
          </div>
        ) : (
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 6, padding: '8px 12px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>No blueprint linked.</div>
            {onLinkBlueprint && blueprints?.length > 0 ? (
              <select style={{ background: '#1a1a1a', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 4, padding: '4px 8px', fontSize: 11 }}
                onChange={(e) => e.target.value && onLinkBlueprint(e.target.value)} defaultValue="">
                <option value="">Select blueprint...</option>
                {blueprints.map((b) => <option key={b.id} value={b.id}>{b.name || b.id}</option>)}
              </select>
            ) : <div style={{ fontSize: 11, color: '#f59e0b' }}>⚠ Create a blueprint in the Blueprint Engine first.</div>}
          </div>
        )}
      </div>

      {/* Transformation Plan */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>TRANSFORMATION PLAN</div>
        {linkedPlan ? (
          <div style={{ background: '#0a0a1a', border: '1px solid #2d1b69', borderRadius: 6, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: '#8b5cf6', fontWeight: 600 }}>{linkedPlan.name || linkedPlan.title || 'Plan'}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{linkedPlan.status}</div>
            </div>
            {onNavigate && <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => onNavigate('/transformation-plan-detail')}>View →</button>}
          </div>
        ) : (
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 6, padding: '8px 12px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>No transformation plan linked.</div>
            {onLinkPlan && plans?.length > 0 ? (
              <select style={{ background: '#1a1a1a', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 4, padding: '4px 8px', fontSize: 11 }}
                onChange={(e) => e.target.value && onLinkPlan(e.target.value)} defaultValue="">
                <option value="">Select plan...</option>
                {plans.map((p) => <option key={p.id} value={p.id}>{p.name || p.title || p.id}</option>)}
              </select>
            ) : <div style={{ fontSize: 11, color: '#f59e0b' }}>⚠ Compile a transformation plan first.</div>}
          </div>
        )}
      </div>

      {/* Generated Prompts */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>GENERATED PROMPTS ({linkedPrompts.length})</div>
        {linkedPrompts.length > 0 ? linkedPrompts.map((p) => (
          <div key={p.id} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 6, padding: '6px 10px', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{p.title}</span>
              <span style={{ fontSize: 10, color: p.safety?.passed ? '#22c55e' : '#ef4444', marginLeft: 8 }}>{p.safety?.passed ? '✓ Safe' : '⛔ Review'}</span>
            </div>
            {onUnlinkPrompt && <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => onUnlinkPrompt(p.id)}>Unlink</button>}
          </div>
        )) : <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No prompts linked.</div>}

        {onLinkPrompt && prompts?.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <select style={{ background: '#1a1a1a', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: 4, padding: '4px 8px', fontSize: 11, width: '100%' }}
              onChange={(e) => e.target.value && onLinkPrompt(e.target.value)} defaultValue="">
              <option value="">Link a generated prompt...</option>
              {(prompts || []).filter((p) => !(workspace.linkedPromptIds || []).includes(p.id))
                .map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        )}
      </div>
    </Card>
  );
}
export default WorkspaceLinkedAssets;
