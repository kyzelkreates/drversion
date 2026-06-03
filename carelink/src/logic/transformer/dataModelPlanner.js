// 4P3X Data Model Planner — RUN 4

const BASE_ENTITIES = [
  { name: 'AppConfig',        purpose: 'Application-level configuration', fields: ['key', 'value', 'updatedAt'],            sourceOfTruth: 'storage.js', runToBuild: 'Run 1' },
  { name: 'UserPreferences',  purpose: 'Per-user UI and behaviour prefs',  fields: ['theme', 'language', 'notifications'],   sourceOfTruth: 'storage.js', runToBuild: 'Run 1' },
  { name: 'SystemHealth',     purpose: 'System health and diagnostics',     fields: ['status', 'lastCheck', 'warnings'],      sourceOfTruth: 'storage.js', runToBuild: 'Run 1' },
];

const TYPE_ENTITY_MAP = {
  lms: [
    { name: 'Course',       purpose: 'Course definition and metadata',         fields: ['id','title','description','modules','status','createdAt'], sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'Lesson',       purpose: 'Individual lesson content',               fields: ['id','courseId','title','content','order','duration'],      sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'Enrolment',    purpose: 'Learner enrolment record',                fields: ['id','userId','courseId','status','startedAt'],             sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'Progress',     purpose: 'Learner progress per lesson/course',      fields: ['id','enrolmentId','lessonId','completed','completedAt'],   sourceOfTruth: 'storage.js', runToBuild: 'Run 6' },
    { name: 'Quiz',         purpose: 'Assessment/quiz definition',              fields: ['id','lessonId','questions','passMark'],                    sourceOfTruth: 'storage.js', runToBuild: 'Run 7' },
    { name: 'Certificate',  purpose: 'Completion certificate record',           fields: ['id','userId','courseId','issuedAt','code'],                sourceOfTruth: 'storage.js', runToBuild: 'Run 7' },
  ],
  fleet: [
    { name: 'Vehicle',      purpose: 'Fleet vehicle record',                    fields: ['id','name','type','status','assignedTo','lastUpdated'],    sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'Route',        purpose: 'Planned route definition',                fields: ['id','vehicleId','waypoints','distance','duration'],        sourceOfTruth: 'storage.js', runToBuild: 'Run 6' },
    { name: 'ComplianceLog',purpose: 'Compliance check log',                    fields: ['id','vehicleId','checkType','result','date','reviewer'],   sourceOfTruth: 'storage.js', runToBuild: 'Run 7' },
  ],
  projectOS: [
    { name: 'Project',      purpose: 'Project registry entry',                  fields: ['id','name','status','createdAt','ownedBy'],                sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'BuildRun',     purpose: 'Tracked build run record',                fields: ['id','projectId','runNumber','status','startedAt','log'],   sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'PromptEntry',  purpose: 'Saved prompt in the vault',               fields: ['id','projectId','title','content','tags','createdAt'],     sourceOfTruth: 'storage.js', runToBuild: 'Run 6' },
    { name: 'ErrorEntry',   purpose: 'Build error tracked in error centre',     fields: ['id','runId','type','message','resolved','resolvedAt'],     sourceOfTruth: 'storage.js', runToBuild: 'Run 7' },
  ],
  saas: [
    { name: 'Organisation', purpose: 'Tenant/organisation record',              fields: ['id','name','plan','seats','createdAt'],                    sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'TeamMember',   purpose: 'Team membership',                         fields: ['id','orgId','userId','role','invitedAt'],                  sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'Subscription', purpose: 'Billing subscription record',             fields: ['id','orgId','plan','status','renewsAt'],                   sourceOfTruth: 'hybrid_future', runToBuild: 'Run 6' },
  ],
  ecommerce: [
    { name: 'Product',      purpose: 'Product catalogue entry',                 fields: ['id','name','description','price','stock','category'],      sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'Order',        purpose: 'Customer order record',                   fields: ['id','customerId','items','total','status','placedAt'],     sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
    { name: 'CartItem',     purpose: 'In-progress cart item',                   fields: ['id','sessionId','productId','quantity'],                   sourceOfTruth: 'storage.js', runToBuild: 'Run 5' },
  ],
};

export function planDataModels(blueprint, dependencyMap) {
  const type = blueprint?.productType || 'foundation';
  const customEntities = blueprint?.requiredDataEntities || [];
  const typeEntities = TYPE_ENTITY_MAP[type] || [];

  const allEntities = [...BASE_ENTITIES, ...typeEntities];

  // Merge any custom entities from blueprint
  for (const name of customEntities) {
    if (!allEntities.find(e => e.name === name)) {
      allEntities.push({
        name,
        purpose: `Custom entity for ${type} — define fields in Run 5.`,
        fields: ['id', 'createdAt', 'updatedAt'],
        sourceOfTruth: assignEntitySourceOfTruth({ name }, blueprint?.stateMode || 'local'),
        runToBuild: 'Run 5',
      });
    }
  }

  return allEntities.map(e => ({ ...e, sourceOfTruth: assignEntitySourceOfTruth(e, blueprint?.stateMode) }));
}

export function mapEntitiesToStateMode(entities, stateMode) {
  return entities.map(e => ({ ...e, sourceOfTruth: assignEntitySourceOfTruth(e, stateMode) }));
}

export function detectMissingEntities(entities) {
  return entities.filter(e => !e.name || !e.purpose || !e.fields?.length);
}

export function assignEntitySourceOfTruth(entity, stateMode) {
  const mode = stateMode || 'local';
  if (mode === 'local') return 'storage.js';
  if (mode === 'supabase') return 'supabase_future';
  if (mode === 'hybrid') return 'hybrid_future';
  return 'storage.js';
}

export function planValidationForEntities(entities) {
  return entities.map(e => ({
    entity: e.name,
    requiredFields: e.fields || [],
    validations: [
      'id must be unique string',
      'createdAt must be ISO date string',
      ...e.fields?.filter(f => f !== 'id' && f !== 'createdAt' && f !== 'updatedAt').map(f => `${f} must be defined`),
    ],
  }));
}
