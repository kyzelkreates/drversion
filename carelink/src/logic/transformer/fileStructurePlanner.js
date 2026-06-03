// 4P3X File Structure Planner — RUN 4
// Plans folders and files for a future variant build. Does NOT create files.

// ─── Protected file registry ─────────────────────────────────────────────────

export const PROTECTED_FILES = [
  'src/state/storage.js',
  'src/state/initialState.js',
  'src/state/validators.js',
  'src/state/blueprintValidators.js',
  'src/state/agentValidators.js',
  'src/config/appConfig.js',
  'src/config/moduleRegistry.js',
  'src/config/agentRegistry.js',
  'src/config/aiProviderConfig.js',
  'src/config/apiConfig.js',
  'src/config/blueprintPresets.js',
  'src/config/transformationRules.js',
  'src/config/variantConfig.js',
  'src/utils/safeJson.js',
  'src/utils/blueprintExport.js',
  'src/utils/agentOutput.js',
  'src/utils/date.js',
  'src/utils/id.js',
  'src/logic/agents/agentEngine.js',
  'src/logic/agents/agentAnalyzers.js',
  'src/logic/agents/agentSafety.js',
  'src/logic/agents/agentPermissions.js',
  'src/logic/agents/agentPrompts.js',
  'src/app/App.jsx',
  'src/app/routes.js',
];

// ─── Folder templates per product type ───────────────────────────────────────

const FOLDER_TEMPLATES = {
  lms: ['src/features/learning', 'src/features/learning/courses', 'src/features/learning/progress', 'src/features/learning/quizzes', 'src/features/learning/certificates', 'src/features/learning/admin'],
  fleet: ['src/features/fleet', 'src/features/fleet/vehicles', 'src/features/fleet/routing', 'src/features/fleet/compliance', 'src/features/fleet/reports'],
  projectOS: ['src/features/projects', 'src/features/projects/runs', 'src/features/projects/prompts', 'src/features/projects/errors', 'src/features/projects/history'],
  saas: ['src/features/billing', 'src/features/onboarding', 'src/features/team', 'src/features/settings', 'src/features/reports'],
  ecommerce: ['src/features/catalogue', 'src/features/cart', 'src/features/checkout', 'src/features/orders', 'src/features/fulfilment'],
  crm: ['src/features/contacts', 'src/features/pipeline', 'src/features/activities', 'src/features/reporting'],
  healthTracker: ['src/features/health', 'src/features/health/metrics', 'src/features/health/goals', 'src/features/health/reports'],
  eventPlatform: ['src/features/events', 'src/features/events/registration', 'src/features/events/schedule', 'src/features/events/speakers'],
  portfolioPlatform: ['src/features/portfolio', 'src/features/portfolio/projects', 'src/features/portfolio/showcase', 'src/features/portfolio/contact'],
  cybersecurity: ['src/features/security', 'src/features/security/assessments', 'src/features/security/reports', 'src/features/security/evidence'],
  customProductSystem: ['src/features/custom', 'src/features/custom/core', 'src/features/custom/modules'],
  foundation: [],
};

const BASE_FOLDERS = [
  'src/pages',
  'src/components',
  'src/logic',
  'src/state',
  'src/config',
  'src/utils',
  'src/styles',
  'public',
];

// ─── File templates per product type ─────────────────────────────────────────

function buildFilesForType(productType, context) {
  const type = productType || 'foundation';
  const files = [];

  // Always allowed to extend (not overwrite)
  const extendableFiles = [
    { path: 'src/state/initialState.js', purpose: 'Add product-specific state slice', allowedToCreate: false, allowedToModify: true, doNotTouch: false, runToBuild: 'Run 5' },
    { path: 'src/state/storage.js', purpose: 'Add product-specific storage functions', allowedToCreate: false, allowedToModify: true, doNotTouch: false, runToBuild: 'Run 5' },
    { path: 'src/config/moduleRegistry.js', purpose: 'Register product-specific modules', allowedToCreate: false, allowedToModify: true, doNotTouch: false, runToBuild: 'Run 5' },
    { path: 'src/app/routes.js', purpose: 'Add product-specific routes', allowedToCreate: false, allowedToModify: true, doNotTouch: false, runToBuild: 'Run 5' },
    { path: 'src/app/App.jsx', purpose: 'Register product-specific pages', allowedToCreate: false, allowedToModify: true, doNotTouch: false, runToBuild: 'Run 5' },
  ];

  // Type-specific new files
  const typeFiles = getTypeSpecificFiles(type);

  return [...extendableFiles, ...typeFiles];
}

