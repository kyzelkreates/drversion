// 4P3X Audit Validators — Run 8

export function validateAuditRun(auditRun) {
  if (!auditRun || typeof auditRun !== 'object') return { ok: false, errors: ['auditRun must be an object'] };
  const errors = [];
  if (!auditRun.id)            errors.push('auditRun.id is required');
  if (!auditRun.status)        errors.push('auditRun.status is required');
  if (typeof auditRun.overallScore !== 'number') errors.push('auditRun.overallScore must be a number');
  if (!auditRun.readinessLevel)  errors.push('auditRun.readinessLevel is required');
  if (!Array.isArray(auditRun.blockers)) errors.push('auditRun.blockers must be an array');
  if (!Array.isArray(auditRun.warnings)) errors.push('auditRun.warnings must be an array');
  if (!auditRun.createdAt)       errors.push('auditRun.createdAt is required');
  return { ok: errors.length === 0, errors };
}

export function validateAuditFinding(finding) {
  if (!finding || typeof finding !== 'object') return { ok: false, errors: ['finding must be an object'] };
  const errors = [];
  if (!finding.id)           errors.push('finding.id is required');
  if (!finding.category)     errors.push('finding.category is required');
  if (!['info','warning','critical'].includes(finding.severity)) errors.push('finding.severity must be info|warning|critical');
  if (!finding.title)        errors.push('finding.title is required');
  if (typeof finding.blocking !== 'boolean') errors.push('finding.blocking must be boolean');
  if (!['open','resolved','accepted_risk'].includes(finding.status)) errors.push('finding.status must be open|resolved|accepted_risk');
  return { ok: errors.length === 0, errors };
}

export function validateFinalAuditState(finalAudit) {
  if (!finalAudit || typeof finalAudit !== 'object') return { ok: false, errors: ['finalAudit must be an object'] };
  const errors = [];
  if (!Array.isArray(finalAudit.auditRuns))      errors.push('finalAudit.auditRuns must be an array');
  if (!Array.isArray(finalAudit.latestFindings)) errors.push('finalAudit.latestFindings must be an array');
  if (!Array.isArray(finalAudit.blockers))       errors.push('finalAudit.blockers must be an array');
  if (!finalAudit.finalLock)                     errors.push('finalAudit.finalLock is required');
  if (typeof finalAudit.overallScore !== 'number') errors.push('finalAudit.overallScore must be a number');
  return { ok: errors.length === 0, errors };
}

export function validateFinalLock(finalLock) {
  if (!finalLock || typeof finalLock !== 'object') return { ok: false, errors: ['finalLock must be an object'] };
  const errors = [];
  if (!['locked','unlocked','blocked','ready_to_lock'].includes(finalLock.status)) errors.push('finalLock.status invalid');
  if (typeof finalLock.canStartVariantBuilds !== 'boolean') errors.push('finalLock.canStartVariantBuilds must be boolean');
  return { ok: errors.length === 0, errors };
}

export function validateHardeningState(hardening) {
  if (!hardening || typeof hardening !== 'object') return { ok: false, errors: ['hardening must be an object'] };
  return { ok: true, errors: [] };
}

export function validateAuditReportExport(report) {
  if (!report) return { ok: false, errors: ['report is empty'] };
  const errors = [];
  // Must not include known raw secret patterns
  const s = JSON.stringify(report);
  if (/sk-[A-Za-z0-9]{20,}/.test(s)) errors.push('Report contains raw API key pattern');
  if (/AIza[A-Za-z0-9\-_]{35}/.test(s)) errors.push('Report contains Google API key pattern');
  return { ok: errors.length === 0, errors };
}
