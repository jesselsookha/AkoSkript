/**
 * AKO SKRIPT — jsMode.js
 * JavaScript editor mode.
 * Sets up: CodeMirror (JS), terminal panel, runner wiring.
 * Phase 2 implementation.
 */

import { AppState, setStatus, setCursorPos, markUnsaved } from '../app.js';

let _view = null;   // CodeMirror EditorView instance

export async function initJSMode(container) {
  container.innerHTML = buildLayout();
  await mountEditor(container);
  bindRunClear(container);
  showReadyState(container);
  setStatus('JavaScript mode ready  —  Press ▶ Run or Ctrl+Enter to execute');
}

export function destroyJSMode() {
  if (_view) {
    _view.destroy();
    _view = null;
  }
  AppState.editorInstance = null;
}

// ── Layout HTML ───────────────────────────────────────────────
function buildLayout() {
  return `
    <div class="editor-panel" id="js-editor-panel" style="flex:1;min-width:0;">
      <div class="panel-header">
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="panel-corner-dot dot-red"></span>
          <span class="panel-corner-dot dot-yellow"></span>
          <span class="panel-corner-dot dot-green"></span>
          <span class="panel-label">JavaScript Editor</span>
        </div>
        <span class="file-name-display" id="js-filename">untitled.js</span>
      </div>
      <div class="cm-host" id="js-cm-host"></div>
    </div>

    <div class="panel-divider" id="js-divider"></div>

    <div class="terminal-panel" id="js-terminal-panel" style="width:40%;min-width:200px;">
      <div class="terminal-header">
        <span class="terminal-label">Console <span>Output</span></span>
        <div class="terminal-controls">
          <button class="btn btn-danger" id="js-btn-clear" style="font-size:10px;padding:2px 6px;">✕ Clear</button>
        </div>
      </div>
      <div id="terminal-output">
        <div class="terminal-empty">
          <span class="empty-line em-title">AKO SKRIPT — JavaScript Console</span>
          <span class="empty-line">Write your code in the editor.</span>
          <span class="empty-line">Press ▶ Run (or Ctrl+Enter) to execute.</span>
          <span class="empty-line">console.log() output appears here.</span>
          <span class="empty-line">prompt() will ask for input here.</span>
        </div>
      </div>
      <div id="terminal-input-line" class="hidden">
        <span class="prompt-symbol">›</span>
        <span id="terminal-prompt-label"></span>
        <input type="text" id="terminal-input" autocomplete="off" spellcheck="false" aria-label="Console input" />
      </div>
    </div>
  `;
}

// ── Mount CodeMirror ──────────────────────────────────────────
async function mountEditor(container) {
  // Dynamically import CodeMirror 6 from CDN
  const [
    { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection },
    { defaultKeymap, historyKeymap, history },
    { javascript },
    { oneDark },
    { autocompletion, closeBrackets },
    { indentOnInput, bracketMatching },
  ] = await Promise.all([
    import('https://esm.sh/@codemirror/view@6'),
    import('https://esm.sh/@codemirror/commands@6'),
    import('https://esm.sh/@codemirror/lang-javascript@6'),
    import('https://esm.sh/@codemirror/theme-one-dark@6'),
    import('https://esm.sh/@codemirror/autocomplete@6'),
    import('https://esm.sh/@codemirror/language@6'),
  ]);

  // Store for other modules to use
  window._CM_MODULES_ = { EditorView };

  const host = container.querySelector('#js-cm-host');
  if (!host) return;

  _view = new EditorView({
    doc: `// Welcome to Ako Skript — JavaScript Mode\n// Write your code below and press ▶ Run\n\nconsole.log("Hello, world!");\n`,
    extensions: [
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      drawSelection(),
      history(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      javascript(),
      oneDark,
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.updateListener.of(update => {
        if (update.docChanged) markUnsaved(true);
        if (update.selectionSet) {
          const sel  = update.state.selection.main;
          const line = update.state.doc.lineAt(sel.from);
          setCursorPos(line.number, sel.from - line.from + 1);
        }
      }),
    ],
    parent: host,
  });

  AppState.editorInstance = _view;
}

// ── Bind Run / Clear events ───────────────────────────────────
function bindRunClear(container) {
  container.addEventListener('ako:run',   () => runJS(container));
  container.addEventListener('ako:clear', () => clearTerminal(container));
  const clearBtn = container.querySelector('#js-btn-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => clearTerminal(container));
}

// ── Show ready state ──────────────────────────────────────────
function showReadyState() {
  // Empty state already shown in buildLayout()
}

// ── Run JavaScript ────────────────────────────────────────────
async function runJS(container) {
  if (!_view) return;

  const output   = container.querySelector('#terminal-output');
  const inputBar = container.querySelector('#terminal-input-line');
  if (!output) return;

  const code = _view.state.doc.toString();

  // Clear previous output
  output.innerHTML = '';
  addLine(output, 'Executing...', 't-banner t-banner-start');

  // Custom console
  const customConsole = {
    log:   (...args) => addLine(output, args.map(formatArg).join(' '), 't-log'),
    warn:  (...args) => addLine(output, args.map(formatArg).join(' '), 't-warn'),
    error: (...args) => addLine(output, args.map(formatArg).join(' '), 't-error'),
    info:  (...args) => addLine(output, args.map(formatArg).join(' '), 't-info'),
  };

  // Custom prompt — resolves via terminal input
  const customPrompt = (question = '') => new Promise(resolve => {
    addLine(output, question || 'Enter a value:', 't-prompt-q');
    if (inputBar) {
      const label = container.querySelector('#terminal-prompt-label');
      const input = container.querySelector('#terminal-input');
      if (label) label.textContent = question || '';
      inputBar.classList.remove('hidden');
      if (input) {
        input.value = '';
        input.focus();
        const handler = (e) => {
          if (e.key === 'Enter') {
            const val = input.value;
            input.removeEventListener('keydown', handler);
            inputBar.classList.add('hidden');
            addLine(output, val, 't-input-echo');
            resolve(val);
          }
        };
        input.addEventListener('keydown', handler);
      }
    }
  });

  // Execute
  try {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const fn = new AsyncFunction('console', 'prompt', code);
    await fn(customConsole, customPrompt);
    addLine(output, `Execution complete`, 't-banner t-banner-end');
    setStatus('Execution complete');
  } catch (err) {
    addLine(output, err.message, 't-error');
    // Teachable error will be wired in Phase 3 (errorEngine.js)
    addLine(output, `Execution failed — see error above`, 't-banner t-banner-end');
    setStatus('Execution error');
  }
}

// ── Clear terminal ────────────────────────────────────────────
function clearTerminal(container) {
  const output   = container.querySelector('#terminal-output');
  const inputBar = container.querySelector('#terminal-input-line');
  if (output)   output.innerHTML = '';
  if (inputBar) inputBar.classList.add('hidden');
  setStatus('Terminal cleared');
}

// ── Helpers ───────────────────────────────────────────────────
function addLine(output, text, classes = '') {
  const span = document.createElement('span');
  span.className = `t-line ${classes}`;
  span.textContent = text;
  output.appendChild(span);
  output.scrollTop = output.scrollHeight;
}

function formatArg(arg) {
  if (typeof arg === 'object' && arg !== null) {
    try { return JSON.stringify(arg, null, 2); }
    catch { return String(arg); }
  }
  return String(arg);
}
