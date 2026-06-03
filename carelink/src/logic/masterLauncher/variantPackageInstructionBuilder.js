// 4P3X Reusable Base Structure™
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates
// variantPackageInstructionBuilder.js — Run 10
// Generates per-builder zip attachment instructions for variant builds.
// Read-only output — no files are written, no APIs are called.

import { BRANDING_LINE } from '../../config/masterVariantPromptTemplates.js';

const COMMON_HEADER = (variantLabel) =>
  `====================================================
HOW TO ATTACH THE BASE ZIP FOR VARIANT BUILD
${variantLabel ? `Variant: ${variantLabel}` : ''}
${BRANDING_LINE}
====================================================

IMPORTANT RULES:
- This creates a NEW, ISOLATED project for this variant.
- Do NOT reuse or overwrite your reusable base zip.
- Do NOT mix this variant with any other variant project.
- Run: npm install after extracting.
- Confirm: npm run build passes before starting the variant run.
====================================================`;

// =====================================================
// GENERAL ZIP ATTACHMENT INSTRUCTIONS
// =====================================================
export function buildZipAttachmentInstructions(state) {
  const variantLabel = _getVariantLabel(state);
  return [
    COMMON_HEADER(variantLabel),
    '',
    '1. Download the 4P3X-Base-Run9.zip from Run 9 Base Package Builder.',
    '2. Choose your builder tool (Base44 / Manus / Cursor / Replit / GitHub / Generic).',
    '3. Create a brand NEW project in your chosen tool.',
    '4. Upload or attach the zip to the new project.',
    '5. Extract all zip contents into the project root.',
    '6. Run: npm install',
    '7. Run: npm run build — must pass with zero errors.',
    '8. Open the app and confirm the dashboard loads at /.',
    '9. You are now ready to apply the Master Variant Prompt.',
    '',
    'Do NOT start building until steps 1–8 are complete.',
  ].join('\n');
}

// =====================================================
// BASE44 INSTRUCTIONS
// =====================================================
export function buildBase44VariantInstructions(state) {
  const variantLabel = _getVariantLabel(state);
  return [
    COMMON_HEADER(variantLabel),
    '',
    'BASE44 — VARIANT BUILD SETUP',
    '',
    '1. Log in to Base44 (https://app.base44.com).',
    '2. Create a NEW app — do NOT modify an existing app.',
    '3. Go to the new app\'s Superagent or code editor.',
    '4. Upload the 4P3X-Base-Run9.zip file when prompted.',
    '5. Base44 will extract the contents into your new project.',
    '6. Confirm the project structure is visible in the file tree.',
    '7. Open the terminal (if available) and run: npm install',
    '8. Run: npm run build — confirm zero errors.',
    '9. Preview the app — confirm the dashboard loads at /.',
    '10. Open a new Superagent conversation.',
    '11. Paste your Master Variant Prompt into the conversation.',
    '12. The agent will begin Run 1 of your chosen variant.',
    '',
    'Tip: Name the app clearly — e.g. "Four Paws LMS - Variant Build".',
    'Do NOT name it "4P3X Base" — keep the base and variants clearly separated.',
  ].join('\n');
}

// =====================================================
// MANUS INSTRUCTIONS
// =====================================================
export function buildManusVariantInstructions(state) {
  const variantLabel = _getVariantLabel(state);
  return [
    COMMON_HEADER(variantLabel),
    '',
    'MANUS — VARIANT BUILD SETUP',
    '',
    '1. Open Manus and start a NEW task or workspace.',
    '2. Attach the 4P3X-Base-Run9.zip file to the task.',
    '3. In your first message, instruct Manus to:',
    '   a. Extract the zip into the project root.',
    '   b. Run: npm install',
    '   c. Run: npm run build — confirm zero errors.',
    '   d. Confirm the dashboard loads at /.',
    '4. Once the base is confirmed loaded, paste your Master Variant Prompt.',
    '5. Manus will execute Run 1 of your chosen variant.',
    '',
    'Important:',
    '- Do NOT paste the variant prompt in the same message as the zip.',
    '- Confirm the base loads cleanly BEFORE pasting the variant run prompt.',
    '- Each new variant is a separate Manus task/workspace.',
  ].join('\n');
}

// =====================================================
// CURSOR INSTRUCTIONS
// =====================================================
export function buildCursorVariantInstructions(state) {
  const variantLabel = _getVariantLabel(state);
  return [
    COMMON_HEADER(variantLabel),
    '',
    'CURSOR — VARIANT BUILD SETUP',
    '',
    '1. Open Cursor and create a NEW folder for this variant.',
    '   Example: ~/projects/four-paws-lms/',
    '2. Copy or extract the 4P3X-Base-Run9.zip contents into that folder.',
    '3. Open the folder in Cursor.',
    '4. Open the terminal in Cursor.',
    '5. Run: npm install',
    '6. Run: npm run build — confirm zero errors.',
    '7. Run: npm run dev — confirm the dashboard loads in the browser.',
    '8. Open the Cursor AI panel (⌘K or Ctrl+K).',
    '9. Paste your Master Variant Prompt into the panel.',
    '10. Cursor AI will begin applying Run 1 of your variant.',
    '',
    'Tip: Keep each variant in its own separate folder.',
    'Do NOT edit the base zip folder. Always work on a fresh copy.',
  ].join('\n');
}

// =====================================================
// REPLIT INSTRUCTIONS
// =====================================================
export function buildReplitVariantInstructions(state) {
  const variantLabel = _getVariantLabel(state);
  return [
    COMMON_HEADER(variantLabel),
    '',
    'REPLIT — VARIANT BUILD SETUP',
    '',
    '1. Log in to Replit (https://replit.com).',
    '2. Create a NEW Repl — choose Node.js or Vite React as the template.',
    '3. In the Repl files panel, upload the 4P3X-Base-Run9.zip.',
    '4. Open the Replit Shell and run:',
    '   unzip 4P3X-Base-Run9.zip -d .',
    '   (or use the file extraction option if available)',
    '5. Run: npm install',
    '6. Run: npm run build — confirm zero errors.',
    '7. Click Run to confirm the app loads.',
    '8. Open the Replit AI panel.',
    '9. Paste your Master Variant Prompt.',
    '10. Replit AI will begin Run 1 of your variant.',
    '',
    'Tip: Name the Repl clearly — e.g. "four-paws-lms-variant".',
    'Each variant gets its own Repl.',
  ].join('\n');
}

// =====================================================
// INTERNAL HELPERS
// =====================================================
function _getVariantLabel(state) {
  const variantType = state?.masterLauncher?.selectedVariantType;
  if (!variantType) return '';
  // Inline to avoid circular — just format the ID
  return variantType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
