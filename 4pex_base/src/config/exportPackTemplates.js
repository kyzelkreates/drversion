// 4P3X Export Pack Templates — Run 7

export const EXPORT_PACK_TEMPLATES = {
  reusableBaseHandoff: {
    id: 'reusableBaseHandoff', label: 'Reusable Base Handoff', type: 'base_handoff',
    description: 'Exports the complete 4P3X Reusable Base Structure™ for handoff to a builder tool or deployment environment.',
    requiredLinkedAssets: [], requiredChecklists: ['pwa', 'github', 'env'],
    requiredInstructions: ['project identity', 'allowed files', 'forbidden files', 'stop conditions', 'rollback guidance'],
    requiredSafetyRules: ['no secrets', 'no auto-deployment', 'SSOT preserved'],
    expectedOutput: 'Complete reusable base handoff pack with deployment readiness checklist.',
  },
  selectedVariantHandoff: {
    id: 'selectedVariantHandoff', label: 'Selected Variant Handoff', type: 'variant_handoff',
    description: 'Exports a specific product variant workspace including transformation plan, generated prompts, and build progress.',
    requiredLinkedAssets: ['workspace', 'blueprint', 'transformationPlan'],
    requiredChecklists: ['pwa', 'github', 'env', 'vercel'],
    requiredInstructions: ['product type', 'run sequence', 'linked prompts', 'stop conditions', 'rollback guidance'],
    requiredSafetyRules: ['no secrets', 'workspace isolation', 'manual execution only'],
    expectedOutput: 'Variant handoff pack linking workspace, plan, and prompts with deployment readiness.',
  },
  dashboardPwaVariantHandoff: {
    id: 'dashboardPwaVariantHandoff', label: 'Dashboard + Connected PWA Handoff', type: 'variant_handoff',
    description: 'Exports a variant that includes both a professional dashboard and a connected role-specific PWA.',
    requiredLinkedAssets: ['workspace', 'blueprint', 'transformationPlan'],
    requiredChecklists: ['pwa', 'github', 'vercel', 'env'],
    requiredInstructions: ['dashboard role', 'PWA role', 'monitoring relationship', 'state separation', 'optional Supabase sync later'],
    requiredSafetyRules: ['no secrets', 'state separation enforced', 'no cross-variant contamination'],
    expectedOutput: 'Dashboard + PWA structure plan with deployment readiness and handoff instructions.',
  },
  deploymentPreparation: {
    id: 'deploymentPreparation', label: 'Deployment Preparation Pack', type: 'deployment_preparation',
    description: 'Prepares the app for deployment with PWA, GitHub, Vercel, and environment readiness checks.',
    requiredLinkedAssets: [], requiredChecklists: ['pwa', 'github', 'vercel', 'env', 'generic'],
    requiredInstructions: ['.env.example content', 'build command', 'output directory', 'deployment steps'],
    requiredSafetyRules: ['no backend secrets in frontend env', 'no secrets committed to repo'],
    expectedOutput: 'Deployment readiness report and .env.example with placeholders only.',
  },
  builderToolUpgradePack: {
    id: 'builderToolUpgradePack', label: 'Builder Tool Upgrade Pack', type: 'builder_tool_pack',
    description: 'Prepares instructions and context for upgrading the reusable base using a specific builder tool.',
    requiredLinkedAssets: ['blueprint'], requiredChecklists: ['generic'],
    requiredInstructions: ['builder tool steps', 'allowed actions', 'forbidden actions', 'stop conditions'],
    requiredSafetyRules: ['fix-only mode', 'no overwrite of working systems'],
    expectedOutput: 'Builder tool handoff instructions with scope, stop conditions, and rollback guidance.',
  },
  finalAuditPack: {
    id: 'finalAuditPack', label: 'Final Audit Pack', type: 'base_handoff',
    description: 'Exports a complete audit of the reusable base structure covering all runs, state, routes, modules, and safety.',
    requiredLinkedAssets: [], requiredChecklists: ['pwa', 'github', 'vercel', 'env', 'generic'],
    requiredInstructions: ['run audit', 'state audit', 'SSOT audit', 'secret audit', 'route audit'],
    requiredSafetyRules: ['all locks enforced', 'no demo language', 'no secrets', 'build passes'],
    expectedOutput: 'Full system audit report confirming production readiness for variant builds.',
  },
};

export function getExportPackTemplate(templateId) {
  return EXPORT_PACK_TEMPLATES[templateId] || null;
}

export function getAllExportPackTemplates() {
  return Object.values(EXPORT_PACK_TEMPLATES);
}

export default EXPORT_PACK_TEMPLATES;
