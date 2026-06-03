// 4P3X Builder Tool Templates — Run 7

export const BUILDER_TOOL_TEMPLATES = {
  base44: {
    id: 'base44', label: 'Base44', purpose: 'AI-powered web app builder',
    inputFormat: 'Uploaded file structure or copy-pasted prompt in Base44 Superagent chat.',
    handoffSteps: [
      'Review the export pack and transformation plan before uploading.',
      'Upload the project zip or paste the generated run prompt into Base44.',
      'Verify Base44 inspects the existing structure before making edits.',
      'Confirm that SSOT (storage.js) is preserved and not replaced.',
      'Follow the generated run prompt scope — do not expand scope beyond allowed files.',
      'Run build validation after each significant change.',
      'Do not create duplicate state systems.',
      'Do not allow Base44 to rebuild unrelated working systems.',
    ],
    allowedActions: ['Edit allowed files only', 'Add new modules per run scope', 'Extend storage.js safely', 'Add new routes', 'Add new components'],
    forbiddenActions: ['Replace storage.js', 'Rebuild existing working pages', 'Add Supabase before its run', 'Expose API secrets', 'Auto-deploy'],
    validationSteps: ['Run npm run build', 'Check all existing routes still load', 'Confirm no duplicate state keys', 'Confirm no secrets exposed'],
    stopConditions: ['Build fails', 'Existing routes break', 'SSOT is replaced', 'Secret is exposed', 'Scope expands beyond run boundary'],
    rollbackGuidance: ['Revert only files changed in the current run', 'Restore storage.js from the export pack if state breaks', 'Remove added routes if routing breaks'],
    secretSafetyRules: ['Never paste real API keys into the Base44 chat', 'User-supplied keys must be entered through the in-app AI Config only'],
    expectedOutput: 'Updated project files within allowed scope, passing npm run build.',
  },

  manus: {
    id: 'manus', label: 'Manus', purpose: 'AI agent for code fixes and structured builds',
    inputFormat: 'Copy-pasted run prompt with fix-only compiler mode directive.',
    handoffSteps: [
      'Paste the generated run prompt into Manus.',
      'Set Manus to FIX-ONLY BUILD COMPILER MODE.',
      'Manus must make the smallest safe change to achieve the mission.',
      'Manus must not loop or regenerate working systems.',
      'Manus must stop if architecture files are missing.',
      'Validate each file change before proceeding to the next.',
    ],
    allowedActions: ['Patch allowed files', 'Add new files within scope', 'Extend existing logic safely'],
    forbiddenActions: ['Whole-app regeneration', 'Duplicate components', 'Overwrite working systems', 'Call external APIs without user approval', 'Expose secrets'],
    validationSteps: ['Run npm run build after each file', 'Check that existing tests/pages still pass', 'Confirm SSOT is intact'],
    stopConditions: ['Architecture file missing', 'Duplicate state system detected', 'Build fails after 2 attempts', 'Scope violation detected'],
    rollbackGuidance: ['Revert last changed file', 'Compare with export pack baseline', 'Report exact failing file'],
    secretSafetyRules: ['No real API keys in prompt text', 'No backend secrets in any file'],
    expectedOutput: 'Targeted file patches within run scope, passing build.',
  },

  replit: {
    id: 'replit', label: 'Replit', purpose: 'Cloud-based IDE for development and preview',
    inputFormat: 'Import zip or clone repo, run npm commands in shell.',
    handoffSteps: [
      'Create a new Replit project or import the exported zip.',
      'Open the Replit shell and run: npm install',
      'Run: npm run dev — confirm the app loads at the preview URL.',
      'Apply file patches from the generated run prompt one file at a time.',
      'Run: npm run build after each significant change.',
      'Never paste real secrets into the Replit editor.',
    ],
    allowedActions: ['Install dependencies', 'Edit allowed files', 'Run build and dev scripts'],
    forbiddenActions: ['Store secrets in .env without .gitignore', 'Push secrets to Replit public repo', 'Rebuild unrelated systems'],
    validationSteps: ['npm install', 'npm run dev', 'npm run build', 'All routes load'],
    stopConditions: ['Build fails', 'Secrets found in source files', 'Existing routes break'],
    rollbackGuidance: ['Use Replit version history to revert files', 'Re-import export pack zip if needed'],
    secretSafetyRules: ['Use Replit Secrets (not .env files) for any keys', 'Never commit secrets to public Replit repos'],
    expectedOutput: 'Running project at Replit preview URL, passing build.',
  },

  cursor: {
    id: 'cursor', label: 'Cursor', purpose: 'AI-powered code editor for local development',
    inputFormat: 'Open project folder in Cursor, apply file patches with AI assistance.',
    handoffSteps: [
      'Open the project folder in Cursor.',
      'Run npm install in the terminal.',
      'Run npm run dev to confirm the base runs.',
      'Use Cursor AI to apply changes one file at a time.',
      'Follow the generated run prompt scope strictly.',
      'Run npm run build after each set of changes.',
    ],
    allowedActions: ['Edit allowed files with AI', 'Run npm commands', 'Add new files within scope'],
    forbiddenActions: ['Let Cursor auto-refactor unrelated files', 'Expose secrets via AI chat', 'Skip validation steps'],
    validationSteps: ['npm install', 'npm run dev', 'npm run build', 'Route check'],
    stopConditions: ['Build fails twice', 'SSOT replaced', 'Secrets exposed'],
    rollbackGuidance: ['Use Cursor git integration to revert', 'Restore from export pack baseline'],
    secretSafetyRules: ['Do not paste real keys into Cursor AI chat', 'Use .env.local for local keys, never commit'],
    expectedOutput: 'Updated local project passing npm run build.',
  },

  github: {
    id: 'github', label: 'GitHub', purpose: 'Version control and CI/CD pipeline',
    inputFormat: 'Push project to GitHub repository.',
    handoffSteps: [
      'Initialise a git repo: git init',
      'Create a .gitignore file that includes: node_modules/, dist/, .env, .env.local',
      'Commit only source files — never commit .env or real secrets.',
      'Create a repository on GitHub and push: git remote add origin <repo-url> && git push -u origin main',
      'Document the build command: npm run build in README.md',
      'Set up GitHub Actions if CI/CD is required in a future run.',
    ],
    allowedActions: ['Push source files', 'Configure .gitignore', 'Set up branch protection', 'Add CI/CD in future run'],
    forbiddenActions: ['Commit .env files', 'Commit real API keys', 'Push dist/ folder directly'],
    validationSteps: ['Confirm .gitignore is correct', 'Confirm no secrets in committed files', 'Confirm README documents build steps'],
    stopConditions: ['Secret detected in repo', '.gitignore missing', 'Build fails in CI'],
    rollbackGuidance: ['Use git revert to undo committed changes', 'Remove sensitive data using git filter-branch if exposed'],
    secretSafetyRules: ['Never commit real keys to any repo (public or private)', 'Use GitHub Secrets for CI/CD workflows'],
    expectedOutput: 'Clean GitHub repository with no secrets, correct .gitignore, documented build process.',
  },

  vercel: {
    id: 'vercel', label: 'Vercel', purpose: 'Frontend deployment and hosting',
    inputFormat: 'Connect GitHub repo to Vercel dashboard.',
    handoffSteps: [
      'Push the project to GitHub first.',
      'Connect the GitHub repo to Vercel via the Vercel dashboard.',
      'Set build command: npm run build',
      'Set output directory: dist',
      'Add any required VITE_PUBLIC_ environment variables in Vercel dashboard (placeholders only).',
      'Never add SUPABASE_SERVICE_ROLE_KEY or any backend secret to Vercel frontend env.',
      'Trigger a deployment and verify the build passes.',
      'Check all routes load on the deployed URL.',
    ],
    allowedActions: ['Connect GitHub repo', 'Set build command and output directory', 'Add VITE_PUBLIC_ env vars via dashboard'],
    forbiddenActions: ['Add backend secrets to frontend env vars', 'Auto-deploy without validation', 'Expose private keys in env settings'],
    validationSteps: ['Build passes in Vercel dashboard', 'All routes load on deployed URL', 'No secrets in frontend bundle'],
    stopConditions: ['Build fails', 'Secret detected in env vars', 'Routes 404'],
    rollbackGuidance: ['Use Vercel instant rollback to previous deployment', 'Fix build error locally before redeploying'],
    secretSafetyRules: ['Backend secrets must use Vercel Edge Functions or a proxy — never frontend env', 'VITE_PUBLIC_ vars are bundled into the browser — never put secrets there'],
    expectedOutput: 'Deployed app on Vercel URL, passing build, all routes loading, no secrets exposed.',
  },

  generic: {
    id: 'generic', label: 'Generic / Custom', purpose: 'Any other deployment target or builder tool',
    inputFormat: 'Export pack JSON or zip file.',
    handoffSteps: [
      'Extract the project into your target environment.',
      'Run npm install.',
      'Run npm run dev to confirm the base runs.',
      'Apply file patches from the generated run prompt one file at a time.',
      'Run npm run build to validate.',
      'Confirm state persists across browser refresh.',
      'Confirm no secrets are exposed in any exported or built file.',
    ],
    allowedActions: ['Install dependencies', 'Apply file patches', 'Run build scripts', 'Export packs'],
    forbiddenActions: ['Expose secrets', 'Skip validation steps', 'Rebuild unrelated systems'],
    validationSteps: ['npm install', 'npm run dev', 'npm run build', 'Route check', 'State persistence check'],
    stopConditions: ['Build fails', 'Secrets exposed', 'SSOT broken'],
    rollbackGuidance: ['Revert changed files', 'Restore from export pack baseline'],
    secretSafetyRules: ['Never include real keys in any export', 'Use environment-specific secret storage appropriate to the platform'],
    expectedOutput: 'Running application passing build validation.',
  },
};

export function getBuilderToolTemplate(toolId) {
  return BUILDER_TOOL_TEMPLATES[toolId] || BUILDER_TOOL_TEMPLATES.generic;
}

export function getAllBuilderTools() {
  return Object.values(BUILDER_TOOL_TEMPLATES);
}

export default BUILDER_TOOL_TEMPLATES;
