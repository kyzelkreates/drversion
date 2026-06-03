// 4P3X Agent Analyzers — RUN 3
// Deterministic local analysis functions.
// These are NOT external AI calls. They inspect local state only.
// Each analyzer returns: { summary, findings, warnings, blockers, recommendations, nextActions, safetyFlags }

import { calculateBlueprintReadiness, detectBlueprintRisks, findMissingBlueprintRequirements } from '../../state/blueprintValidators.js';
import moduleRegistry from '../../config/moduleRegistry.js';
import transformationRules, { getCriticalRules } from '../../config/transformationRules.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

function emptyOutput(summary) {
  return { summary, findings: [], warnings: [], blockers: [], recommendations: [], nextActions: [], safetyFlags: [] };
}

function hasBlueprintData(ctx) {
  return ctx && ctx.blueprint && ctx.blueprint.name;
}

// ─── System Architect Analyzer ──────────────────────────────────────────────

export function analyzeArchitecture(ctx) {
  if (!hasBlueprintData(ctx)) {
    return {
      ...emptyOutput('No active blueprint. Architecture analysis requires an active blueprint.'),
      blockers: ['No active blueprint selected. Go to Blueprint Engine and create or select a blueprint.'],
      nextActions: ['Create a blueprint in the Blueprint Engine.', 'Select it as the active blueprint.'],
    };
  }

  const bp      = ctx.blueprint;
  const r       = ctx.readiness || {};
  const findings    = [];
  const warnings    = [];
  const blockers    = [];
  const recommendations = [];
  const nextActions = [];
  const safetyFlags = [];

  // SSOT alignment
  findings.push('State management: SSOT is storage.js — single source of truth confirmed.');
  findings.push(`State mode: ${bp.stateMode || 'not set'}`);

  if (bp.stateMode === 'supabase' || bp.stateMode === 'hybrid') {
    warnings.push('Blueprint targets Supabase mode — this requires a dedicated Supabase sync run before connecting backend.');
    recommendations.push('Do not connect Supabase until the dedicated sync run is built and validated.');
    safetyFlags.push('Supabase: not yet connected — required run has not been built.');
  }

  // Module dependency
  const activeModuleIds = moduleRegistry.filter((m) => m.status === 'active').map((m) => m.id);
  const missingCore = (bp.coreModules || []).filter((m) => !activeModuleIds.includes(m));
  if (missingCore.length > 0) {
    warnings.push(`Core modules not yet active in module registry: ${missingCore.join(', ')}`);
    recommendations.push(`Activate or build the following core modules in future runs: ${missingCore.join(', ')}`);
  } else {
    findings.push('All core blueprint modules are present in module registry.');
  }

  // Data entity check
  const entities = (bp.requiredDataEntities || []).filter(Boolean);
  if (entities.length === 0) {
    warnings.push('No required data entities defined in blueprint — required for backend schema planning.');
    recommendations.push('Define required data entities in the Blueprint Detail editor.');
  } else {
    findings.push(`Data model: ${entities.length} entities defined — ${entities.slice(0, 4).join(', ')}${entities.length > 4 ? '…' : ''}`);
  }

  // Safety level
  const SAFETY_CRITICAL = ['safety-critical', 'compliance-critical'];
  if (SAFETY_CRITICAL.includes(bp.safetyLevel)) {
    safetyFlags.push(`Safety-critical product (${bp.safetyLevel}): human review and compliance sign-off required before any deployment.`);
    recommendations.push('Engage safety/compliance reviewer before building fleet, induction, or compliance-critical product runs.');
  }

  // Run sequencing
  const criticalRules = getCriticalRules();
  const storageRule = criticalRules.find((r) => r.id === 'fp_no_replace_storage');
  if (storageRule) findings.push('Foundation rule confirmed: ' + storageRule.label);

  // Readiness score
  const score = r.score || 0;
  if (score < 40) {
    blockers.push(`Readiness score is ${score}/100 — architecture review cannot be completed until blueprint is more complete.`);
  } else if (score < 70) {
    warnings.push(`Readiness score is ${score}/100 — architecture has gaps. Review missing requirements before next run.`);
    recommendations.push('Complete the blueprint in Blueprint Detail before running transformation.');
  } else {
    findings.push(`Readiness score: ${score}/100 — architecture is sufficiently defined for transformation planning.`);
  }

  // Locked rules
  const locked = (bp.lockedRules || []).filter(Boolean);
  if (locked.length > 0) {
    findings.push(`${locked.length} locked rules defined — these must be respected in all future runs.`);
  } else {
    warnings.push('No locked rules defined — add key constraints to prevent accidental feature creep.');
    recommendations.push('Define locked rules in Blueprint Detail to protect architectural boundaries.');
  }

  nextActions.push('Review blueprint detail and fill all missing requirements.');
  nextActions.push('Verify module registry alignment before next run.');
  if (bp.stateMode !== 'local-first') nextActions.push('Plan dedicated Supabase sync run before enabling backend state.');

  return {
    summary: `Architecture review complete for "${bp.name}". Readiness: ${score}/100. ${blockers.length} blockers, ${warnings.length} warnings.`,
    findings,
    warnings,
    blockers,
    recommendations,
    nextActions,
    safetyFlags,
  };
}

