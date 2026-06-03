// 4P3X File Permission Compiler — Run 5
// Compiles file permission boundaries, protected file detection, and do-not-touch rules.
// Does not execute builds. Does not write files.

const ALWAYS_PROTECTED = [
  { path: 'src/state/storage.js', reason: 'SSOT — only controlled additive extension allowed', risk: 'critical' },
  { path: 'src/state/initialState.js', reason: 'State schema — only additive extension allowed', risk: 'critical' },
  { path: 'src/config/appConfig.js', reason: 'App identity config — only identity extension allowed', risk: 'high' },
  { path: 'src/config/variantConfig.js', reason: 'Variant config — do not overwrite', risk: 'high' },
  { path: 'src/app/App.jsx', reason: 'App root — only route additions allowed', risk: 'high' },
  { path: 'src/app/routes.js', reason: 'Route registry — only additive route entries allowed', risk: 'high' },
  { path: 'src/components/layout/AppShell.jsx', reason: 'Layout shell — Run 1 foundation', risk: 'high' },
  { path: 'src/components/layout/Sidebar.jsx', reason: 'Sidebar — driven by moduleRegistry only', risk: 'high' },
  { path: '.env', reason: 'Environment secrets', risk: 'critical' },
  { path: '.env.local', reason: 'Local environment secrets', risk: 'critical' },
  { path: '.env.production', reason: 'Production environment secrets', risk: 'critical' },
  { path: 'public/manifest.json', reason: 'PWA manifest — only extend with care', risk: 'medium' },
];

const RUN_HISTORY_PROTECTED = [
  { path: 'src/logic/agents/', reason: 'Run 3 agent system', risk: 'high' },
  { path: 'src/logic/transformer/', reason: 'Run 4 transformation compiler', risk: 'high' },
  { path: 'src/logic/launcher/', reason: 'Run 5 launch system', risk: 'high' },
  { path: 'src/components/agents/', reason: 'Run 3 agent components', risk: 'high' },
  { path: 'src/components/transformer/', reason: 'Run 4 transformer components', risk: 'high' },
  { path: 'src/components/launcher/', reason: 'Run 5 launcher components', risk: 'high' },
  { path: 'src/pages/AiAgents.jsx', reason: 'Run 3', risk: 'high' },
  { path: 'src/pages/AgentWorkbench.jsx', reason: 'Run 3', risk: 'high' },
  { path: 'src/pages/AgentRecommendations.jsx', reason: 'Run 3', risk: 'high' },
  { path: 'src/pages/BlueprintEngine.jsx', reason: 'Run 2', risk: 'high' },
  { path: 'src/pages/BlueprintDetail.jsx', reason: 'Run 2', risk: 'high' },
  { path: 'src/pages/TransformationReadiness.jsx', reason: 'Run 2', risk: 'high' },
  { path: 'src/pages/TransformationCompiler.jsx', reason: 'Run 4', risk: 'high' },
  { path: 'src/pages/ProductSkeletonGenerator.jsx', reason: 'Run 4', risk: 'high' },
  { path: 'src/pages/TransformationPlanDetail.jsx', reason: 'Run 4', risk: 'high' },
  { path: 'src/pages/VariantBuildLauncher.jsx', reason: 'Run 5', risk: 'high' },
  { path: 'src/pages/RunPromptGenerator.jsx', reason: 'Run 5', risk: 'high' },
  { path: 'src/pages/GeneratedPromptDetail.jsx', reason: 'Run 5', risk: 'high' },
];

export function compileFilePermissions(runScope) {
  return {
    allowed: runScope.allowedFiles || [],
    forbidden: runScope.forbiddenFiles || [],
    protected: ALWAYS_PROTECTED,
    previousRunProtected: RUN_HISTORY_PROTECTED,
    doNotTouchRules: enforceDoNotTouchRules(runScope),
    explanation: explainFilePermissionBoundaries(runScope),
  };
}

export function detectProtectedFileRisks(runScope) {
  const risks = [];
  const { allowedFiles = [] } = runScope;

  for (const pf of ALWAYS_PROTECTED) {
    const isAllowed = allowedFiles.some((af) =>
      af.toLowerCase().includes(pf.path.toLowerCase().replace(' (extend only)', '').replace(' (structural rewrite)', ''))
    );
    if (isAllowed && pf.risk === 'critical') {
      risks.push({
        file: pf.path,
        risk: pf.risk,
        reason: pf.reason,
        warning: 'This file is in the allowed list but marked critical — ensure only additive changes are made.',
      });
    }
  }

  return risks;
}

export function enforceDoNotTouchRules(runScope) {
  const { forbiddenFiles = [] } = runScope;
  const rules = [];

  const allProtected = [...ALWAYS_PROTECTED, ...RUN_HISTORY_PROTECTED];
  for (const pf of allProtected) {
    const isForbidden = forbiddenFiles.some((ff) =>
      ff.toLowerCase().includes(pf.path.toLowerCase())
    );
    rules.push({
      file: pf.path,
      enforced: isForbidden || pf.risk === 'critical',
      reason: pf.reason,
      risk: pf.risk,
    });
  }

  return rules;
}

export function explainFilePermissionBoundaries(runScope) {
  const { allowedFiles = [], forbiddenFiles = [] } = runScope;
  return [
    `This run may touch ${allowedFiles.length} file(s)/path(s).`,
    `This run must not touch ${forbiddenFiles.length} file(s)/path(s).`,
    'Protected baseline files (storage.js, initialState.js, appConfig.js) may only be extended additively.',
    'Run 1-5 files not in the allowed list must not be modified.',
    'No environment secrets may be read, written, or exposed.',
    'No backend secret handlers may be touched.',
  ];
}
