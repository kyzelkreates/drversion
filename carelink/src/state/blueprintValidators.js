// 4P3X Blueprint Validators — RUN 2
// Blueprint-specific validation, readiness scoring, and risk detection.

import { getPresetById } from '../config/blueprintPresets.js';
import { getRulesForProductType } from '../config/transformationRules.js';
import { nowIso } from '../utils/date.js';
import { generateId } from '../utils/id.js';

const VALID_STATE_MODES   = ['local-first', 'supabase', 'hybrid'];
const VALID_SAFETY_LEVELS = ['standard', 'sensitive', 'safety-critical', 'compliance-critical'];
const VALID_STATUSES      = ['draft', 'validated', 'needs_work', 'ready_for_next_run'];

const FORBIDDEN_AI_ACTIONS = [
  'edit_files', 'auto_deploy', 'call_external_api',
  'auto_configure', 'uncontrolled_autonomy', 'store_raw_keys',
];

const SAFETY_CRITICAL_TYPES = ['fleet', 'cybersecurity', 'safety-critical', 'compliance-critical'];
const DEFENSIVE_ONLY_TYPES  = ['cybersecurity', 'monitoring'];
const NO_CLONE_TYPES        = ['portfolio', 'custom'];

/**
 * Validate a blueprint object.
 * Returns { valid: boolean, errors: string[] }
 */
