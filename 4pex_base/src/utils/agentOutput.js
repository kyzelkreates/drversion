// 4P3X Agent Output Utilities — RUN 3
// Format, summarize, group, and filter agent output for display and export.

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

/**
 * Format a raw agent output for display.
 * Returns a clean, display-ready object.
 */
export function formatAgentOutput(output) {
  if (!output || typeof output !== 'object') {
    return {
      summary:         'No output available.',
      findings:        [],
      warnings:        [],
      blockers:        [],
      recommendations: [],
      nextActions:     [],
      safetyFlags:     [],
    };
  }
  return {
    summary:         output.summary || 'No summary provided.',
    findings:        (output.findings || []).filter(Boolean),
    warnings:        (output.warnings || []).filter(Boolean),
    blockers:        (output.blockers || []).filter(Boolean),
    recommendations: (output.recommendations || []).filter(Boolean),
    nextActions:     (output.nextActions || []).filter(Boolean),
    safetyFlags:     (output.safetyFlags || []).filter(Boolean),
  };
}

/**
 * Produce a short human-readable summary string from an agent run.
 */
export function summarizeAgentRun(agentRun) {
  if (!agentRun) return 'No run data.';
  const counts = [
    agentRun.findings?.length     ? `${agentRun.findings.length} finding${agentRun.findings.length !== 1 ? 's' : ''}` : null,
    agentRun.warnings?.length     ? `${agentRun.warnings.length} warning${agentRun.warnings.length !== 1 ? 's' : ''}` : null,
    agentRun.blockers?.length     ? `${agentRun.blockers.length} blocker${agentRun.blockers.length !== 1 ? 's' : ''}` : null,
    agentRun.recommendations?.length ? `${agentRun.recommendations.length} recommendation${agentRun.recommendations.length !== 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ');
  return `${agentRun.summary || 'Run completed.'}${counts ? ` (${counts})` : ''}`;
}

/**
 * Group recommendations by priority, sorted critical → low.
 */
export function groupRecommendationsByPriority(recommendations) {
  if (!Array.isArray(recommendations)) return {};
  const groups = { critical: [], high: [], medium: [], low: [] };
  for (const rec of recommendations) {
    const p = rec.priority || 'low';
    if (p in groups) groups[p].push(rec);
    else groups.low.push(rec);
  }
  return groups;
}

/**
 * Filter recommendations by agentId.
 */
export function filterRecommendationsByAgent(recommendations, agentId) {
  if (!Array.isArray(recommendations) || !agentId) return recommendations || [];
  return recommendations.filter((r) => r.agentId === agentId);
}

/**
 * Filter recommendations by status.
 */
export function filterRecommendationsByStatus(recommendations, status) {
  if (!Array.isArray(recommendations) || !status) return recommendations || [];
  return recommendations.filter((r) => r.status === status);
}

/**
 * Filter recommendations by category.
 */
export function filterRecommendationsByCategory(recommendations, category) {
  if (!Array.isArray(recommendations) || !category) return recommendations || [];
  return recommendations.filter((r) => r.category === category);
}

/**
 * Sort recommendations: critical → high → medium → low, then by createdAt desc.
 */
export function sortRecommendationsByPriority(recommendations) {
  if (!Array.isArray(recommendations)) return [];
  return [...recommendations].sort((a, b) => {
    const pDiff = (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3);
    if (pDiff !== 0) return pDiff;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
}

/**
 * Sanitize an agent report for export.
 * Strips any accidental secret values from all string fields.
 */
const SECRET_RE = /sk-[a-zA-Z0-9\-_]{20,}|eyJ[a-zA-Z0-9+/=._-]{20,}|sb_[a-zA-Z0-9\-_]{20,}/g;

function redactSecrets(str) {
  if (typeof str !== 'string') return str;
  return str.replace(SECRET_RE, '••••••••');
}

function sanitizeStrings(val) {
  if (typeof val === 'string') return redactSecrets(val);
  if (Array.isArray(val)) return val.map(sanitizeStrings);
  if (val && typeof val === 'object') {
    const out = {};
    for (const k of Object.keys(val)) out[k] = sanitizeStrings(val[k]);
    return out;
  }
  return val;
}

export function sanitizeAgentReportExport(report) {
  if (!report || typeof report !== 'object') return report;
  return sanitizeStrings(report);
}

/**
 * Get counts summary for display.
 */
export function getRecommendationCounts(recommendations) {
  if (!Array.isArray(recommendations)) return { total: 0, open: 0, critical: 0, high: 0, accepted: 0, dismissed: 0 };
  return {
    total:     recommendations.length,
    open:      recommendations.filter((r) => r.status === 'open').length,
    critical:  recommendations.filter((r) => r.priority === 'critical').length,
    high:      recommendations.filter((r) => r.priority === 'high').length,
    accepted:  recommendations.filter((r) => r.status === 'accepted').length,
    dismissed: recommendations.filter((r) => r.status === 'dismissed').length,
  };
}
