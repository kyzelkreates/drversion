// 4P3X Safety Compliance Planner — RUN 4

const BASE_BOUNDARIES = [
  'All data must remain local unless explicitly moved to a remote store in a future run.',
  'No raw API keys or backend secrets may appear in plans, exports, or UI.',
  'No autonomous agent actions are permitted.',
  'All destructive actions require explicit user confirmation.',
  'State must flow through storage.js only — no secondary stores.',
];

const TYPE_SAFETY_MAP = {
  fleet: {
    safetyLevel: 'safety_critical',
    requiredWarnings: [
      'Route data is advisory only — always verify with authoritative navigation sources.',
      'Human operator must retain final decision-making authority over all routes.',
      'Data freshness cannot be guaranteed — check last update timestamp before use.',
      'This system does not provide legally binding routing decisions.',
      'Offline fallback behaviour must be implemented before production use.',
    ],
    humanOverrideRequired: true,
    disclaimersRequired: true,
    complianceBoundaries: [
      'Responsibility boundary: operator retains full liability for vehicle decisions.',
      'No legal certainty guarantee is provided by this system.',
      'Route validation must be performed by qualified human operators.',
      'Emergency override procedures must be available at all times.',
    ],
  },
  cybersecurity: {
    safetyLevel: 'compliance_critical',
    requiredWarnings: [
      'This tool is for authorised security assessment only.',
      'Do not use against systems you do not have explicit written permission to test.',
      'No exploit automation is permitted.',
      'All assessments must be evidence-based and properly documented.',
      'Findings must be reported through authorised channels only.',
    ],
    humanOverrideRequired: true,
    disclaimersRequired: true,
    complianceBoundaries: [
      'Defensive-only posture — no offensive exploit execution.',
      'Authorised assessment boundary must be documented before each engagement.',
      'Evidence and reporting focus only — no automated exploitation.',
      'Legal compliance boundary: unauthorised testing is prohibited.',
    ],
  },
  portfolioPlatform: {
    safetyLevel: 'standard',
    requiredWarnings: [
      'Architecture extraction is for analytical purposes only.',
      'Do not clone proprietary code, branding, or assets.',
      'Respect intellectual property of analysed systems.',
    ],
    humanOverrideRequired: false,
    disclaimersRequired: true,
    complianceBoundaries: [
      'No proprietary code cloning.',
      'No copied branding or assets.',
      'Architecture extraction only — no content reproduction.',
    ],
  },
  healthTracker: {
    safetyLevel: 'safety_advisory',
    requiredWarnings: [
      'Health data is for personal tracking only — not medical advice.',
      'Consult qualified healthcare professionals for medical decisions.',
      'This system is not a medical device.',
    ],
    humanOverrideRequired: true,
    disclaimersRequired: true,
    complianceBoundaries: [
      'Not a substitute for professional medical advice.',
      'Health data is stored locally — no medical-grade data handling.',
      'No diagnosis or treatment recommendations are provided.',
    ],
  },
};

const DEFAULT_SAFETY = {
  safetyLevel: 'standard',
  requiredWarnings: ['This product is in development. Review all outputs before production use.'],
  humanOverrideRequired: false,
  disclaimersRequired: false,
  complianceBoundaries: [...BASE_BOUNDARIES],
};

export function planSafetyCompliance(blueprint) {
  const type = blueprint?.productType || 'foundation';
  const override = blueprint?.safetyLevel;
  const base = TYPE_SAFETY_MAP[type] || DEFAULT_SAFETY;

  return {
    safetyLevel: override || base.safetyLevel,
    requiredWarnings: [...base.requiredWarnings, ...BASE_BOUNDARIES.slice(0, 2)],
    humanOverrideRequired: base.humanOverrideRequired,
    disclaimersRequired: base.disclaimersRequired,
    complianceBoundaries: [
      ...(base.complianceBoundaries || []),
      ...BASE_BOUNDARIES,
    ],
  };
}

export function detectSafetyCriticalNeeds(blueprint) {
  const type = blueprint?.productType || '';
  const safetyTypes = ['fleet', 'medical', 'healthTracker', 'navigation', 'cybersecurity'];
  if (safetyTypes.includes(type) || blueprint?.safetyLevel === 'safety_critical') {
    return [{ need: 'human_override', message: 'Human override mechanism is required for this product type.' },
            { need: 'data_freshness_warning', message: 'Data freshness warning must be displayed to users.' }];
  }
  return [];
}

export function detectComplianceCriticalNeeds(blueprint) {
  const type = blueprint?.productType || '';
  if (type === 'cybersecurity') {
    return [{ need: 'authorised_assessment_only', message: 'Authorised assessment boundary must be declared.' },
            { need: 'no_exploit_automation', message: 'Exploit automation is strictly forbidden.' }];
  }
  if (type === 'healthTracker') {
    return [{ need: 'not_medical_advice', message: 'Medical disclaimer must be displayed.' }];
  }
  return [];
}

export function detectCyberSafetyBoundaries(blueprint) {
  if (blueprint?.productType !== 'cybersecurity') return [];
  return [
    'Defensive-only boundary — no offensive exploit execution.',
    'All assessments must be explicitly authorised in writing.',
    'No automated exploitation tools may be used.',
  ];
}

export function detectNavigationSafetyBoundaries(blueprint) {
  if (blueprint?.productType !== 'fleet') return [];
  return [
    'Human operator retains final authority over all navigation decisions.',
    'Route data must be verified against authoritative sources.',
    'Offline fallback is required for safety-critical navigation.',
  ];
}

export function detectAppExtractionBoundaries(blueprint) {
  if (blueprint?.productType !== 'portfolioPlatform') return [];
  return [
    'Architecture extraction only — no proprietary content cloning.',
    'No branding, assets, or code may be copied from analysed applications.',
    'Respect intellectual property boundaries at all times.',
  ];
}
