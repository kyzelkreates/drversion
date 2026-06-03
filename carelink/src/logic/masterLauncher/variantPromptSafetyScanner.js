// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// variantPromptSafetyScanner.js — Run 10
// Scans generated variant prompts for safety risks before the user uses them.
// Advisory/read-only — this never executes prompts or modifies external systems.

// =====================================================
// MASTER SAFETY SCAN
// =====================================================
export function scanVariantPromptSafety(promptText) {
  if (!promptText || typeof promptText !== 'string') {
    return { safe: false, issues: [{ severity: 'critical', message: 'Prompt text is empty or invalid.' }] };
  }

  const issues = [
    ...detectSecretRisk(promptText),
    ...detectMultiVariantRisk(promptText),
    ...detectBaseOverwriteRisk(promptText),
    ...detectFeatureCreepRisk(promptText),
    ...detectUnsafeMedicalClaims(promptText),
    ...detectUnsafeNavigationClaims(promptText),
    ...detectUnsafeCyberClaims(promptText),
  ];

  const criticals = issues.filter((i) => i.severity === 'critical');
  const warnings  = issues.filter((i) => i.severity === 'warning');

  return {
    safe:      criticals.length === 0,
    issues,
    criticalCount: criticals.length,
    warningCount:  warnings.length,
    summary:
      criticals.length === 0
        ? warnings.length === 0
          ? 'No safety issues detected.'
          : `${warnings.length} warning(s) found — review before use.`
        : `${criticals.length} critical issue(s) found — do not use this prompt until resolved.`,
  };
}

// =====================================================
// SECRET RISK DETECTION
// =====================================================
export function detectSecretRisk(promptText) {
  const issues = [];
  const secretPatterns = [
    { pattern: /sk-[A-Za-z0-9]{20,}/, label: 'Possible OpenAI key' },
    { pattern: /sk_live_[A-Za-z0-9]{20,}/, label: 'Possible Stripe live key' },
    { pattern: /sk_test_[A-Za-z0-9]{20,}/, label: 'Possible Stripe test key' },
    { pattern: /AIza[A-Za-z0-9]{30,}/, label: 'Possible Google API key' },
    { pattern: /ghp_[A-Za-z0-9]{20,}/, label: 'Possible GitHub personal access token' },
    { pattern: /eyJhbGciOiJIUzI1NiJ9\.[A-Za-z0-9._-]+/, label: 'Possible JWT token' },
    { pattern: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^\s<]{10,}/, label: 'Possible Supabase service role key value' },
    { pattern: /DATABASE_URL\s*=\s*postgres:\/\/[^\s<]{5,}/, label: 'Possible database connection string' },
  ];

  secretPatterns.forEach(({ pattern, label }) => {
    if (pattern.test(promptText)) {
      issues.push({
        severity: 'critical',
        category: 'secret_exposure',
        message: `${label} pattern detected in prompt. Remove real credentials immediately.`,
      });
    }
  });

  return issues;
}

// =====================================================
// MULTI-VARIANT RISK
// =====================================================
export function detectMultiVariantRisk(promptText) {
  const issues = [];
  const triggers = [
    'build all variants',
    'build multiple variants',
    'build both variants',
    'create all products',
    'create multiple products',
    'build variant A and variant B',
    'simultaneously build',
    'build in parallel',
  ];
  const lower = promptText.toLowerCase();
  triggers.forEach((t) => {
    if (lower.includes(t)) {
      issues.push({
        severity: 'critical',
        category: 'multi_variant_risk',
        message: `Phrase "${t}" may instruct building multiple variants in one run — not allowed.`,
      });
    }
  });
  return issues;
}