// ─── UX Logic Analyzer ──────────────────────────────────────────────────────

export function analyzeUxLogic(ctx) {
  if (!hasBlueprintData(ctx)) {
    return {
      ...emptyOutput('No active blueprint. UX analysis requires an active blueprint.'),
      blockers: ['No active blueprint selected.'],
      nextActions: ['Create and select a blueprint in Blueprint Engine.'],
    };
  }

  const bp = ctx.blueprint;
  const findings    = [];
  const warnings    = [];
  const blockers    = [];
  const recommendations = [];
  const nextActions = [];
  const safetyFlags = [];

  // User flows
  const flows = (bp.mainUserFlows || []).filter(Boolean);
  if (flows.length === 0) {
    blockers.push('No user flows defined — UX design cannot proceed without defined user journeys.');
    recommendations.push('Add at least 3 main user flows in Blueprint Detail.');
  } else if (flows.length < 3) {
    warnings.push(`Only ${flows.length} user flow(s) defined — aim for at least 3 to cover core journeys.`);
    recommendations.push('Add more user flows to cover edge cases and secondary user types.');
  } else {
    findings.push(`${flows.length} user flows defined. Core journeys are mapped.`);
  }

  // Target users
  const users = (bp.targetUsers || []).filter(Boolean);
  if (users.length === 0) {
    blockers.push('No target users defined — UX cannot be designed without knowing who the product is for.');
    recommendations.push('Define target user roles in Blueprint Detail (e.g. Admin, Student, Manager).');
  } else {
    findings.push(`Target users defined: ${users.join(', ')}`);
  }

  // UI layout
  if (!bp.uiLayoutProfile) {
    warnings.push('No UI layout profile selected — layout shell must be defined before building screens.');
    recommendations.push('Select a UI layout profile (e.g. sidebar-shell, kanban-shell) in Blueprint Detail.');
  } else {
    findings.push(`UI layout profile: ${bp.uiLayoutProfile}`);
  }

  // Mobile responsiveness reminder
  findings.push('Current foundation uses CSS-grid and flex — responsive layout is active.');
  recommendations.push('Ensure all future screen designs include mobile breakpoints before building product runs.');

  // Screen state coverage
  const SCREEN_STATES = ['empty state', 'loading state', 'error state', 'success state'];
  const flowText = flows.join(' ').toLowerCase();
  const missingStates = SCREEN_STATES.filter((s) => !flowText.includes(s.replace(' state', '')));
  if (missingStates.length > 0) {
    warnings.push(`User flows may not cover: ${missingStates.join(', ')}. Ensure screens handle these states.`);
    recommendations.push('Add empty, loading, error, and success state handling to all future product screens.');
  } else {
    findings.push('User flows appear to reference multiple screen states.');
  }

  // PWA
  if (!bp.pwaRequired) {
    findings.push('PWA not required for this blueprint.');
  } else {
    findings.push('PWA required — ensure service worker and offline support are built in the relevant product run.');
    recommendations.push('Validate offline UX flow before deploying PWA product variant.');
  }

  nextActions.push('Finalise user flows in Blueprint Detail.');
  nextActions.push('Map each user flow to a screen/component in the product run.');
  nextActions.push('Verify empty/loading/error/success states for all critical screens.');

  return {
    summary: `UX review complete for "${bp.name}". ${flows.length} user flows, ${users.length} user types, layout: ${bp.uiLayoutProfile || 'not set'}.`,
    findings,
    warnings,
    blockers,
    recommendations,
    nextActions,
    safetyFlags,
  };
}

// ─── Validation Analyzer ─────────────────────────────────────────────────────

