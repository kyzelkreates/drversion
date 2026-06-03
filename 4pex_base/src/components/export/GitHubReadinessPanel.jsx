import React from 'react';
import { DeploymentChecklistPanel } from './DeploymentChecklistPanel.jsx';

export function GitHubReadinessPanel({ githubCheck }) {
  if (!githubCheck) return null;
  return <DeploymentChecklistPanel title="GitHub Readiness" icon="🐙" items={githubCheck.results || []} score={githubCheck.score || 0} />;
}
export default GitHubReadinessPanel;
