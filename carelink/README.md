# 4P3X Reusable Base Structure™

> Powered by 4P3X Intelligent AI
> Created by Kyzel Kreates
> Part of the 4P3X Verse

---

## What is this?

A clean, modular, local-first production foundation that can be safely transformed into many product systems:

- LMS / Learning Platform
- AP3X Project Control OS
- Fleet / Routing Dashboard
- Monitoring Dashboard
- Employee Induction Platform
- Client Portal
- Admin Dashboard
- AI Analysis Platform
- SaaS Dashboard
- Portfolio-Ready Product System

---

## Run 1 — Core Foundation

Run 1 builds the reusable production base.

### Included in Run 1

- Core app shell (AppShell, Sidebar, TopBar)
- Single Source of Truth (storage.js)
- Config-driven architecture (appConfig, variantConfig, moduleRegistry, apiConfig, aiProviderConfig, agentRegistry)
- External AI Provider Configuration panel
- Internal Agent Registry (config-only)
- Variant Profile selection
- Module Registry (navigation-driven)
- Settings (export / import / reset state)
- PWA manifest
- Clean modular folder structure
- No backend, no paid APIs, no secrets

---

## Run 2 — Reusable Transformation Layer + Product Blueprint Engine

Run 2 extends the foundation with a blueprint and transformation system.

### Added in Run 2

- Product Blueprint Engine (/blueprints)
- Blueprint Detail editor (/blueprint-detail)
- Transformation Readiness checker (/readiness)
- Blueprint presets (11 production-grade starter configurations)
- Transformation rules system (22 rules across 6 categories)
- Blueprint validators with readiness scoring (0-100)
- Blueprint export/import with secret key sanitisation
- Safe storage.js extension (no Run 1 functions removed)
- Module registry extended (8 active + 8 reserved)
- RefactorPlannerAgent structured preview panel (read-only, reserved for Run 3)
- Dashboard updated with Run 2 blueprint cards

---

## Getting Started

```bash
npm install
npm run dev
npm run build
```

---

## Folder Structure

```
/src
  /app          — App root and route definitions
  /components   — Layout and UI components
    /blueprints — Blueprint-specific components (Run 2)
  /config       — All config (identity, variants, modules, AI, agents, API guard, blueprints, transformation rules)
  /pages        — Page components
  /state        — SSOT storage, initial state, selectors, validators, blueprintValidators
  /styles       — Global CSS
  /utils        — Safe JSON, ID, date, blueprintExport utilities
  main.jsx
/public
  manifest.json
```

---

## State

All state is managed through `/src/state/storage.js`.

- No component writes directly to localStorage.
- State is validated before saving.
- API keys are masked before storage.
- Raw keys are never exported.
- Blueprint data is sanitised before export.
- State key: `4p3x_reusable_base_state_v1`

---

## Run 3 Preview

Run 3 should build the **Internal AI Agent Panels + Guided Assistant Logic**.

It will activate safe, limited-authority advisory agents:

- System Architect Agent
- UX Logic Agent
- Validation Agent
- Refactor Planner Agent
- API Config Agent (enhanced)

All agents must remain advisory, explainable, limited-authority, and non-autonomous.

---

## Security

- No real API keys are hardcoded.
- The API Config Guard™ blocks forbidden backend secret names from frontend use.
- Browser localStorage is not suitable for production secret storage. Use a backend proxy in production.
- No autonomous AI behaviour is present in Run 1 or Run 2.
- Blueprint exports never contain raw API keys.

---

© 2026 Kyzel Kreates — 4P3X Verse

---

## Run 4 — Variant Transformation Compiler + Safe Product Skeleton Generator

### Included in Run 4
- Transformation Compiler — creates transformation plans from blueprints (read/plan only, no file writes)
- Product Skeleton Generator — generates skeleton plans for human review (display only)
- Transformation Plan Detail page
- Full plan validation and blocker logic
- Transformation lock system — prevents unsafe builds

---

## Run 5 — Variant Build Launcher + Run Prompt Generator

