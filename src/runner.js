/**
 * AKO SKRIPT — runner.js
 * Execution engine for JavaScript (and later TypeScript).
 * Manages:
 *   - Custom console (log, warn, error, info, table, clear, group)
 *   - Custom prompt() — resolves via the terminal input bar
 *   - Async code execution wrapper
 *   - Error capture and forwarding to errorEngine
 */

import { matchError, renderErrorBlock } from './errors/errorEngine.js';

// ── Execution ─────────────────────────────────────────────────

/**
 * Run a JavaScript string in a sandboxed async function.
 * @param {string}      code         - Source code to execute
 * @param {HTMLElement} outputEl     - #terminal-output element
 * @param {HTMLElement} inputBarEl   - #terminal-input-line element
 * @param {object}      opts
 * @param {string}      opts.language  - 'javascript' | 'typescript'
 * @param {Function}    opts.onStart   - Called before execution
 * @param {Function}    opts.onEnd     - Called after execution (success or fail)
 */
export async function runCode(code, outputEl, inputBarEl, opts = {}) {
  const {
    language = 'javascript',
    onStart  = null,
    onEnd    = null,
  } = opts;

  // Clear output and signal start
  clearOutput(outputEl);
  if (onStart) onStart();
  appendBanner(outputEl, `▶  Running ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}…`, 't-banner-start');

  // Build sandboxed environment
  const cons    = buildConsole(outputEl);
  const prompt  = buildPrompt(outputEl, inputBarEl);

  try {
    const AsyncFn = Object.getPrototypeOf(async function () {}).constructor;
    const fn = new AsyncFn(
      'console', 'prompt', 'window', 'document', 'alert',
      code
    );

    // Neutralise browser globals we don't want students accidentally hitting
    await fn(
      cons,
      prompt,
      undefined,  // window  — undefined inside fn
      undefined,  // document
      (msg) => cons.log(`[alert] ${msg}`)  // alert → console
    );

    appendBanner(outputEl, '■  Execution complete', 't-banner-end');
    if (onEnd) onEnd(null);

  } catch (err) {
    // Match to teaching catalog
    const matched = matchError(err, language, code);
    renderErrorBlock(outputEl, matched);
    appendBanner(outputEl, '■  Execution stopped — see error above', 't-banner-end t-banner-fail');
    if (onEnd) onEnd(err);
  }
}

// ── Custom Console ────────────────────────────────────────────

function buildConsole(outputEl) {
  return {
    log:   (...args) => appendLine(outputEl, formatArgs(args), 't-log'),
    info:  (...args) => appendLine(outputEl, formatArgs(args), 't-info'),
    warn:  (...args) => appendLine(outputEl, `⚠  ${formatArgs(args)}`, 't-warn'),
    error: (...args) => appendLine(outputEl, formatArgs(args), 't-error-raw'),
    debug: (...args) => appendLine(outputEl, formatArgs(args), 't-dim'),

    // console.table — render as simple ASCII table
    table: (data) => appendTable(outputEl, data),

    // console.clear — clear output area
    clear: () => clearOutput(outputEl),

    // console.group / groupEnd — indent visually
    group:    (label = '') => appendLine(outputEl, `▾ ${label}`, 't-group-label'),
    groupEnd: ()            => appendLine(outputEl, '', 't-group-end'),

    // console.assert
    assert: (cond, ...args) => {
      if (!cond) appendLine(outputEl, `✖ Assertion failed: ${formatArgs(args)}`, 't-error-raw');
    },

    // console.count (simple version)
    count: (label = 'default') => {
      const key = `__ako_count_${label}`;
      window[key] = (window[key] || 0) + 1;
      appendLine(outputEl, `${label}: ${window[key]}`, 't-info');
    },

    // console.time / timeEnd
    time: (label = 'default') => {
      window[`__ako_time_${label}`] = performance.now();
    },
    timeEnd: (label = 'default') => {
      const start = window[`__ako_time_${label}`];
      if (start !== undefined) {
        const ms = (performance.now() - start).toFixed(2);
        appendLine(outputEl, `${label}: ${ms}ms`, 't-info');
        delete window[`__ako_time_${label}`];
      }
    },
  };
}

// ── Custom prompt() ───────────────────────────────────────────

