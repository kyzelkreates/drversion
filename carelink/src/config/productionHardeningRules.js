// 4P3X Production Hardening Rules — Run 8

export const PRODUCTION_HARDENING_RULES = [
  { id: 'ssot_only_persistence',      label: 'SSOT-Only Persistence',          description: 'All state writes must go through storage.js. No direct localStorage calls from components.',  severity: 'critical', blocking: true,  appliesTo: ['storage', 'components'] },
  { id: 'no_component_localstorage',  label: 'No Component localStorage Writes', description: 'Components must not call localStorage.setItem directly.',                                     severity: 'critical', blocking: true,  appliesTo: ['components'] },
  { id: 'safe_import_export',         label: 'Safe Import/Export',              description: 'All import and export flows must validate input and sanitise output.',                          severity: 'critical', blocking: true,  appliesTo: ['export', 'import'] },
  { id: 'no_raw_secrets',             label: 'No Raw Secrets',                  description: 'API keys and backend secrets must never appear as real values in frontend state or exports.',  severity: 'critical', blocking: true,  appliesTo: ['state', 'export', 'prompts'] },
  { id: 'no_backend_secrets_frontend',label: 'No Backend Secrets in Frontend',  description: 'SUPABASE_SERVICE_ROLE_KEY and similar backend-only secrets must not be required by the base.', severity: 'critical', blocking: true,  appliesTo: ['config', 'state'] },
  { id: 'no_auto_external_api',       label: 'No Automatic External API Calls', description: 'No external API call (AI, Supabase, Stripe, etc.) may fire automatically without user action.', severity: 'critical', blocking: true,  appliesTo: ['agents', 'automation'] },
  { id: 'no_auto_deployment',         label: 'No Automatic Deployment',         description: 'No CI/CD, deploy script, or push must execute automatically from the base app.',               severity: 'critical', blocking: true,  appliesTo: ['export', 'deployment'] },
  { id: 'no_generated_file_writes',   label: 'No Generated File Writes',        description: 'Skeleton plans and transformation plans must not write files to the live app folder.',          severity: 'critical', blocking: true,  appliesTo: ['transformation', 'skeleton'] },
  { id: 'no_prompt_auto_execution',   label: 'No Prompt Auto-Execution',        description: 'Generated prompts must never execute automatically. Manual copy-paste only.',                  severity: 'critical', blocking: true,  appliesTo: ['prompts'] },
  { id: 'no_autonomous_agents',       label: 'No Autonomous Agent Behaviour',   description: 'Agents must remain advisory. No agent may independently write, deploy, or call APIs.',         severity: 'critical', blocking: true,  appliesTo: ['agents'] },
  { id: 'no_destructive_transform',   label: 'No Destructive Transformation',   description: 'Transformation must be non-destructive. Planning only — no live code rewriting.',             severity: 'critical', blocking: true,  appliesTo: ['transformation'] },
  { id: 'route_module_alignment',     label: 'Route/Module Registry Alignment', description: 'Every active module must have a registered route and a matching page component.',             severity: 'warning',  blocking: false, appliesTo: ['routes', 'modules'] },
  { id: 'dashboard_pwa_architecture', label: 'Dashboard + PWA Architecture',    description: 'Every variant pattern must support a professional dashboard and a connected PWA.',             severity: 'warning',  blocking: false, appliesTo: ['architecture'] },
  { id: 'pwa_readiness',             label: 'PWA Readiness',                   description: 'PWA manifest must exist with required fields and responsive layout must be confirmed.',          severity: 'warning',  blocking: false, appliesTo: ['pwa'] },
  { id: 'final_audit_lock_enforced', label: 'Final Audit Lock Enforced',        description: 'The transformation readiness lock must block variant builds until the audit passes.',          severity: 'critical', blocking: true,  appliesTo: ['audit', 'lock'] },
  { id: 'no_demo_language',          label: 'No Demo Language in Product Areas', description: 'Product-facing text must not use demo/mock/fake/dummy/toy wording.',                          severity: 'warning',  blocking: false, appliesTo: ['ui', 'content'] },
];

export const BLOCKING_HARDENING_RULES  = PRODUCTION_HARDENING_RULES.filter(r => r.blocking);
export const WARNING_HARDENING_RULES   = PRODUCTION_HARDENING_RULES.filter(r => !r.blocking);

export function getHardeningRule(id) {
  return PRODUCTION_HARDENING_RULES.find(r => r.id === id) || null;
}
