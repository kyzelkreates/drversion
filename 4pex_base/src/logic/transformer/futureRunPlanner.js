// 4P3X Future Run Planner — RUN 4
// Generates future run sequences per product type. Does NOT build them.

const PROTECTED_FILES_ALL_RUNS = [
  'src/state/storage.js',
  'src/state/initialState.js',
  'src/config/appConfig.js',
  'src/config/moduleRegistry.js',
  'src/config/agentRegistry.js',
];

const RUN_SEQUENCES = {
  lms: [
    { run: 'Run 5', title: 'Learning Data Model + Module Shell',
      mission: 'Establish the core learning data entities (Course, Lesson, Enrolment) and empty module shells without building UI logic.',
      allowedFiles: ['src/features/learning/', 'src/state/learningState.js', 'src/pages/Learning.jsx'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Course entity has all required fields', 'Enrolment entity validated', 'Module shell renders without error'],
      stopConditions: ['Any Run 1/2/3 file is modified', 'External API calls are added', 'storage.js is duplicated'] },
    { run: 'Run 6', title: 'Course/Module/Lesson Builder',
      mission: 'Build the course creation, module ordering, and lesson editing interfaces using local state only.',
      allowedFiles: ['src/pages/CourseBuilder.jsx', 'src/pages/LessonDetail.jsx', 'src/features/learning/'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Course CRUD works locally', 'Lesson ordering persists', 'No external API calls'],
      stopConditions: ['Backend dependency added', 'Run 5 entities are not present'] },
    { run: 'Run 7', title: 'Quiz/Progress/Certificate System',
      mission: 'Add quiz engine, progress tracking, and certificate generation.',
      allowedFiles: ['src/pages/QuizEngine.jsx', 'src/pages/ProgressTracker.jsx', 'src/pages/CertificateGenerator.jsx'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Quiz submit and score works', 'Certificate generates without external service', 'Progress persists'],
      stopConditions: ['Run 6 course builder is not complete'] },
    { run: 'Run 8', title: 'Admin/Import/Export/Polish',
      mission: 'Add admin panel, bulk import/export, accessibility polish, and production readiness checks.',
      allowedFiles: ['src/pages/LearningAdmin.jsx', 'src/utils/learningExport.js'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Admin CRUD works', 'Export/import roundtrip verified', 'Build passes'],
      stopConditions: ['Run 7 is not complete', 'Critical accessibility issues remain'] },
  ],
  fleet: [
    { run: 'Run 5', title: 'Vehicle/Fleet Data Model + Dashboard Shell',
      mission: 'Create fleet and vehicle entities, build empty dashboard shell.',
      allowedFiles: ['src/features/fleet/', 'src/state/fleetState.js', 'src/pages/FleetDashboard.jsx'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Vehicle entity validated', 'Fleet dashboard renders', 'Safety disclaimers present'],
      stopConditions: ['No human override mechanism', 'External routing APIs connected without proxy'] },
    { run: 'Run 6', title: 'Routing/Provider Config Foundation',
      mission: 'Build routing configuration UI and provider integration plan (no live routing calls yet).',
      allowedFiles: ['src/pages/RouteConfig.jsx', 'src/features/fleet/routing/'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Route config persists locally', 'Provider selection validates', 'No raw API keys in UI'],
      stopConditions: ['Run 5 fleet model not complete', 'Safety boundaries not present'] },
    { run: 'Run 7', title: 'Compliance/Safety Advisory Layer',
      mission: 'Add compliance logging, safety advisory panel, and human override controls.',
      allowedFiles: ['src/pages/ComplianceReports.jsx', 'src/features/fleet/compliance/'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Compliance log records correctly', 'Human override always accessible', 'Data freshness warning shown'],
      stopConditions: ['Human override removed', 'Legal disclaimer not present'] },
    { run: 'Run 8', title: 'Reports/Export/Polish',
      mission: 'Add fleet reporting, data export, and production polish.',
      allowedFiles: ['src/utils/fleetExport.js'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Reports generate without external calls', 'Export is sanitized', 'Build passes'],
      stopConditions: ['Run 7 compliance layer not complete'] },
  ],
  projectOS: [
    { run: 'Run 5', title: 'Project Registry + Run Tracker',
      mission: 'Build the core project registry and run tracking system using local state.',
      allowedFiles: ['src/features/projects/', 'src/state/projectState.js', 'src/pages/ProjectRegistry.jsx', 'src/pages/RunTracker.jsx'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Project CRUD works locally', 'Run log persists', 'Unique run IDs generated'],
      stopConditions: ['External dependency introduced', 'storage.js replaced'] },
    { run: 'Run 6', title: 'Prompt Vault + Build History',
      mission: 'Add the prompt library and full build history viewer.',
      allowedFiles: ['src/pages/PromptVault.jsx', 'src/features/projects/prompts/'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Prompts save and load correctly', 'Build history is chronological', 'Search works locally'],
      stopConditions: ['Run 5 project model not complete'] },
    { run: 'Run 7', title: 'Error Centre + Repair Queue',
      mission: 'Build error tracking, repair queue, and issue resolution workflow.',
      allowedFiles: ['src/pages/ErrorCentre.jsx', 'src/features/projects/errors/'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Errors log correctly', 'Repair queue updates state', 'Resolved errors marked'],
      stopConditions: ['Run 6 vault not complete'] },
    { run: 'Run 8', title: 'Repo/Deployment Tracking',
      mission: 'Add repository and deployment tracking, polish, and production readiness.',
      allowedFiles: ['src/features/projects/history/'],
      forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
      validationGates: ['Repo links persist', 'Deployment status tracked', 'Build passes'],
      stopConditions: ['Run 7 error centre not complete'] },
  ],
};

const DEFAULT_SEQUENCE = [
  { run: 'Run 5', title: 'Product Data Model + Module Shell',
    mission: 'Establish core product data entities and empty module shells.',
    allowedFiles: ['src/features/custom/', 'src/state/productState.js', 'src/pages/ProductHome.jsx'],
    forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
    validationGates: ['Core entities validated', 'Module shell renders', 'Local state persists'],
    stopConditions: ['External API required before proxy run', 'storage.js replaced'] },
  { run: 'Run 6', title: 'Core Feature Build',
    mission: 'Build core product features using the data model from Run 5.',
    allowedFiles: ['src/features/custom/'],
    forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
    validationGates: ['Core CRUD operations work', 'UI states all covered', 'No external calls'],
    stopConditions: ['Run 5 data model not complete'] },
  { run: 'Run 7', title: 'Advanced Features + Integration',
    mission: 'Add advanced features and integration foundation.',
    allowedFiles: ['src/features/custom/', 'src/utils/'],
    forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
    validationGates: ['Advanced features work locally', 'Integration plan validated'],
    stopConditions: ['Run 6 core not complete'] },
  { run: 'Run 8', title: 'Polish + Production Readiness',
    mission: 'Final polish, accessibility, export/import, and production build verification.',
    allowedFiles: ['src/styles/', 'src/utils/'],
    forbiddenFiles: PROTECTED_FILES_ALL_RUNS,
    validationGates: ['Build passes', 'All UI states covered', 'Export sanitized'],
    stopConditions: ['Run 7 not complete'] },
];

export function generateFutureRunSequence(blueprint, transformationPlan) {
  const type = blueprint?.productType || 'foundation';
  return RUN_SEQUENCES[type] || DEFAULT_SEQUENCE;
}

export function generateNextRunRecommendation(blueprint, transformationPlan) {
  const seq = generateFutureRunSequence(blueprint, transformationPlan);
  return seq[0] || null;
}

export function generateRunScope(runNumber, productType) {
  const seq = RUN_SEQUENCES[productType] || DEFAULT_SEQUENCE;
  const idx = parseInt(String(runNumber).replace('Run ', ''), 10) - 5;
  return seq[idx] || null;
}

export function generateAllowedFilesForRun(runNumber, productType) {
  const scope = generateRunScope(runNumber, productType);
  return scope?.allowedFiles || [];
}

export function generateForbiddenFilesForRun(runNumber, productType) {
  const scope = generateRunScope(runNumber, productType);
  return scope?.forbiddenFiles || PROTECTED_FILES_ALL_RUNS;
}

export function generateValidationGatesForRun(runNumber, productType) {
  const scope = generateRunScope(runNumber, productType);
  return scope?.validationGates || [];
}

export function generateStopConditionsForRun(runNumber, productType) {
  const scope = generateRunScope(runNumber, productType);
  return scope?.stopConditions || [];
}