export function analyzeValidation(ctx) {
  if (!hasBlueprintData(ctx)) {
    return {
      ...emptyOutput('No active blueprint. Validation requires an active blueprint.'),
      blockers: ['No active blueprint selected.'],
      nextActions: ['Create and select a blueprint in Blueprint Engine.'],
    };
  }

  const bp      = ctx.blueprint;
  const r       = calculateBlueprintReadiness(bp);
  const missing = findMissingBlueprintRequirements(bp);
  const risks   = detectBlueprintRisks(bp);

  const findings    = [];
  const warnings    = [];
  const blockers    = [];
  const recommendations = [];
  const nextActions = [];
  const safetyFlags = [];

  findings.push(`Readiness score: ${r.score}/100 — Level: ${r.level.replace(/_/g, ' ')}`);
  findings.push(`Validation status: ${bp.status || 'unknown'}`);

  if (missing.length > 0) {
    for (const m of missing) {
      if (['Product name', 'Product description (min 10 chars)', 'Identity: App name', 'Target users', 'Core modules', 'Main user flows', 'Required data entities'].includes(m)) {
        blockers.push(`Missing required field: ${m}`);
      } else {
        warnings.push(`Missing recommended field: ${m}`);
      }
    }
  } else {
    findings.push('All required blueprint fields are populated.');
  }

  for (const risk of risks) {
    if (risk.startsWith('⚠')) safetyFlags.push(risk.replace('⚠ ', ''));
    else if (risk.startsWith('ℹ')) findings.push(risk.replace('ℹ ', ''));
    else warnings.push(risk);
  }

  if (r.score >= 90) {
    findings.push('Blueprint meets production readiness threshold.');
    recommendations.push('Blueprint is ready for transformation planning. Proceed to Transformation Readiness.');
    nextActions.push('Open Transformation Readiness and calculate readiness score.');
  } else if (r.score >= 70) {
    recommendations.push('Blueprint is largely complete — address remaining warnings before next run.');
    nextActions.push('Fill remaining optional fields to increase readiness score.');
  } else if (r.score >= 40) {
    recommendations.push('Blueprint is partially complete — address all blockers before proceeding.');
    nextActions.push('Complete all blocked fields in Blueprint Detail editor.');
  } else {
    recommendations.push('Blueprint is in early draft state — significant work needed before transformation planning.');
    nextActions.push('Open Blueprint Detail and complete all required fields from scratch.');
  }

  // Critical rules check
  const criticals = getCriticalRules();
  const failedCriticals = criticals.filter((rule) => {
    if (rule.id === 'fp_no_replace_storage') return false; // storage is confirmed intact
    if (rule.id === 'ai_no_raw_keys_in_exports') return JSON.stringify(bp).toLowerCase().includes('_rawkey');
    if (rule.id === 'ai_no_uncontrolled_autonomy') return (bp.aiAgentNeeds || []).some((n) => String(n).toLowerCase().includes('autonomous'));
    return false;
  });

  if (failedCriticals.length > 0) {
    for (const r of failedCriticals) blockers.push(`Critical rule violation: ${r.label}`);
  } else {
    findings.push(`${criticals.length} critical transformation rules checked — no violations detected.`);
  }

  return {
    summary: `Validation complete for "${bp.name}". Score: ${r.score}/100. ${blockers.length} blockers, ${missing.length} missing fields.`,
    findings,
    warnings,
    blockers,
    recommendations,
    nextActions,
    safetyFlags,
  };
}

// ─── Refactor Planner Analyzer ───────────────────────────────────────────────

