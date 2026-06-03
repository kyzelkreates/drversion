// 4P3X State Transition Planner — RUN 4

const BASE_TRANSITIONS = [
  { name: 'app_load',           from: 'uninitialized', to: 'ready',         trigger: 'App mounts and state loads from localStorage',           validationRequired: true },
  { name: 'state_migrate',      from: 'legacy',        to: 'current',       trigger: 'Missing state keys detected and safely migrated',        validationRequired: true },
  { name: 'blueprint_select',   from: 'none_selected', to: 'selected',      trigger: 'User selects a blueprint in Blueprint Engine',           validationRequired: false },
  { name: 'blueprint_validate', from: 'draft',         to: 'validated',     trigger: 'User triggers blueprint validation',                     validationRequired: true },
  { name: 'plan_compile',       from: 'no_plan',       to: 'plan_draft',    trigger: 'User triggers compilation in Transformation Compiler',   validationRequired: true },
  { name: 'plan_ready',         from: 'plan_draft',    to: 'plan_ready',    trigger: 'Risk scanner passes and all blockers resolved',          validationRequired: true },
  { name: 'plan_export',        from: 'plan_ready',    to: 'plan_exported', trigger: 'User exports plan — sanitization applied',               validationRequired: true },
  { name: 'plan_import',        from: 'import_json',   to: 'plan_saved',    trigger: 'User imports valid JSON plan — validated before save',   validationRequired: true },
  { name: 'plan_delete',        from: 'any',           to: 'deleted',       trigger: 'User confirms deletion of a transformation plan',        validationRequired: true },
  { name: 'state_export',       from: 'active',        to: 'exported',      trigger: 'User exports full app state — keys masked',              validationRequired: true },
  { name: 'state_reset',        from: 'active',        to: 'reset',         trigger: 'User confirms full state reset with confirmation',       validationRequired: true },
];

const TYPE_TRANSITIONS = {
  lms: [
    { name: 'enrol_learner',    from: 'not_enrolled',  to: 'enrolled',      trigger: 'Learner enrols in a course',                            validationRequired: true },
    { name: 'complete_lesson',  from: 'in_progress',   to: 'completed',     trigger: 'Learner marks lesson complete',                         validationRequired: false },
    { name: 'submit_quiz',      from: 'quiz_open',     to: 'quiz_submitted',trigger: 'Learner submits quiz answers',                          validationRequired: true },
    { name: 'award_cert',       from: 'course_done',   to: 'certified',     trigger: 'System awards certificate after passing final quiz',     validationRequired: true },
  ],
  fleet: [
    { name: 'assign_vehicle',   from: 'available',     to: 'assigned',      trigger: 'Vehicle is assigned to a driver/route',                 validationRequired: true },
    { name: 'start_route',      from: 'assigned',      to: 'in_transit',    trigger: 'Driver starts a route — human confirmation required',   validationRequired: true },
    { name: 'complete_route',   from: 'in_transit',    to: 'completed',     trigger: 'Route is marked complete',                              validationRequired: true },
    { name: 'flag_compliance',  from: 'any',           to: 'flagged',       trigger: 'Compliance check fails — human review required',        validationRequired: true },
  ],
  projectOS: [
    { name: 'create_project',   from: 'no_project',    to: 'active',        trigger: 'User creates a new project in registry',                validationRequired: false },
    { name: 'start_run',        from: 'project_active',to: 'run_active',    trigger: 'User starts a build run',                               validationRequired: true },
    { name: 'complete_run',     from: 'run_active',    to: 'run_complete',  trigger: 'User marks run complete and saves log',                  validationRequired: true },
    { name: 'log_error',        from: 'run_active',    to: 'error_logged',  trigger: 'Error detected and logged to error centre',             validationRequired: false },
  ],
};

export function planStateTransitions(blueprint) {
  const type = blueprint?.productType || 'foundation';
  const typeTransitions = TYPE_TRANSITIONS[type] || [];
  return [...BASE_TRANSITIONS, ...typeTransitions];
}

export function validateStateTransitionPlan(transitions) {
  const errors = [];
  if (!Array.isArray(transitions)) { return { valid: false, errors: ['transitions must be an array'] }; }
  for (const t of transitions) {
    if (!t.name)    errors.push(`Transition missing name: ${JSON.stringify(t)}`);
    if (!t.from)    errors.push(`Transition "${t.name}" missing from state`);
    if (!t.to)      errors.push(`Transition "${t.name}" missing to state`);
    if (!t.trigger) errors.push(`Transition "${t.name}" missing trigger`);
  }
  return { valid: errors.length === 0, errors };
}

export function detectUnsafeTransitions(transitions) {
  const unsafe = [];
  for (const t of transitions) {
    if (t.to === 'reset' && !t.validationRequired) {
      unsafe.push({ transition: t.name, reason: 'Reset transitions must require validation/confirmation.' });
    }
    if (t.to === 'deleted' && !t.validationRequired) {
      unsafe.push({ transition: t.name, reason: 'Delete transitions must require confirmation.' });
    }
    if (typeof t.validationRequired === 'undefined') {
      unsafe.push({ transition: t.name, reason: 'validationRequired field is undefined.' });
    }
  }
  return unsafe;
}

export function mapTransitionsToStorageActions(transitions) {
  const ACTION_MAP = {
    plan_compile:  'compileTransformationPlan',
    plan_export:   'exportTransformationPlan',
    plan_import:   'importTransformationPlan',
    plan_delete:   'deleteTransformationPlan',
    state_export:  'exportState',
    state_reset:   'resetState',
    blueprint_select: 'setActiveBlueprint',
  };
  return transitions.map(t => ({
    transition: t.name,
    storageAction: ACTION_MAP[t.name] || null,
    note: ACTION_MAP[t.name] ? 'Maps to storage.js function' : 'No direct storage action — UI state only',
  }));
}
