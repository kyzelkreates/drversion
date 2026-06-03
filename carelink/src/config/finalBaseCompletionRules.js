// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// finalBaseCompletionRules.js — Run 10
// Rules governing when and how the reusable base can be marked complete.

export const FINAL_BASE_COMPLETION_RULES = [
  {
    id: 'completion_rule_1',
    rule: 'Final audit must pass',
    description: 'The Run 8 final system audit must have passed with no critical blockers.',
    blockingLevel: 'critical',
    checkKey: 'finalAuditPassed',
  },
  {
    id: 'completion_rule_2',
    rule: 'Package must be ready',
    description: 'The Run 9 base package builder must have a validated, zip-ready package.',
    blockingLevel: 'critical',
    checkKey: 'packageReady',
  },
  {
    id: 'completion_rule_3',
    rule: 'No critical blockers',
    description: 'No critical blockers may be present across any run system.',
    blockingLevel: 'critical',
    checkKey: 'noCriticalBlockers',
  },
  {
    id: 'completion_rule_4',
    rule: 'No raw secrets exposed',
    description: 'No raw API keys or secrets may be present in any exported or displayed content.',
    blockingLevel: 'critical',
    checkKey: 'noSecretsExposed',
  },
  {
    id: 'completion_rule_5',
    rule: 'Dashboard + PWA rule present',
    description: 'The required Dashboard + Connected PWA structural rule must be present in the base.',
    blockingLevel: 'critical',
    checkKey: 'dashboardPwaRulePresent',
  },
  {
    id: 'completion_rule_6',
    rule: 'Branding locked',
    description: 'All export packs, manifests, and generated prompts must carry the 4P3X branding line.',
    blockingLevel: 'critical',
    checkKey: 'brandingLocked',
  },
  {
    id: 'completion_rule_7',
    rule: 'Transformation readiness lock confirmed',
    description: 'The Run 8 transformation readiness lock must be engaged.',
    blockingLevel: 'critical',
    checkKey: 'transformationLockConfirmed',
  },
  {
    id: 'completion_rule_8',
    rule: 'All active routes load without error',
    description: 'Every module route registered as active must resolve to a working page.',
    blockingLevel: 'critical',
    checkKey: 'allRoutesClean',
  },
  {
    id: 'completion_rule_9',
    rule: 'No unsafe product-facing wording',
    description: 'No demo, mock, throwaway, or showcase-only language in product-facing text.',
    blockingLevel: 'warning',
    checkKey: 'noUnsafeWording',
  },
  {
    id: 'completion_rule_10',
    rule: 'Build passes with zero errors',
    description: 'npm run build must complete with zero errors.',
    blockingLevel: 'critical',
    checkKey: 'buildPasses',
  },
];

export const POST_COMPLETION_INSTRUCTIONS = `
====================================================
THE 4P3X REUSABLE BASE STRUCTURE™ IS COMPLETE
Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
====================================================

STOP building the reusable base.

The base is now locked and ready for real product variant builds.

What to do next:

1. Download the full project zip from Run 9 Base Package Builder.
2. Choose ONE product variant to build first.
3. Generate the Master Variant Prompt from Run 10.
4. Attach the zip to your chosen builder tool (Base44 / Manus / Cursor / Replit).
5. Start a NEW isolated project — do NOT reuse or overwrite this base.
6. Run the variant prompt against the fresh project.
7. Build ONE variant at a time.

Recommended first variants:
  1. Four Paws LMS + Learner PWA
  2. Fleet Control Dashboard + Driver PWA
  3. Patient Monitoring Dashboard + Patient PWA
  4. Coach Training Dashboard + Training PWA
  5. Therapist Dashboard + Patient PWA

Each variant is its own isolated project.
Each variant starts from the same reusable base zip.
Each variant follows the Dashboard + Connected PWA pattern.
Each variant carries the 4P3X branding.

Do not build multiple variants in one run.
Do not mix variant projects.
Do not add more features to the base.
`;

export const EMERGENCY_FIX_WARNING = `
====================================================
EMERGENCY FIX — BASE UNLOCKED
====================================================

The base has been temporarily unlocked for an emergency fix.

Rules that still apply:

1. Fix only the specific confirmed issue — do NOT add new features.
2. Do NOT redesign, rebuild, or replace working systems.
3. Do NOT add a new run number for minor patches.
4. After the fix, re-run full validation.
5. Re-lock the base immediately after the fix is confirmed.
6. Document what was fixed and why in README.md.

If the fix requires a new run, it must be an explicit patch run
(e.g., Run 10.5) with its own strict enforcement rules.
`;
