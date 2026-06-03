// 4P3X Prompt Validators — Run 5
// Validates generated prompt objects before saving or exporting.

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /eyJ[a-zA-Z0-9._-]{50,}/,
  /service_role_key\s*=\s*["'][^"']+["']/i,
  /SUPABASE_SERVICE_ROLE_KEY/i,
  /api_secret\s*=\s*["'][^"']{5,}/i,
  /private_key\s*=\s*["'][^"']{5,}/i,
];

const FORBIDDEN_BACKEND_NAMES = [
  'SERVICE_ROLE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'SECRET_KEY',
  'PRIVATE_KEY',
  'MASTER_KEY',
  'SIGNING_SECRET',
  'WEBHOOK_SECRET',
  'STRIPE_SECRET_KEY',
  'SENDGRID_API_KEY',
  'FIREBASE_SERVICE_ACCOUNT',
];

const DEMO_PATTERNS = [
  /\bdemo\s+data\b/i,
  /\bmock\s+data\b/i,
  /\bfake\s+data\b/i,
  /\bdummy\s+data\b/i,
  /\btoy\s+app\b/i,
  /sample.only/i,
  /placeholder\s+only/i,
];

export function validateGeneratedPrompt(prompt) {
  if (!prompt || typeof prompt !== 'object') {
    return { valid: false, error: 'Prompt must be a non-null object.' };
  }

  const requiredFields = ['id', 'transformationPlanId', 'productType', 'runNumber', 'title', 'promptText'];
  for (const field of requiredFields) {
    if (!prompt[field]) {
      return { valid: false, error: `Prompt missing required field: "${field}".` };
    }
  }

  if (!['draft', 'validated', 'needs_review', 'ready_to_copy'].includes(prompt.status)) {
    return { valid: false, error: `Invalid prompt status: "${prompt.status}".` };
  }

  const safetyResult = validatePromptSafety(prompt);
  if (!safetyResult.valid) return safetyResult;

  return { valid: true };
}

export function validatePromptSafety(prompt) {
  if (!prompt) return { valid: false, error: 'Prompt is null.' };
  const text = prompt.promptText || '';

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      return { valid: false, error: 'Prompt text contains a possible raw secret key or token.' };
    }
  }

  const upperText = text.toUpperCase();
  for (const name of FORBIDDEN_BACKEND_NAMES) {
    if (upperText.includes(name + '=') || upperText.includes(name + ' =')) {
      return { valid: false, error: `Prompt text contains forbidden backend secret name: "${name}".` };
    }
  }

  return { valid: true };
}

export function validatePromptCompleteness(prompt) {
  if (!prompt) return { valid: false, error: 'Prompt is null.' };
  if (!prompt.completeness) return { valid: false, error: 'Prompt missing completeness object.' };
  if (typeof prompt.completeness.score !== 'number') {
    return { valid: false, error: 'Prompt completeness.score must be a number.' };
  }
  return { valid: true };
}

export function validatePromptScope(prompt) {
  if (!prompt) return { valid: false, error: 'Prompt is null.' };
  if (!prompt.scope || typeof prompt.scope !== 'object') {
    return { valid: false, error: 'Prompt missing scope object.' };
  }
  if (!Array.isArray(prompt.scope.allowedFiles)) {
    return { valid: false, error: 'Prompt scope.allowedFiles must be an array.' };
  }
  if (!Array.isArray(prompt.scope.forbiddenFiles)) {
    return { valid: false, error: 'Prompt scope.forbiddenFiles must be an array.' };
  }
  return { valid: true };
}

export function validatePromptFilePermissions(prompt) {
  if (!prompt) return { valid: false, error: 'Prompt is null.' };
  const forbidden = prompt.scope?.forbiddenFiles || [];
  const protectedFiles = ['src/state/storage.js', '.env', '.env.local', '.env.production'];

  for (const pf of protectedFiles) {
    const inAllowed = (prompt.scope?.allowedFiles || []).some(
      (af) => af.toLowerCase() === pf.toLowerCase()
    );
    const notInForbidden = !forbidden.some((ff) => ff.toLowerCase().includes(pf.toLowerCase()));
    if (inAllowed && notInForbidden && pf === '.env') {
      return { valid: false, error: `Prompt allows "${pf}" without it being in the forbidden list — security risk.` };
    }
  }

  return { valid: true };
}

export function validatePromptStopConditions(prompt) {
  if (!prompt) return { valid: false, error: 'Prompt is null.' };
  if (!prompt.controls?.stopConditions || !Array.isArray(prompt.controls.stopConditions)) {
    return { valid: false, error: 'Prompt missing controls.stopConditions array.' };
  }
  if (prompt.controls.stopConditions.length === 0) {
    return { valid: false, error: 'Prompt has no stop conditions — at least one is required.' };
  }
  return { valid: true };
}

export function validatePromptRollbackGuidance(prompt) {
  if (!prompt) return { valid: false, error: 'Prompt is null.' };
  if (!prompt.controls?.rollbackGuidance || !Array.isArray(prompt.controls.rollbackGuidance)) {
    return { valid: false, error: 'Prompt missing controls.rollbackGuidance array.' };
  }
  if (prompt.controls.rollbackGuidance.length === 0) {
    return { valid: false, error: 'Prompt has no rollback guidance — at least one step is required.' };
  }
  return { valid: true };
}

export function validatePromptDirective1(prompt) {
  if (!prompt) return { valid: false, error: 'Prompt is null.' };
  if (!prompt.promptText) return { valid: false, error: 'Prompt text is empty.' };
  if (!/DIRECTIVE 1/i.test(prompt.promptText)) {
    return { valid: false, error: 'Prompt is missing the Directive 1 footer.' };
  }
  if (!/Adapt the skill set to the task/i.test(prompt.promptText)) {
    return { valid: false, error: 'Prompt Directive 1 footer is incomplete.' };
  }
  return { valid: true };
}

export function runAllPromptValidations(prompt) {
  const checks = [
    validateGeneratedPrompt,
    validatePromptSafety,
    validatePromptCompleteness,
    validatePromptScope,
    validatePromptFilePermissions,
    validatePromptStopConditions,
    validatePromptRollbackGuidance,
    validatePromptDirective1,
  ];

  const errors = [];
  for (const check of checks) {
    const result = check(prompt);
    if (!result.valid) {
      errors.push(result.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