### Included in Run 5
- Variant Build Launcher — readiness checks before any variant build begins
- Run Prompt Generator — generates FIX-ONLY BUILD COMPILER MODE prompts for each run
- Generated Prompt Detail — copy/export only, no auto-execution
- Prompt safety scanner and completeness validator
- Acceptance criteria, stop conditions, rollback guidance, validation gates injected into every prompt

---

## Run 6 — Product Variant Workspace Manager

### Included in Run 6
- Variant Workspaces — create and manage isolated product build workspaces
- Workspace Detail — link blueprints, plans, prompts, export packs by ID only
- Workspace Comparison — read-only side-by-side comparison
- Workspace isolation locks — no cross-variant contamination
- Progress tracking (manual), readiness scoring, blocker management

---

## Run 7 — Export / Handoff / Deployment Preparation Layer

### Included in Run 7
- Export Centre — create and manage export packs
- Handoff Pack Builder — builder-safe handoff instructions, GitHub/Vercel/PWA checklists
- Deployment Readiness — pre-flight checks before any variant deployment
- Export Pack Detail — view linked assets, sanitised content, safety status
- Dashboard + Connected PWA structure planning and rules
- No secrets exported — all env values use placeholders only

---

## Run 8 — Final System Audit + Production Hardening + Transformation Readiness Lock

### Included in Run 8
- Final System Audit — runs 15 audit categories across the entire base
- Production Hardening — verify all hardening checks manually
- Transformation Readiness Lock — lock the base only when all critical checks pass
- Final Readiness Report — export a sanitised readiness summary
- Audit categories: SSOT, routes, module registry, agent safety, transformation locks, prompt safety, workspace isolation, export/handoff, no-demo wording, secret exposure, PWA readiness, state schema, dashboard+PWA architecture, final lock

---

## Run 8.5 — Final Patch / Drift Removal / Transformation Lock Hardening

### Included in Run 8.5 (patches only — no new features)
- `useAppState` hook created (`src/state/useAppState.js`) — resolves missing export for Run 8 pages
- `moduleRegistry.js` `runToBuild` normalised — all runs use `'Run N'` string format consistently
- `Modules.jsx` filter patched to match normalised run ID format
- `.env.example` created with placeholders only and full security guidance
- Final build confirmed clean — all 28 routes, 28 pages, 20 audit components, 19 audit logic files verified
- SSOT confirmed — no direct localStorage writes outside storage.js
- No raw secrets, no unsafe product-facing wording, no autonomous agents, no destructive paths

---

## Safety Principles

1. **SSOT** — All persistent state goes through `storage.js`. No exceptions.
2. **Advisory AI only** — All agents have `autonomyAllowed: false`, `fileEditAllowed: false`, `externalApiCallsAllowed: false`, `destructiveActionsAllowed: false`.
3. **Prompts are copy-paste only** — No generated prompt executes automatically.
4. **Skeletons are plans only** — No generated file is written into the live app.
5. **No secrets exported** — Export packs, handoff packs, and audit reports are sanitised before export.
6. **Transformation lock** — Variant builds can only start after the final audit passes with no blockers and score ≥ 85.
7. **Dashboard + Connected PWA** — Every future variant must have a professional dashboard and one connected role-specific PWA with separated state and permission scopes.

---

## After Run 8.5 — What Comes Next

The reusable base is complete. Export the full project as a zip and begin one selected variant path only:

- Four Paws LMS + Learner PWA
- Fleet Control Dashboard + Driver PWA
- Patient Monitoring Dashboard + Patient PWA
- Coach Training Dashboard + Training PWA
- Therapist Dashboard + Patient PWA
- Project Control OS
- Client Portal
- Admin Dashboard
- AI Analysis Platform

Each variant must be created as its own isolated project using:
1. A selected workspace
2. A selected blueprint
3. A compiled transformation plan
4. Generated run prompts (copy-paste into your AI agent)
5. An export/handoff pack
6. Final readiness lock confirmation

**Do not build multiple variants in one run.**

---

*4P3X Reusable Base Structure™ — Powered by 4P3X Intelligent AI — Created by Kyzel Kreates — Part of the 4P3X Verse*

---

## Run 9 — Base ZIP / Project Package Builder

### Included in Run 9

