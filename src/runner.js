/**
 * AKO SKRIPT — runner.js
 * Execution engine for JavaScript and TypeScript.
 * Provides: custom console, custom prompt(), async runner, output helpers.
 */

import { matchError, renderErrorBlock } from './errors/errorEngine.js';

/**
 * Run JavaScript source code.
 * @param {string}      code
 * @param {HTMLElement} outputEl   — #terminal-output
 * @param {HTMLElement} inputBarEl — #terminal-input-line
 * @param {object}      opts       — { language, onStart, onEnd }
 */
export async function runCode(code, outputEl, inputBarEl, opts = {}) {
  const { language = 'javascript', onStart, onEnd } = opts;

  clearOutput(outputEl);
  if (onStart) onStart();

  appendBanner(outputEl, `\u25ba  Running ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}\u2026`, 't-banner-start');

  const cons   = buildConsole(outputEl);
  const prompt = buildPrompt(outputEl, inputBarEl);

  try {
    const AsyncFn = Object.getPrototypeOf(async function () {}).constructor;
    // Neutralise browser globals students shouldn't hit accidentally
    const fn = new AsyncFn('console', 'prompt', 'alert', 'confirm', code);
    await fn(
      cons,
      prompt,
      (msg) => cons.log(`[alert] ${String(msg)}`),
      (msg) => { cons.log(`[confirm] ${String(msg)}`); return false; }
    );

    appendBanner(outputEl, '\u25a0  Execution complete', 't-banner-end');
    if (onEnd) onEnd(null);

  } catch (err) {
    const matched = matchError(err, language, code);
    renderErrorBlock(outputEl, matched);
    appendBanner(outputEl, '\u25a0  Execution stopped \u2014 see error above', 't-banner-end t-banner-fail');
    if (onEnd) onEnd(err);
  }
}

// ── Custom console ────────────────────────────────────────────
function buildConsole(outputEl) {
  return {
    log:   (...a) => appendLine(outputEl, fmtArgs(a), 't-log'),
    info:  (...a) => appendLine(outputEl, fmtArgs(a), 't-info'),
    warn:  (...a) => appendLine(outputEl, `\u26a0  ${fmtArgs(a)}`, 't-warn'),
    error: (...a) => appendLine(outputEl, fmtArgs(a), 't-error-raw'),
    debug: (...a) => appendLine(outputEl, fmtArgs(a), 't-dim'),
    table: (data) => appendTable(outputEl, data),
    clear: ()     => clearOutput(outputEl),
    group:    (label = '') => appendLine(outputEl, `\u25be ${label}`, 't-group-label'),
    groupEnd: ()           => appendLine(outputEl, '', 't-group-end'),
    assert: (cond, ...a) => {
      if (!cond) appendLine(outputEl, `Assertion failed: ${fmtArgs(a)}`, 't-error-raw');
    },
    count: (label = 'default') => {
      const k = `__ako_cnt_${label}`;
      window[k] = (window[k] || 0) + 1;
      appendLine(outputEl, `${label}: ${window[k]}`, 't-info');
    },
    time:    (label = 'default') => { window[`__ako_t_${label}`] = performance.now(); },
    timeEnd: (label = 'default') => {
      const t = window[`__ako_t_${label}`];
      if (t !== undefined) {
        appendLine(outputEl, `${label}: ${(performance.now() - t).toFixed(2)}ms`, 't-info');
        delete window[`__ako_t_${label}`];
      }
    },
  };
}

// ── Custom prompt ─────────────────────────────────────────────
function buildPrompt(outputEl, inputBarEl) {
  return (question = '') => new Promise(resolve => {
    if (question) appendLine(outputEl, question, 't-prompt-q');

    if (!inputBarEl) { resolve(''); return; }

    const labelEl = inputBarEl.querySelector('#terminal-prompt-label');
    const inputEl = inputBarEl.querySelector('#terminal-input');

    if (labelEl) labelEl.textContent = question ? question.slice(0, 50) : 'Enter value:';
    inputBarEl.classList.remove('hidden');

    if (inputEl) {
      inputEl.value = '';
      inputEl.focus();
      const handler = e => {
        if (e.key === 'Enter') {
          const val = inputEl.value;
          inputEl.removeEventListener('keydown', handler);
          inputBarEl.classList.add('hidden');
          appendLine(outputEl, `\u203a ${val}`, 't-input-echo');
          resolve(val);
        }
      };
      inputEl.addEventListener('keydown', handler);
    }
  });
}

// ── Output helpers ────────────────────────────────────────────
export function appendLine(outputEl, text, cssClass = 't-log') {
  String(text).split('\n').forEach((line, i) => {
    const span = document.createElement('span');
    span.className = `t-line ${cssClass}`;
    span.textContent = (i > 0 && line) ? `   ${line}` : line;
    outputEl.appendChild(span);
  });
  outputEl.scrollTop = outputEl.scrollHeight;
}

export function appendBanner(outputEl, text, extraClass = '') {
  const el = document.createElement('span');
  el.className = `t-banner ${extraClass}`;
  el.textContent = text;
  outputEl.appendChild(el);
  outputEl.scrollTop = outputEl.scrollHeight;
}

export function clearOutput(outputEl) {
  outputEl.innerHTML = '';
}

// ── ASCII table ───────────────────────────────────────────────
function appendTable(outputEl, data) {
  if (!data || typeof data !== 'object') { appendLine(outputEl, String(data)); return; }
  const rows = Array.isArray(data) ? data.map((v, i) => ({ index: i, value: v })) : Object.entries(data).map(([k, v]) => ({ key: k, value: v }));
  if (!rows.length) return;
  const cols = [...new Set(rows.flatMap(r => Object.keys(r)))];
  const widths = cols.map(c => Math.max(c.length, ...rows.map(r => String(r[c] ?? '').length)));
  const hr  = cols.map((_, i) => '-'.repeat(widths[i] + 2)).join('+');
  const row = cells => cells.map((c, i) => ` ${String(c ?? '').padEnd(widths[i])} `).join('|');
  [hr, row(cols), hr, ...rows.map(r => row(cols.map(c => r[c] ?? ''))), hr]
    .forEach(l => appendLine(outputEl, l, 't-table'));
}

// ── Value formatters ──────────────────────────────────────────
function fmtArgs(args) { return args.map(fmtVal).join(' '); }

export function fmtVal(v) {
  if (v === null)       return 'null';
  if (v === undefined)  return 'undefined';
  if (typeof v === 'string')   return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'function') return `[Function: ${v.name || 'anonymous'}]`;
  if (v instanceof Error)      return `${v.name}: ${v.message}`;
  if (Array.isArray(v)) return `[ ${v.map(fmtVal).join(', ')} ]`;
  try {
    const entries = Object.entries(v).slice(0, 10).map(([k, val]) => `${k}: ${fmtVal(val)}`);
    return `{ ${entries.join(', ')}${Object.keys(v).length > 10 ? ', \u2026' : ''} }`;
  } catch { return '[object]'; }
}