// =====================================================
// BASE OVERWRITE RISK
// =====================================================
export function detectBaseOverwriteRisk(promptText) {
  const issues = [];
  const triggers = [
    'overwrite the base',
    'replace the base',
    'modify the base zip',
    'update the reusable base',
    'edit the base structure',
    'change the base project',
    'delete the base',
  ];
  const lower = promptText.toLowerCase();
  triggers.forEach((t) => {
    if (lower.includes(t)) {
      issues.push({
        severity: 'critical',
        category: 'base_overwrite_risk',
        message: `Phrase "${t}" may instruct overwriting the reusable base — not allowed.`,
      });
    }
  });
  return issues;
}

// =====================================================
// FEATURE CREEP RISK
// =====================================================
export function detectFeatureCreepRisk(promptText) {
  const issues = [];
  const triggers = [
    'add payment processing',
    'add stripe',
    'add paypal',
    'add social login',
    'add oauth',
    'add a/b testing',
    'add analytics tracking',
    'add email marketing',
    'add push notifications in this run',
    'add chatbot',
    'integrate openai directly',
    'call the api automatically',
    'auto-generate',
    'auto-deploy',
    'auto-execute',
  ];
  const lower = promptText.toLowerCase();
  triggers.forEach((t) => {
    if (lower.includes(t)) {
      issues.push({
        severity: 'warning',
        category: 'feature_creep',
        message: `Phrase "${t}" may introduce scope beyond the current run. Review before use.`,
      });
    }
  });
  return issues;
}

// =====================================================
// UNSAFE MEDICAL CLAIMS
// =====================================================
export function detectUnsafeMedicalClaims(promptText) {
  const issues = [];
  const triggers = [
    'diagnose',
    'clinical diagnosis',
    'medical advice',
    'prescribe',
    'prescription',
    'treatment plan',
    'replace a doctor',
    'replace a therapist',
    'replace a clinician',
    'replace medical professional',
    'certified medical',
    'fda approved',
    'ce marked',
    'hipaa compliant' // only a warning — may be aspirational
  ];
  const lower = promptText.toLowerCase();
  triggers.forEach((t) => {
    const severity = ['hipaa compliant'].includes(t) ? 'warning' : 'warning';
    if (lower.includes(t)) {
      issues.push({
        severity,
        category: 'unsafe_medical_claim',
        message: `Phrase "${t}" detected — ensure this system is not presented as a replacement for qualified medical care.`,
      });
    }
  });
  return issues;
}

// =====================================================
// UNSAFE NAVIGATION / SAFETY-CRITICAL CLAIMS
// =====================================================
export function detectUnsafeNavigationClaims(promptText) {
  const issues = [];
  const triggers = [
    'autopilot',
    'self-driving',
    'autonomous navigation',
    'automatic route planning',
    'auto-route driver',
    'replace a human driver',
    'override speed limit',
    'bypass traffic law',
  ];
  const lower = promptText.toLowerCase();
  triggers.forEach((t) => {
    if (lower.includes(t)) {
      issues.push({
        severity: 'critical',
        category: 'unsafe_navigation_claim',
        message: `Phrase "${t}" may imply safety-critical autonomous behaviour. Remove immediately.`,
      });
    }
  });
  return issues;
}

// =====================================================
// UNSAFE CYBER / SECURITY CLAIMS
// =====================================================
export function detectUnsafeCyberClaims(promptText) {
  const issues = [];
  const triggers = [
    'bypass authentication',
    'bypass auth',
    'skip login',
    'skip security',
    'hardcode password',
    'hardcode secret',
    'disable cors',
    'disable csp',
    'disable ssl',
    'ignore certificate',
    'remove rate limit',
    'expose admin endpoint',
    'public admin route',
    'unauthenticated admin',
  ];
  const lower = promptText.toLowerCase();
  triggers.forEach((t) => {
    if (lower.includes(t)) {
      issues.push({
        severity: 'critical',
        category: 'unsafe_cyber_claim',
        message: `Phrase "${t}" may introduce a security vulnerability. Remove immediately.`,
      });
    }
  });
  return issues;
}
