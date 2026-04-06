/**
 * AKO SKRIPT — transpiler.js
 * TypeScript → JavaScript in-browser transpilation.
 * Phase 4 will expand with full type checking and diagnostic collection.
 */

const DEFAULT_OPTIONS = {
  module: 1,        // CommonJS
  target: 99,       // ESNext
  strict: false,
  noEmitOnError: false,
  experimentalDecorators: true,
};

/**
 * Transpile TypeScript to JavaScript.
 * @param {string} tsSource
 * @param {object} opts  — compiler option overrides
 * @returns {{ js: string, diagnostics: object[] }}
 */
export function transpile(tsSource, opts = {}) {
  if (typeof window.ts === 'undefined') {
    throw new Error('TypeScript compiler not loaded. Check the CDN script tag in index.html.');
  }

  const options = { ...DEFAULT_OPTIONS, ...opts };
  const result  = window.ts.transpileModule(tsSource, {
    compilerOptions: options,
    reportDiagnostics: true,
  });

  const diagnostics = (result.diagnostics || []).map(d => ({
    code:     d.code,
    message:  window.ts.flattenDiagnosticMessageText(d.messageText, '\n'),
    severity: d.category === 1 ? 'error' : d.category === 0 ? 'warning' : 'info',
    line:     null,
    col:      null,
  }));

  return { js: result.outputText, diagnostics };
}

/** Type-check only — returns diagnostics, no output. Phase 4 implementation. */
export function typeCheck(_tsSource) {
  return [];
}

/** Format diagnostics into terminal-ready strings. */
export function formatDiagnostics(diagnostics) {
  return diagnostics.map(d => {
    const loc    = d.line ? ` [${d.line}:${d.col}]` : '';
    const prefix = d.severity === 'error' ? 'TS Error' : d.severity === 'warning' ? 'TS Warning' : 'TS Info';
    return `${prefix} TS${d.code}${loc}: ${d.message}`;
  });
}