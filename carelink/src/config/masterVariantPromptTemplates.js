// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// masterVariantPromptTemplates.js — Run 10
// Templates for generating master variant transformation prompts.
// All generated prompts must enforce FIX-ONLY BUILD COMPILER MODE
// and must never build multiple variants or expose secrets.

export const BRANDING_LINE =
  'Powered by 4P3X Intelligent AI — Created by Kyzel Kreates';

export const DIRECTIVE_1_FOOTER = `====================================================
DIRECTIVE 1
====================================================

Adapt the skill set to the task.
Include full folder structure, program code, logic code, transition code,
UI logic, UI code, and HTML/JSX where required.
Preserve SSOT, prevent feature creep, and protect working systems.

${BRANDING_LINE}
Part of the 4P3X Verse.`;

export const FIX_ONLY_HEADER = `⛔ STRICT MANUS / BASE44 / SUPER AGENT ENFORCEMENT RULES — READ FIRST

PROJECT:
[PROJECT_NAME]
Powered by 4P3X Intelligent AI
Created by Kyzel Kreates
Part of the 4P3X Verse

MODE:
FIX-ONLY BUILD COMPILER MODE

RUN:
[RUN_NUMBER] ONLY`;

export const UPLOAD_INSTRUCTIONS_TEMPLATE = `====================================================
GETTING STARTED — ATTACH THE BASE ZIP
====================================================

Before running this prompt, you must:

1. Download the 4P3X Reusable Base Structure™ project zip.
2. Open your builder tool (Base44 / Manus / Cursor / Replit / GitHub Codespace).
3. Attach or upload the zip to a NEW, ISOLATED project — do NOT use an existing variant project.
4. Extract the zip contents into the project root.
5. Run: npm install
6. Confirm the project builds: npm run build
7. Confirm the dashboard loads at / before starting this run.

This is a separate product variant project.
Do NOT overwrite your reusable base zip.
Do NOT mix this variant with any other variant.
Do NOT start building until the base zip loads and builds cleanly.`;

export const VARIANT_IDENTITY_TEMPLATE = `====================================================
PROJECT IDENTITY
====================================================

Base Structure: 4P3X Reusable Base Structure™
Variant: [VARIANT_NAME]
Product Type: [PRODUCT_TYPE]
Dashboard Role: [DASHBOARD_ROLE]
PWA Role: [PWA_ROLE]
Dashboard/PWA Relationship: [RELATIONSHIP]
Branding: ${BRANDING_LINE}`;

export const DASHBOARD_PWA_STRUCTURE_TEMPLATE = `====================================================
DASHBOARD + CONNECTED PWA STRUCTURE
====================================================

This variant MUST follow the 4P3X Dashboard + Connected PWA pattern:

1. Professional/admin dashboard for the managing role.
2. Connected role-specific PWA for the end-user role.
3. Dashboard monitors, reviews, manages, or receives updates from the PWA.
4. Dashboard state is fully separated from PWA user state.
5. Local-first operation first — no forced cloud sync in early runs.
6. Optional Supabase sync added only after local-first foundation is stable.
7. Separate permissions for dashboard role and PWA role.
8. Clear data ownership boundaries between dashboard and PWA.
9. Export/reporting path from dashboard.
10. No cross-variant contamination — this is an isolated product project.

Dashboard: [DASHBOARD_NAME]
PWA: [PWA_NAME]
State Isolation: [STATE_ISOLATION]
Sync Point: [SYNC_POINT]
Export Path: [EXPORT_PATH]
PWA Offline Capability: [PWA_OFFLINE]`;

export const SAFETY_RULES_TEMPLATE = `====================================================
SAFETY RULES — ABSOLUTE
====================================================

1. Do NOT overwrite or modify the reusable base zip.
2. Do NOT build multiple variants inside this project.
3. Do NOT execute generated prompts automatically.
4. Do NOT deploy without completing all readiness checks.
5. Do NOT expose any raw API keys or secrets in frontend code.
6. Do NOT create autonomous agents that act without user confirmation.
7. Do NOT write generated content directly into live app files.
8. Do NOT weaken transformation locks or safety boundaries.
9. Do NOT use unsafe product-facing wording (demo, mock, throwaway, fake).
10. Do NOT add base features — this is a variant build, not a base build.
11. Do NOT mix dashboard state with PWA user state.
12. Do NOT merge this variant with another variant project.
13. Do NOT bypass SSOT — all writes go through storage.js or equivalent.
14. Do NOT build features beyond the scope of [RUN_NUMBER].

[VARIANT_SPECIFIC_WARNINGS]`;

