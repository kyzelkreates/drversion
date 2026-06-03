// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// dashboardPwaPatterns.js — Run 10
// Every product variant must follow the Dashboard + Connected PWA pattern.
// These are the required structural rules and predefined pattern presets.

// =====================================================
// REQUIRED STRUCTURE RULES
// Every product variant MUST follow ALL 10 of these.
// =====================================================
export const DASHBOARD_PWA_REQUIRED_RULES = [
  {
    id: 'rule_1',
    rule: 'Professional/admin dashboard required',
    description:
      'Every variant must include a professional or administrative dashboard for the managing role.',
  },
  {
    id: 'rule_2',
    rule: 'Connected role-specific PWA required',
    description:
      'Every variant must include a connected role-specific PWA for the end-user or field role.',
  },
  {
    id: 'rule_3',
    rule: 'Dashboard monitors or manages the PWA',
    description:
      'The dashboard must monitor, review, manage, or receive updates from the PWA — not the other way around.',
  },
  {
    id: 'rule_4',
    rule: 'Dashboard state separated from PWA user state',
    description:
      'Dashboard admin state and PWA user state must be isolated. No shared state store between them.',
  },
  {
    id: 'rule_5',
    rule: 'Local-first operation first',
    description:
      'Both dashboard and PWA must operate local-first where possible, before any optional cloud sync.',
  },
  {
    id: 'rule_6',
    rule: 'Optional Supabase sync later',
    description:
      'Cloud sync (Supabase or similar) is optional and added only after the local-first foundation is complete.',
  },
  {
    id: 'rule_7',
    rule: 'Separate permissions for dashboard and PWA roles',
    description:
      'Dashboard role permissions and PWA role permissions must be defined and enforced separately.',
  },
  {
    id: 'rule_8',
    rule: 'Clear data ownership boundaries',
    description:
      'It must be clear which data belongs to the dashboard role and which belongs to the PWA role.',
  },
  {
    id: 'rule_9',
    rule: 'Export/reporting path required',
    description:
      'Dashboard must provide at minimum a basic export or reporting path for its key data.',
  },
  {
    id: 'rule_10',
    rule: 'No cross-variant contamination',
    description:
      'Each variant must be a fully isolated project. No data, state, or components bleed between variants.',
  },
];

