/**
 * AKO SKRIPT — errorEngine.js
 * Matches runtime errors to the teaching catalog and
 * returns enriched, teachable error objects.
 * Phase 3 full implementation.
 */

// Catalogs loaded lazily in Phase 3
// import { JSErrors }  from './jsErrors.js';
// import { TSErrors }  from './tsErrors.js';
// import { HTMLErrors } from './htmlErrors.js';
// import { CSSErrors }  from './cssErrors.js';

/**
 * Match an error to the teaching catalog.
 * @param {Error} error        - The caught error object
 * @param {string} language    - 'javascript' | 'typescript' | 'html' | 'css'
 * @param {string} sourceCode  - The user's code (for context-aware hints)
 * @returns {{ raw: string, teachable: string|null, code: string|null }}
 */
export function matchError(error, language = 'javascript', sourceCode = '') {
  // Phase 3 will implement full catalog matching.
  // For now, return the raw message only.
  return {
    raw:       error.message,
    teachable: null,
    code:      null,
  };
}

/**
 * Render a teachable error block into the terminal output element.
 * @param {HTMLElement} outputEl  - The #terminal-output div
 * @param {object} matched        - Result from matchError()
 */
export function renderErrorBlock(outputEl, matched) {
  // Raw error line
  const errLine = document.createElement('span');
  errLine.className   = 't-line t-error';
  errLine.textContent = matched.raw;
  outputEl.appendChild(errLine);

  // Teachable expansion (if available)
  if (matched.teachable) {
    const block = document.createElement('div');
    block.className = 't-teachable';
    block.innerHTML = `
      <div class="teachable-header">
        ${matched.code ? `[${matched.code}]` : ''} Teaching Moment
      </div>
      <div class="teachable-msg">${escapeHtml(matched.teachable)}</div>
    `;
    outputEl.appendChild(block);
  }

  outputEl.scrollTop = outputEl.scrollHeight;
}

// ── Utility ───────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