export const VALIDATION_GATES_TEMPLATE = `====================================================
VALIDATION GATES
====================================================

Before editing:
1. Confirm base zip is loaded and builds cleanly.
2. Confirm this is an isolated variant project.
3. Confirm Run 1–[PREV_RUN] systems are intact.
4. Identify only actual issues — do not patch working code.
5. Do not add features outside the scope of [RUN_NUMBER].

After editing:
1. Run: npm run build — must pass with zero errors.
2. Confirm dashboard loads.
3. Confirm all active routes load.
4. Confirm state persists on browser refresh.
5. Confirm PWA shell loads and is installable.
6. Confirm SSOT — all writes go through storage.js.
7. Confirm no raw secrets present.
8. Confirm no unsafe product-facing language remains.
9. Confirm no new external dependencies added unnecessarily.`;

export const ACCEPTANCE_CRITERIA_TEMPLATE = `====================================================
ACCEPTANCE CRITERIA
====================================================

[RUN_NUMBER] is complete only if:

- All previous runs still work.
- Dashboard loads and all active routes load.
- [VARIANT_SPECIFIC_ACCEPTANCE]
- No product variant is built inside the base.
- No deployment has happened.
- No raw secrets are exposed.
- No autonomous agents execute actions without confirmation.
- No unsafe product-facing language remains.
- Build passes with zero errors.`;

export const ROLLBACK_TEMPLATE = `====================================================
ROLLBACK GUIDANCE
====================================================

If this run breaks the app:

1. Revert only the files changed in [RUN_NUMBER].
2. Restore previous storage.js immediately if state breaks.
3. Restore previous routes.js / App.jsx if routing breaks.
4. Restore previous moduleRegistry.js if navigation breaks.
5. Do NOT rebuild the full app.
6. Do NOT delete working run systems.
7. Report the exact file and patch that caused failure.`;

export const STOP_CONDITIONS_TEMPLATE = `====================================================
STOP CONDITIONS
====================================================

Stop immediately if:

- Previous runs are not present or not working.
- storage.js is missing.
- moduleRegistry.js is missing.
- The project is not the correct isolated variant project.
- The requested patch requires a full rebuild.
- The requested patch adds features outside [RUN_NUMBER] scope.
- The requested patch would expose secrets.
- The requested patch would build multiple variants.
- The requested patch would overwrite the reusable base zip.
- The requested patch would break SSOT.
- The requested patch would create autonomous agents.

If stopped, output:
1. Exact stop reason.
2. Missing requirement.
3. Safest next action.`;

export const ALLOWED_FILES_TEMPLATE = `====================================================
FILES ALLOWED TO TOUCH IN [RUN_NUMBER]
====================================================

Allowed only if required for [RUN_NUMBER] objectives:

- src/state/storage.js
- src/state/initialState.js
- src/state/validators.js
- src/state/*Validators.js
- src/config/moduleRegistry.js
- src/config/agentRegistry.js
- src/config/*Rules.js
- src/config/*Templates.js
- src/config/*Config.js
- src/app/App.jsx
- src/app/routes.js
- src/pages/*
- src/components/*
- src/logic/*
- src/utils/*
- src/styles/globals.css
- public/manifest.json
- README.md
- .env.example (placeholders only)

Patch only specific faulty sections.
Do not replace whole files unless the file is corrupted and cannot compile.`;

export const FORBIDDEN_FILES_TEMPLATE = `====================================================
FILES / LOGIC DO NOT TOUCH
====================================================

Do not touch or introduce:

- Other variant project files
- Unrelated platform backend code
- Real external AI provider call logic
- Backend secret handling
- Deployment secrets
- Protected proprietary code
- Any finished working module unless it has a confirmed issue

Do not replace:
- storage.js with a different state system
- The app shell
- Any Run 1–[PREV_RUN] core systems`;