function getTypeSpecificFiles(type) {
  const maps = {
    lms: [
      { path: 'src/pages/Learning.jsx',              purpose: 'Learning hub landing page',          allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
      { path: 'src/pages/CourseBuilder.jsx',         purpose: 'Course creation and editing',         allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 6' },
      { path: 'src/pages/ProgressTracker.jsx',       purpose: 'Learner progress overview',           allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 6' },
      { path: 'src/pages/QuizEngine.jsx',            purpose: 'Quiz and assessment system',          allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 7' },
      { path: 'src/pages/CertificateGenerator.jsx', purpose: 'Certificate generation and export',   allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 7' },
      { path: 'src/features/learning/courseModel.js',purpose: 'Course data model and logic',        allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
      { path: 'src/state/learningState.js',          purpose: 'Learning-specific state slice',       allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
    ],
    fleet: [
      { path: 'src/pages/FleetDashboard.jsx',       purpose: 'Fleet overview and vehicle status',    allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
      { path: 'src/pages/VehicleDetail.jsx',         purpose: 'Individual vehicle detail view',      allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
      { path: 'src/pages/RouteConfig.jsx',           purpose: 'Routing configuration interface',     allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 6' },
      { path: 'src/pages/ComplianceReports.jsx',     purpose: 'Compliance reporting and audit',      allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 7' },
      { path: 'src/features/fleet/vehicleModel.js', purpose: 'Vehicle data model and validation',    allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
      { path: 'src/state/fleetState.js',             purpose: 'Fleet-specific state slice',          allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
    ],
    projectOS: [
      { path: 'src/pages/ProjectRegistry.jsx',      purpose: 'Project listing and management',       allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
      { path: 'src/pages/RunTracker.jsx',            purpose: 'Build run tracking and history',      allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
      { path: 'src/pages/PromptVault.jsx',           purpose: 'Saved prompt library',                allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 6' },
      { path: 'src/pages/ErrorCentre.jsx',           purpose: 'Error tracking and repair queue',     allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 7' },
      { path: 'src/features/projects/projectModel.js', purpose: 'Project data model',               allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
      { path: 'src/state/projectState.js',           purpose: 'Project OS state slice',              allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
    ],
  };

  return maps[type] || [
    { path: `src/pages/ProductHome.jsx`,             purpose: 'Product landing page',                allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
    { path: `src/features/custom/productModel.js`,   purpose: 'Product-specific data model',         allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
    { path: `src/state/productState.js`,             purpose: 'Product-specific state slice',        allowedToCreate: true, allowedToModify: false, doNotTouch: false, runToBuild: 'Run 5' },
  ];
}

// ─── Exported planners ────────────────────────────────────────────────────────

export function planFoldersForProductType(productType, context) {
  const typeFolders = FOLDER_TEMPLATES[productType] || FOLDER_TEMPLATES.customProductSystem;
  return [...BASE_FOLDERS, ...typeFolders];
}

export function planFilesForProductType(productType, context) {
  const files = buildFilesForType(productType, context);
  return markProtectedFiles(files);
}

export function markProtectedFiles(files) {
  return files.map(f => {
    const isProtected = PROTECTED_FILES.includes(f.path);
    if (isProtected) {
      return { ...f, allowedToCreate: false, allowedToModify: false, doNotTouch: true };
    }
    return f;
  });
}

export function markAllowedCreateFiles(files) {
  return files.filter(f => f.allowedToCreate === true);
}

export function markAllowedModifyFiles(files) {
  return files.filter(f => f.allowedToModify === true && !f.doNotTouch);
}

export function detectFileConflictRisks(files, existingModules) {
  const conflicts = [];
  const existing = existingModules || [];
  for (const f of files) {
    if (f.doNotTouch && f.allowedToModify) {
      conflicts.push({ file: f.path, reason: 'Marked both doNotTouch and allowedToModify — conflict.' });
    }
    if (f.allowedToCreate && PROTECTED_FILES.includes(f.path)) {
      conflicts.push({ file: f.path, reason: 'Protected file marked as allowedToCreate.' });
    }
  }
  return conflicts;
}
