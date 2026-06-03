// 4P3X Deployment Checklist Config — Run 7

export const PWA_CHECKLIST = [
  { id: 'manifest_exists',     label: 'manifest.json exists in /public',         critical: true  },
  { id: 'app_name',            label: 'App name is set in manifest',              critical: true  },
  { id: 'short_name',          label: 'Short name is set in manifest',            critical: false },
  { id: 'theme_color',         label: 'Theme color is set in manifest',           critical: false },
  { id: 'start_url',           label: 'Start URL is set in manifest',             critical: true  },
  { id: 'display_standalone',  label: 'Display mode set to standalone',           critical: false },
  { id: 'responsive_layout',   label: 'App has responsive mobile layout',         critical: true  },
  { id: 'offline_strategy',    label: 'Offline strategy is planned',              critical: false },
  { id: 'icons_planned',       label: 'App icons are planned or present',         critical: false },
];

export const GITHUB_CHECKLIST = [
  { id: 'repo_name_planned',   label: 'Repository name is planned',              critical: false },
  { id: 'readme_present',      label: 'README.md is present',                    critical: true  },
  { id: 'package_json',        label: 'package.json is present',                 critical: true  },
  { id: 'gitignore_planned',   label: '.gitignore is planned (node_modules, dist, .env)', critical: true },
  { id: 'no_secrets',          label: 'No secrets or real .env files committed', critical: true  },
  { id: 'build_documented',    label: 'Build command documented (npm run build)', critical: true  },
  { id: 'branch_documented',   label: 'Deployment branch documented (main)',     critical: false },
];

export const VERCEL_CHECKLIST = [
  { id: 'build_command',       label: 'Build command: npm run build',            critical: true  },
  { id: 'output_directory',    label: 'Output directory: dist',                  critical: true  },
  { id: 'env_placeholders',    label: 'Environment variables use placeholders',  critical: true  },
  { id: 'no_backend_secrets',  label: 'No backend secrets in frontend env vars', critical: true  },
  { id: 'prod_checklist',      label: 'Production validation checklist included', critical: false },
];

export const GENERIC_CHECKLIST = [
  { id: 'npm_install',         label: 'npm install completes without errors',    critical: true  },
  { id: 'npm_run_build',       label: 'npm run build completes successfully',    critical: true  },
  { id: 'no_console_crash',    label: 'No console crash on startup',             critical: true  },
  { id: 'state_persists',      label: 'State persists across browser refresh',   critical: true  },
  { id: 'routes_load',         label: 'All routes load without errors',          critical: true  },
  { id: 'export_pack',         label: 'Export pack generated and sanitised',     critical: false },
  { id: 'no_secrets_exposed',  label: 'No secrets exposed in any export',        critical: true  },
];

export default { PWA_CHECKLIST, GITHUB_CHECKLIST, VERCEL_CHECKLIST, GENERIC_CHECKLIST };