function buildPrompt(outputEl, inputBarEl) {
  return (question = '') => new Promise(resolve => {
    // Show question in output
    if (question) {
      appendLine(outputEl, question, 't-prompt-q');
    }

    if (!inputBarEl) {
      // Fallback if no input bar
      resolve('');
      return;
    }

    const labelEl = inputBarEl.querySelector('#terminal-prompt-label');
    const inputEl = inputBarEl.querySelector('#terminal-input');

    if (labelEl) labelEl.textContent = question ? `${truncate(question, 40)}` : 'Enter value:';
    inputBarEl.classList.remove('hidden');

    if (inputEl) {
      inputEl.value = '';
      inputEl.focus();

      const onKey = (e) => {
        if (e.key === 'Enter') {
          const val = inputEl.value;
          inputEl.removeEventListener('keydown', onKey);
          inputBarEl.classList.add('hidden');

          // Echo input back into terminal
          appendLine(outputEl, `› ${val}`, 't-input-echo');
          resolve(val);
        }
      };

      inputEl.addEventListener('keydown', onKey);
    }
  });
}

// ── Terminal Output Helpers ───────────────────────────────────

export function appendLine(outputEl, text, cssClass = 't-log') {
  // Handle multi-line strings
  const lines = String(text).split('\n');
  lines.forEach((line, i) => {
    const span = document.createElement('span');
    span.className = `t-line ${cssClass}`;
    // For indented lines after the first, add a continuation marker
    span.textContent = (i > 0 && line) ? `   ${line}` : line;
    outputEl.appendChild(span);
  });
  scrollToBottom(outputEl);
}

export function appendBanner(outputEl, text, extraClass = '') {
  const el = document.createElement('span');
  el.className = `t-banner ${extraClass}`;
  el.textContent = text;
  outputEl.appendChild(el);
  scrollToBottom(outputEl);
}

export function clearOutput(outputEl) {
  outputEl.innerHTML = '';
}

// ── ASCII Table ───────────────────────────────────────────────

function appendTable(outputEl, data) {
  if (!data || typeof data !== 'object') {
    appendLine(outputEl, String(data), 't-log');
    return;
  }

  const rows = Array.isArray(data) ? data : Object.entries(data).map(([k, v]) => ({ key: k, value: v }));
  if (!rows.length) return;

  const cols = [...new Set(rows.flatMap(r => Object.keys(r)))];
  const widths = cols.map(c => Math.max(c.length, ...rows.map(r => String(r[c] ?? '').length)));

  const hr  = '┼' + widths.map(w => '─'.repeat(w + 2)).join('┼') + '┼';
  const row = (cells) => '│' + cells.map((c, i) => ` ${String(c ?? '').padEnd(widths[i])} `).join('│') + '│';

  const lines = [hr, row(cols), hr, ...rows.map(r => row(cols.map(c => r[c] ?? ''))), hr];
  lines.forEach(l => appendLine(outputEl, l, 't-table'));
}

// ── Formatters ────────────────────────────────────────────────

function formatArgs(args) {
  return args.map(formatValue).join(' ');
}

export function formatValue(val) {
  if (val === null)      return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'string')  return val;
  if (typeof val === 'boolean') return String(val);
  if (typeof val === 'number')  return String(val);
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
  if (val instanceof Error)      return `${val.name}: ${val.message}`;
  if (Array.isArray(val)) {
    return `[ ${val.map(formatValue).join(', ')} ]`;
  }
  if (typeof val === 'object') {
    try {
      return prettyObject(val);
    } catch {
      return '[object]';
    }
  }
  return String(val);
}

function prettyObject(obj, depth = 0) {
  if (depth > 2) return '{…}';
  const entries = Object.entries(obj)
    .slice(0, 12)
    .map(([k, v]) => {
      const val = (v && typeof v === 'object' && !Array.isArray(v))
        ? prettyObject(v, depth + 1)
        : formatValue(v);
      return `${k}: ${val}`;
    });
  const suffix = Object.keys(obj).length > 12 ? ', …' : '';
  return `{ ${entries.join(', ')}${suffix} }`;
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function scrollToBottom(el) {
  el.scrollTop = el.scrollHeight;
}
