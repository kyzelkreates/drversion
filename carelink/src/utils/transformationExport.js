// 4P3X Transformation Export Utils — RUN 4

import { safeStringifyJson } from './safeJson.js';
import { validateTransformationPlan } from '../state/transformationValidators.js';

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{10,}/gi,
  /"(rawKey|raw_key|apiKey|api_key|client_secret|private_key|service_key)"\s*:\s*"[^"]+"/gi,
];

const FORBIDDEN_EXPORT_KEYS = ['rawKey', 'raw_key', 'client_secret', 'private_key', 'service_key', 'supabase_service_key'];

function stripSecrets(obj) {
  if (typeof obj === 'string') {
    let s = obj;
    for (const pat of SECRET_PATTERNS) s = s.replace(pat, '[REDACTED]');
    return s;
  }
  if (Array.isArray(obj)) return obj.map(stripSecrets);
  if (obj && typeof obj === 'object') {
    const clean = {};
    for (const [k, v] of Object.entries(obj)) {
      if (FORBIDDEN_EXPORT_KEYS.includes(k)) { clean[k] = '[REDACTED]'; continue; }
      clean[k] = stripSecrets(v);
    }
    return clean;
  }
  return obj;
}

export function sanitizeTransformationPlanForExport(plan) {
  if (!plan || typeof plan !== 'object') return null;
  const clean = stripSecrets({ ...plan });
  // Hard remove any allowFileWrites/allowOverwrite flags that could be misread
  delete clean.allowFileWrites;
  delete clean.allowOverwrite;
  delete clean.destructiveRefactor;
  return clean;
}

export function exportTransformationPlanToJson(plan) {
  if (!plan || typeof plan !== 'object') return { ok: false, error: 'No plan provided.' };

  const { valid, errors } = validateTransformationPlan(plan);
  if (!valid) return { ok: false, error: 'Plan failed validation: ' + errors.join('; ') };

  const sanitized = sanitizeTransformationPlanForExport(plan);
  const withMeta  = {
    ...sanitized,
    _exportMeta: {
      exportedAt:  new Date().toISOString(),
      exportedBy:  '4P3X Reusable Base Structure™',
      poweredBy:   '4P3X Intelligent AI',
      createdBy:   'Kyzel Kreates',
      ecosystem:   '4P3X Verse',
      version:     'Run 4',
      safetyNote:  'This file is a non-destructive transformation plan only. No live files are generated from this export.',
    },
  };

  const { ok, value, error } = safeStringifyJson(withMeta, 2);
  if (!ok) return { ok: false, error };
  return { ok: true, json: value };
}

export function importTransformationPlanFromJson(json) {
  if (typeof json !== 'string' && typeof json !== 'object') {
    return { ok: false, error: 'Import must be a JSON string or object.' };
  }

  let parsed;
  try {
    parsed = typeof json === 'string' ? JSON.parse(json) : json;
  } catch (e) {
    return { ok: false, error: 'Invalid JSON: ' + e.message };
  }

  // Strip export meta before validation
  const { _exportMeta, allowFileWrites, allowOverwrite, destructiveRefactor, ...planData } = parsed;

  // Force non-destructive
  planData.compileMode         = 'non_destructive';
  planData.allowFileWrites     = false;
  planData.allowOverwrite      = false;
  planData.destructiveRefactor = false;

  const { valid, errors } = validateTransformationPlan(planData);
  if (!valid) return { ok: false, error: 'Plan validation failed: ' + errors.join('; ') };

  // Sanitize after import
  const sanitized = sanitizeTransformationPlanForExport(planData);
  return { ok: true, plan: sanitized };
}

export function summarizeTransformationPlan(plan) {
  if (!plan) return null;
  return {
    id:             plan.id,
    blueprintName:  plan.blueprintName,
    productType:    plan.productType,
    status:         plan.status,
    readiness:      plan.readiness,
    blockerCount:   (plan.blockers || []).length,
    warningCount:   (plan.warnings || []).length,
    riskCount:      (plan.risks || []).length,
    criticalRisks:  (plan.risks || []).filter(r => r.severity === 'critical').length,
    compiledAt:     plan.audit?.compiledAt,
  };
}

export function groupPlanRisksBySeverity(plan) {
  const risks = plan?.risks || [];
  return {
    critical: risks.filter(r => r.severity === 'critical'),
    warning:  risks.filter(r => r.severity === 'warning'),
    info:     risks.filter(r => r.severity === 'info'),
  };
}

export function formatFutureRunSequence(plan) {
  const seq = plan?.futureRunSequence || [];
  return seq.map((run, i) => ({
    index:          i + 1,
    run:            run.run,
    title:          run.title,
    mission:        run.mission,
    gateCount:      (run.validationGates || []).length,
    stopConditions: (run.stopConditions || []).length,
    fileCount:      (run.allowedFiles || []).length,
    protectedCount: (run.forbiddenFiles || []).length,
  }));
}
