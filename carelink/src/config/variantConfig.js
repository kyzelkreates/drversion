// 4P3X Variant Config — RUN 1 + RUN 2
// Variant profiles are transformation targets only.
// No product features are built in this file.

const variantConfig = [
  {
    id: 'base',
    name: 'Reusable Base',
    type: 'foundation',
    description: 'Core production foundation. The starting point for all product transformations.',
    recommendedModules: ['dashboard', 'modules', 'variantProfile', 'aiConfig', 'settings'],
    lockedRules: [
      'Preserve storage.js as SSOT.',
      'Preserve all Run 1 and Run 2 foundations.',
      'No product-specific logic in the base variant.',
    ],
    futureUse: 'This is the active foundation for all future product variants.',
  },
  {
    id: 'learningPlatform',
    name: 'Learning Platform',
    type: 'lms',
    description: 'Production LMS with course delivery, student progress tracking, and instructor tooling.',
    recommendedModules: ['dashboard', 'learning', 'admin', 'reports', 'aiAgents'],
    lockedRules: [
      'Student data must be isolated per user (RLS).',
      'No course data in local-only mode.',
    ],
    futureUse: 'Build in Run 4 — requires Supabase sync run first.',
  },
  {
    id: 'projectControlOS',
    name: 'Project Control OS',
    type: 'project-management',
    description: 'Production project, task, and team control operating system.',
    recommendedModules: ['dashboard', 'projects', 'admin', 'reports', 'integrations'],
    lockedRules: ['Role-based access required.', 'No fleet logic.'],
    futureUse: 'Build in Run 4 — requires Supabase sync run first.',
  },
  {
    id: 'fleetDashboard',
    name: 'Fleet Dashboard',
    type: 'fleet',
    description: 'Safety-critical vehicle fleet and route management system.',
    recommendedModules: ['dashboard', 'fleet', 'monitoring', 'admin', 'reports'],
    lockedRules: [
      'Safety-critical: all route changes must be logged.',
      'Driver data must comply with privacy regulations.',
    ],
    futureUse: 'Build in Run 5 — safety-critical; requires compliance review before deployment.',
  },
  {
    id: 'monitoringDashboard',
    name: 'Monitoring Dashboard',
    type: 'monitoring',
    description: 'System and operational health monitoring with live alerting.',
    recommendedModules: ['dashboard', 'monitoring', 'reports', 'admin'],
    lockedRules: [
      'Read-only views by default.',
      'No destructive actions from monitoring views.',
    ],
    futureUse: 'Build in Run 4 — requires Supabase or hybrid sync.',
  },
  {
    id: 'clientPortal',
    name: 'Client Portal',
    type: 'portal',
    description: 'Production client-facing self-service and project communication portal.',
    recommendedModules: ['dashboard', 'projects', 'integrations', 'settings'],
    lockedRules: [
      'Role separation required: client vs admin.',
      'Client data isolation with RLS.',
    ],
    futureUse: 'Build in Run 4 — requires Supabase auth and RLS.',
  },
  {
    id: 'adminDashboard',
    name: 'Admin Dashboard',
    type: 'admin',
    description: 'Production internal administration and team management dashboard.',
    recommendedModules: ['dashboard', 'admin', 'reports', 'integrations', 'settings'],
    lockedRules: [
      'Admin-only access.',
      'All admin actions must be audited.',
    ],
    futureUse: 'Build in Run 4 — requires Supabase auth and audit log.',
  },
  {
    id: 'aiAnalysisPlatform',
    name: 'AI Analysis Platform',
    type: 'ai-analysis',
    description: 'AI-assisted data analysis, insight generation, and reporting platform.',
    recommendedModules: ['dashboard', 'aiConfig', 'aiAgents', 'reports', 'admin'],
    lockedRules: [
      'No autonomous AI actions without explicit user approval.',
      'No raw keys in exported reports.',
    ],
    futureUse: 'Build in Run 5 — requires AI agents run and Supabase sync.',
  },
  {
    id: 'employeeInductionPlatform',
    name: 'Employee Induction Platform',
    type: 'induction',
    description: 'Compliance-critical workplace onboarding and induction tracking system.',
    recommendedModules: ['dashboard', 'learning', 'admin', 'reports'],
    lockedRules: [
      'Completion records must be immutable once signed.',
      'Compliance reporting must meet local standards.',
    ],
    futureUse: 'Build in Run 5 — requires compliance review and HR system integration.',
  },
  {
    id: 'portfolioDemoSystem',
    name: 'Portfolio-Ready Product System',
    type: 'portfolio',
    description: 'Production-ready product showcase system for presenting product variants to clients.',
    recommendedModules: ['dashboard', 'variantProfile', 'modules', 'settings', 'blueprintEngine'],
    lockedRules: [
      'No real customer data without explicit consent.',
      'No raw API keys in any presentation configuration.',
      'No destructive actions during client presentations.',
    ],
    futureUse: 'Build in Run 5 — showcase polish and client presentation mode.',
  },
];

export default variantConfig;
