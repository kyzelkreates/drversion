// 4P3X Module Activation Planner — RUN 4

const RUN_MODULE_MAP = {
  // Always active
  dashboard:                { status: 'active',   run: 'Run 1' },
  modules:                  { status: 'active',   run: 'Run 1' },
  variantProfile:           { status: 'active',   run: 'Run 1' },
  aiConfig:                 { status: 'active',   run: 'Run 1' },
  settings:                 { status: 'active',   run: 'Run 1' },
  blueprintEngine:          { status: 'active',   run: 'Run 2' },
  transformationReadiness:  { status: 'active',   run: 'Run 2' },
  blueprintDetail:          { status: 'active',   run: 'Run 2' },
  aiAgents:                 { status: 'active',   run: 'Run 3' },
  agentWorkbench:           { status: 'active',   run: 'Run 3' },
  agentRecommendations:     { status: 'active',   run: 'Run 3' },
  transformationCompiler:   { status: 'active',   run: 'Run 4' },
  productSkeletonGenerator: { status: 'active',   run: 'Run 4' },
  transformationPlanDetail: { status: 'active',   run: 'Run 4' },
  // Future reserved
  learning:     { status: 'reserved', run: 'Run 5+' },
  projects:     { status: 'reserved', run: 'Run 5+' },
  fleet:        { status: 'reserved', run: 'Run 5+' },
  monitoring:   { status: 'reserved', run: 'Run 5+' },
  admin:        { status: 'reserved', run: 'Run 6+' },
  reports:      { status: 'reserved', run: 'Run 6+' },
  integrations: { status: 'reserved', run: 'Run 7+' },
};

export function planModuleActivation(blueprint, dependencyMap, moduleRegistry) {
  const needed = [
    ...(blueprint?.coreModules || []),
    ...(blueprint?.optionalModules || []),
  ];

  const active   = [];
  const reserved = [];
  const future   = [];
  const blocked  = [];

  for (const modId of needed) {
    const entry = RUN_MODULE_MAP[modId];
    if (!entry) {
      future.push({ id: modId, reason: 'Not yet registered in module registry — future run required.' });
      continue;
    }
    if (entry.status === 'active') {
      active.push({ id: modId, run: entry.run });
    } else {
      reserved.push({ id: modId, run: entry.run, reason: 'Reserved for ' + entry.run });
    }
  }

  // Check dependency map for blocks
  const depMap = dependencyMap || {};
  for (const modId of needed) {
    const deps = depMap[modId] || [];
    for (const dep of deps) {
      const depEntry = RUN_MODULE_MAP[dep];
      if (!depEntry || depEntry.status !== 'active') {
        const alreadyBlocked = blocked.find(b => b.id === modId);
        if (!alreadyBlocked) {
          blocked.push({ id: modId, reason: `Depends on "${dep}" which is not yet active.` });
        }
      }
    }
  }

  return {
    activeModules:   active.map(m => m.id),
    reservedModules: reserved.map(m => m.id),
    futureModules:   future.map(m => m.id),
    blockedModules:  blocked.map(m => m.id),
    details:         { active, reserved, future, blocked },
  };
}

export function detectMissingModules(plan) {
  return (plan?.futureModules || []).concat(plan?.blockedModules || []);
}

export function detectBlockedModules(plan) {
  return plan?.blockedModules || [];
}

export function mapModulesToFutureRuns(plan) {
  const map = {};
  for (const id of plan?.reservedModules || []) {
    const entry = RUN_MODULE_MAP[id];
    const run = entry?.run || 'Run 5+';
    if (!map[run]) map[run] = [];
    map[run].push(id);
  }
  for (const id of plan?.futureModules || []) {
    const run = 'Run 5+';
    if (!map[run]) map[run] = [];
    map[run].push(id);
  }
  return map;
}