// =====================================================
// PREDEFINED DASHBOARD + PWA PATTERNS
// =====================================================
export const DASHBOARD_PWA_PATTERNS = [
  {
    id: 'fourPaws',
    label: 'Four Paws — Training/Admin Dashboard + Learner PWA',
    dashboardName: 'Training/Admin Dashboard',
    pwaName: 'Learner/Client PWA',
    dashboardRole: 'Training Administrator / Content Manager',
    pwaRole: 'Learner / Client',
    relationship:
      'Dashboard creates modules, lessons, and quizzes; monitors learner progress; issues certificates. Learner PWA delivers content, records completions, and syncs status.',
    stateIsolation:
      'Admin state holds course library, learner roster, completion data. Learner state holds current progress, quiz answers (local), certificate history.',
    syncPoint: 'Learner completion events sync to admin dashboard on submission.',
    exportPath: 'Progress reports, completion certificates, module analytics.',
    pwaOfflineCapability: 'Lesson content cached locally; completions queued for sync.',
    variantId: 'fourPawsLms',
  },
  {
    id: 'fleet',
    label: 'Fleet Control — Fleet Dashboard + Driver PWA',
    dashboardName: 'Fleet Control Dashboard',
    pwaName: 'Driver PWA',
    dashboardRole: 'Fleet Manager / Dispatcher',
    pwaRole: 'Driver / Operative',
    relationship:
      'Dashboard manages vehicles, assigns routes, monitors driver status, and tracks compliance. Driver PWA receives assignments, logs trips, records check-ins, and sends status updates.',
    stateIsolation:
      'Manager state holds fleet roster, assignments, route plans, compliance records. Driver state holds assigned trips, active route, check-in log.',
    syncPoint: 'Driver check-ins and trip completions sync to fleet dashboard.',
    exportPath: 'Trip reports, compliance logs, driver performance summaries.',
    pwaOfflineCapability: 'Active trip data and check-in forms cached locally.',
    variantId: 'fleetControlDashboard',
  },
  {
    id: 'patientMonitoring',
    label: 'Patient Monitoring — Clinician Dashboard + Patient PWA',
    dashboardName: 'Clinician/Professional Dashboard',
    pwaName: 'Patient PWA',
    dashboardRole: 'Clinician / Healthcare Professional',
    pwaRole: 'Patient / Service User',
    relationship:
      'Dashboard receives patient check-ins, wellbeing logs, alerts, and progress data. Clinician reviews and responds. Patient PWA allows daily logging, check-ins, and personal progress view.',
    stateIsolation:
      'Clinician state holds patient roster, review queue, clinical notes (local), alert log. Patient state holds personal check-in history, log entries, current status.',
    syncPoint: 'Patient check-ins and log entries sync to clinician dashboard on submission.',
    exportPath: 'Wellbeing reports, check-in summaries, progress trend views.',
    pwaOfflineCapability: 'Check-in forms available offline; submissions queued for sync.',
    variantId: 'patientMonitoring',
    safetyWarning:
      'This system must NOT be used for real clinical diagnosis or treatment without qualified medical oversight. All health data requires appropriate encryption and legal compliance.',
  },
  {
    id: 'coachTraining',
    label: 'Coach Training — Coach Dashboard + Trainee PWA',
    dashboardName: 'Coach/Manager Dashboard',
    pwaName: 'Trainee PWA',
    dashboardRole: 'Coach / Training Manager',
    pwaRole: 'Trainee / New Starter',
    relationship:
      'Dashboard creates induction plans, assigns tasks, monitors trainee progress, and signs off completions. Trainee PWA delivers assigned tasks, collects acknowledgements, and records completion.',
    stateIsolation:
      'Coach state holds trainee roster, induction plans, task library, completion records. Trainee state holds assigned tasks, completion status, acknowledgements.',
    syncPoint: 'Task completions and acknowledgements sync to coach dashboard.',
    exportPath: 'Induction completion reports, trainee progress summaries.',
    pwaOfflineCapability: 'Assigned task list and acknowledgement forms cached locally.',
    variantId: 'coachTrainingDashboard',
  },
  {
    id: 'therapist',
    label: 'Therapist — Therapist Dashboard + Patient/Client PWA',
    dashboardName: 'Therapist Dashboard',
    pwaName: 'Patient/Client PWA',
    dashboardRole: 'Therapist / Practitioner',
    pwaRole: 'Patient / Client',
    relationship:
      'Dashboard receives pre-session notes, mood logs, and wellbeing check-ins. Therapist reviews progress between sessions. Patient PWA allows self-guided check-ins, journaling, and session preparation.',
    stateIsolation:
      'Therapist state holds client roster, session notes (local), review queue, wellbeing log feed. Client state holds personal check-ins, journal entries, mood history.',
    syncPoint: 'Client check-ins and pre-session notes sync to therapist dashboard on submission.',
    exportPath: 'Progress summaries, session preparation notes (anonymised exports only).',
    pwaOfflineCapability: 'Check-in and journal forms available offline; queued for sync.',
    variantId: 'therapistDashboardPatientPwa',
    safetyWarning:
      'This system must NOT replace qualified therapeutic care. All client data must be encrypted and handled under applicable data protection laws.',
  },
  {
    id: 'generic',
    label: 'Generic Dashboard + PWA Pattern (Custom Variant)',
    dashboardName: 'Admin/Professional Dashboard',
    pwaName: 'End-User PWA',
    dashboardRole: 'Administrator / Manager',
    pwaRole: 'End User / Field Operative',
    relationship:
      'Dashboard manages, monitors, and receives data from the connected PWA. Roles, responsibilities, and data ownership defined by the product variant.',
    stateIsolation:
      'Dashboard state and PWA state are fully separated. No shared store.',
    syncPoint: 'User actions in PWA sync to dashboard on submission or on network availability.',
    exportPath: 'Key data reports available from dashboard.',
    pwaOfflineCapability: 'Core PWA functionality available offline with sync queue.',
    variantId: 'customProduct',
  },
];

export const getPatternById  = (id) => DASHBOARD_PWA_PATTERNS.find((p) => p.id === id) || null;
export const getAllPatternIds = () => DASHBOARD_PWA_PATTERNS.map((p) => p.id);
export const getPatternLabels = () => DASHBOARD_PWA_PATTERNS.map((p) => ({ id: p.id, label: p.label }));
