// 4P3X Package Instruction Builder — Run 9
// Builds per-builder attachment instructions.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import TEMPLATES, { BRANDING } from '../../config/packageInstructionTemplates.js';

export function buildBase44PackageInstructions(state)   { return _build('base44', state); }
export function buildManusPackageInstructions(state)    { return _build('manus', state); }
export function buildReplitPackageInstructions(state)   { return _build('replit', state); }
export function buildCursorPackageInstructions(state)   { return _build('cursor', state); }
export function buildGitHubPackageInstructions(state)   { return _build('github', state); }
export function buildVercelPackageInstructions(state)   { return _build('vercel', state); }
export function buildGenericPackageInstructions(state)  { return _build('generic', state); }

function _build(target, state) {
  const base = TEMPLATES[target] || TEMPLATES.generic;
  return {
    target,
    brandingLine: BRANDING.brandingLine,
    steps: base,
    safetyNote: 'Do not include .env files, node_modules, or real API keys in the zip.',
    generatedAt: new Date().toISOString(),
  };
}

export function buildAllInstructions(state) {
  return {
    base44: buildBase44PackageInstructions(state),
    manus:  buildManusPackageInstructions(state),
    replit: buildReplitPackageInstructions(state),
    cursor: buildCursorPackageInstructions(state),
    github: buildGitHubPackageInstructions(state),
    vercel: buildVercelPackageInstructions(state),
    generic: buildGenericPackageInstructions(state),
  };
}

export default {
  buildBase44PackageInstructions,
  buildManusPackageInstructions,
  buildReplitPackageInstructions,
  buildCursorPackageInstructions,
  buildGitHubPackageInstructions,
  buildVercelPackageInstructions,
  buildGenericPackageInstructions,
  buildAllInstructions,
};