export function analyzeRefactorPlan(ctx) {
  if (!hasBlueprintData(ctx)) {
    return {
      ...emptyOutput('No active blueprint. Refactor planning requires an active blueprint.'),
      blockers: ['No active blueprint selected.'],
      nextActions: ['Create and select a blueprint.'],
    };
  }

  const bp = ctx.blueprint;
  const r  = ctx.readiness || {};
  const findings    = [];
  const warnings    = [];
  const blockers    = [];
  const recommendations = [];
  const nextActions = [];
  const safetyFlags = [];

  // Foundation protection
  findings.push('Run 1 foundation: storage.js, app shell, all config layers — do not touch in future runs.');
  findings.push('Run 2 foundation: Blueprint Engine, Transformation Readiness — do not replace in future runs.');
  findings.push('Run 3 foundation: Agent system, advisory panels — do not remove in future runs.');

  // Next run recommendation
  const score = r.score || 0;
  if (score >= 70) {
    findings.push('Blueprint readiness threshold met — safe to plan Run 4.');
    recommendations.push('Run 4 should build: Variant Transformation Compiler + Safe Product Skeleton Generator.');
    nextActions.push('Plan Run 4: Transform validated blueprint into product skeleton structure without destroying the base.');
  } else {
    warnings.push(`Readiness score is ${score}/100 — recommend completing blueprint before planning transformation runs.`);
    blockers.push('Blueprint must reach 70/100 readiness before transformation run is safe.');
    nextActions.push('Complete blueprint to 70+ readiness before planning Run 4.');
  }

  // State mode
  if (bp.stateMode === 'supabase' || bp.stateMode === 'hybrid') {
    warnings.push('Supabase sync has not been built yet — do not attempt to connect backend before that run.');
    safetyFlags.push('Supabase sync run is required before deploying any server-connected product variant.');
    nextActions.push('Plan a dedicated Supabase sync run (Run 4 or Run 5 depending on product type).');
  }

  // Product type specific
  const productType = bp.productType;
  const SAFETY_CRITICAL_TYPES = ['fleet', 'cybersecurity'];
  const COMPLIANCE_TYPES = ['induction', 'compliance-critical'];

  if (SAFETY_CRITICAL_TYPES.includes(productType)) {
    safetyFlags.push(`Safety-critical product (${productType}): human safety review required before any deployment run.`);
    recommendations.push('Engage a safety reviewer before building the fleet or cybersecurity product run.');
    warnings.push('Fleet and cybersecurity products must not go live without safety sign-off and legal review.');
  }

  if (COMPLIANCE_TYPES.includes(productType)) {
    safetyFlags.push(`Compliance-critical product (${productType}): legal/compliance review required before employee data is handled.`);
    recommendations.push('Ensure applicable privacy regulations are reviewed before building induction/compliance product run.');
  }

  // Future run roadmap
  const futureRuns = (bp.futureRuns || []).filter(Boolean);
  if (futureRuns.length > 0) {
    findings.push(`Planned future runs (${futureRuns.length}): ${futureRuns.slice(0, 3).join(' / ')}${futureRuns.length > 3 ? '…' : ''}`);
  } else {
    warnings.push('No future runs defined in blueprint — add run recommendations to plan transformation path.');
    recommendations.push('Add future run recommendations to the blueprint in Blueprint Detail.');
  }

  // Do-not-touch list
  const doNotTouch = [
    'storage.js — SSOT, must not be replaced',
    'moduleRegistry.js — navigation SSOT',
    'agentRegistry.js — agent authority config',
    'Run 1 app shell and layout',
    'Run 2 blueprint validation system',
    'Run 3 agent safety boundary',
  ];
  for (const item of doNotTouch) warnings.push(`Do not touch: ${item}`);

  return {
    summary: `Refactor planning complete for "${bp.name}". Score: ${score}/100. ${futureRuns.length} future runs planned.`,
    findings,
    warnings,
    blockers,
    recommendations,
    nextActions,
    safetyFlags,
  };
}

// ─── API Config Analyzer ────────────────────────────────────────────────────

export function analyzeApiConfig(ctx) {
  const ai = ctx?.aiSettings || {};
  const findings    = [];
  const warnings    = [];
  const blockers    = [];
  const recommendations = [];
  const nextActions = [];
  const safetyFlags = [];

  const provider = ai.provider || 'none';
  const keyConfigured = ai.apiKeyConfigured === true;
  const testStatus = ai.testStatus || 'not_tested';
  const localOnly  = ai.localOnlyMode !== false;

  findings.push(`AI provider: ${provider}`);
  findings.push(`Key configured: ${keyConfigured ? 'Yes (' + (ai.apiKeyMasked || '••••') + ')' : 'No'}`);
  findings.push(`Test status: ${testStatus}`);
  findings.push(`Local-only mode: ${localOnly ? 'Active' : 'Disabled'}`);

  if (provider === 'none') {
    warnings.push('No external AI provider configured — internal agents operate in local-only advisory mode.');
    recommendations.push('Configure an external AI provider in AI Config to unlock provider-backed analysis in future runs.');
    nextActions.push('Open AI Config and select a provider if external AI assistance is needed.');
  } else {
    findings.push(`Provider selected: ${provider} — external AI assistance is configured.`);
    if (!keyConfigured) {
      blockers.push(`Provider "${provider}" is selected but no API key is configured. Agent will not be able to call this provider.`);
      nextActions.push('Open AI Config and enter a valid API key for the selected provider.');
    }
    if (testStatus === 'not_tested') {
      warnings.push('API configuration has not been tested yet. Use the Test button in AI Config to verify.');
      recommendations.push('Test the API configuration before relying on it for agent-assisted analysis.');
    } else if (testStatus === 'failed') {
      blockers.push('API configuration test failed — provider may be unreachable or key may be invalid.');
      nextActions.push('Review and correct the API key and base URL in AI Config, then re-test.');
    } else if (testStatus === 'success') {
      findings.push('API configuration test: passed.');
    }
  }

  // Security reminders
  safetyFlags.push('API keys must never be hardcoded in source files. Use local config or environment variables via a backend proxy in production.');
  safetyFlags.push('Internal agents in Run 3 do not call external providers automatically. All external calls require explicit user action.');
  recommendations.push('In a future production run, move API key handling to a server-side proxy to keep secrets off the client.');

  // Local-only advisory
  if (localOnly) {
    findings.push('Run 3 advisory agents: operating in local-only mode — no external API calls are made automatically.');
  }

  return {
    summary: `API config review complete. Provider: ${provider}, Key: ${keyConfigured ? 'configured' : 'not set'}, Test: ${testStatus}.`,
    findings,
    warnings,
    blockers,
    recommendations,
    nextActions,
    safetyFlags,
  };
}

