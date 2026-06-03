import React from 'react';
import { Card } from '../ui/Card.jsx';

const levelColors = { ready: '#22c55e', ready_with_warnings: '#f59e0b', partial: '#8b5cf6', not_ready: '#ef4444' };

export function AuditScoreCard({ score = 0, readinessLevel = 'not_ready', lastRunAt, passedCount = 0, failedCount = 0, warningCount = 0 }) {
  const color = levelColors[readinessLevel] || '#6b7280';
  const levelLabel = readinessLevel.replace(/_/g, ' ').toUpperCase();

  return (
    <Card variant="gold">
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center', minWidth: 72 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>/ 100</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color, marginBottom: 4 }}>{levelLabel}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#22c55e' }}>✓ {passedCount} passed</span>
            {failedCount  > 0 && <span style={{ fontSize: 11, color: '#ef4444' }}>⛔ {failedCount} failed</span>}
            {warningCount > 0 && <span style={{ fontSize: 11, color: '#f59e0b' }}>⚠ {warningCount} warnings</span>}
          </div>
          {lastRunAt && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Last run: {new Date(lastRunAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
export default AuditScoreCard;
