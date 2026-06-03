// 4P3X Prompt Export Utilities — Run 5
// Safe export, import, and copy functions for generated prompts.
// Never exports raw API keys or backend secrets.

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/g,
  /eyJ[a-zA-Z0-9._-]{50,}/g,
  /service_role_key\s*=\s*["'][^"']+["']/gi,
];

export function sanitizePromptForExport(prompt) {
  if (!prompt) return null;

  let { promptText, ...rest } = prompt;

  // Scrub any accidental secrets from promptText
  if (promptText) {
    for (const pattern of SECRET_PATTERNS) {
      promptText = promptText.replace(pattern, '[REDACTED]');
    }
  }

  // Remove internal audit timestamps that don't need export
  const sanitized = {
    ...rest,
    promptText,
    audit: {
      createdAt: prompt.audit?.createdAt || null,
      updatedAt: prompt.audit?.updatedAt || null,
      copiedAt: prompt.audit?.copiedAt || null,
      exportedAt: new Date().toISOString(),
    },
  };

  return sanitized;
}

export function exportPromptToText(prompt) {
  if (!prompt) return '';
  const sanitized = sanitizePromptForExport(prompt);
  return sanitized.promptText || '';
}

export function exportPromptToJson(prompt) {
  if (!prompt) return null;
  const sanitized = sanitizePromptForExport(prompt);
  return JSON.stringify(sanitized, null, 2);
}

export function exportAllPromptsToJson(prompts) {
  if (!Array.isArray(prompts)) return null;
  const sanitized = prompts.map(sanitizePromptForExport).filter(Boolean);
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      exportedFrom: '4P3X Reusable Base Structure™',
      promptCount: sanitized.length,
      prompts: sanitized,
    },
    null,
    2
  );
}

export function importPromptFromJson(json) {
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;

    // Handle both single prompt and export bundle
    if (parsed.prompts && Array.isArray(parsed.prompts)) {
      // This is an export bundle — validate each
      const results = [];
      for (const p of parsed.prompts) {
        const result = validateImportedPrompt(p);
        if (result.valid) {
          results.push({ prompt: result.prompt, error: null });
        } else {
          results.push({ prompt: null, error: result.error });
        }
      }
      return { type: 'bundle', results };
    }

    // Single prompt
    const result = validateImportedPrompt(parsed);
    return { type: 'single', results: [result] };
  } catch (e) {
    return {
      type: 'error',
      results: [{ prompt: null, error: `Failed to parse JSON: ${e.message}` }],
    };
  }
}

function validateImportedPrompt(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, error: 'Invalid prompt object.', prompt: null };
  }

  const required = ['id', 'transformationPlanId', 'productType', 'runNumber', 'title', 'promptText'];
  for (const field of required) {
    if (!parsed[field]) {
      return { valid: false, error: `Missing required field: "${field}".`, prompt: null };
    }
  }

  // Safety check on imported promptText
  for (const pattern of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(parsed.promptText || '')) {
      return { valid: false, error: 'Imported prompt contains a possible raw secret key — rejected.', prompt: null };
    }
  }

  // Sanitize before accepting
  const sanitized = sanitizePromptForExport(parsed);

  return { valid: true, error: null, prompt: sanitized };
}

export async function copyTextToClipboard(text) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.top = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return { success: ok };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export function summarizeGeneratedPrompt(prompt) {
  if (!prompt) return null;
  return {
    id: prompt.id,
    title: prompt.title,
    productType: prompt.productType,
    runNumber: prompt.runNumber,
    status: prompt.status,
    safetyPassed: prompt.safety?.passed ?? false,
    completenessScore: prompt.completeness?.score ?? 0,
    createdAt: prompt.audit?.createdAt || null,
  };
}
