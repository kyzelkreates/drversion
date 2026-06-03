// 4P3X Prompt Safety Scanner — Run 5
// Scans generated prompt text for safety violations.
// Does not call external APIs. All checks are local pattern matching.

import PROMPT_SAFETY_RULES from '../../config/promptSafetyRules.js';

export function scanPromptSafety(promptText) {
  if (!promptText || typeof promptText !== 'string') {
    return {
      passed: false,
      blockedTerms: [],
      secretRisks: ['Prompt text is empty or invalid'],
      destructiveRisks: [],
      autonomyRisks: [],
      featureCreepRisks: [],
    };
  }

  const blockedTerms = detectDemoLanguage(promptText);
  const secretRisks = detectSecretExposure(promptText);
  const destructiveRisks = detectDestructiveInstructions(promptText);
  const autonomyRisks = detectAutonomyRisk(promptText);
  const featureCreepRisks = detectFeatureCreep(promptText);
  const crossRunRisks = detectCrossRunDrift(promptText);
  const cyberRisks = detectUnsafeCyberPrompt(promptText);
  const cloningRisks = detectProprietaryCloningPrompt(promptText);

  const allRisks = [
    ...secretRisks,
    ...destructiveRisks,
    ...autonomyRisks,
    ...cyberRisks,
    ...cloningRisks,
  ];

  const blockingRuleIds = ['no_base_overwrite', 'no_duplicate_ssot', 'no_direct_localstorage', 'no_secret_exposure', 'no_auto_api_calls', 'no_autonomous_agents', 'no_final_build_early', 'no_unsafe_cyber', 'no_proprietary_cloning'];
  const hasBlockingViolation = allRisks.length > 0 || crossRunRisks.length > 0;

  return {
    passed: !hasBlockingViolation,
    blockedTerms,
    secretRisks,
    destructiveRisks: [...destructiveRisks, ...crossRunRisks],
    autonomyRisks,
    featureCreepRisks: [...featureCreepRisks, ...cyberRisks, ...cloningRisks],
  };
}

