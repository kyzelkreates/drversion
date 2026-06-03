// 4P3X BlueprintPreview — RUN 2 — Read-only summary of a blueprint

import React from 'react';
import Badge from '../ui/Badge.jsx';

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 140, flexShrink: 0 }}>{label}</span>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{children}</div>
    </div>
  );
}

export function BlueprintPreview({ blueprint }) {
  if (!blueprint) return <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No blueprint selected.</div>;

  const listItems = (arr) =>
    Array.isArray(arr) && arr.filter(Boolean).length > 0
      ? arr.filter(Boolean).map((item, i) => (
          <Badge key={i} variant="neutral" style={{ marginRight: 4, marginBottom: 4 }}>{item}</Badge>
        ))
      : <span style={{ color: 'var(--text-muted)' }}>—</span>;

  return (
    <div>
      <Row label="Product Name">{blueprint.name}</Row>
      <Row label="Product Type">{blueprint.productType}</Row>
      <Row label="Description">{blueprint.description || '—'}</Row>
      <Row label="App Name">{blueprint.identity?.appName || '—'}</Row>
      <Row label="Tagline">{blueprint.identity?.tagline || '—'}</Row>
      <Row label="State Mode"><Badge variant="neutral">{blueprint.stateMode}</Badge></Row>
      <Row label="Safety Level"><Badge variant="warn">{blueprint.safetyLevel}</Badge></Row>
      <Row label="PWA Required">{blueprint.pwaRequired ? 'Yes' : 'No'}</Row>
      <Row label="Target Users">{listItems(blueprint.targetUsers)}</Row>
      <Row label="Core Modules">{listItems(blueprint.coreModules)}</Row>
      <Row label="Optional Modules">{listItems(blueprint.optionalModules)}</Row>
      <Row label="Data Entities">{listItems(blueprint.requiredDataEntities)}</Row>
      <Row label="User Flows">
        {Array.isArray(blueprint.mainUserFlows) && blueprint.mainUserFlows.filter(Boolean).length > 0
          ? blueprint.mainUserFlows.filter(Boolean).map((f, i) => (
              <div key={i} style={{ marginBottom: 2 }}>→ {f}</div>
            ))
          : <span style={{ color: 'var(--text-muted)' }}>—</span>}
      </Row>
      <Row label="AI Agent Needs">{listItems(blueprint.aiAgentNeeds)}</Row>
      <Row label="API Integrations">{listItems(blueprint.apiIntegrationNeeds)}</Row>
      <Row label="UI Layout">{blueprint.uiLayoutProfile || '—'}</Row>
      <Row label="Future Runs">
        {Array.isArray(blueprint.futureRuns) && blueprint.futureRuns.filter(Boolean).length > 0
          ? blueprint.futureRuns.filter(Boolean).map((r, i) => (
              <div key={i} style={{ color: 'var(--purple-bright)', marginBottom: 2 }}>{r}</div>
            ))
          : <span style={{ color: 'var(--text-muted)' }}>—</span>}
      </Row>
    </div>
  );
}

export default BlueprintPreview;
