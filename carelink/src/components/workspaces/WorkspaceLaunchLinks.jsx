import React from 'react';
import { Card } from '../ui/Card.jsx';

export function WorkspaceLaunchLinks({ workspace, onNavigate }) {
  const links = [
    { label: 'Blueprint Detail',          route: '/blueprint-detail',          active: !!workspace.linkedBlueprintId },
    { label: 'Transformation Plan Detail', route: '/transformation-plan-detail', active: !!workspace.linkedTransformationPlanId },
    { label: 'Run Prompt Generator',       route: '/run-prompt-generator',       active: true },
    { label: 'Generated Prompt Detail',    route: '/generated-prompt-detail',    active: (workspace.linkedPromptIds || []).length > 0 },
    { label: 'Variant Build Launcher',     route: '/variant-build-launcher',     active: true },
    { label: 'Export Centre',             route: '/export-centre',              active: true },
  ];

  return (
    <Card variant="default">
      <div className="card-title">Launch Links</div>
      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 10 }}>
        No build runs are executed automatically from these links.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {links.map((link) => (
          <button
            key={link.route}
            className="btn btn-ghost"
            style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: 12, opacity: link.active ? 1 : 0.4 }}
            onClick={() => link.active && onNavigate(link.route)}
            disabled={!link.active}
          >
            {link.active ? '→' : '○'} {link.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
export default WorkspaceLaunchLinks;
