// 4P3X Package Instruction Templates — Run 9
// Builder attachment instruction text for each target environment.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

export const BRANDING = {
  poweredBy: '4P3X Intelligent AI',
  createdBy: 'Kyzel Kreates',
  projectName: '4P3X Reusable Base Structure™',
  ecosystem: '4P3X Verse',
  brandingLine: 'Powered by 4P3X Intelligent AI — Created by Kyzel Kreates',
};

export const BASE44_INSTRUCTIONS = [
  'Upload the base zip as a new Base44 app project.',
  'Do not overwrite any existing app — create a new workspace.',
  'After upload, confirm all pages load without errors.',
  'Verify Dashboard, Modules, and Blueprint Engine routes work.',
  'Set your environment variables using the Base44 Secrets manager — do NOT paste real keys into any source file.',
  'The base is read-only advisory only. Do not auto-execute generated prompts.',
  'Use the Base Package Builder module to confirm package readiness before beginning a variant build.',
  `Branding: ${BRANDING.brandingLine}`,
];

export const MANUS_INSTRUCTIONS = [
  'Upload the base zip to a new Manus workspace.',
  'Run: npm install',
  'Run: npm run dev',
  'Confirm all pages load at http://localhost:5173.',
  'Verify Dashboard, Modules, and Blueprint Engine are accessible.',
  'Do not auto-execute any generated prompts.',
  'Do not write variant files into this base project.',
  'Use the Package Validation module to confirm all checks pass before any variant work.',
  `Branding: ${BRANDING.brandingLine}`,
];

export const REPLIT_INSTRUCTIONS = [
  'Upload the base zip to a new Replit project.',
  'Set the language to Node.js / React.',
  'Run: npm install',
  'Run: npm run dev',
  'Use the Replit Secrets manager for any environment variables — never hardcode keys.',
  'Confirm the preview shows the Dashboard at the root route.',
  'The base runs entirely in the browser — no backend service is required.',
  'Use the Package Validation module before any variant build begins.',
  `Branding: ${BRANDING.brandingLine}`,
];

export const CURSOR_INSTRUCTIONS = [
  'Extract the base zip into a new Cursor workspace folder.',
  'Open the folder in Cursor.',
  'Run: npm install',
  'Run: npm run dev',
  'Confirm the app opens at http://localhost:5173.',
  'Copy .env.example to .env and fill in any required values (do not paste secrets into source files).',
  'Use Cursor AI only in advisory mode for this base — do not allow automatic file writes.',
  'Use the Base Package Builder module to review the file tree before starting a variant build.',
  `Branding: ${BRANDING.brandingLine}`,
];

export const GITHUB_INSTRUCTIONS = [
  'Create a new private GitHub repository for the 4P3X Reusable Base Structure™.',
  'Extract the base zip locally.',
  'Run: git init && git add . && git commit -m "Initial commit — 4P3X Reusable Base Structure™"',
  'Push to the new private repo: git remote add origin <your-repo-url> && git push -u origin main',
  'Do NOT push .env or any file containing real secrets.',
  'Add .env to .gitignore if not already present.',
  'Confirm .env.example (with placeholders only) is committed.',
  'Add a branch protection rule on main to prevent direct pushes.',
  `Branding: ${BRANDING.brandingLine}`,
];

export const VERCEL_INSTRUCTIONS = [
  'Import the GitHub repository into Vercel (do not deploy the base directly — deploy a completed variant only).',
  'Set all environment variables in Vercel project settings — never in source files.',
  'Build command: npm run build',
  'Output directory: dist',
  'Confirm the preview deployment loads the Dashboard.',
  'The base is a structural foundation — deploy only after a variant is fully built and validated.',
  'Enable Vercel environment variable encryption.',
  `Branding: ${BRANDING.brandingLine}`,
];

export const GENERIC_INSTRUCTIONS = [
  'Extract the base zip into a new project folder.',
  'Run: npm install',
  'Run: npm run dev',
  'Copy .env.example to .env and fill in required values.',
  'NEVER commit .env or any file with real secrets to version control.',
  'Confirm all pages load correctly before starting a variant build.',
  'Use the Package Validation module to verify the base is ready.',
  `Branding: ${BRANDING.brandingLine}`,
];

export default {
  base44: BASE44_INSTRUCTIONS,
  manus: MANUS_INSTRUCTIONS,
  replit: REPLIT_INSTRUCTIONS,
  cursor: CURSOR_INSTRUCTIONS,
  github: GITHUB_INSTRUCTIONS,
  vercel: VERCEL_INSTRUCTIONS,
  generic: GENERIC_INSTRUCTIONS,
};