**New pages:**
- Base Package Builder (`/base-package-builder`) — create the base package record, review include/exclude rules, view builder attachment instructions, run the pre-zip export checklist
- Package Manifest (`/package-manifest`) — view and export the machine-readable package manifest including required/forbidden file lists and branding
- Package Validation (`/package-validation`) — run full package validation against all system checks before authorising zip preparation

**New components (src/components/package/):**
- `PackageBuilderPanel.jsx` — package creation, status, readiness score, validate trigger
- `PackageManifestViewer.jsx` — required/forbidden file viewer with export
- `PackageFileTreePanel.jsx` — planned file tree with include/exclude/advisory sections
- `PackageIncludeExcludePanel.jsx` — side-by-side include and exclude rule lists
- `PackageReadinessPanel.jsx` — per-check readiness display with blockers/warnings
- `PackageSecretScanPanel.jsx` — masked-only secret scan results
- `PackageInstructionPanel.jsx` — per-builder attachment instructions (Base44 / Manus / Replit / Cursor / GitHub / Vercel / Generic)
- `PackageValidationPanel.jsx` — full validation result display with re-run trigger
- `PackageExportChecklist.jsx` — 14-item manual pre-zip checklist

**New logic (src/logic/package/):**
- `packageBuilder.js` — CRUD + readiness + zip validation for package records
- `packageManifestBuilder.js` — machine-readable manifest generation with branding
- `packageFileTreePlanner.js` — include/exclude/advisory file tree planning
- `packageReadinessScanner.js` — 8-check readiness scanner (audit, SSOT, routes, secrets, isolation, manifest)
- `packageSecretScanner.js` — raw key pattern + forbidden name detection, always masked output
- `packageInstructionBuilder.js` — per-builder handoff instruction generator
- `packageValidation.js` — full package validation before zip authorisation

**New config (src/config/):**
- `packageRules.js` — 17 blocker/warning safety rules for packaging
- `packageFileRules.js` — required include patterns, forbidden patterns, optional patterns
- `packageInstructionTemplates.js` — attachment instruction text for all 7 target environments, branding lock

**New state (src/state/):**
- `packageValidators.js` — state-level validation for basePackage section
- `initialState.js` — `basePackage` section added with locks, manifest, validation, zip status
- `storage.js` — 10 new Run 9 functions: `createBasePackage`, `updateBasePackage`, `deleteBasePackage`, `setActiveBasePackage`, `buildPackageManifest`, `validateBasePackage`, `calculateBasePackageReadiness`, `exportPackageManifest`, `exportPackageInstructions`, `getActiveBasePackage`
- `validators.js` — basePackage state shape validation added

**New utils:**
- `utils/packageExport.js` — `sanitizeManifestForExport`, `formatManifestAsText`, `formatInstructionsAsText`

**Updated files:**
- `src/config/moduleRegistry.js` — 3 new active Run 9 modules
- `src/app/routes.js` — 3 new routes added
- `src/pages/Dashboard.jsx` — Run 9 cards (package status, zip ready, builder attachment, blockers) + system status updated to Run 9 Complete
- `src/pages/Modules.jsx` — Run 9 modules shown in active grid

### Branding Lock

All package manifests, instructions, and export reports carry:

> Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

### Package Safety Locks

| Lock | Value |
|------|-------|
| preventSecretPackaging | true |
| preventNodeModulesPackaging | true |
| preventEnvPackaging | true |
| preventBuildCachePackaging | true |
| preventVariantContamination | true |
| preventDemoLanguage | true |
| requireFinalAuditPass | true |
| requirePackageValidation | true |
| requireManualZipOnly | true |

### What Run 9 Does NOT Do

- Does not build product variants
- Does not create a zip automatically
- Does not push to GitHub automatically
- Does not deploy to Vercel automatically
- Does not execute generated prompts
- Does not call external APIs
- Does not expose secrets in any output
- Does not create a second state system

---

## After Run 9 — What Comes Next

**Run 10 — Master Variant Transformation Launcher + Final Ready-to-Build Lock**

Run 10 will generate the master prompt for creating real product variants from the packaged base zip. Do not build Run 10 until Run 9 package validation passes with no blockers.

---

*4P3X Reusable Base Structure™ — Powered by 4P3X Intelligent AI — Created by Kyzel Kreates — Part of the 4P3X Verse*
