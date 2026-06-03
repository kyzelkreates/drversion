// 4P3X Workspace Templates — Run 6
// Production workspace starter templates for real future product variants.
// These templates are planning starters only — they do not build products.

function nowIso() { return new Date().toISOString(); }

export const WORKSPACE_TEMPLATES = {

  learningPlatformWorkspace: {
    id: 'tpl_learning_platform',
    label: 'Learning Platform',
    productType: 'learningPlatform',
    description: 'Workspace for building a structured learning platform with courses, modules, lessons, progress tracking, quizzes, and certificates.',
    recommendedBlueprintType: 'learningPlatform',
    recommendedTransformationPlanType: 'learningPlatform',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly', 'preventAutoBuildExecution'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Course Data Model', body: 'Plan the Course, Module, Lesson, and LearnerProgress data models before starting Run 6.', category: 'architecture' },
      { title: 'Run 6 Goal', body: 'Run 6 builds the learning data model and module shell only. No UI or quiz logic yet.', category: 'build' },
    ],
    safetyWarnings: ['Learner PII must not be stored without a consent flow.', 'Certificate generation must remain local-only until a secure backend run is planned.'],
    workspacePurpose: 'Stage and track the learning platform build across Run 6, 7, and 8.',
  },

  projectControlOSWorkspace: {
    id: 'tpl_project_control_os',
    label: 'Project Control OS',
    productType: 'projectControlOS',
    description: 'Workspace for building a project control system with run tracking, prompt vault, build history, error centre, and repair queue.',
    recommendedBlueprintType: 'projectControlOS',
    recommendedTransformationPlanType: 'projectControlOS',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Run 6 Goal', body: 'Run 6 builds the project registry and run tracker. No prompt vault yet.', category: 'build' },
    ],
    safetyWarnings: ['Prompt vault must not auto-execute stored prompts.'],
    workspacePurpose: 'Stage and track the project control OS build.',
  },

  fleetDashboardWorkspace: {
    id: 'tpl_fleet_dashboard',
    label: 'Fleet Dashboard',
    productType: 'fleetDashboard',
    description: 'Workspace for building a fleet management dashboard with vehicles, drivers, routes, compliance, and reports.',
    recommendedBlueprintType: 'fleetDashboard',
    recommendedTransformationPlanType: 'fleetDashboard',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Run 6 Goal', body: 'Run 6 builds the vehicle/fleet data model and dashboard shell only. No routing engine yet.', category: 'build' },
    ],
    safetyWarnings: ['Driver PII must not be exposed without a consent and access control flow.', 'No live GPS APIs until provider keys are configured.'],
    workspacePurpose: 'Stage and track the fleet dashboard build.',
  },

  monitoringDashboardWorkspace: {
    id: 'tpl_monitoring_dashboard',
    label: 'Monitoring Dashboard',
    productType: 'monitoringDashboard',
    description: 'Workspace for building a monitoring and alerting dashboard with metrics, health rules, incidents, and reports.',
    recommendedBlueprintType: 'monitoringDashboard',
    recommendedTransformationPlanType: 'monitoringDashboard',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Run 6 Goal', body: 'Run 6 builds the monitoring data model and alert shell. No live polling yet.', category: 'build' },
    ],
    safetyWarnings: ['No live polling APIs until monitoring provider keys are configured.'],
    workspacePurpose: 'Stage and track the monitoring dashboard build.',
  },

  clientPortalWorkspace: {
    id: 'tpl_client_portal',
    label: 'Client Portal',
    productType: 'clientPortal',
    description: 'Workspace for building a client portal with client management, document sharing, tasks, invoices, and reports.',
    recommendedBlueprintType: 'clientPortal',
    recommendedTransformationPlanType: 'clientPortal',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Run 6 Goal', body: 'Run 6 builds the client data model and portal shell. No invoicing yet.', category: 'build' },
    ],
    safetyWarnings: ['Client PII must not be shared without access controls.'],
    workspacePurpose: 'Stage and track the client portal build.',
  },

  adminDashboardWorkspace: {
    id: 'tpl_admin_dashboard',
    label: 'Admin Dashboard',
    productType: 'adminDashboard',
    description: 'Workspace for building an admin dashboard with user management, content management, config editor, audit log, and reports.',
    recommendedBlueprintType: 'adminDashboard',
    recommendedTransformationPlanType: 'adminDashboard',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Run 6 Goal', body: 'Run 6 builds the admin data model and dashboard shell. No analytics yet.', category: 'build' },
    ],
    safetyWarnings: ['Admin config editor must validate before save.', 'Audit log must be append-only.'],
    workspacePurpose: 'Stage and track the admin dashboard build.',
  },

  aiAnalysisPlatformWorkspace: {
    id: 'tpl_ai_analysis_platform',
    label: 'AI Analysis Platform',
    productType: 'aiAnalysisPlatform',
    description: 'Workspace for building an AI-powered analysis platform with datasets, job runner, result viewer, and report builder.',
    recommendedBlueprintType: 'aiAnalysisPlatform',
    recommendedTransformationPlanType: 'aiAnalysisPlatform',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly', 'preventSecretExposure'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Run 6 Goal', body: 'Run 6 builds the analysis data model and provider config shell. No live API calls yet.', category: 'build' },
      { title: 'API Key Safety', body: 'AI provider API keys must never be hardcoded. User must supply keys through the AI Config page.', category: 'risk' },
    ],
    safetyWarnings: ['AI provider API keys must be user-supplied only.', 'No API key may be stored in raw state.'],
    workspacePurpose: 'Stage and track the AI analysis platform build.',
  },

  employeeInductionWorkspace: {
    id: 'tpl_employee_induction',
    label: 'Employee Induction Platform',
    productType: 'employeeInductionPlatform',
    description: 'Workspace for building an employee induction platform with programmes, steps, policy acknowledgements, and certificates.',
    recommendedBlueprintType: 'employeeInductionPlatform',
    recommendedTransformationPlanType: 'employeeInductionPlatform',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Run 6 Goal', body: 'Run 6 builds the induction data model and shell. No policy flows yet.', category: 'build' },
    ],
    safetyWarnings: ['Inductee personal data must not be exposed without a consent flow.'],
    workspacePurpose: 'Stage and track the employee induction platform build.',
  },

  supabaseHybridSaaSWorkspace: {
    id: 'tpl_supabase_hybrid_saas',
    label: 'Supabase Hybrid SaaS',
    productType: 'supabaseHybridSaaS',
    description: 'Workspace for building a Supabase-backed SaaS product with auth, multi-tenant data, and billing.',
    recommendedBlueprintType: 'supabaseHybridSaaS',
    recommendedTransformationPlanType: 'supabaseHybridSaaS',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly', 'preventSecretExposure'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Run 6 Goal', body: 'Run 6 builds the Supabase config and auth shell. No Supabase calls until keys are configured.', category: 'build' },
      { title: 'Security Rules', body: 'Service role key must never be in the frontend bundle. RLS must be enabled on all tables.', category: 'risk' },
    ],
    safetyWarnings: ['Supabase service role key must never be exposed in frontend code.', 'Row-level security must be enabled on all tables.'],
    workspacePurpose: 'Stage and track the Supabase hybrid SaaS build.',
  },

  localFirstPWAWorkspace: {
    id: 'tpl_local_first_pwa',
    label: 'Local-First PWA Product',
    productType: 'localFirstPWAProduct',
    description: 'Workspace for building a local-first Progressive Web App with offline support, sync engine, and push notifications.',
    recommendedBlueprintType: 'localFirstPWAProduct',
    recommendedTransformationPlanType: 'localFirstPWAProduct',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Run 6 Goal', body: 'Run 6 extends the PWA core with the product data model and offline shell.', category: 'build' },
    ],
    safetyWarnings: ['Service worker scope must be set correctly.', 'Push notification permission must be user-consented.'],
    workspacePurpose: 'Stage and track the local-first PWA product build.',
  },

  customProductWorkspace: {
    id: 'tpl_custom_product',
    label: 'Custom Product System',
    productType: 'customProductSystem',
    description: 'Workspace for building a fully custom product system based on the validated transformation plan and blueprint.',
    recommendedBlueprintType: 'customProductSystem',
    recommendedTransformationPlanType: 'customProductSystem',
    expectedRunCount: 3,
    defaultStatus: 'planning',
    requiredLocks: ['preserveBaseFoundation', 'isolateWorkspaceState', 'preventCrossWorkspaceMutation', 'manualPromptExecutionOnly'],
    requiredLinkedAssets: ['blueprint', 'transformationPlan'],
    defaultNotes: [
      { title: 'Custom Product Plan', body: 'Document the custom product goals and key screens before linking a transformation plan.', category: 'architecture' },
    ],
    safetyWarnings: ['Custom product features must match the validated transformation plan.', 'Feature creep must be prevented.'],
    workspacePurpose: 'Stage and track a custom product system build.',
  },
};

export function getWorkspaceTemplate(templateId) {
  return WORKSPACE_TEMPLATES[templateId] || null;
}

export function getAllWorkspaceTemplates() {
  return Object.values(WORKSPACE_TEMPLATES);
}

export function getWorkspaceTemplateByProductType(productType) {
  return Object.values(WORKSPACE_TEMPLATES).find((t) => t.productType === productType) || null;
}

export default WORKSPACE_TEMPLATES;
