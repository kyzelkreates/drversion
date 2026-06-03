import React from 'react';
import { Card } from '../ui/Card.jsx';

export function DeploymentChecklistPanel({ title, items, score, icon = '📋' }) {
  if (!items || items.length === 0) return null;
  const passed = items.filter((i) => i.passed).length;
  const total  = items.length;

  return (
    <Card variant="default">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="card-title" style={{ margin: 0 }}>{icon} {title}</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444' }}>
          {passed}/{total}
        </span>
      </div>
      {items.map((item) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid #111' }}>
          <span style={{ fontSize: 14, color: item.passed ? '#22c55e' : item.critical ? '#ef4444' : '#6b7280' }}>
            {item.passed ? '✓' : item.critical ? '⛔' : '○'}
          </span>
          <span style={{ fontSize: 12, color: item.passed ? 'var(--text-primary)' : item.critical ? '#ef4444' : 'var(--text-muted)' }}>
            {item.label}
          </span>
          {item.critical && !item.passed && (
            <span style={{ fontSize: 10, color: '#ef4444', marginLeft: 'auto' }}>CRITICAL</span>
          )}
        </div>
      ))}
    </Card>
  );
}
export default DeploymentChecklistPanel;
