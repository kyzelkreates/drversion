// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// finalVariantOptions.js — Run 10
// Available product variant types for master variant prompt generation.
// These are planning-only options. No variant is built inside the base.

export const FINAL_VARIANT_OPTIONS = [
  {
    id: 'fourPawsLms',
    label: 'Four Paws LMS + Learner PWA',
    productName: 'Four Paws LMS',
    productType: 'Learning Management System + Learner PWA',
    dashboardRole: 'Training Administrator / Content Manager',
    pwaRole: 'Learner / Client',
    monitoringRelationship:
      'Dashboard creates and manages lessons, quizzes, modules, and certificates. Learner PWA delivers content, tracks progress, and syncs completions to dashboard.',
    safetyLevel: 'standard',
    suggestedFirstVariantRun: 'Run 1 — Core LMS Foundation + Learner PWA Shell',
    requiredWarnings: [
      'Do not store raw assessment answers in localStorage long-term.',
      'Certificate generation must happen server-side or be clearly marked as local draft.',
      'Do not mix learner data across separate learner accounts.',
    ],
    recommendedRunCount: 8,
  },
  {
    id: 'fleetControlDashboard',
    label: 'Fleet Control Dashboard + Driver PWA',
    productName: 'Fleet Control',
    productType: 'Fleet Management Dashboard + Driver PWA',
    dashboardRole: 'Fleet Manager / Dispatcher',
    pwaRole: 'Driver / Operative',
    monitoringRelationship:
      'Dashboard monitors vehicle status, driver assignments, route progress, compliance, and trip logs. Driver PWA records trip data, check-ins, and status updates.',
    safetyLevel: 'high',
    suggestedFirstVariantRun: 'Run 1 — Fleet Core + Driver PWA Shell',
    requiredWarnings: [
      'Navigation functionality must use licensed mapping APIs — do not self-host mapping.',
      'Driver location data must be handled with explicit consent and GDPR compliance.',
      'Do not use real GPS coordinates in local-only prototype without consent.',
    ],
    recommendedRunCount: 10,
  },
  {
    id: 'patientMonitoring',
    label: 'Patient Monitoring Dashboard + Patient PWA',
    productName: 'Patient Monitoring',
    productType: 'Clinician Dashboard + Patient PWA',
    dashboardRole: 'Clinician / Healthcare Professional',
    pwaRole: 'Patient / Service User',
    monitoringRelationship:
      'Dashboard receives patient check-ins, wellbeing logs, and progress data. Clinician reviews, responds, and manages alerts. Patient PWA allows daily logging, check-ins, and viewing personal progress.',
    safetyLevel: 'critical',
    suggestedFirstVariantRun: 'Run 1 — Patient Monitoring Core + Patient PWA Shell',
    requiredWarnings: [
      'This system must NOT be used for real clinical diagnosis or treatment decisions without qualified medical oversight.',
      'All health data must be encrypted at rest and in transit.',
      'GDPR and relevant healthcare data regulations must be confirmed with a legal professional before launch.',
      'Emergency escalation flows must be reviewed by a qualified clinician before deployment.',
      'Do not store raw health data in localStorage without encryption.',
    ],
    recommendedRunCount: 12,
  },
  {
    id: 'coachTrainingDashboard',
    label: 'Coach Training Dashboard + Trainee PWA',
    productName: 'Coach Training OS',
    productType: 'Coach/Manager Dashboard + Trainee PWA',
    dashboardRole: 'Coach / Training Manager',
    pwaRole: 'Trainee / New Starter',
    monitoringRelationship:
      'Dashboard creates induction plans, monitors trainee progress, assigns tasks, and signs off completions. Trainee PWA delivers tasks, collects acknowledgements, and records completion.',
    safetyLevel: 'standard',
    suggestedFirstVariantRun: 'Run 1 — Coach Training Core + Trainee PWA Shell',
    requiredWarnings: [
      'Completion sign-offs must not substitute for legally required training certifications.',
      'Do not auto-certify trainees without human review.',
    ],
    recommendedRunCount: 8,
  },
  {
    id: 'therapistDashboardPatientPwa',
    label: 'Therapist Dashboard + Patient/Client PWA',
    productName: 'Therapist Platform',
    productType: 'Therapist Dashboard + Patient/Client PWA',
    dashboardRole: 'Therapist / Practitioner',
    pwaRole: 'Patient / Client',
    monitoringRelationship:
      'Dashboard receives pre-session notes, wellbeing check-ins, and mood logs. Therapist reviews progress between sessions. Patient PWA allows self-guided check-ins, journaling, and session preparation.',
    safetyLevel: 'critical',
    suggestedFirstVariantRun: 'Run 1 — Therapist Platform Core + Patient PWA Shell',
    requiredWarnings: [
      'This system must NOT replace qualified therapeutic care.',
      'Do not use AI-generated responses as clinical advice.',
      'All client data must be encrypted and handled under applicable data protection laws.',
      'Crisis/emergency protocols must be reviewed by a qualified professional before any real use.',
      'Do not store session notes or clinical observations in plain localStorage.',
    ],
    recommendedRunCount: 12,
  },
  {
    id: 'projectControlOS',
    label: 'Project Control OS',
    productName: 'Project Control OS',
    productType: 'Project Management Dashboard',
    dashboardRole: 'Project Manager / Team Lead',
    pwaRole: 'Team Member / Contributor',
    monitoringRelationship:
      'Dashboard manages projects, milestones, tasks, team assignments, and reporting. Team PWA shows assigned work, captures updates, and syncs status to dashboard.',
    safetyLevel: 'standard',
    suggestedFirstVariantRun: 'Run 1 — Project Control Core + Team PWA Shell',
    requiredWarnings: [
      'Do not expose one team member\'s tasks or data to another without role-based access control.',
    ],
    recommendedRunCount: 8,
  },
  {
    id: 'clientPortal',
    label: 'Client Portal',
    productName: 'Client Portal',
    productType: 'Service Provider Dashboard + Client PWA',
    dashboardRole: 'Service Provider / Account Manager',
    pwaRole: 'Client / End Customer',
    monitoringRelationship:
      'Dashboard manages client accounts, documents, proposals, and communications. Client PWA provides a branded self-service view of their account, deliverables, and status.',
    safetyLevel: 'standard',
    suggestedFirstVariantRun: 'Run 1 — Client Portal Core + Client PWA Shell',
    requiredWarnings: [
      'Do not expose one client\'s data to another client.',
      'Proposal/contract features must not substitute for legal review.',
    ],
    recommendedRunCount: 7,
  },
  {
    id: 'adminDashboard',
    label: 'Admin Dashboard',
    productName: 'Admin Dashboard',
    productType: 'Standalone Admin Dashboard',
    dashboardRole: 'System Administrator',
    pwaRole: 'N/A — Dashboard-only variant',
    monitoringRelationship:
      'Standalone admin dashboard for managing users, settings, content, or system configuration. Can connect a PWA in a later run if required.',
    safetyLevel: 'standard',
    suggestedFirstVariantRun: 'Run 1 — Admin Dashboard Core',
    requiredWarnings: [
      'Admin access must be protected with proper authentication.',
      'Do not expose admin routes to non-admin users.',
    ],
    recommendedRunCount: 6,
  },
  {
    id: 'aiAnalysisPlatform',
    label: 'AI Analysis Platform',
    productName: 'AI Analysis Platform',
    productType: 'AI-Assisted Analysis Dashboard + Report PWA',
    dashboardRole: 'Analyst / Researcher',
    pwaRole: 'Report Consumer / Stakeholder',
    monitoringRelationship:
      'Dashboard manages datasets, analysis runs, and AI-generated insights. Report PWA delivers clean summaries and findings to non-technical stakeholders.',
    safetyLevel: 'high',
    suggestedFirstVariantRun: 'Run 1 — AI Analysis Core + Report PWA Shell',
    requiredWarnings: [
      'AI-generated analysis must be clearly labelled as AI-assisted and reviewed by a human before acting on results.',
      'Do not expose raw API keys in the frontend.',
      'Do not auto-execute analysis without user confirmation.',
    ],
    recommendedRunCount: 9,
  },
  {
    id: 'localFirstPwaProduct',
    label: 'Local-First PWA Product',
    productName: 'Local-First PWA',
    productType: 'Standalone Local-First PWA',
    dashboardRole: 'N/A — PWA-first variant',
    pwaRole: 'End User',
    monitoringRelationship:
      'Fully local-first PWA product. No external sync required. Optional admin view or Supabase sync added in a later run if needed.',
    safetyLevel: 'standard',
    suggestedFirstVariantRun: 'Run 1 — Local-First PWA Core',
    requiredWarnings: [
      'Offline data must be protected — do not store sensitive data unencrypted.',
      'Service worker caching must be carefully scoped.',
    ],
    recommendedRunCount: 6,
  },
  {
    id: 'supabaseHybridSaaS',
    label: 'Supabase-Ready Hybrid SaaS',
    productName: 'Supabase Hybrid SaaS',
    productType: 'Local-First Dashboard + Supabase Sync',
    dashboardRole: 'SaaS Admin / Owner',
    pwaRole: 'End User / Customer',
    monitoringRelationship:
      'Dashboard operates locally first with optional Supabase sync for multi-device or multi-user support. PWA operates the same way.',
    safetyLevel: 'high',
    suggestedFirstVariantRun: 'Run 1 — SaaS Core + Local-First Foundation',
    requiredWarnings: [
      'Supabase service role keys must NEVER be exposed in the frontend.',
      'RLS (Row Level Security) must be enabled on all Supabase tables before real user data is stored.',
      'Do not mix Supabase auth and local auth systems without careful design.',
    ],
    recommendedRunCount: 10,
  },
  {
    id: 'customProduct',
    label: 'Custom Product (User-Defined)',
    productName: 'Custom Product',
    productType: 'User-Defined Variant',
    dashboardRole: 'User-Defined',
    pwaRole: 'User-Defined',
    monitoringRelationship:
      'User defines the dashboard and PWA roles, relationship, and product scope in the variant prompt builder.',
    safetyLevel: 'standard',
    suggestedFirstVariantRun: 'Run 1 — Custom Product Core',
    requiredWarnings: [
      'Define clear dashboard and PWA roles before starting.',
      'Do not build multiple variants in one run.',
      'Each custom product must be a separate isolated project.',
    ],
    recommendedRunCount: 8,
  },
];

export const getVariantById = (id) => FINAL_VARIANT_OPTIONS.find((v) => v.id === id) || null;
export const getAllVariantIds  = () => FINAL_VARIANT_OPTIONS.map((v) => v.id);
export const getVariantLabels = () => FINAL_VARIANT_OPTIONS.map((v) => ({ id: v.id, label: v.label }));