// ─── Safety Compliance Analyzer ─────────────────────────────────────────────

export function analyzeSafetyCompliance(ctx) {
  const bp = ctx?.blueprint;
  const findings    = [];
  const warnings    = [];
  const blockers    = [];
  const recommendations = [];
  const nextActions = [];
  const safetyFlags = [];

  if (!bp) {
    return {
      ...emptyOutput('No active blueprint. Safety review requires an active blueprint.'),
      warnings: ['No active blueprint selected.'],
      nextActions: ['Create and select a blueprint before running safety compliance review.'],
    };
  }

  const productType  = bp.productType || 'custom';
  const safetyLevel  = bp.safetyLevel || 'standard';

  findings.push(`Product type: ${productType}`);
  findings.push(`Safety level: ${safetyLevel}`);

  // General safety rules
  findings.push('Agent system: all agents are advisory, non-autonomous, and cannot edit files.');
  findings.push('No external AI API calls occur automatically in Run 3.');
  safetyFlags.push('This system is a local production foundation. It does not perform real-world actions in current state.');

  // Safety-critical
  if (['safety-critical', 'fleet', 'cybersecurity'].includes(safetyLevel) || ['fleet', 'cybersecurity'].includes(productType)) {
    safetyFlags.push('SAFETY-CRITICAL product: real-world operation of this system could affect human safety. Human oversight is mandatory at every stage.');
    safetyFlags.push('Fleet products: all route changes, trip logs, and driver assignments must be immutable and audited before deployment.');
    safetyFlags.push('Defensive-only rule: no offensive security tools, vulnerability exploitation, or attack simulation code may be added.');
    blockers.push('Safety-critical validation: obtain formal safety review and compliance sign-off before deploying this product type.');
    recommendations.push('Engage a qualified safety engineer and legal reviewer before building the fleet or cybersecurity product run.');
  }

  // Compliance-critical
  if (['compliance-critical', 'induction'].includes(safetyLevel) || ['induction'].includes(productType)) {
    safetyFlags.push('COMPLIANCE-CRITICAL product: employee data, HR records, and completion certificates must comply with local privacy regulations.');
    safetyFlags.push('Completion records must be immutable once signed — no deletion or backdating allowed.');
    blockers.push('Privacy compliance: review applicable privacy regulations before handling real employee data.');
    recommendations.push('Get legal review of induction data handling before any HR system integration.');
  }

  // Sensitive
  if (safetyLevel === 'sensitive') {
    warnings.push('Sensitive product: ensure data access controls (RLS, auth) are in place before going live.');
    recommendations.push('Implement row-level security in the Supabase sync run for all sensitive data entities.');
  }

  // Portfolio anti-cloning
  if (productType === 'portfolio') {
    safetyFlags.push('Portfolio product: do not replicate proprietary third-party application UI, branding, or data structures without authorisation.');
    recommendations.push('Ensure all portfolio content and product structures are original or explicitly licensed.');
  }

  // AI safety
  safetyFlags.push('AI safety: no autonomous AI behaviour is permitted. All agent outputs require human review before action.');
  safetyFlags.push('Secret safety: no raw API keys, backend tokens, or environment secrets may appear in any export or output.');
  recommendations.push('Always review agent recommendations before acting on them — agents are advisory only.');

  nextActions.push('Complete safety review checklist before proceeding to any deployment run.');
  nextActions.push('Document safety review outcomes in blueprint locked rules.');

  return {
    summary: `Safety compliance review complete for "${bp.name}". Type: ${productType}, Level: ${safetyLevel}. ${safetyFlags.length} safety flags raised.`,
    findings,
    warnings,
    blockers,
    recommendations,
    nextActions,
    safetyFlags,
  };
}

