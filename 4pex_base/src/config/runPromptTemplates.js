// 4P3X Run Prompt Templates — Run 5
// Defines reusable prompt section templates.
// These are assembly fragments for generated future run prompts.
// No builds are executed from these templates.

export const DIRECTIVE_1_FOOTER = `====================================================
DIRECTIVE 1
====================================================

Adapt the skill set to the task. Include full folder structure, program code, logic code, transition code, UI logic, UI code, and HTML/JSX where required. Preserve SSOT, prevent feature creep, and protect working systems.`;

export const FIX_ONLY_WRAPPER = `⛔ STRICT MANUS / BASE44 / SUPER AGENT ENFORCEMENT RULES — READ FIRST

MODE:
FIX-ONLY BUILD COMPILER MODE`;

export const PROMPT_SECTIONS = {

  enforcementHeader: (context) => `⛔ STRICT MANUS / BASE44 / SUPER AGENT ENFORCEMENT RULES — READ FIRST

PROJECT:
${context.projectName}
Powered by 4P3X Intelligent AI
Created by Kyzel Kreates
Part of the 4P3X Verse

MODE:
FIX-ONLY BUILD COMPILER MODE

RUN:
${context.runNumber} ONLY — ${context.runTitle?.toUpperCase()}`,

  projectIdentitySection: (context) => `====================================================
PROJECT IDENTITY
====================================================

Project:     ${context.projectName}
Product:     ${context.productLabel}
Product Type: ${context.productType}
Current Run: ${context.runNumber}
Run Title:   ${context.runTitle}`,

  currentStatusSection: (context) => `====================================================
CURRENT BUILD STATUS
====================================================

${(context.preservedRuns || []).map((r) => `${r} — COMPLETE — MUST REMAIN INTACT`).join('\n')}

DO NOT modify, overwrite, or break any of the above runs.
DO NOT rebuild what is already working.`,

  missionSection: (context) => `====================================================
PRIMARY MISSION
====================================================

${context.mission}

This run must:
${(context.missionPoints || []).map((p) => `- ${p}`).join('\n')}

This run must NOT:
- Build final product variants early
- Execute generated prompts automatically
- Call external AI APIs
- Write generated skeleton files into the live app
- Create a second state system
- Overwrite existing working systems`,

  scopeSection: (context) => `====================================================
SCOPE
====================================================

This run covers only:
${(context.requiredModules || []).map((m) => `- ${m}`).join('\n')}

Required data models:
${(context.requiredDataModels || []).map((m) => `- ${m}`).join('\n')}

Required UI screens:
${(context.requiredUiScreens || []).map((s) => `- ${s}`).join('\n')}

Required state transitions:
${(context.requiredStateTransitions || []).map((t) => `- ${t}`).join('\n')}`,

  allowedFilesSection: (context) => `====================================================
FILES ALLOWED TO TOUCH
====================================================

${(context.allowedFiles || []).map((f) => `- ${f}`).join('\n')}

Only the files listed above may be created or modified.
Any other file must not be touched.`,

  forbiddenFilesSection: (context) => `====================================================
FILES / LOGIC DO NOT TOUCH
====================================================

${(context.forbiddenFiles || []).map((f) => `- ${f}`).join('\n')}

Protected baseline (always forbidden):
- src/state/storage.js (full rewrite — only safe SSOT extension allowed)
- src/state/initialState.js (structural rewrite — only additive schema extension allowed)
- src/config/appConfig.js (unless identity config extension required)
- src/logic/agents/ (unless this run explicitly extends agent system)
- src/logic/transformer/ (unless this run explicitly extends transformation system)
- src/logic/launcher/ (unless this run explicitly extends launch system)
- Any deployment secrets
- Any environment secret files
- Any backend secret handlers`,

  ssotRulesSection: () => `====================================================
SSOT RULES
====================================================

1. Only storage.js may read/write localStorage.
2. No component may directly mutate localStorage.
3. All new state must be added to initialState.js schema first.
4. All state mutations must go through storage.js functions.
5. No second state management system may be created.
6. Existing state structure must not be broken.
7. State migration must handle missing fields gracefully.
8. No raw API keys may be stored in state.
9. No backend secrets may be stored in state.
10. Export/import must sanitize state before output.`,

  implementationRequirementsSection: (context) => `====================================================
IMPLEMENTATION REQUIREMENTS
====================================================

The app must still run with:
npm install
npm run dev
npm run build

${(context.implementationRequirements || []).map((r) => `- ${r}`).join('\n')}

The app must not:
- Require a backend
- Require Supabase (unless this is a Supabase product run)
- Require paid APIs
- Hardcode API keys
- Expose backend secrets
- Call external AI APIs automatically`,

  uiUxRequirementsSection: (context) => `====================================================
UI / UX REQUIREMENTS
====================================================

Preserve existing style:
- Black background
- Metallic gold accents
- Metallic silver text
- Green status accents
- Purple transformation accents
- Clean card components
- Strong contrast
- Mobile responsive
- Production-ready

${(context.uiRequirements || []).map((r) => `- ${r}`).join('\n')}

All screens must include:
- Empty states
- Error states
- Loading states where needed
- No demo/mock/fake wording
- Production-quality labels and copy`,

  stateLogicSection: (context) => `====================================================
STATE / LOGIC REQUIREMENTS
====================================================

${(context.stateLogicRules || []).map((r) => `- ${r}`).join('\n')}

Forbidden state patterns:
- Do not create duplicate state for existing systems
- Do not mutate agentSystem unless explicitly extending agents
- Do not mutate transformationCompiler unless explicitly extending compiler
- Do not mutate variantLauncher unless explicitly extending launcher
- Do not overwrite blueprint state
- Do not remove Run 1 / Run 2 / Run 3 / Run 4 state keys`,

  validationGatesSection: (context) => `====================================================
VALIDATION GATES
====================================================

Before editing:
1. Confirm Run 1 through ${context.lastPreservedRun || 'Run 5'} files are intact.
2. Confirm storage.js exists and is unmodified structurally.
3. Confirm build passes before starting.
4. Confirm no unrelated product is being overwritten.

After editing:
${(context.validationGates || []).map((g, i) => `${i + 1}. ${g}`).join('\n')}`,

  acceptanceCriteriaSection: (context) => `====================================================
ACCEPTANCE CRITERIA
====================================================

${context.runNumber} is complete only if:

${(context.acceptanceCriteria || []).map((c) => `- ${c}`).join('\n')}

- Run 1 still works.
- Run 2 still works.
- Run 3 still works.
- Run 4 still works.
- Run 5 still works.
- Dashboard still loads.
- Existing routes still work.
- Build passes without errors.`,

  stopConditionsSection: (context) => `====================================================
STOP CONDITIONS
====================================================

Stop immediately if:

${(context.stopConditions || []).map((s) => `- ${s}`).join('\n')}

Global stop conditions (always apply):
- Run 1/2/3/4/5 files are missing or corrupted
- storage.js is being replaced or restructured
- A second state system is being created
- External AI APIs are being called automatically
- Backend secrets are being exposed
- Destructive changes are being made to working systems
- Demo/mock/fake wording is being introduced`,

  rollbackGuidanceSection: (context) => `====================================================
ROLLBACK GUIDANCE
====================================================

If this run breaks the app:

${(context.rollbackGuidance || []).map((r, i) => `${i + 1}. ${r}`).join('\n')}

General rollback rules:
- Revert only files changed in this run.
- Do not delete working Run 1/2/3/4/5 systems.
- If storage.js is corrupted, restore from last working export.
- Remove this run's module entries from moduleRegistry.js if navigation breaks.
- Remove this run's routes if routing breaks.
- Report the exact file causing failure.`,

  finalChecklistSection: (context) => `====================================================
FINAL CHECKLIST
====================================================

- [ ] ${context.runNumber} only
- [ ] Run 1 preserved
- [ ] Run 2 preserved
- [ ] Run 3 preserved
- [ ] Run 4 preserved
- [ ] Run 5 preserved
${(context.runChecklist || []).map((c) => `- [ ] ${c}`).join('\n')}
- [ ] No raw keys exported
- [ ] No external AI calls
- [ ] No Supabase dependency (unless Supabase product run)
- [ ] No autonomous agents
- [ ] No file-writing generator
- [ ] No destructive refactor
- [ ] No final product variants built
- [ ] No demo/mock/fake wording
- [ ] Build passes`,

  directive1Footer: () => DIRECTIVE_1_FOOTER,
};

export function getPromptSectionKeys() {
  return Object.keys(PROMPT_SECTIONS);
}

export function renderSection(sectionKey, context) {
  const fn = PROMPT_SECTIONS[sectionKey];
  if (!fn) return '';
  return fn(context);
}

export default PROMPT_SECTIONS;
