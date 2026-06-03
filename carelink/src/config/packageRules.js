// 4P3X Package Rules — Run 9
// Rules for safe base zip packaging.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

export const PACKAGE_SAFETY_RULES = [
  {
    id: 'base_only',
    label: 'Package the reusable base only',
    description: 'Package only the 4P3X Reusable Base Structure™. Do not package product-specific generated variants.',
    severity: 'blocker',
  },
  {
    id: 'no_node_modules',
    label: 'Exclude node_modules',
    description: 'node_modules must never be included. The receiving environment installs its own dependencies.',
    severity: 'blocker',
  },
  {
    id: 'no_env_files',
    label: 'Exclude .env files',
    description: '.env, .env.local, .env.production, and all real environment files must be excluded. Include .env.example with placeholders only.',
    severity: 'blocker',
  },
  {
    id: 'no_real_secrets',
    label: 'Exclude real API keys and secrets',
    description: 'No raw API keys, service role keys, private keys, tokens, passwords, or credentials may be included.',
    severity: 'blocker',
  },
  {
    id: 'no_build_cache',
    label: 'Exclude build cache and dist by default',
    description: 'dist/, .vite/, .cache/, and all build output must be excluded unless the user explicitly opts in to including a built output.',
    severity: 'blocker',
  },
  {
    id: 'no_variant_contamination',
    label: 'Exclude variant-specific generated files',
    description: 'Files generated for a specific product variant must not be included in the reusable base package.',
    severity: 'blocker',
  },
  {
    id: 'no_unrelated_projects',
    label: 'Exclude unrelated project folders',
    description: 'Any folder not belonging to the 4P3X Reusable Base Structure™ project must be excluded.',
    severity: 'blocker',
  },
  {
    id: 'no_demo_language',
    label: 'Exclude unsafe product-facing wording',
    description: 'Package instructions and manifest must not contain demo, mock, fake, dummy, toy, or placeholder-only product descriptions.',
    severity: 'blocker',
  },
  {
    id: 'require_readme',
    label: 'README.md must be included',
    description: 'The project README must travel with the package.',
    severity: 'blocker',
  },
  {
    id: 'require_package_json',
    label: 'package.json must be included',
    description: 'package.json is required for the receiving environment to install dependencies.',
    severity: 'blocker',
  },
  {
    id: 'require_src',
    label: 'src/ folder must be included',
    description: 'The entire src/ directory is required.',
    severity: 'blocker',
  },
  {
    id: 'require_public',
    label: 'public/ folder must be included',
    description: 'The public/ folder including manifest.json and PWA icons must be included.',
    severity: 'blocker',
  },
  {
    id: 'require_env_example',
    label: '.env.example must be included (placeholders only)',
    description: '.env.example with placeholder values only must travel with the package.',
    severity: 'warning',
  },
  {
    id: 'require_handoff_instructions',
    label: 'Handoff instructions must be included',
    description: 'Builder attachment instructions must accompany the package.',
    severity: 'warning',
  },
  {
    id: 'require_final_readiness_report',
    label: 'Final readiness report must be included',
    description: 'An exported final readiness report must be referenced in the package.',
    severity: 'warning',
  },
  {
    id: 'require_package_manifest',
    label: 'Package manifest must be generated',
    description: 'A machine-readable package manifest must be generated before zip.',
    severity: 'blocker',
  },
  {
    id: 'manual_zip_only',
    label: 'Manual zip only — no automatic deployment',
    description: 'The packaging system must not automatically create a zip, push to GitHub, deploy to Vercel, or trigger any external service.',
    severity: 'blocker',
  },
];

export const BLOCKER_RULES = PACKAGE_SAFETY_RULES.filter((r) => r.severity === 'blocker');
export const WARNING_RULES = PACKAGE_SAFETY_RULES.filter((r) => r.severity === 'warning');

export default PACKAGE_SAFETY_RULES;
