// 4P3X Package Export Utilities — Run 9
// Safe export helpers for package manifests and instructions.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

import { maskSecretFindings } from '../logic/package/packageSecretScanner.js';

/**
 * Sanitise a package manifest before export / display.
 * Masks any accidental secret-looking strings.
 */
export function sanitizeManifestForExport(manifest) {
  if (!manifest) return null;
  const str = JSON.stringify(manifest);
  const masked = str.replace(
    /([A-Za-z0-9_-]{32,})/g,
    (m) => {
      // Only mask if it looks like a raw key (high entropy guess by length)
      if (m.length >= 40) return m.slice(0, 6) + '****';
      return m;
    }
  );
  try {
    return JSON.parse(masked);
  } catch {
    return manifest;
  }
}

/**
 * Format a package manifest as a human-readable text block.
 */
export function formatManifestAsText(manifest) {
  if (!manifest) return '';
  const lines = [
    `4P3X Reusable Base Structure™ — Package Manifest`,
    `${manifest.identity?.brandingLine || ''}`,
    `Generated: ${manifest.generatedAt || ''}`,
    `Schema version: ${manifest.schemaVersion || ''}`,
    '',
    '=== REQUIRED FILES ===',
    ...(manifest.requiredFiles || []).map((f) => `  + ${f.pattern}  (${f.reason})`),
    '',
    '=== FORBIDDEN FILES ===',
    ...(manifest.forbiddenFiles || []).map((f) => `  ✗ ${f.pattern}  (${f.reason})`),
    '',
    '=== PACKAGE METADATA ===',
    `  App: ${manifest.metadata?.appName || ''}`,
    `  Version: ${manifest.metadata?.appVersion || ''}`,
    `  Final Audit Locked: ${manifest.metadata?.finalAuditLocked ? 'YES' : 'NO'}`,
    `  Total Runs: ${manifest.metadata?.totalRuns || ''}`,
    `  Next Run: ${manifest.metadata?.nextRun || ''}`,
    '',
    `Safety note: ${manifest.safetyNote || ''}`,
    `Instruction: ${manifest.instruction || ''}`,
  ];
  return lines.join('\n');
}

/**
 * Format builder instructions as text.
 */
export function formatInstructionsAsText(instructions, target) {
  if (!instructions) return '';
  const steps = instructions.steps || instructions;
  return [
    `4P3X Reusable Base Structure™ — ${target.toUpperCase()} Attachment Instructions`,
    instructions.brandingLine || '',
    '',
    ...(Array.isArray(steps) ? steps.map((s, i) => `${i + 1}. ${s}`) : [String(steps)]),
    '',
    `Safety note: ${instructions.safetyNote || ''}`,
  ].join('\n');
}

export default { sanitizeManifestForExport, formatManifestAsText, formatInstructionsAsText };
