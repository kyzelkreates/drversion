// 4P3X Prompt Safety Rules — Run 5
// Defines all safety checks applied to generated run prompts.
// These rules prevent destructive, autonomous, or unsafe prompts from being exported.

export const PROMPT_SAFETY_RULES = [
  {
    id: 'no_base_overwrite',
    label: 'No Base Overwrite',
    description: 'The prompt must not instruct the agent to overwrite Run 1, Run 2, Run 3, Run 4, or Run 5 systems.',
    severity: 'critical',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /overwrite.*run\s*[1-5]/i,
      /replace.*storage\.js/i,
      /delete.*run\s*[1-5]/i,
      /remove.*existing.*runs/i,
      /rewrite.*storage\.js/i,
      /replace.*initialState/i,
      /rebuild.*app.*from.*scratch/i,
    ],
  },
  {
    id: 'no_duplicate_ssot',
    label: 'No Duplicate SSOT',
    description: 'The prompt must not instruct creation of a second state management system.',
    severity: 'critical',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /create.*new.*state.*system/i,
      /replace.*storage\.js.*with/i,
      /use.*redux/i,
      /use.*zustand/i,
      /use.*mobx/i,
      /create.*context.*provider.*for.*all/i,
      /global.*state.*store.*instead/i,
    ],
  },
  {
    id: 'no_direct_localstorage',
    label: 'No Direct localStorage Mutation',
    description: 'The prompt must not instruct components to directly read/write localStorage.',
    severity: 'high',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /localstorage\.setitem/i,
      /localstorage\.removeitem/i,
      /localstorage\.clear\(\)/i,
      /window\.localstorage\./i,
    ],
  },
  {
    id: 'no_hidden_backend',
    label: 'No Hidden Backend Assumptions',
    description: 'The prompt must not assume a backend exists unless the product type includes a backend run.',
    severity: 'high',
    appliesToProductTypes: ['learningPlatform', 'projectControlOS', 'fleetDashboard', 'monitoringDashboard', 'clientPortal', 'adminDashboard', 'aiAnalysisPlatform', 'employeeInductionPlatform', 'localFirstPWAProduct', 'customProductSystem'],
    blocking: true,
    detectionPatterns: [
      /call.*the.*backend/i,
      /send.*to.*server/i,
      /post.*request.*to.*api/i,
      /fetch.*from.*endpoint/i,
      /use.*express/i,
      /use.*fastapi/i,
      /use.*django/i,
    ],
  },
  {
    id: 'no_secret_exposure',
    label: 'No Backend Secret Exposure',
    description: 'The prompt must not include or instruct inclusion of backend secrets, service role keys, or private API keys.',
    severity: 'critical',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /service_role/i,
      /supabase_service_key/i,
      /secret_key\s*=/i,
      /api_secret\s*=/i,
      /private_key\s*=/i,
      /sk-[a-zA-Z0-9]{20,}/,
      /eyJ[a-zA-Z0-9._-]{20,}/,
    ],
  },
  {
    id: 'no_auto_api_calls',
    label: 'No Automatic External API Calls',
    description: 'The prompt must not instruct automatic external API calls without user consent or explicit configuration.',
    severity: 'critical',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /automatically.*call.*openai/i,
      /auto.*fetch.*from.*api/i,
      /call.*ai.*api.*on.*load/i,
      /trigger.*external.*api.*automatically/i,
    ],
  },
  {
    id: 'no_autonomous_agents',
    label: 'No Autonomous Destructive Agents',
    description: 'The prompt must not create agents that autonomously modify files, call APIs, or execute destructive actions.',
    severity: 'critical',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /agent.*automatically.*edits.*files/i,
      /agent.*calls.*api.*without.*approval/i,
      /autonomous.*file.*modification/i,
      /self.*modifying.*code/i,
      /agent.*runs.*without.*user/i,
    ],
  },
  {
    id: 'no_product_variant_drift',
    label: 'No Product Variant Drift',
    description: 'The prompt must not instruct building features from multiple product variants at once.',
    severity: 'high',
    appliesToProductTypes: 'all',
    blocking: false,
    detectionPatterns: [
      /build.*lms.*and.*crm.*together/i,
      /add.*all.*product.*types/i,
      /include.*fleet.*and.*learning/i,
    ],
  },
  {
    id: 'no_cross_run_mutation',
    label: 'No Cross-Run Mutation',
    description: 'The prompt must not instruct mutations to files or state from a different designated run.',
    severity: 'high',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /modify.*run\s*[1-4].*files/i,
      /edit.*agentworkbench/i,
      /change.*transformation.*compiler.*core/i,
      /overwrite.*variant.*launcher/i,
    ],
  },
  {
    id: 'no_feature_creep',
    label: 'No Feature Creep',
    description: 'The prompt must not introduce features outside the defined run scope.',
    severity: 'medium',
    appliesToProductTypes: 'all',
    blocking: false,
    detectionPatterns: [
      /add.*payment.*processing.*now/i,
      /include.*analytics.*dashboard.*in.*this.*run/i,
      /build.*everything.*in.*one.*run/i,
    ],
  },
  {
    id: 'no_final_build_early',
    label: 'No Final Build Before Selected Run',
    description: 'The prompt must not instruct building the final product variant before its designated run.',
    severity: 'critical',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /build.*final.*product.*now/i,
      /complete.*full.*product.*in.*this.*run/i,
      /skip.*run.*[6-9]/i,
      /build.*all.*runs.*at.*once/i,
    ],
  },
  {
    id: 'no_demo_language',
    label: 'No Demo/Mock/Fake/Dummy/Toy Wording',
    description: 'The prompt must not use demo, mock, fake, dummy, toy, sample-only, or placeholder language.',
    severity: 'medium',
    appliesToProductTypes: 'all',
    blocking: false,
    detectionPatterns: [
      /\bdemo\b/i,
      /\bmock\b/i,
      /\bfake\b/i,
      /\bdummy\b/i,
      /\btoy\b/i,
      /sample.only/i,
      /placeholder.*only/i,
    ],
  },
  {
    id: 'no_proprietary_cloning',
    label: 'No Proprietary Cloning',
    description: 'The prompt must not instruct cloning of proprietary external systems without authorisation.',
    severity: 'high',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /clone.*notion/i,
      /clone.*salesforce/i,
      /replicate.*stripe.*exactly/i,
      /copy.*shopify/i,
      /build.*exact.*copy.*of/i,
    ],
  },
  {
    id: 'no_unsafe_cyber',
    label: 'No Unsafe Cybersecurity Instructions',
    description: 'The prompt must not include instructions that could enable security vulnerabilities or illegal access.',
    severity: 'critical',
    appliesToProductTypes: 'all',
    blocking: true,
    detectionPatterns: [
      /bypass.*authentication/i,
      /disable.*security/i,
      /sql.*injection/i,
      /xss.*attack/i,
      /exploit.*vulnerability/i,
      /brute.*force.*password/i,
      /steal.*credentials/i,
    ],
  },
  {
    id: 'navigation_safety_warning',
    label: 'Navigation Safety Warning Required',
    description: 'Prompts for products with public user navigation must include navigation safety instructions.',
    severity: 'low',
    appliesToProductTypes: ['learningPlatform', 'clientPortal', 'adminDashboard', 'employeeInductionPlatform', 'supabaseHybridSaaS'],
    blocking: false,
    detectionPatterns: [],
    requiresPresenceOf: ['navigation', 'route', 'page guard', 'access control'],
  },
];

export function getRuleById(ruleId) {
  return PROMPT_SAFETY_RULES.find((r) => r.id === ruleId) || null;
}

export function getBlockingRules() {
  return PROMPT_SAFETY_RULES.filter((r) => r.blocking);
}

export function getRulesForProductType(productType) {
  return PROMPT_SAFETY_RULES.filter(
    (r) => r.appliesToProductTypes === 'all' || r.appliesToProductTypes.includes(productType)
  );
}

export default PROMPT_SAFETY_RULES;
