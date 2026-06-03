// 4P3X UI Component Planner — RUN 4

const REQUIRED_UI_STATES = ['empty', 'loading', 'error', 'success', 'validation_warning', 'permission_restricted'];

const TYPE_PAGES = {
  lms:           ['Learning', 'CourseBuilder', 'LessonDetail', 'ProgressTracker', 'QuizEngine', 'CertificateGenerator', 'LearningAdmin'],
  fleet:         ['FleetDashboard', 'VehicleDetail', 'RouteConfig', 'ComplianceReports', 'FleetAdmin'],
  projectOS:     ['ProjectRegistry', 'RunTracker', 'PromptVault', 'ErrorCentre', 'RepoTracker'],
  saas:          ['Onboarding', 'TeamManagement', 'BillingSubscription', 'UsageReports', 'AppSettings'],
  ecommerce:     ['ProductCatalogue', 'ProductDetail', 'Cart', 'Checkout', 'OrderHistory', 'Fulfilment'],
  crm:           ['ContactList', 'ContactDetail', 'Pipeline', 'ActivityFeed', 'CrmReports'],
  healthTracker: ['HealthDashboard', 'MetricLogger', 'GoalTracker', 'HealthReports'],
  eventPlatform: ['EventList', 'EventDetail', 'RegistrationForm', 'Schedule', 'SpeakerProfiles'],
  portfolioPlatform: ['PortfolioHome', 'ProjectShowcase', 'AboutPage', 'ContactForm'],
  cybersecurity: ['AssessmentDashboard', 'EvidenceLogger', 'ReportBuilder', 'ComplianceMatrix'],
  customProductSystem: ['ProductHome', 'CustomModule', 'CustomAdmin'],
  foundation:    [],
};

const TYPE_COMPONENTS = {
  lms:           ['CourseCard', 'LessonCard', 'ProgressBar', 'QuizQuestion', 'CertificateBadge', 'EnrolmentButton'],
  fleet:         ['VehicleCard', 'RouteMap', 'ComplianceBadge', 'StatusIndicator', 'FleetFilter'],
  projectOS:     ['ProjectCard', 'RunCard', 'PromptCard', 'ErrorCard', 'BuildTimeline'],
  saas:          ['PlanCard', 'TeamMemberRow', 'UsageChart', 'BillingAlert', 'OnboardingStep'],
  ecommerce:     ['ProductCard', 'CartItem', 'PriceDisplay', 'StockBadge', 'CheckoutSummary'],
  crm:           ['ContactCard', 'PipelineStage', 'ActivityItem', 'DealCard'],
  healthTracker: ['MetricCard', 'GoalProgress', 'HealthChart', 'WeeklyLog'],
  eventPlatform: ['EventCard', 'RegistrationForm', 'ScheduleItem', 'SpeakerCard'],
  portfolioPlatform: ['ProjectCard', 'SkillBadge', 'ContactButton', 'ShowcaseGrid'],
  cybersecurity: ['AssessmentCard', 'EvidenceItem', 'ComplianceRow', 'RiskBadge'],
  customProductSystem: ['FeatureCard', 'CustomTable', 'ActionPanel'],
  foundation:    [],
};

const TYPE_LAYOUTS = {
  lms:           ['LearningShell', 'CourseSidebar', 'ProgressLayout'],
  fleet:         ['FleetShell', 'MapLayout', 'ReportLayout'],
  projectOS:     ['ProjectShell', 'RunSidebar', 'VaultLayout'],
  saas:          ['DashboardShell', 'SettingsLayout', 'OnboardingLayout'],
  ecommerce:     ['ShopShell', 'CheckoutLayout', 'CatalogueLayout'],
  crm:           ['CrmShell', 'PipelineLayout', 'ContactLayout'],
  healthTracker: ['HealthShell', 'MetricLayout'],
  eventPlatform: ['EventShell', 'ScheduleLayout'],
  portfolioPlatform: ['PortfolioShell', 'ShowcaseLayout'],
  cybersecurity: ['SecurityShell', 'AssessmentLayout'],
  customProductSystem: ['ProductShell'],
  foundation:    ['AppShell'],
};

export function planPages(blueprint) {
  const type = blueprint?.productType || 'foundation';
  const extra = blueprint?.mainUserFlows?.map(f => f.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')) || [];
  const base  = TYPE_PAGES[type] || TYPE_PAGES.customProductSystem;
  return [...new Set([...base, ...extra.slice(0, 5)])];
}

export function planComponents(blueprint) {
  const type = blueprint?.productType || 'foundation';
  return TYPE_COMPONENTS[type] || TYPE_COMPONENTS.customProductSystem;
}

export function planLayouts(blueprint) {
  const type = blueprint?.productType || 'foundation';
  return TYPE_LAYOUTS[type] || TYPE_LAYOUTS.customProductSystem;
}

export function planRequiredUiStates(blueprint) {
  const type       = blueprint?.productType || '';
  const safetyLevel = blueprint?.safetyLevel || 'standard';
  const stateMode  = blueprint?.stateMode || 'local';

  const states = [...REQUIRED_UI_STATES];

  if (stateMode === 'hybrid' || stateMode === 'supabase_future') states.push('offline');
  if (safetyLevel === 'safety_critical') states.push('safety_warning');
  if (['fleet', 'medical', 'cybersecurity'].includes(type)) states.push('safety_warning', 'offline');

  return [...new Set(states)];
}

export function detectMissingUxStates(blueprint) {
  const required  = planRequiredUiStates(blueprint);
  const declared  = blueprint?.mainUserFlows || [];
  const missing   = [];

  for (const state of required) {
    const stateFound = declared.some(f => f.toLowerCase().includes(state.replace('_', ' ').toLowerCase()));
    if (!stateFound) {
      missing.push({ state, message: `UX flow for "${state}" state is not declared in blueprint user flows.` });
    }
  }
  return missing;
}
