/**
 * AKO SKRIPT — transpiler.js
 * TypeScript → JavaScript in-browser transpilation.
 * Uses the TypeScript compiler loaded via CDN in index.html.
 *
 * Phase 4 will expand this with:
 *   - Full diagnostic collection (TS error codes)
 *   - Source map support
 *   - Strict mode toggle
 */

// ── TypeScript availability check ────────────────────────────
function getTSCompiler() {
  if (typeof window.ts === 'undefined') {
    throw new Error(
      'TypeScript compiler not loaded. ' +
      'Ensure the TypeScript CDN script tag is present in index.html.'
    );
  }
  return window.ts;
}

// ── Default compiler options ──────────────────────────────────
const DEFAULT_TS_OPTIONS = {
  module:           1,     // CommonJS
  target:           99,    // ESNext
  strict:           false, // relaxed for beginners — Phase 4 will expose toggle
  noEmitOnError:    false,
  experimentalDecorators: true,
  emitDecoratorMetadata:  false,
  jsx:              0,     // None
  removeComments:   false,
  sourceMap:        false,
};

// ── Transpile TypeScript source to JavaScript ─────────────────
/**
 * @param {string} tsSource  - TypeScript source code
 * @param {object} options   - Optional compiler option overrides
 * @returns {{ js: string, diagnostics: TSTeachableDiagnostic[] }}
 */
export function transpile(tsSource, options = {}) {
  const ts = getTSCompiler();

  const compilerOptions = { ...DEFAULT_TS_OPTIONS, ...options };

  // Collect diagnostics
  const diagnostics = [];

  // Transpile using ts.transpileModule (single-file, no type checking)
  // Full type checking requires a language service — Phase 4 enhancement
  const result = ts.transpileModule(tsSource, {
    compilerOptions,
    reportDiagnostics: true,
    moduleName: 'ako-skript-module',
  });

  // Map any transpile-level diagnostics
  if (result.diagnostics && result.diagnostics.length > 0) {
    result.diagnostics.forEach(d => {
      diagnostics.push(mapDiagnostic(ts, d, tsSource));
    });
  }

  return {
    js:          result.outputText,
    diagnostics,
  };
}

// ── Full type-check (Phase 4 — service-based) ─────────────────
/**
 * Runs a full TypeScript type check on the provided source.
 * Returns structured diagnostics matching the TS error catalog.
 * @param {string} tsSource
 * @returns {TSTeachableDiagnostic[]}
 */
export function typeCheck(tsSource) {
  // Phase 4 implementation.
  // Requires ts.createLanguageService with a virtual file system.
  // Returns [] for now so callers can safely destructure.
  return [];
}

// ── Diagnostic Mapper ─────────────────────────────────────────
/**
 * Maps a raw TS diagnostic to our teaching-catalog-compatible shape.
 * @typedef  {object} TSTeachableDiagnostic
 * @property {number}  code       - TS error number (e.g. 2304)
 * @property {string}  message    - Human-readable message
 * @property {number|null} line   - 1-based line number
 * @property {number|null} col    - 1-based column number
 * @property {'error'|'warning'|'info'} severity
 */
function mapDiagnostic(ts, d, source) {
  let line = null;
  let col  = null;

  if (d.file && d.start !== undefined) {
    const pos = d.file.getLineAndCharacterOfPosition(d.start);
    line = pos.line + 1;
    col  = pos.character + 1;
  } else if (typeof d.start === 'number' && source) {
    // Inline source — compute from offset
    const before = source.slice(0, d.start);
    line = (before.match(/\n/g) || []).length + 1;
    col  = d.start - before.lastIndexOf('\n');
  }

  const severity =
    d.category === 1 ? 'error'   :
    d.category === 0 ? 'warning' : 'info';

  return {
    code:     d.code,
    message:  ts.flattenDiagnosticMessageText(d.messageText, '\n'),
    line,
    col,
    severity,
  };
}

// ── Format diagnostics for the terminal ──────────────────────
/**
 * Converts an array of diagnostics to terminal-ready strings.
 * @param {TSTeachableDiagnostic[]} diagnostics
 * @returns {string[]}
 */
export function formatDiagnostics(diagnostics) {
  return diagnostics.map(d => {
    const loc = (d.line !== null) ? ` [${d.line}:${d.col}]` : '';
    const prefix = d.severity === 'error' ? 'TS Error' :
                   d.severity === 'warning' ? 'TS Warning' : 'TS Info';
    return `${prefix} TS${d.code}${loc}: ${d.message}`;
  });
}
