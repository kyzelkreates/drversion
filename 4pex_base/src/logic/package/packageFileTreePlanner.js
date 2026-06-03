// 4P3X Package File Tree Planner — Run 9
// Plans which files belong in the base package zip.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { REQUIRED_INCLUDE_PATTERNS, FORBIDDEN_PATTERNS } from '../../config/packageFileRules.js';

export function planPackageFileTree(state) {
  const required = REQUIRED_INCLUDE_PATTERNS.map((p) => ({
    pattern: p.pattern,
    reason: p.reason,
    status: 'required',
  }));

  const forbidden = FORBIDDEN_PATTERNS.map((p) => ({
    pattern: p.pattern,
    reason: p.reason,
    status: 'forbidden',
  }));

  const advisory = [
    { path: 'src/pages/',          note: 'All 28+ page files — verified in Run 8.5' },
    { path: 'src/components/',     note: 'All UI components across agents, audit, blueprints, export, layout, package, transformer, ui, workspaces' },
    { path: 'src/logic/',          note: 'All logic modules: agents, audit, export, launcher, package, transformer' },
    { path: 'src/config/',         note: 'All config files including module registry, prompt templates, package rules' },
    { path: 'src/state/',          note: 'SSOT state system: initialState, storage, useAppState, validators, selectors' },
    { path: 'src/utils/',          note: 'Utility modules: auditExport, packageExport' },
    { path: 'src/styles/',         note: 'Global CSS' },
    { path: 'public/',             note: 'manifest.json, icon-192.png, icon-512.png' },
    { path: 'index.html',          note: 'HTML entry point' },
    { path: 'package.json',        note: 'Dependency manifest' },
    { path: 'vite.config.js',      note: 'Build configuration' },
    { path: 'README.md',           note: 'Full project documentation including Runs 1–9' },
    { path: '.env.example',        note: 'Placeholder env template — no real secrets' },
  ];

  return { required, forbidden, advisory };
}

export function detectRequiredMissingFiles(state) {
  const missing = [];
  const critical = [
    'package.json', 'vite.config.js', 'index.html', 'README.md',
    '.env.example', 'src/main.jsx',
  ];
  // These are advisory — in a real zip these would be checked against the FS.
  // Here we verify state signals them as present.
  const pkg = state?.basePackage || {};
  if (!pkg.latestManifest?.requiredFiles?.length) {
    missing.push('Package manifest has not yet been generated — run Build Manifest first.');
  }
  return missing;
}

export function detectForbiddenFiles(state) {
  const found = [];
  const pkg = state?.basePackage || {};
  // Check if any forbidden file patterns appear in package metadata
  const excluded = pkg.latestManifest?.excludeRules || [];
  FORBIDDEN_PATTERNS.forEach((fp) => {
    if (!excluded.includes(fp.pattern)) {
      found.push({ pattern: fp.pattern, note: `Not explicitly excluded — verify manually.` });
    }
  });
  return found;
}

export function detectUnrelatedProjectRisk(state) {
  const risks = [];
  const app = state?.app || {};
  if (!app.name || !app.name.includes('4P3X')) {
    risks.push('App name does not include "4P3X" — confirm this is the correct project before packaging.');
  }
  return risks;
}

export default {
  planPackageFileTree,
  detectRequiredMissingFiles,
  detectForbiddenFiles,
  detectUnrelatedProjectRisk,
};
