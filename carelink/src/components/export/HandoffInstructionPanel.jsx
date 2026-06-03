import React, { useState } from 'react';
import { Card } from '../ui/Card.jsx';

export function HandoffInstructionPanel({ instructions, onCopy }) {
  const [copied, setCopied] = useState(false);

  if (!instructions) {
    return (
      <Card variant="default">
        <div className="card-title">Handoff Instructions</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No handoff instructions generated yet. Select a builder tool and click "Generate".</div>
      </Card>
    );
  }

  function handleCopy() {
    if (onCopy) { onCopy(); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }

  const Section = ({ title, items, color = 'var(--text-secondary)', prefix = '' }) =>
    items?.length > 0 ? (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>{title}</div>
        {items.map((item, i) => (
          <div key={i} style={{ fontSize: 12, color, padding: '3px 0' }}>{prefix}{item}</div>
        ))}
      </div>
    ) : null;

  return (
    <Card variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="card-title" style={{ margin: 0 }}>Handoff Instructions — {instructions.builderTool?.toUpperCase()}</div>
        <button className="btn btn-primary btn-sm" onClick={handleCopy}>{copied ? '✓ Copied' : '📋 Copy All'}</button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-secondary)', background: '#0a0a0a', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
        {instructions.summary}
      </div>

      <Section title="STEPS"           items={instructions.steps}           color="var(--text-primary)" prefix="→ " />
      <Section title="ALLOWED ACTIONS" items={instructions.allowedActions}  color="#22c55e"             prefix="✓ " />
      <Section title="FORBIDDEN"       items={instructions.forbiddenActions} color="#ef4444"            prefix="⛔ " />
      <Section title="VALIDATION STEPS" items={instructions.validationSteps} color="#f59e0b"            prefix="✓ " />
      <Section title="STOP CONDITIONS" items={instructions.stopConditions}  color="#ef4444"             prefix="⛔ " />
      <Section title="ROLLBACK GUIDANCE" items={instructions.rollbackGuidance} color="var(--text-secondary)" prefix="" />
      <Section title="SECRET SAFETY"   items={instructions.secretSafetyRules} color="#8b5cf6"          prefix="⊡ " />

      {instructions.directive1 && (
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--gold)', background: '#0a0800', border: '1px solid #78350f', borderRadius: 6, padding: '6px 10px' }}>
          {instructions.directive1}
        </div>
      )}
    </Card>
  );
}
export default HandoffInstructionPanel;