// ─── Product Strategy Analyzer ──────────────────────────────────────────────

export function analyzeProductStrategy(ctx) {
  if (!hasBlueprintData(ctx)) {
    return {
      ...emptyOutput('No active blueprint. Product strategy review requires an active blueprint.'),
      blockers: ['No active blueprint selected.'],
      nextActions: ['Create and select a blueprint.'],
    };
  }

  const bp = ctx.blueprint;
  const r  = ctx.readiness || {};
  const findings    = [];
  const warnings    = [];
  const blockers    = [];
  const recommendations = [];
  const nextActions = [];
  const safetyFlags = [];

  // Identity clarity
  if (bp.identity?.appName) {
    findings.push(`App identity: "${bp.identity.appName}" — ${bp.identity.tagline || 'no tagline set'}`);
  } else {
    warnings.push('No app name set in blueprint identity — define it for clear product positioning.');
    recommendations.push('Set a clear app name and tagline in Blueprint Detail.');
  }

  // Audience
  const users = (bp.targetUsers || []).filter(Boolean);
  if (users.length === 0) {
    blockers.push('No target users defined — product strategy cannot be evaluated without a defined audience.');
    nextActions.push('Define target user roles in Blueprint Detail.');
  } else if (users.length === 1) {
    warnings.push('Only one target user type defined — consider whether secondary users (admin, manager) need to be planned for.');
    recommendations.push('Add secondary user roles to cover admin, manager, or support personas.');
  } else {
    findings.push(`Audience defined: ${users.join(', ')}`);
  }

  // Description quality
  if (!bp.description || bp.description.trim().length < 20) {
    warnings.push('Product description is too short — a clear description is essential for positioning and client communication.');
    recommendations.push('Write a clear 1–2 sentence product description in Blueprint Detail.');
  } else {
    findings.push('Product description present and readable.');
  }

  // Product type fit
  const productType = bp.productType;
  const STRONG_TYPES = ['lms', 'project-management', 'portal', 'admin', 'monitoring', 'ai-analysis', 'induction'];
  if (STRONG_TYPES.includes(productType)) {
    findings.push(`Product type "${productType}" is well-defined — transformation path is clear.`);
  } else if (productType === 'custom') {
    warnings.push('Custom product type — ensure all modules, entities, and flows are fully defined before transformation.');
    recommendations.push('Replace the custom product type with a specific type if the product category becomes clear.');
  } else if (productType === 'portfolio') {
    findings.push('Portfolio-ready product — designed for client presentation and variant showcase.');
    recommendations.push('Ensure portfolio showcases real product capabilities — no client data in presentation configuration.');
  }

  // Transformation readiness
  const score = r.score || 0;
  if (score >= 70) {
    findings.push(`Product readiness: ${score}/100 — sufficient for transformation planning.`);
    recommendations.push('Blueprint is ready to move to Run 4: Variant Transformation Compiler.');
  } else {
    warnings.push(`Product readiness: ${score}/100 — complete the blueprint before considering transformation.`);
    nextActions.push('Address readiness gaps before positioning this product for client delivery.');
  }

  // Packaging
  const futureRuns = (bp.futureRuns || []).filter(Boolean);
  if (futureRuns.length === 0) {
    recommendations.push('Add future run recommendations — these form the product roadmap for client communication.');
    nextActions.push('Define at least 3 future run milestones in Blueprint Detail.');
  } else {
    findings.push(`Product roadmap: ${futureRuns.length} future runs planned.`);
  }

  recommendations.push('Use the transformation readiness score as a product maturity indicator in client conversations.');
  safetyFlags.push('Do not present unbuilt features as complete. Blueprint is a plan — not a shipped product.');

  return {
    summary: `Product strategy review complete for "${bp.name}". Type: ${productType}, Audience: ${users.length} roles, Readiness: ${score}/100.`,
    findings,
    warnings,
    blockers,
    recommendations,
    nextActions,
    safetyFlags,
  };
}
