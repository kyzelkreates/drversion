import React from 'react';
import { DeploymentChecklistPanel } from './DeploymentChecklistPanel.jsx';

export function PwaReadinessPanel({ pwaCheck }) {
  if (!pwaCheck) return null;
  return <DeploymentChecklistPanel title="PWA Readiness" icon="📱" items={pwaCheck.results || []} score={pwaCheck.score || 0} />;
}
export default PwaReadinessPanel;
