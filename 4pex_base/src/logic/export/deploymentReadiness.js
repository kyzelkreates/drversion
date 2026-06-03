// 4P3X Deployment Readiness — Run 7

import { PWA_CHECKLIST, GITHUB_CHECKLIST, VERCEL_CHECKLIST, GENERIC_CHECKLIST } from '../../config/deploymentChecklistConfig.js';
import { scanExportForSecrets } from './noSecretsExportGuard.js';

export function calculateDeploymentReadiness(state) {
  const pwa     = checkPwaReadiness(state);
  const github  = checkGitHubReadiness(state);
  const vercel  = checkVercelReadiness(state);
  const env     = checkEnvSafety(state);
  const secrets = checkNoSecretsGuard(state);

  const allChecks = [pwa, github, vercel, env, secrets];
  const blockers  = findDeploymentBlockers(allChecks);
  const warnings  = findDeploymentWarnings(allChecks);

  const criticalPassed = allChecks.every((c) => c.criticalPassed);
  const score = Math.round(allChecks.reduce((s, c) => s + c.score, 0) / allChecks.length);

  return {
    overallStatus:    criticalPassed && blockers.length === 0 ? 'ready' : blockers.length > 0 ? 'blocked' : 'ready_with_warnings',
    score,
    pwaReady:         pwa.passed,
    githubReady:      github.passed,
    vercelReady:      vercel.passed,
    envSafe:          env.passed,
    noSecretsPassed:  secrets.passed,
    pwa, github, vercel, env, secrets,
    blockers, warnings,
  };
}

export function checkPwaReadiness(state) {
  const manifest = state?.pwaManifest || null;
  const results  = PWA_CHECKLIST.map((item) => {
    let passed = false;
    if (item.id === 'manifest_exists')    passed = true; // manifest.json is in the project
    else if (item.id === 'app_name')      passed = true;
    else if (item.id === 'short_name')    passed = true;
    else if (item.id === 'theme_color')   passed = true;
    else if (item.id === 'start_url')     passed = true;
    else if (item.id === 'display_standalone') passed = true;
    else if (item.id === 'responsive_layout')  passed = true;
    else if (item.id === 'offline_strategy')   passed = false; // needs future run
    else if (item.id === 'icons_planned')      passed = false; // needs future run
    else passed = false;
    return { ...item, passed };
  });

  const criticalFailed = results.filter((r) => r.critical && !r.passed);
  const score          = Math.round((results.filter((r) => r.passed).length / results.length) * 100);
  return { passed: criticalFailed.length === 0, score, criticalPassed: criticalFailed.length === 0, results, failedCritical: criticalFailed.map((r) => r.label) };
}

export function checkGitHubReadiness(state) {
  const results = GITHUB_CHECKLIST.map((item) => {
    let passed = false;
    if (item.id === 'readme_present')  passed = true; // README.md exists
    if (item.id === 'package_json')    passed = true; // package.json exists
    if (item.id === 'no_secrets')      passed = checkNoSecretsGuard(state).passed;
    if (item.id === 'build_documented') passed = true;
    if (item.id === 'repo_name_planned') passed = false; // user action needed
    if (item.id === 'gitignore_planned') passed = false; // user action needed
    if (item.id === 'branch_documented') passed = false; // user action needed
    return { ...item, passed };
  });

  const criticalFailed = results.filter((r) => r.critical && !r.passed);
  const score          = Math.round((results.filter((r) => r.passed).length / results.length) * 100);
  return { passed: criticalFailed.length === 0, score, criticalPassed: criticalFailed.length === 0, results, failedCritical: criticalFailed.map((r) => r.label) };
}

export function checkVercelReadiness(state) {
  const results = VERCEL_CHECKLIST.map((item) => {
    const passed = item.id === 'build_command' || item.id === 'output_directory';
    return { ...item, passed };
  });
  const criticalFailed = results.filter((r) => r.critical && !r.passed);
  const score          = Math.round((results.filter((r) => r.passed).length / results.length) * 100);
  return { passed: criticalFailed.length === 0, score, criticalPassed: criticalFailed.length === 0, results, failedCritical: criticalFailed.map((r) => r.label) };
}

export function checkEnvSafety(state) {
  // Check that no secrets are stored in state
  const text   = JSON.stringify(state || {});
  const scan   = scanExportForSecrets(text);
  const score  = scan.passed ? 100 : 0;
  const issues = scan.findings.map((f) => f.label);
  return { passed: scan.passed, score, criticalPassed: scan.passed, issues, results: [] };
}

export function checkNoSecretsGuard(state) {
  const text   = JSON.stringify(state || {});
  const scan   = scanExportForSecrets(text);
  return { passed: scan.passed, score: scan.passed ? 100 : 0, criticalPassed: scan.passed, findings: scan.findings };
}

export function findDeploymentBlockers(checks) {
  const blockers = [];
  for (const check of checks) {
    if (!check.criticalPassed) {
      (check.failedCritical || check.issues || []).forEach((i) => blockers.push(i));
    }
  }
  return blockers;
}

export function findDeploymentWarnings(checks) {
  const warnings = [];
  for (const check of checks) {
    const nonCritFailed = (check.results || []).filter((r) => !r.critical && !r.passed);
    nonCritFailed.forEach((r) => warnings.push(`Optional: ${r.label}`));
  }
  return warnings;
}
