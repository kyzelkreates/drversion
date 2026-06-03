// 4P3X Reusable Base Structure™
// Initial State — Single Source of Truth Foundation
// RUN 1 + RUN 2 + RUN 3

export const createInitialState = () => ({
  app: {
    name: '4P3X Reusable Base Structure\u2122',
    poweredBy: '4P3X Intelligent AI',
    createdBy: 'Kyzel Kreates',
    ecosystem: '4P3X Verse',
    version: '1.0.0',
    mode: 'local-first',
  },

  activeVariant: {
    id: 'base',
    name: 'Reusable Base',
    type: 'foundation',
  },

  modules: {
    // RUN 1 active
    dashboard:               { enabled: true },
    modules:                 { enabled: true },
    variantProfile:          { enabled: true },
    aiConfig:                { enabled: true },
    settings:                { enabled: true },
    // RUN 2 active
    blueprintEngine:         { enabled: true },
    transformationReadiness: { enabled: true },
    blueprintDetail:         { enabled: true },
    // RUN 3 active
    aiAgents:                { enabled: true },
    agentWorkbench:          { enabled: true },
    agentRecommendations:    { enabled: true },
    // Reserved future runs
    learning:     { enabled: false },
    projects:     { enabled: false },
    fleet:        { enabled: false },
    monitoring:   { enabled: false },
    admin:        { enabled: false },
    reports:      { enabled: false },
    integrations: { enabled: false },
  },

  preferences: {
    theme: 'dark',
    accentStyle: 'metallic',
  },

  health: {
    storage:    'ready',
    apiConfig:  'not_configured',
    aiConfig:   'not_configured',
    backend:    'not_connected',
    pwa:        'ready',
    agentSystem:'ready',
  },

  aiSettings: {
    provider:         'none',
    model:            '',
    apiKeyConfigured: false,
    apiKeyMasked:     '',
    baseUrl:          '',
    testStatus:       'not_tested',
    lastTestedAt:     null,
    enabledAgents: {
      apiConfigAgent: true,
    },
    disabledAgents:   [],
    localOnlyMode:    true,
  },

  // RUN 2
  blueprints: {
    items:             [],
    activeBlueprintId: null,
    lastExportedAt:    null,
    importStatus:      'not_started',
  },

  transformation: {
    selectedPresetId:          'base',
    readinessScore:            0,
    readinessLevel:            'not_ready',
    missingRequirements:       [],
    recommendedNextRun:        'Run 3',
    lockedFoundation:          true,
    allowDestructiveTransform: false,
  },

  // RUN 3
  agentSystem: {
    status:          'ready',
    mode:            'local-advisory',
    externalAiEnabled:  false,
    autonomyEnabled:    false,
    lastRunAt:          null,
    activeAgentId:      null,
    recommendationQueue: [],
    agentRuns:          [],
    permissions: {
      allowFileEdits:           false,
      allowExternalApiCalls:    false,
      allowDestructiveActions:  false,
      requireUserApproval:      true,
    },
    safety: {
      enforceNoAutonomy:          true,
      enforceNoSecretsInOutput:   true,
      enforceNoDestructiveActions: true,
      enforceNoDemoLanguage:      true,
    },
  },

  transformationCompiler: {
    status:                  'ready',
    selectedBlueprintId:     null,
    activePlanId:            null,
    compileMode:             'non_destructive',
    allowFileWrites:         false,
    allowOverwrite:          false,
    allowDestructiveRefactor: false,
    lastCompiledAt:          null,
    plans:                   [],
    locks: {
      preserveRun1:             true,
      preserveRun2:             true,
      preserveRun3:             true,
      preserveStorageSSOT:      true,
      preventDuplicateState:    true,
      preventExternalApiCalls:  true,
      preventSecretExposure:    true,
      preventDemoLanguage:      true,
      preventDestructiveRefactor: true,
      requireValidatedBlueprint: true,
      requireReadinessCheck:    true,
      requireUserReview:        true,
    },
    safety: {
      compileRequiresValidatedBlueprint: true,
      compileRequiresReadinessCheck:     true,
      compileRequiresDependencyMap:      true,
      compileRequiresUserReview:         true,
      compileDoesNotWriteFiles:          true,
    },
  },


  // ── Run 5: Variant Build Launcher ─────────────────────────────────
  variantLauncher: {
    status:                     'ready',
    selectedTransformationPlanId: null,
    activeGeneratedPromptId:    null,
    launchMode:                 'manual_copy_paste',
    autoExecutePrompts:         false,
    allowVariantBuildExecution: false,
    generatedPrompts:           [],
    promptHistory:              [],
    launchReadiness: {
      ready:                   false,
      blockers:                [],
      warnings:                [],
      nextRecommendedAction:   '',
    },
    locks: {
      requireTransformationPlan:    true,
      requireReadyPlan:             true,
      requireManualCopyPaste:       true,
      preventAutoExecution:         true,
      preventBaseOverwrite:         true,
      preventCrossRunDrift:         true,
      preventFeatureCreep:          true,
      preventDemoLanguage:          true,
      preventSecretExposure:        true,
    },
  },

  // ── Run 6: Variant Workspace Manager ───────────────────────────────
  variantWorkspaces: {
    status:            'ready',
    activeWorkspaceId: null,
    workspaces:        [],
    workspaceHistory:  [],
    comparison: {
      selectedWorkspaceIds: [],
      lastComparedAt:       null,
    },
    locks: {
      preventWorkspaceCrossContamination: true,
      preventBaseMutation:                true,
      preventAutoBuildExecution:          true,
      preventPromptAutoExecution:         true,
      preventSecretExposure:              true,
      preventDemoLanguage:                true,
      requireLinkedBlueprint:             true,
      requireLinkedTransformationPlan:    true,
      requireManualReviewBeforeBuild:     true,
    },
  },

  // ── Run 7: Export / Handoff / Deployment Preparation Layer ──────────
  exportSystem: {
    status: 'ready',
    activeExportPackId: null,
    exportPacks: [],
    exportHistory: [],
    selectedBuilderTool: 'base44',
    deploymentReadiness: {
      overallStatus: 'not_checked',
      pwaReady: false,
      githubReady: false,
      vercelReady: false,
      envSafe: false,
      noSecretsPassed: false,
      blockers: [],
      warnings: [],
    },
    locks: {
      preventSecretExport: true,
      preventBackendSecretExposure: true,
      preventAutoDeployment: true,
      preventAutoGitPush: true,
      preventAutoVercelConnect: true,
      preventGeneratedFileWrites: true,
      preventPromptExecution: true,
      preventDemoLanguage: true,
      requireManualHandoff: true,
      requireExportSanitisation: true,
    },
  },


  // ── Run 8: Final Audit + Production Hardening + Transformation Readiness Lock ──
  finalAudit: {
    status: 'not_run',
    lastRunAt: null,
    overallScore: 0,
    readinessLevel: 'not_ready',
    baseReadyForVariants: false,
    exportReady: false,
    zipHandoffReady: false,
    auditRuns: [],
    latestFindings: [],
    blockers: [],
    warnings: [],
    passedChecks: [],
    failedChecks: [],
    finalLock: {
      status: 'unlocked',
      lockedAt: null,
      lockedBy: 'final_audit',
      canStartVariantBuilds: false,
      reason: 'Final audit has not passed yet.',
    },
    hardening: {
      ssotVerified: false,
      routesVerified: false,
      modulesVerified: false,
      secretsCleared: false,
      noDemoLanguageVerified: false,
      agentsSafe: false,
      transformationSafe: false,
      promptsSafe: false,
      workspacesSafe: false,
      exportsSafe: false,
      dashboardPwaReady: false,
      pwaReady: false,
    },
    locks: {
      preventVariantBuildIfAuditFails: true,
      preventExportIfSecretsDetected: true,
      preventTransformationIfBlockersExist: true,
      preventGeneratedFileWrites: true,
      preventPromptAutoExecution: true,
      preventExternalApiAutoCalls: true,
      preventDemoLanguage: true,
      preserveStorageSSOT: true,
      preserveReusableBase: true,
    },
  },


  basePackage: {
    status: 'not_checked',
    activePackageId: null,
    packages: [],
    latestManifest: null,
    latestValidation: null,
    zipReady: false,
    builderAttachmentReady: false,
    locks: {
      preventSecretPackaging: true,
      preventNodeModulesPackaging: true,
      preventEnvPackaging: true,
      preventBuildCachePackaging: true,
      preventVariantContamination: true,
      preventDemoLanguage: true,
      requireFinalAuditPass: true,
      requirePackageValidation: true,
      requireManualZipOnly: true,
    },
  },

  masterLauncher: {
    status: 'ready',
    selectedVariantType: '',
    selectedDashboardPwaPattern: '',
    generatedMasterPrompts: [],
    activeMasterPromptId: null,
    finalBaseComplete: false,
    readyToBuildVariants: false,
    locks: {
      preventMoreBaseFeatureRuns: true,
      preventMultiVariantBuildInOneRun: true,
      preventVariantBuildInsideBase: true,
      requireBasePackageReady: true,
      requireFinalAuditLock: true,
      requireManualVariantPromptUse: true,
      preventSecretExposure: true,
      enforceBranding: true,
      enforceDashboardPwaPattern: true,
    },
  },

  audit: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
});

export default createInitialState;