export function detectSecretExposure(promptText) {
  const risks = [];
  const patterns = [
    { pattern: /service_role/i, label: 'Supabase service role key reference' },
    { pattern: /sk-[a-zA-Z0-9]{20,}/, label: 'Possible raw OpenAI/Stripe secret key' },
    { pattern: /eyJ[a-zA-Z0-9._-]{50,}/, label: 'Possible raw JWT token' },
    { pattern: /api_secret\s*=\s*["'][^"']{5,}/i, label: 'Possible raw API secret assignment' },
    { pattern: /private_key\s*=\s*["'][^"']{5,}/i, label: 'Possible raw private key assignment' },
    { pattern: /supabase_service_key/i, label: 'Supabase service key reference' },
    { pattern: /SUPABASE_SERVICE_ROLE_KEY/i, label: 'Supabase service role env var reference' },
    { pattern: /OPENAI_API_KEY\s*=\s*[^\s$]/i, label: 'Possible hardcoded OpenAI key' },
  ];

  for (const { pattern, label } of patterns) {
    if (pattern.test(promptText)) {
      risks.push(label);
    }
  }

  return risks;
}

export function detectDestructiveInstructions(promptText) {
  const risks = [];
  const patterns = [
    { pattern: /overwrite.*storage\.js/i, label: 'Instruction to overwrite storage.js' },
    { pattern: /replace.*storage\.js.*with/i, label: 'Instruction to replace storage.js' },
    { pattern: /delete.*run\s*[1-5]/i, label: 'Instruction to delete a previous run' },
    { pattern: /remove.*existing.*runs/i, label: 'Instruction to remove existing runs' },
    { pattern: /rebuild.*app.*from.*scratch/i, label: 'Instruction to rebuild app from scratch' },
    { pattern: /replace.*initialstate/i, label: 'Instruction to replace initialState' },
  ];

  for (const { pattern, label } of patterns) {
    if (pattern.test(promptText)) {
      risks.push(label);
    }
  }

  return risks;
}

export function detectAutonomyRisk(promptText) {
  const risks = [];
  const patterns = [
    { pattern: /agent.*automatically.*edits.*files/i, label: 'Agent auto-edits files' },
    { pattern: /agent.*calls.*api.*without.*approval/i, label: 'Agent calls API without approval' },
    { pattern: /autonomous.*file.*modification/i, label: 'Autonomous file modification' },
    { pattern: /self.*modif/i, label: 'Self-modifying code reference' },
    { pattern: /auto.*execute.*prompts/i, label: 'Auto-execute prompt reference' },
    { pattern: /runs.*without.*user.*input/i, label: 'System runs without user input' },
  ];

  for (const { pattern, label } of patterns) {
    if (pattern.test(promptText)) {
      risks.push(label);
    }
  }

  return risks;
}

export function detectFeatureCreep(promptText) {
  const risks = [];
  const patterns = [
    { pattern: /add.*payment.*processing.*now/i, label: 'Payment processing before payment run' },
    { pattern: /build.*everything.*in.*one.*run/i, label: 'All-in-one run scope creep' },
    { pattern: /include.*all.*product.*types/i, label: 'Multiple product type scope creep' },
  ];

  for (const { pattern, label } of patterns) {
    if (pattern.test(promptText)) {
      risks.push(label);
    }
  }

  return risks;
}

export function detectCrossRunDrift(promptText) {
  const risks = [];
  const patterns = [
    { pattern: /modify.*agentworkbench/i, label: 'Modifies AgentWorkbench (Run 3)' },
    { pattern: /change.*transformation.*compiler.*core/i, label: 'Changes Transformation Compiler core (Run 4)' },
    { pattern: /overwrite.*variant.*launcher/i, label: 'Overwrites Variant Launcher (Run 5)' },
    { pattern: /edit.*blueprintengine/i, label: 'Edits BlueprintEngine (Run 2)' },
  ];

  for (const { pattern, label } of patterns) {
    if (pattern.test(promptText)) {
      risks.push(label);
    }
  }

  return risks;
}

export function detectDemoLanguage(promptText) {
  const blocked = [];
  const terms = [
    { pattern: /\bdemo\s+data\b/i, term: 'demo data' },
    { pattern: /\bmock\s+data\b/i, term: 'mock data' },
    { pattern: /\bfake\s+data\b/i, term: 'fake data' },
    { pattern: /\bdummy\s+data\b/i, term: 'dummy data' },
    { pattern: /\btoy\s+app\b/i, term: 'toy app' },
    { pattern: /\bsample.only\b/i, term: 'sample-only' },
    { pattern: /\bplaceholder\s+only\b/i, term: 'placeholder only' },
  ];

  for (const { pattern, term } of terms) {
    if (pattern.test(promptText)) {
      blocked.push(term);
    }
  }

  return blocked;
}

export function detectUnsafeCyberPrompt(promptText) {
  const risks = [];
  const patterns = [
    { pattern: /bypass.*authentication/i, label: 'Bypass authentication instruction' },
    { pattern: /disable.*security/i, label: 'Disable security instruction' },
    { pattern: /sql.*injection/i, label: 'SQL injection reference' },
    { pattern: /xss.*attack/i, label: 'XSS attack reference' },
    { pattern: /exploit.*vulnerability/i, label: 'Exploit vulnerability instruction' },
    { pattern: /brute.*force.*password/i, label: 'Brute force password instruction' },
    { pattern: /steal.*credentials/i, label: 'Credential theft instruction' },
  ];

  for (const { pattern, label } of patterns) {
    if (pattern.test(promptText)) {
      risks.push(label);
    }
  }

  return risks;
}

export function detectProprietaryCloningPrompt(promptText) {
  const risks = [];
  const patterns = [
    { pattern: /clone.*notion/i, label: 'Notion cloning instruction' },
    { pattern: /clone.*salesforce/i, label: 'Salesforce cloning instruction' },
    { pattern: /replicate.*stripe.*exactly/i, label: 'Stripe exact replication instruction' },
    { pattern: /copy.*shopify/i, label: 'Shopify copying instruction' },
    { pattern: /build.*exact.*copy.*of\s+\w+/i, label: 'Exact copy of proprietary system' },
  ];

  for (const { pattern, label } of patterns) {
    if (pattern.test(promptText)) {
      risks.push(label);
    }
  }

  return risks;
}

export function detectNavigationSafetyMissing(promptText, productType) {
  const productsRequiringNavSafety = ['learningPlatform', 'clientPortal', 'adminDashboard', 'employeeInductionPlatform', 'supabaseHybridSaaS'];
  if (!productsRequiringNavSafety.includes(productType)) return false;

  const hasNavSafety = /navigation|route.*guard|page.*guard|access.*control/i.test(promptText);
  return !hasNavSafety;
}
