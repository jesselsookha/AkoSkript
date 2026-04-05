/**
 * AKO SKRIPT — jsMode.js
 * JavaScript editor mode — Phase 2 (complete).
 * Wires: editor.js (CodeMirror), runner.js (execution),
 *        resizable divider, status bar, keyboard shortcuts.
 */

import { AppState, setStatus, setCursorPos, markUnsaved } from '../app.js';
import { createEditor, getDoc, setDoc }                   from '../editor.js';
import { runCode, clearOutput, appendLine }               from '../runner.js';

// ── Module state ──────────────────────────────────────────────
let _view      = null;   // CodeMirror EditorView
let _container = null;   // main-content element
let _divClean  = null;   // cleanup fn for divider drag

// ── Default starter code ──────────────────────────────────────
const JS_STARTER = `// Welcome to Ako Skript — JavaScript Mode
// Write your code in this editor, then press ▶ Run (or Ctrl+Enter)

// --- Example: variables and output ---
const name = prompt("What is your name?");
console.log("Hello, " + name + "!");

// --- Example: a simple loop ---
for (let i = 1; i <= 5; i++) {
  console.log("Count: " + i);
}
`;

// ── Init ──────────────────────────────────────────────────────
export async function initJSMode(container) {
  _container = container;

  // 1. Build layout
  container.innerHTML = buildLayout();

  // 2. Mount CodeMirror via shared editor.js
  const host = container.querySelector('#js-cm-host');
  _view = await createEditor(host, {
    doc:      JS_STARTER,
    language: 'javascript',
    onChange: () => markUnsaved(true),
    onCursor: (ln, col) => setCursorPos(ln, col),
    extraKeys: [
      {
        key: 'Ctrl-Enter',
        run: () => { triggerRun(); return true; }
      },
      {
        key: 'Mod-Enter',
        run: () => { triggerRun(); return true; }
      },
    ],
  });

  AppState.editorInstance = _view;

  // 3. Bind run / clear
  bindRunClear(container);

  // 4. Bind resizable divider
  _divClean = bindDivider(container);

  // 5. Update filename display
  updateFilenameDisplay('untitled.js');

  setStatus('JavaScript mode ready  —  ▶ Run or Ctrl+Enter to execute', 6000);
}

export function destroyJSMode() {
  if (_divClean)  _divClean();
  if (_view)      _view.destroy();
  _view      = null;
  _container = null;
  _divClean  = null;
  AppState.editorInstance = null;
}

// ── Layout ────────────────────────────────────────────────────
function buildLayout() {
  return `
    <div class="editor-panel" id="js-editor-panel"
         style="flex:1;min-width:200px;display:flex;flex-direction:column;">

      <div class="panel-header">
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="panel-corner-dot dot-red"    aria-hidden="true"></span>
          <span class="panel-corner-dot dot-yellow" aria-hidden="true"></span>
          <span class="panel-corner-dot dot-green"  aria-hidden="true"></span>
          <span class="panel-label">JavaScript Editor</span>
        </div>
        <span class="file-name-display" id="js-filename">untitled.js</span>
      </div>

      <div class="cm-host" id="js-cm-host" style="flex:1;overflow:hidden;"></div>
    </div>

    <div class="panel-divider"
         id="js-divider"
         role="separator"
         aria-label="Resize editor and terminal panels"
         tabindex="0"
         title="Drag to resize panels"></div>

    <div class="terminal-panel" id="js-terminal-panel"
         style="width:38%;min-width:220px;display:flex;flex-direction:column;">

      <div class="terminal-header">
        <span class="terminal-label">
          Console <span>Output</span>
        </span>
        <div class="terminal-controls">
          <button class="btn btn-danger"
                  id="js-btn-clear"
                  title="Clear terminal (also: click ✕ Clear in toolbar)"
                  style="font-size:10px;padding:2px 8px;">
            ✕ Clear
          </button>
        </div>
      </div>

      <div id="terminal-output" aria-live="polite" aria-label="Console output">
        <div class="terminal-empty">
          <span class="empty-line em-title">AKO SKRIPT — JavaScript Console</span>
          <span class="empty-line">&nbsp;</span>
          <span class="empty-line">Write your code in the editor.</span>
          <span class="empty-line">Press ▶ Run or <kbd>Ctrl+Enter</kbd> to execute.</span>
          <span class="empty-line">&nbsp;</span>
          <span class="empty-line">console.log()  →  prints here</span>
          <span class="empty-line">prompt()       →  prompts here</span>
        </div>
      </div>

      <div id="terminal-input-line" class="hidden" aria-label="Console input">
        <span class="prompt-symbol" aria-hidden="true">›</span>
        <span id="terminal-prompt-label"></span>
        <input type="text"
               id="terminal-input"
               autocomplete="off"
               spellcheck="false"
               aria-label="Enter a value and press Enter" />
      </div>
    </div>
  `;
}

