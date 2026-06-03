// 4P3X BlueprintCard — RUN 2

import React from 'react';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';
import BlueprintReadinessScore from './BlueprintReadinessScore.jsx';

const STATUS_VARIANT = {
  draft:                'neutral',
  validated:            'active',
  needs_work:           'warn',
  ready_for_next_run:   'info',
};

const SAFETY_VARIANT = {
  standard:             'neutral',
  sensitive:            'warn',
  'safety-critical':    'error',
  'compliance-critical': 'error',
};

export function BlueprintCard({ blueprint, isActive, onSelect, onEdit }) {
  const r = blueprint.readiness || {};

  return (
    <Card
      variant={isActive ? 'gold' : undefined}
      style={{ cursor: 'pointer', transition: 'all 0.15s' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 700,
            color: isActive ? 'var(--gold-bright)' : 'var(--text-primary)',
            marginBottom: 2,
          }}>
            {blueprint.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{blueprint.productType}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <Badge variant={STATUS_VARIANT[blueprint.status] || 'neutral'}>{blueprint.status}</Badge>
          <Badge variant={SAFETY_VARIANT[blueprint.safetyLevel] || 'neutral'}>{blueprint.safetyLevel}</Badge>
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
        {blueprint.description?.slice(0, 90)}{blueprint.description?.length > 90 ? '…' : ''}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <Badge variant="neutral">{blueprint.stateMode}</Badge>
        {blueprint.pwaRequired && <Badge variant="info">PWA</Badge>}
        <Badge variant="neutral">{blueprint.coreModules?.length || 0} modules</Badge>
      </div>

      <BlueprintReadinessScore
        score={r.score || 0}
        level={r.level || 'not_ready'}
        missing={[]}
        warnings={[]}
        compact
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {!isActive && (
          <button className="btn btn-primary btn-sm" onClick={() => onSelect(blueprint.id)}>
            Select
          </button>
        )}
        {isActive && <span style={{ fontSize: 11, color: 'var(--gold-bright)', padding: '5px 0' }}>● Active</span>}
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(blueprint.id)}>
          Edit / View
        </button>
      </div>
    </Card>
  );
}

export default BlueprintCard;