export const SSOT_RULES_TEMPLATE = `====================================================
SSOT RULES
====================================================

1. All persistent state writes go through storage.js only.
2. No direct localStorage writes from components.
3. No duplicate state management system.
4. State sections for each run must be present and validated.
5. Import/export/reset functions must still work.
6. State migration must not wipe valid existing data.
7. Dashboard state key and PWA state key must be separate.`;

// Build the full master variant prompt from sections
export function buildFullPromptTemplate(context) {
  const {
    variantOption,
    pattern,
    runNumber,
    prevRun,
    missionStatement,
    variantSpecificAcceptance,
    variantSpecificWarnings,
  } = context;

  const safetyWarnings = [
    ...(variantOption?.requiredWarnings || []),
    ...(pattern?.safetyWarning ? [pattern.safetyWarning] : []),
    ...(variantSpecificWarnings || []),
  ];

  const warningsBlock =
    safetyWarnings.length > 0
      ? safetyWarnings.map((w, i) => `${i + 1}. ${w}`).join('\n')
      : '(No variant-specific warnings)';

  const sections = [
    FIX_ONLY_HEADER
      .replace('[PROJECT_NAME]', variantOption?.productName || 'Custom Product')
      .replace('[RUN_NUMBER]', runNumber || 'Run 1'),

    `====================================================\nPRIMARY MISSION\n====================================================\n\n${missionStatement || `Build ${runNumber} of the ${variantOption?.productName || 'product variant'}.`}`,

    UPLOAD_INSTRUCTIONS_TEMPLATE,

    VARIANT_IDENTITY_TEMPLATE
      .replace('[VARIANT_NAME]', variantOption?.label || '')
      .replace('[PRODUCT_TYPE]', variantOption?.productType || '')
      .replace('[DASHBOARD_ROLE]', variantOption?.dashboardRole || '')
      .replace('[PWA_ROLE]', variantOption?.pwaRole || '')
      .replace('[RELATIONSHIP]', variantOption?.monitoringRelationship || ''),

    DASHBOARD_PWA_STRUCTURE_TEMPLATE
      .replace('[DASHBOARD_NAME]', pattern?.dashboardName || 'Admin Dashboard')
      .replace('[PWA_NAME]', pattern?.pwaName || 'End-User PWA')
      .replace('[STATE_ISOLATION]', pattern?.stateIsolation || 'Dashboard state and PWA state are fully separated.')
      .replace('[SYNC_POINT]', pattern?.syncPoint || 'User actions sync to dashboard on submission.')
      .replace('[EXPORT_PATH]', pattern?.exportPath || 'Key data reports available from dashboard.')
      .replace('[PWA_OFFLINE]', pattern?.pwaOfflineCapability || 'Core functionality available offline.'),

    SAFETY_RULES_TEMPLATE
      .replace('[RUN_NUMBER]', runNumber || 'Run 1')
      .replace('[VARIANT_SPECIFIC_WARNINGS]', warningsBlock),

    SSOT_RULES_TEMPLATE,
    ALLOWED_FILES_TEMPLATE.replace(/\[RUN_NUMBER\]/g, runNumber || 'Run 1'),
    FORBIDDEN_FILES_TEMPLATE.replace('[PREV_RUN]', prevRun || 'previous'),

    VALIDATION_GATES_TEMPLATE
      .replace(/\[RUN_NUMBER\]/g, runNumber || 'Run 1')
      .replace('[PREV_RUN]', prevRun || 'previous'),

    ACCEPTANCE_CRITERIA_TEMPLATE
      .replace(/\[RUN_NUMBER\]/g, runNumber || 'Run 1')
      .replace('[VARIANT_SPECIFIC_ACCEPTANCE]', variantSpecificAcceptance || '- Core variant features for this run are built and working.'),

    ROLLBACK_TEMPLATE.replace(/\[RUN_NUMBER\]/g, runNumber || 'Run 1'),
    STOP_CONDITIONS_TEMPLATE.replace(/\[RUN_NUMBER\]/g, runNumber || 'Run 1'),
    DIRECTIVE_1_FOOTER,
  ];

  return sections.join('\n\n');
}
