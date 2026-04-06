/**
 * AKO SKRIPT — errorEngine.js
 * Matches runtime errors to teaching catalog entries.
 * Phase 3 will populate the JS catalog; this engine is fully wired now.
 */

import { JSErrors  } from './jsErrors.js';
import { TSErrors  } from './tsErrors.js';

/**
 * Match a caught Error to the teaching catalog.
 * @param {Error}  error
 * @param {string} language   'javascript' | 'typescript'
 * @param {string} sourceCode user's code (for context hints)
 * @returns {{ raw: string, teachable: string|null, code: string|null }}
 */
export function matchError(error, language = 'javascript', sourceCode = '') {
  const catalog = language === 'typescript' ? TSErrors : JSErrors;
  const msg = error.message || String(error);

  for (const entry of catalog) {
    if (entry.pattern && entry.pattern.test(msg)) {
      let teachable = entry.explanation || null;

      // Simple context hint: if source contains the likely symbol, mention it
      if (teachable && entry.extractSymbol) {
        const sym = entry.extractSymbol(msg, sourceCode);
        if (sym) teachable = teachable.replace('{symbol}', `"${sym}"`);
      }

      return { raw: msg, teachable, code: entry.code || null };
    }
  }

  // No catalog match — return raw only
  return { raw: msg, teachable: null, code: null };
}

/**
 * Render error output into the terminal output element.
 * Always renders the raw error; adds teachable block if available.
 */
export function renderErrorBlock(outputEl, matched) {
  // Raw error line
  const errLine = document.createElement('span');
  errLine.className = 't-line t-error-raw';
  errLine.textContent = matched.raw;
  outputEl.appendChild(errLine);

  // Teachable expansion
  if (matched.teachable) {
    const block = document.createElement('div');
    block.className = 't-teachable';
    block.innerHTML = `
      <div class="teachable-header">${matched.code ? `[${matched.code}] ` : ''}Teaching Moment</div>
      <div class="teachable-msg">${escHtml(matched.teachable)}</div>
    `;
    outputEl.appendChild(block);
  }

  outputEl.scrollTop = outputEl.scrollHeight;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}