// ── Run / Clear Bindings ──────────────────────────────────────
function bindRunClear(container) {
  container.addEventListener('ako:run',   triggerRun);
  container.addEventListener('ako:clear', triggerClear);

  const clearBtn = container.querySelector('#js-btn-clear');
  if (clearBtn) clearBtn.addEventListener('click', triggerClear);
}

function triggerRun() {
  if (!_view || !_container) return;

  const outputEl   = _container.querySelector('#terminal-output');
  const inputBarEl = _container.querySelector('#terminal-input-line');
  if (!outputEl) return;

  const code = getDoc(_view);

  runCode(code, outputEl, inputBarEl, {
    language: 'javascript',
    onStart:  () => setStatus('Running…', 0),
    onEnd:    (err) => {
      if (err) setStatus(`Error: ${err.message}`, 8000);
      else     setStatus('Execution complete', 4000);
    },
  });
}

function triggerClear() {
  if (!_container) return;
  const outputEl   = _container.querySelector('#terminal-output');
  const inputBarEl = _container.querySelector('#terminal-input-line');
  if (outputEl)   clearOutput(outputEl);
  if (inputBarEl) inputBarEl.classList.add('hidden');
  setStatus('Terminal cleared', 2000);
}

// ── Resizable Divider ─────────────────────────────────────────
/**
 * Binds mouse/touch drag on the divider to resize the two panels.
 * Returns a cleanup function to remove all listeners.
 */
function bindDivider(container) {
  const divider     = container.querySelector('#js-divider');
  const editorPanel = container.querySelector('#js-editor-panel');
  const termPanel   = container.querySelector('#js-terminal-panel');
  if (!divider || !editorPanel || !termPanel) return () => {};

  let dragging   = false;
  let startX     = 0;
  let startEdW   = 0;
  let startTermW = 0;

  const onMouseDown = (e) => {
    dragging   = true;
    startX     = e.clientX;
    startEdW   = editorPanel.getBoundingClientRect().width;
    startTermW = termPanel.getBoundingClientRect().width;
    divider.classList.add('dragging');
    document.body.style.cursor    = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const dx      = e.clientX - startX;
    const total   = startEdW + startTermW;
    const newEdW  = Math.max(200, Math.min(total - 220, startEdW + dx));
    const newTermW = total - newEdW;

    editorPanel.style.flex  = 'none';
    editorPanel.style.width = `${newEdW}px`;
    termPanel.style.width   = `${newTermW}px`;
  };

  const onMouseUp = () => {
    if (!dragging) return;
    dragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor    = '';
    document.body.style.userSelect = '';
  };

  // Keyboard resize (for accessibility — arrow keys on focused divider)
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 50 : 16;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const edW   = editorPanel.getBoundingClientRect().width;
      const termW = termPanel.getBoundingClientRect().width;
      const total = edW + termW;
      const delta = e.key === 'ArrowLeft' ? -step : step;
      const newEdW = Math.max(200, Math.min(total - 220, edW + delta));
      editorPanel.style.flex  = 'none';
      editorPanel.style.width = `${newEdW}px`;
      termPanel.style.width   = `${total - newEdW}px`;
    }
  };

  divider.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup',   onMouseUp);
  divider.addEventListener('keydown',    onKeyDown);

  // Return cleanup
  return () => {
    divider.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup',   onMouseUp);
    divider.removeEventListener('keydown',    onKeyDown);
  };
}

// ── File Management Integration ───────────────────────────────
export function getJSContent() {
  return _view ? getDoc(_view) : '';
}

export function setJSContent(content, filename = 'untitled.js') {
  if (_view) setDoc(_view, content);
  updateFilenameDisplay(filename);
  markUnsaved(false);
}

// ── Status helpers ────────────────────────────────────────────
function updateFilenameDisplay(name) {
  const el = _container?.querySelector('#js-filename');
  if (el) el.textContent = name;
}
