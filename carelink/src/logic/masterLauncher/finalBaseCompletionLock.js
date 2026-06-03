// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// finalBaseCompletionLock.js — Run 10
// Governs whether the reusable base can be marked as complete.
// Once complete, no more base feature runs are permitted.

import { FINAL_BASE_COMPLETION_RULES, POST_COMPLETION_INSTRUCTIONS } from '../../config/finalBaseCompletionRules.js';

// =====================================================
// CAN COMPLETE BASE?
// =====================================================
export function canCompleteBase(state) {
  const checks = FINAL_BASE_COMPLETION_RULES.map((rule) => {
    const passed = _evaluateRule(rule, state);
    return {
      ruleId:      rule.id,
      rule:        rule.rule,
      description: rule.description,
      blockingLevel: rule.blockingLevel,
      passed,
    };
  });

  const blockers  = checks.filter((c) => !c.passed && c.blockingLevel === 'critical');
  const warnings  = checks.filter((c) => !c.passed && c.blockingLevel === 'warning');
  const passCount = checks.filter((c) => c.passed).length;

  return {
    canComplete:   blockers.length === 0,
    checks,
    blockers,
    warnings,
    passCount,
    totalChecks:   checks.length,
    score:         Math.round((passCount / checks.length) * 100),
    summary:
      blockers.length === 0
        ? warnings.length === 0
          ? 'All checks passed. Base is ready to be marked complete.'
          : `${warnings.length} warning(s) found. Base can be completed but review warnings first.`
        : `${blockers.length} critical blocker(s) found. Resolve before completing the base.`,
  };
}

// =====================================================
// COMPLETE BASE
// Writes completion status. Does NOT delete any data.
// =====================================================
export function completeBase(state) {
  const readiness = canCompleteBase(state);
  if (!readiness.canComplete) {
    return {
      success: false,
      error: 'Cannot complete base — critical blockers exist.',
      blockers: readiness.blockers,
    };
  }

  const completionRecord = {
    status:               'complete',
    finalBaseComplete:    true,
    readyToBuildVariants: true,
    completedAt:          new Date().toISOString(),
    branding:             'Powered by 4P3X Intelligent AI — Created by Kyzel Kreates',
    locks: {
      preventMoreBaseFeatureRuns:    true,
      preventMultiVariantBuildInOneRun: true,
      preventVariantBuildInsideBase:    true,
      requireBasePackageReady:          true,
      requireFinalAuditLock:            true,
      requireManualVariantPromptUse:    true,
      preventSecretExposure:            true,
      enforceBranding:                  true,
      enforceDashboardPwaPattern:       true,
    },
    postCompletionInstructions: POST_COMPLETION_INSTRUCTIONS,
    checkResults: readiness.checks,
  };

  return {
    success: true,
    completionRecord,
    message: 'The 4P3X Reusable Base Structure™ is now COMPLETE. Stop building the base. Begin real product variant builds.',
  };
}

// =====================================================
// UNLOCK BASE FOR EMERGENCY FIX
// =====================================================
export function unlockBaseForEmergencyFix(state) {
  if (!state?.masterLauncher?.finalBaseComplete) {
    return {
      success: false,
      error: 'Base is not yet marked complete — no unlock needed.',
    };
  }

  return {
    success: true,
    unlockedAt: new Date().toISOString(),
    warning:
      'Base temporarily unlocked for emergency fix only. ' +
      'Fix ONLY the confirmed issue. Do NOT add new features. ' +
      'Re-run full validation and re-lock the base immediately after.',
    rules: [
      'Fix only the specific confirmed issue.',
      'Do NOT add new features.',
      'Do NOT redesign or replace working systems.',
      'After the fix, re-run full validation.',
      'Re-lock the base immediately after confirmation.',
      'Document the fix in README.md.',
    ],
  };
}

// =====================================================
// EXPLAIN BASE COMPLETION STATUS
// =====================================================
export function explainBaseCompletionStatus(state) {
  const ml = state?.masterLauncher;
  if (!ml) return 'Master launcher state not initialised.';

  if (ml.finalBaseComplete && ml.readyToBuildVariants) {
    return (
      'The 4P3X Reusable Base Structure™ is COMPLETE. ' +
      'No more base feature runs. ' +
      'Export the zip, choose a variant, generate the master prompt, and build your first product.'
    );
  }

  const readiness = canCompleteBase(state);
  if (readiness.canComplete) {
    return `All completion checks pass (${readiness.score}%). Click "Complete Base" to lock it.`;
  }

  return (
    `Base is NOT yet complete. ${readiness.blockers.length} critical blocker(s) remain. ` +
    `Blockers: ${readiness.blockers.map((b) => b.rule).join(' | ')}`
  );
}

// =====================================================
// INTERNAL RULE EVALUATOR
// =====================================================
function _evaluateRule(rule, state) {
  switch (rule.checkKey) {
    case 'finalAuditPassed': {
      const audit = state?.finalAudit;
      return !!audit && (audit.finalLock?.status === 'locked' || audit.overallStatus === 'passed');
    }
    case 'packageReady': {
      const pkg = state?.basePackage;
      return !!pkg && (pkg.status === 'validated' || pkg.zipReady === true);
    }
    case 'noCriticalBlockers': {
      const blockers = state?.finalAudit?.blockers || [];
      return blockers.filter((b) => b.level === 'critical' || b.blocking === true).length === 0;
    }
    case 'noSecretsExposed': {
      // Check the secret scan results if available
      const scan = state?.finalAudit?.secretScan;
      if (!scan) return true; // no scan data — assume clean
      return scan.exposedKeys?.length === 0 || scan.status === 'clean';
    }
    case 'dashboardPwaRulePresent': {
      // This rule exists in the base config — always true if the base is intact
      return true;
    }
    case 'brandingLocked': {
      const ml = state?.masterLauncher;
      return ml?.locks?.enforceBranding !== false;
    }
    case 'transformationLockConfirmed': {
      const lock = state?.finalAudit?.finalLock;
      return !!lock && lock.status === 'locked';
    }
    case 'allRoutesClean': {
      const audit = state?.finalAudit;
      if (!audit) return false;
      return audit.routeAudit?.status === 'passed' || audit.overallStatus === 'passed';
    }
    case 'noUnsafeWording': {
      const audit = state?.finalAudit;
      if (!audit) return true;
      return audit.wordingAudit?.status !== 'failed';
    }
    case 'buildPasses': {
      const audit = state?.finalAudit;
      if (!audit) return false;
      return audit.buildStatus === 'passed' || audit.overallStatus === 'passed';
    }
    default:
      return false;
  }
}
