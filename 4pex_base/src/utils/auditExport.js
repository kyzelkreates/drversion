// 4P3X Audit Export Utils — Run 8

export function exportAuditRunToJson(auditRun) {
  const sanitised = sanitizeAuditReport(auditRun);
  return JSON.stringify(sanitised, null, 2);
}

export function exportFinalReadinessReportToJson(report) {
  const sanitised = sanitizeAuditReport(report);
  return JSON.stringify(sanitised, null, 2);
}

export function exportFinalReadinessReportToText(report) {
  const r = sanitizeAuditReport(report);
  const lines = [
    '===================================================',
    '4P3X Reusable Base Structure™ — Final Readiness Report',
    `Generated: ${new Date().toLocaleString()}`,
    '===================================================',
    '',
    `App: ${r.appName || '4P3X Base'}   Version: ${r.appVersion || '—'}`,
    `Overall Score: ${r.overallScore || 0}/100`,
    `Readiness Level: ${(r.readinessLevel || 'not_ready').replace(/_/g, ' ').toUpperCase()}`,
    '',
    `Base Ready for Variants:    ${r.baseReadyForVariants  ? 'YES ✓' : 'NO ✗'}`,
    `Export Ready:               ${r.exportReady           ? 'YES ✓' : 'NO ✗'}`,
    `Zip Handoff Ready:          ${r.zipHandoffReady        ? 'YES ✓' : 'NO ✗'}`,
    `Can Start Variant Builds:   ${r.canStartVariantBuilds  ? 'YES ✓' : 'NO ✗'}`,
    `Transformation Lock:        ${r.lockStatus             || 'unlocked'}`,
    '',
    '--- BLOCKERS ---',
    ...((r.blockers || []).length ? r.blockers.map(b => `⛔ ${b}`) : ['None ✓']),
    '',
    '--- WARNINGS ---',
    ...((r.warnings || []).length ? r.warnings.map(w => `⚠ ${w}`) : ['None ✓']),
    '',
    '--- PASSED CHECKS ---',
    ...((r.passedChecks || []).slice(0, 20).map(p => `✓ ${p}`)),
    r.passedChecks?.length > 20 ? `… and ${r.passedChecks.length - 20} more` : '',
    '',
    '--- FINAL RECOMMENDATION ---',
    r.finalRecommendation || 'Run the final audit first.',
    '',
    '--- NEXT ACTION ---',
    r.nextAction || (r.canStartVariantBuilds ? 'Begin real product variant builds from the exported base zip.' : 'Resolve blockers and re-run final audit.'),
    '',
    '===================================================',
    'SAFETY NOTES',
    '• This report does not deploy, execute prompts, or write generated files.',
    '• No raw API keys or backend secrets are included.',
    '• This is a local readiness assessment only.',
    '===================================================',
  ];
  return lines.filter(l => l !== undefined).join('\n');
}

export function sanitizeAuditReport(report) {
  if (!report) return {};
  const s = JSON.stringify(report);
  // Strip raw API key patterns
  const cleaned = s
    .replace(/sk-[A-Za-z0-9]{20,}/g, '***MASKED***')
    .replace(/AIza[A-Za-z0-9\-_]{35}/g, '***MASKED***')
    .replace(/eyJ[A-Za-z0-9\-_.]{30,}/g, '***MASKED***');
  try { return JSON.parse(cleaned); } catch { return report; }
}

export function summarizeAuditRun(auditRun) {
  if (!auditRun) return 'No audit run data.';
  return `Score: ${auditRun.overallScore}/100 · Level: ${auditRun.readinessLevel} · Blockers: ${auditRun.blockers?.length || 0} · Warnings: ${auditRun.warnings?.length || 0} · Passed: ${auditRun.passedChecks?.length || 0}`;
}

export function groupAuditFindingsBySeverity(findings = []) {
  return {
    critical: findings.filter(f => f.severity === 'critical'),
    warning:  findings.filter(f => f.severity === 'warning'),
    info:     findings.filter(f => f.severity === 'info'),
  };
}

export function groupAuditFindingsByCategory(findings = []) {
  return findings.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {});
}

export async function copyAuditReportText(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

export function downloadAuditReportJson(report, filename = '4p3x-final-readiness-report.json') {
  const json = exportFinalReadinessReportToJson(report);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function downloadAuditReportText(report, filename = '4p3x-final-readiness-report.txt') {
  const text = exportFinalReadinessReportToText(report);
  const blob = new Blob([text], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