export function validateBlueprint(bp) {
  const errors = [];

  if (!bp || typeof bp !== 'object') {
    return { valid: false, errors: ['Blueprint must be a non-null object.'] };
  }

  if (!bp.name || typeof bp.name !== 'string' || bp.name.trim().length < 2) {
    errors.push('Blueprint must have a name (minimum 2 characters).');
  }

  if (!bp.productType || typeof bp.productType !== 'string') {
    errors.push('Blueprint must have a productType.');
  }

  if (!bp.identity || typeof bp.identity !== 'object') {
    errors.push('Blueprint must have an identity object.');
  }

  if (!Array.isArray(bp.targetUsers) || bp.targetUsers.length === 0) {
    errors.push('Blueprint must have at least one target user.');
  }

  if (!Array.isArray(bp.coreModules) || bp.coreModules.length === 0) {
    errors.push('Blueprint must have at least one core module.');
  }

  if (!Array.isArray(bp.mainUserFlows) || bp.mainUserFlows.length === 0) {
    errors.push('Blueprint must have at least one main user flow.');
  }

  if (!VALID_STATE_MODES.includes(bp.stateMode)) {
    errors.push(`Invalid stateMode: "${bp.stateMode}". Must be one of: ${VALID_STATE_MODES.join(', ')}.`);
  }

  if (!VALID_SAFETY_LEVELS.includes(bp.safetyLevel)) {
    errors.push(`Invalid safetyLevel: "${bp.safetyLevel}". Must be one of: ${VALID_SAFETY_LEVELS.join(', ')}.`);
  }

  if (bp.status && !VALID_STATUSES.includes(bp.status)) {
    errors.push(`Invalid status: "${bp.status}".`);
  }

  // AI safety check
  if (Array.isArray(bp.aiAgentNeeds)) {
    for (const need of bp.aiAgentNeeds) {
      const lower = String(need).toLowerCase();
      if (FORBIDDEN_AI_ACTIONS.some((fa) => lower.includes(fa.replace(/_/g, ' ')))) {
        errors.push(`Forbidden AI agent need detected: "${need}"`);
      }
    }
  }

  // Secret key check inside blueprint
  const bpStr = JSON.stringify(bp).toLowerCase();
  const FORBIDDEN_PATTERNS = ['supabase_service_role', 'stripe_secret', 'jwt_secret', '_rawkey'];
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (bpStr.includes(pattern)) {
      errors.push(`Forbidden secret pattern detected in blueprint: "${pattern}"`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Detect risks in a blueprint.
 * Returns array of risk warning strings.
 */
export function detectBlueprintRisks(bp) {
  const risks = [];
  if (!bp) return risks;

  if (SAFETY_CRITICAL_TYPES.includes(bp.productType) || SAFETY_CRITICAL_TYPES.includes(bp.safetyLevel)) {
    risks.push('⚠ Safety-critical product: all changes must be logged. Real-world safety validation required before deployment.');
  }

  if (DEFENSIVE_ONLY_TYPES.includes(bp.productType)) {
    risks.push('⚠ Defensive-only product: no offensive security tools, attack simulation, or exploitation code permitted.');
  }

  if (NO_CLONE_TYPES.includes(bp.productType)) {
    risks.push('⚠ No proprietary cloning: do not replicate third-party applications, their UI, branding, or data structures without authorisation.');
  }

  if (bp.stateMode === 'supabase' || bp.stateMode === 'hybrid') {
    risks.push('ℹ Supabase mode requires a dedicated Supabase sync run. Do not connect Supabase before that run is built.');
  }

  if (bp.safetyLevel === 'compliance-critical') {
    risks.push('⚠ Compliance-critical: ensure local privacy regulations are met. Obtain legal review before deploying with real user data.');
  }

  if (Array.isArray(bp.apiIntegrationNeeds) && bp.apiIntegrationNeeds.some((n) =>
    String(n).toLowerCase().includes('payment')
  )) {
    risks.push('ℹ Payment integration requires dedicated payment run. Do not add payment logic before its run is built.');
  }

  return risks;
}

/**
 * Find missing requirements for a blueprint.
 * Returns array of missing requirement strings.
 */
export function findMissingBlueprintRequirements(bp) {
  const missing = [];
  if (!bp) return missing;

  if (!bp.name || bp.name.trim().length < 2) missing.push('Product name');
  if (!bp.description || bp.description.trim().length < 10) missing.push('Product description (min 10 chars)');
  if (!bp.identity?.appName) missing.push('Identity: App name');
  if (!Array.isArray(bp.targetUsers) || bp.targetUsers.filter(Boolean).length === 0) missing.push('Target users');
  if (!Array.isArray(bp.coreModules) || bp.coreModules.filter(Boolean).length === 0) missing.push('Core modules');
  if (!Array.isArray(bp.mainUserFlows) || bp.mainUserFlows.filter(Boolean).length === 0) missing.push('Main user flows');
  if (!Array.isArray(bp.requiredDataEntities) || bp.requiredDataEntities.filter(Boolean).length === 0) missing.push('Required data entities');
  if (!bp.uiLayoutProfile) missing.push('UI layout profile');
  if (!Array.isArray(bp.futureRuns) || bp.futureRuns.filter(Boolean).length === 0) missing.push('Future run recommendations');

  return missing;
}

/**
 * Validate blueprint against transformation rules.
 * Returns { passed: boolean, violations: string[] }
 */
export function validateBlueprintAgainstTransformationRules(bp) {
  if (!bp) return { passed: false, violations: ['No blueprint provided.'] };

  const rules = getRulesForProductType(bp.productType || 'custom');
  const violations = [];

  for (const rule of rules) {
    if (rule.severity === 'critical') {
      // Check specific critical rules
      if (rule.id === 'ai_no_raw_keys_in_exports') {
        const bpStr = JSON.stringify(bp).toLowerCase();
        if (bpStr.includes('_rawkey') || bpStr.includes('apikey')) {
          violations.push(`[${rule.severity.toUpperCase()}] ${rule.label}`);
        }
      }
      if (rule.id === 'ai_no_uncontrolled_autonomy') {
        if (Array.isArray(bp.aiAgentNeeds)) {
          const hasUncontrolled = bp.aiAgentNeeds.some((n) =>
            String(n).toLowerCase().includes('autonomous') ||
            String(n).toLowerCase().includes('unrestricted')
          );
          if (hasUncontrolled) violations.push(`[${rule.severity.toUpperCase()}] ${rule.label}`);
        }
      }
    }
  }

  return { passed: violations.length === 0, violations };
}

/**
 * Calculate blueprint readiness score (0–100).
 * Returns { score, level, missing, warnings }
 */
export function calculateBlueprintReadiness(bp) {
  if (!bp) return { score: 0, level: 'not_ready', missing: [], warnings: [] };

  const missing  = findMissingBlueprintRequirements(bp);
  const risks    = detectBlueprintRisks(bp);
  const { valid, errors } = validateBlueprint(bp);
  const { passed, violations } = validateBlueprintAgainstTransformationRules(bp);

  // Base scoring
  let score = 0;

  // Core fields (60 pts)
  if (bp.name?.trim().length >= 2)                                      score += 8;
  if (bp.description?.trim().length >= 10)                              score += 6;
  if (bp.identity?.appName)                                             score += 6;
  if (Array.isArray(bp.targetUsers) && bp.targetUsers.filter(Boolean).length > 0)   score += 8;
  if (Array.isArray(bp.coreModules) && bp.coreModules.filter(Boolean).length > 0)   score += 8;
  if (Array.isArray(bp.mainUserFlows) && bp.mainUserFlows.filter(Boolean).length > 0) score += 8;
  if (Array.isArray(bp.requiredDataEntities) && bp.requiredDataEntities.filter(Boolean).length > 0) score += 8;
  if (bp.uiLayoutProfile)                                               score += 4;
  if (VALID_STATE_MODES.includes(bp.stateMode))                         score += 4;

  // Optional completeness (25 pts)
  if (Array.isArray(bp.optionalModules) && bp.optionalModules.length > 0)  score += 5;
  if (Array.isArray(bp.aiAgentNeeds) && bp.aiAgentNeeds.length > 0)        score += 5;
  if (Array.isArray(bp.apiIntegrationNeeds) && bp.apiIntegrationNeeds.length > 0) score += 5;
  if (Array.isArray(bp.futureRuns) && bp.futureRuns.filter(Boolean).length > 0) score += 5;
  if (Array.isArray(bp.lockedRules) && bp.lockedRules.filter(Boolean).length > 0) score += 5;

  // Validation bonus (15 pts)
  if (valid && errors.length === 0) score += 10;
  if (passed && violations.length === 0) score += 5;

  // Deductions
  score -= missing.length * 3;
  score -= violations.length * 10;
  score = Math.max(0, Math.min(100, Math.round(score)));

  let level;
  if (score >= 90)      level = 'ready';
  else if (score >= 70) level = 'ready_with_warnings';
  else if (score >= 40) level = 'partial';
  else                  level = 'not_ready';

  return { score, level, missing, warnings: [...risks, ...violations] };
}

/**
 * Create a new blueprint object from a preset.
 */
export function createBlueprintFromPreset(presetId) {
  const preset = getPresetById(presetId);
  if (!preset) {
    return { ok: false, error: `Preset not found: "${presetId}"` };
  }

  const now = nowIso();
  const blueprint = {
    id:          generateId('bp'),
    name:        preset.name,
    productType: preset.productType,
    description: preset.description,
    status:      'draft',
    identity: {
      appName:   preset.name,
      poweredBy: '4P3X Intelligent AI',
      createdBy: 'Kyzel Kreates',
      ecosystem: '4P3X Verse',
      tagline:   preset.description,
    },
    targetUsers:           [],
    coreModules:           [...preset.defaultCoreModules],
    optionalModules:       [...preset.defaultOptionalModules],
    requiredDataEntities:  [...preset.defaultDataEntities],
    mainUserFlows:         [...preset.defaultUserFlows],
    aiAgentNeeds:          [...preset.defaultAiAgentNeeds],
    apiIntegrationNeeds:   [...preset.defaultApiIntegrationNeeds],
    uiLayoutProfile:       preset.defaultUILayoutProfile,
    stateMode:             preset.defaultStateMode,
    pwaRequired:           false,
    safetyLevel:           preset.defaultSafetyLevel,
    lockedRules:           [...preset.lockedRules],
    futureRuns:            [...preset.recommendedFutureRuns],
    readiness: {
      score:   0,
      level:   'not_ready',
      missing: [],
      warnings: [],
    },
    audit: { createdAt: now, updatedAt: now },
  };

  // Calculate initial readiness
  blueprint.readiness = calculateBlueprintReadiness(blueprint);

  const { valid, errors } = validateBlueprint(blueprint);
  if (!valid) {
    // Still return it as draft — user can fix issues
    blueprint.status = 'needs_work';
  }

  return { ok: true, blueprint };
}
