// 4P3X Dashboard + Connected PWA Structure Rules — Run 7
// Structural planning only. These are patterns, not built products.

export const DASHBOARD_PWA_PATTERNS = {
  learningPlatform: {
    dashboardRole: 'Admin / Trainer Dashboard',
    pwaRole: 'Learner PWA',
    monitoringRelationship: 'Dashboard tracks learning progress, lesson completion, quiz results, certificates, and learner status.',
    stateSeparation: 'Dashboard manages course content and learner records. PWA handles learner session, progress sync, and offline access.',
    optionalSupabaseSyncLater: true,
    safetyNotes: ['Learner PII must be protected', 'Certificate data must be append-only'],
  },
  fleetDashboard: {
    dashboardRole: 'Fleet Control Dashboard',
    pwaRole: 'Driver PWA',
    monitoringRelationship: 'Dashboard monitors vehicle locations, routes, compliance status, driver updates, and incidents.',
    stateSeparation: 'Dashboard manages fleet records and compliance rules. PWA handles driver session, location updates, and route instructions.',
    optionalSupabaseSyncLater: true,
    safetyNotes: ['Driver PII must not be exposed without access controls', 'No live GPS until provider keys are configured', 'Route data must not imply legal navigational certainty'],
  },
  monitoringDashboard: {
    dashboardRole: 'Professional Monitoring Dashboard',
    pwaRole: 'User / Client PWA',
    monitoringRelationship: 'Dashboard monitors check-ins, wellbeing logs, alerts, progress notes, and escalation flags.',
    stateSeparation: 'Dashboard manages professional records and escalation rules. PWA handles user self-reporting and offline logging.',
    optionalSupabaseSyncLater: true,
    safetyNotes: ['No medical diagnosis claims', 'No emergency care claims', 'Disclaimer: informational support tool only'],
  },
  employeeInductionPlatform: {
    dashboardRole: 'Employer / Manager Dashboard',
    pwaRole: 'Employee Induction PWA',
    monitoringRelationship: 'Dashboard tracks induction programme completion, policy acknowledgement, task sign-off, and team status.',
    stateSeparation: 'Dashboard manages programme content and employee records. PWA handles employee self-paced training and acknowledgements.',
    optionalSupabaseSyncLater: true,
    safetyNotes: ['Employee PII must be protected', 'Acknowledgement records must be tamper-evident'],
  },
  clientPortal: {
    dashboardRole: 'Admin / Professional Dashboard',
    pwaRole: 'Client PWA',
    monitoringRelationship: 'Dashboard manages client records, documents, tasks, invoices, and project status.',
    stateSeparation: 'Dashboard owns full client records. PWA provides client read/limited-write access only.',
    optionalSupabaseSyncLater: true,
    safetyNotes: ['Client PII must not be accessible without authentication', 'Documents must have access control'],
  },
  adminDashboard: {
    dashboardRole: 'System Admin Dashboard',
    pwaRole: 'End-User PWA',
    monitoringRelationship: 'Dashboard manages user accounts, content, system config, and audit log. PWA provides end-user experience.',
    stateSeparation: 'Dashboard has elevated permissions. PWA is read/write scoped to the user\'s own data only.',
    optionalSupabaseSyncLater: true,
    safetyNotes: ['Admin actions must be logged in audit trail', 'Config editor must validate before save'],
  },
  customProductSystem: {
    dashboardRole: 'Admin / Control Dashboard',
    pwaRole: 'User-Facing PWA',
    monitoringRelationship: 'Dashboard oversees product records, management functions, and reporting. PWA serves the end-user interaction layer.',
    stateSeparation: 'Dashboard and PWA must have clearly separated state and permission scopes.',
    optionalSupabaseSyncLater: true,
    safetyNotes: ['Define custom safety rules before building this variant'],
  },
};

export const STRUCTURE_RULES = [
  'Dashboard and PWA must have separate state scopes.',
  'Dashboard state must not be directly accessible from the PWA.',
  'PWA user data must not be directly writable from the dashboard without validation.',
  'Local-first operation must be default before any Supabase sync is introduced.',
  'Optional Supabase sync must be planned in a future controlled backend run.',
  'Dashboard permissions and PWA permissions must be defined before building.',
  'No cross-variant contamination — each product variant has its own workspace.',
  'Export/reporting path must be planned before the variant build run begins.',
];

export function getDashboardPwaPattern(productType) {
  return DASHBOARD_PWA_PATTERNS[productType] || DASHBOARD_PWA_PATTERNS.customProductSystem;
}

export function getAllPatterns() {
  return Object.entries(DASHBOARD_PWA_PATTERNS).map(([productType, pattern]) => ({ productType, ...pattern }));
}

export default DASHBOARD_PWA_PATTERNS;
