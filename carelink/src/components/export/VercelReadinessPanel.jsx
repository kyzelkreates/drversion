import React from 'react';
import { DeploymentChecklistPanel } from './DeploymentChecklistPanel.jsx';

export function VercelReadinessPanel({ vercelCheck }) {
  if (!vercelCheck) return null;
  return <DeploymentChecklistPanel title="Vercel Readiness" icon="▲" items={vercelCheck.results || []} score={vercelCheck.score || 0} />;
}
export default VercelReadinessPanel;
