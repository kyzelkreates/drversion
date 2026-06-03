// 4P3X Package File Rules — Run 9
// Defines which files must be included vs forbidden in the base package.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

export const REQUIRED_INCLUDE_FILES = [
  'package.json',
  'vite.config.js',
  'index.html',
  'README.md',
  '.env.example',
  'public/manifest.json',
  'public/icon-192.png',
  'public/icon-512.png',
  'src/main.jsx',
  'src/app/App.jsx',
  'src/app/routes.js',
  'src/state/initialState.js',
  'src/state/storage.js',
  'src/state/useAppState.js',
  'src/state/validators.js',
  'src/state/selectors.js',
  'src/state/blueprintValidators.js',
  'src/state/workspaceValidators.js',
  'src/state/exportPackValidators.js',
  'src/state/auditValidators.js',
  'src/state/promptValidators.js',
  'src/state/transformationValidators.js',
  'src/state/agentValidators.js',
  'src/state/packageValidators.js',
  'src/config/appConfig.js',
  'src/config/agentRegistry.js',
  'src/config/moduleRegistry.js',
  'src/config/productRunSequences.js',
  'src/config/runPromptTemplates.js',
  'src/config/promptSafetyRules.js',
  'src/config/workspaceTemplates.js',
  'src/config/dashboardPwaStructureRules.js',
  'src/config/packageRules.js',
  'src/config/packageFileRules.js',
  'src/config/packageInstructionTemplates.js',
  'src/styles/globals.css',
  'src/pages/**',
  'src/components/**',
  'src/logic/**',
  'src/utils/**',
];

export const REQUIRED_INCLUDE_PATTERNS = [
  { pattern: 'package.json',        reason: 'Dependency manifest — required by all build tools.' },
  { pattern: 'vite.config.js',      reason: 'Build configuration — required by Vite.' },
  { pattern: 'index.html',          reason: 'HTML entry point.' },
  { pattern: 'README.md',           reason: 'Project documentation.' },
  { pattern: '.env.example',        reason: 'Placeholder env template — no real secrets.' },
  { pattern: 'public/**',           reason: 'Static assets including PWA manifest and icons.' },
  { pattern: 'src/**',              reason: 'All source files — pages, components, logic, config, state, styles, utils.' },
];

export const FORBIDDEN_PATTERNS = [
  { pattern: 'node_modules/**',        reason: 'Install dependencies fresh — never bundle node_modules.' },
  { pattern: 'dist/**',                reason: 'Build output excluded by default. Opt-in only.' },
  { pattern: '.vite/**',               reason: 'Vite build cache — not portable.' },
  { pattern: '.cache/**',              reason: 'Local build/tool cache.' },
  { pattern: '.env',                   reason: 'Real environment variables — must NEVER be packaged.' },
  { pattern: '.env.local',             reason: 'Local environment overrides — must NEVER be packaged.' },
  { pattern: '.env.production',        reason: 'Production secrets — must NEVER be packaged.' },
  { pattern: '.env.development',       reason: 'Development secrets — must NEVER be packaged.' },
  { pattern: '*.pem',                  reason: 'Certificate / private key file.' },
  { pattern: '*.key',                  reason: 'Private key file.' },
  { pattern: 'secrets.*',              reason: 'Explicit secrets file.' },
  { pattern: 'service-role*',          reason: 'Supabase/backend service role key — BACKEND ONLY, never frontend.' },
  { pattern: 'private*',               reason: 'Files prefixed with "private" are presumed sensitive.' },
  { pattern: '.DS_Store',              reason: 'macOS filesystem metadata — not portable.' },
  { pattern: 'Thumbs.db',             reason: 'Windows filesystem thumbnail cache.' },
  { pattern: '*.log',                  reason: 'Runtime logs — not part of the project source.' },
  { pattern: '.git/**',               reason: 'Git history — excluded unless explicitly requested for a git handoff.' },
  { pattern: 'coverage/**',           reason: 'Test coverage output.' },
  { pattern: '.nyc_output/**',        reason: 'NYC coverage cache.' },
  { pattern: 'yarn.lock',             reason: 'Lock file — receiving environment should generate its own.' },
  { pattern: 'package-lock.json',     reason: 'Lock file — receiving environment should generate its own.' },
  { pattern: 'pnpm-lock.yaml',        reason: 'Lock file — receiving environment should generate its own.' },
];

export const OPTIONAL_INCLUDE_PATTERNS = [
  { pattern: 'dist/**',    reason: 'Built output — include only if the target environment needs pre-built files.' },
  { pattern: '.git/**',    reason: 'Git history — include only for git-based handoff (GitHub, GitLab).' },
  { pattern: 'yarn.lock',  reason: 'Include if the target team uses Yarn and wants locked versions.' },
];

export default { REQUIRED_INCLUDE_PATTERNS, FORBIDDEN_PATTERNS, OPTIONAL_INCLUDE_PATTERNS };
