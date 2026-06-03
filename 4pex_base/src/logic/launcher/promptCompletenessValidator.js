// 4P3X Prompt Completeness Validator — Run 5
// Validates that generated prompts contain all required sections.
// Scores completeness and determines readiness status.

const REQUIRED_SECTIONS = {
  fixOnlyWrapper: {
    label: 'FIX-ONLY BUILD COMPILER MODE wrapper',
    patterns: [/FIX-ONLY BUILD COMPILER MODE/i, /⛔.*STRICT.*ENFORCEMENT/i],
    weight: 10,
  },
  projectIdentity: {
    label: 'Project identity section',
    patterns: [/PROJECT IDENTITY/i, /4P3X|Kyzel Kreates/i],
    weight: 8,
  },
  currentStatus: {
    label: 'Current build status (preserved runs)',
    patterns: [/CURRENT BUILD STATUS/i, /RUN 1.*COMPLETE|RUN 2.*COMPLETE/i],
    weight: 8,
  },
  mission: {
    label: 'Primary mission section',
    patterns: [/PRIMARY MISSION/i, /mission/i],
    weight: 10,
  },
  scope: {
    label: 'Scope section',
    patterns: [/SCOPE/i, /required modules/i, /required data models/i],
    weight: 7,
  },
  allowedFiles: {
    label: 'Allowed files section',
    patterns: [/FILES ALLOWED TO TOUCH/i, /ALLOWED.*FILES/i],
    weight: 10,
  },
  forbiddenFiles: {
    label: 'Forbidden files section',
    patterns: [/DO NOT TOUCH/i, /FORBIDDEN.*FILES/i],
    weight: 10,
  },
  ssotRules: {
    label: 'SSOT rules section',
    patterns: [/SSOT RULES/i, /only storage\.js may/i],
    weight: 8,
  },
  validationGates: {
    label: 'Validation gates section',
    patterns: [/VALIDATION GATES/i, /before editing/i],
    weight: 7,
  },
  acceptanceCriteria: {
    label: 'Acceptance criteria section',
    patterns: [/ACCEPTANCE CRITERIA/i, /complete only if/i],
    weight: 8,
  },
  stopConditions: {
    label: 'Stop conditions section',
    patterns: [/STOP CONDITIONS/i, /stop immediately if/i],
    weight: 7,
  },
  rollbackGuidance: {
    label: 'Rollback guidance section',
    patterns: [/ROLLBACK GUIDANCE/i, /if.*breaks/i],
    weight: 7,
  },
  directive1Footer: {
    label: 'Directive 1 footer',
    patterns: [/DIRECTIVE 1/i, /Adapt the skill set to the task/i],
    weight: 10,
  },
};

const TOTAL_WEIGHT = Object.values(REQUIRED_SECTIONS).reduce((sum, s) => sum + s.weight, 0);

export function validatePromptCompleteness(promptText) {
  const score = scorePromptCompleteness(promptText);
  const missing = detectMissingRequiredSections(promptText);
  const present = Object.keys(REQUIRED_SECTIONS).filter((k) => !missing.includes(k));

  let status = 'needs_review';
  if (score >= 85) status = 'ready_to_copy';
  else if (score >= 60) status = 'partial';

  return {
    score,
    status,
    missingSections: missing,
    requiredSectionsPresent: present,
    hasDirective1: confirmDirective1Footer(promptText),
    hasFixOnlyWrapper: confirmFixOnlyWrapper(promptText),
    hasAllowedForbidden: confirmAllowedForbiddenFiles(promptText),
    hasValidationGates: confirmValidationGates(promptText),
    hasRollbackGuidance: confirmRollbackGuidance(promptText),
    hasStopConditions: confirmStopConditions(promptText),
  };
}

export function detectMissingRequiredSections(promptText) {
  const missing = [];
  if (!promptText) return Object.keys(REQUIRED_SECTIONS);

  for (const [key, section] of Object.entries(REQUIRED_SECTIONS)) {
    const found = section.patterns.some((p) => p.test(promptText));
    if (!found) {
      missing.push(key);
    }
  }

  return missing;
}

export function scorePromptCompleteness(promptText) {
  if (!promptText) return 0;

  let earned = 0;
  for (const section of Object.values(REQUIRED_SECTIONS)) {
    const found = section.patterns.some((p) => p.test(promptText));
    if (found) {
      earned += section.weight;
    }
  }

  return Math.round((earned / TOTAL_WEIGHT) * 100);
}

export function confirmDirective1Footer(promptText) {
  if (!promptText) return false;
  return /DIRECTIVE 1/i.test(promptText) && /Adapt the skill set to the task/i.test(promptText);
}

export function confirmFixOnlyWrapper(promptText) {
  if (!promptText) return false;
  return /FIX-ONLY BUILD COMPILER MODE/i.test(promptText);
}

export function confirmAllowedForbiddenFiles(promptText) {
  if (!promptText) return false;
  return (
    /FILES ALLOWED TO TOUCH/i.test(promptText) &&
    /DO NOT TOUCH/i.test(promptText)
  );
}

export function confirmValidationGates(promptText) {
  if (!promptText) return false;
  return /VALIDATION GATES/i.test(promptText);
}

export function confirmRollbackGuidance(promptText) {
  if (!promptText) return false;
  return /ROLLBACK GUIDANCE/i.test(promptText);
}

export function confirmStopConditions(promptText) {
  if (!promptText) return false;
  return /STOP CONDITIONS/i.test(promptText);
}

export function getCompletenessLabel(score) {
  if (score >= 85) return 'ready_to_copy';
  if (score >= 60) return 'partial';
  return 'needs_review';
}

export function getMissingSectionLabels(missingSectionKeys) {
  return missingSectionKeys.map((k) => REQUIRED_SECTIONS[k]?.label || k);
}
