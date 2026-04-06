/**
 * AKO SKRIPT — jsMode.js
 * JavaScript editor mode — fully wired to editor.js and runner.js.
 */

import { AppState, setStatus, setCursorPos, markUnsaved } from '../app.js';
import { createEditor, getDoc, setDoc }                   from '../editor.js';
import { runCode, clearOutput }                           from '../runner.js';

let _view      = null;
let _container = null;
let _cleanDiv  = null;

const STARTER = `// Welcome to Ako Skript — JavaScript Mode
// Write your code here, then press \u25ba Run or Ctrl+Enter

const name = prompt("What is your name?");
console.log("Hello, " + name + "!");

for (let i = 1; i <= 5; i++) {
  console.log("Count: " + i);
}
`;

// ── Init ──────────────────────────────────────────────────────
export async function initJSMode(container) {
  _container = container;
  container.innerHTML = buildLayout();

  const host = container.querySelector('#js-cm-host');
  _view = await createEditor(host, {
    doc:      STARTER,
    language: 'javascript',
    onChange: () => markUnsaved(true),
    onCursor: (ln, col) => setCursorPos(ln, col),
    extraKeys: [
      { key: 'Ctrl-Enter', run: () => { _triggerRun(); return true; } },
      { key: 'Mod-Enter',  run: () => { _triggerRun(); return true; } },
    ],
  });

  AppState.editorInstance = _view;

  _cleanDiv = bindDivider(container);
  bindRunClear(container);

  setStatus('JavaScript mode ready  \u2014  \u25ba Run or Ctrl+Enter to execute', 6000);
}

export function destroyJSMode() {
  if (_cleanDiv) _cleanDiv();
  if (_view)     _view.destroy();
  _view = null; _container = null; _cleanDiv = null;
  AppState.editorInstance = null;
}

// ── Layout ────────────────────────────────────────────────────
function buildLayout() {
  return `
    <div class="editor-panel" id="js-editor-panel"
         style="flex:1;min-width:200px;display:flex;flex-direction:column;">
      <div class="panel-header">
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="panel-corner-dot dot-red"></span>
          <span class="panel-corner-dot dot-yellow"></span>
          <span class="panel-corner-dot dot-green"></span>
          <span class="panel-label">JavaScript Editor</span>
        </div>
        <span class="file-name-display" id="js-filename">untitled.js</span>
      </div>
      <div class="cm-host" id="js-cm-host" style="flex:1;overflow:hidden;"></div>
    </div>

    <div class="panel-divider" id="js-divider"
         role="separator" tabindex="0"
         title="Drag to resize \u2014 Arrow keys also work"></div>

    <div class="terminal-panel" id="js-terminal-panel"
         style="width:38%;min-width:220px;display:flex;flex-direction:column;">
      <div class="terminal-header">
        <span class="terminal-label">Console <span>Output</span></span>
        <div class="terminal-controls">
          <button class="btn btn-danger" id="js-btn-clear"
                  style="font-size:10px;padding:2px 8px;">\u2715 Clear</button>
        </div>
      </div>

      <div id="terminal-output" aria-live="polite">
        <div class="terminal-empty">
          <span class="empty-line em-title">AKO SKRIPT \u2014 JavaScript Console</span>
          <span class="empty-line">&nbsp;</span>
          <span class="empty-line">Write your code in the editor.</span>
          <span class="empty-line">Press \u25ba Run or Ctrl+Enter to execute.</span>
          <span class="empty-line">&nbsp;</span>
          <span class="empty-line">console.log()  \u2192  output here</span>
          <span class="empty-line">prompt()       \u2192  input here</span>
        </div>
      </div>

      <div id="terminal-input-line" class="hidden">
        <span class="prompt-symbol">\u203a</span>
        <span id="terminal-prompt-label"></span>
        <input type="text" id="terminal-input"
               autocomplete="off" spellcheck="false"
               aria-label="Enter value and press Enter" />
      </div>
    </div>
  `;
}

// ── Run / Clear ───────────────────────────────────────────────
function bindRunClear(container) {
  container.addEventListener('ako:run',   _triggerRun);
  container.addEventListener('ako:clear', _triggerClear);
  const btn = container.querySelector('#js-btn-clear');
  if (btn) btn.addEventListener('click', _triggerClear);
}

function _triggerRun() {
  if (!_view || !_container) return;
  const outputEl   = _container.querySelector('#terminal-output');
  const inputBarEl = _container.querySelector('#terminal-input-line');
  if (!outputEl) return;

  runCode(getDoc(_view), outputEl, inputBarEl, {
    language: 'javascript',
    onStart:  () => setStatus('Running\u2026', 0),
    onEnd:    err => err
      ? setStatus(`Error: ${err.message.slice(0, 60)}`, 8000)
      : setStatus('Execution complete', 4000),
  });
}

function _triggerClear() {
  if (!_container) return;
  const outputEl   = _container.querySelector('#terminal-output');
  const inputBarEl = _container.querySelector('#terminal-input-line');
  if (outputEl)   clearOutput(outputEl);
  if (inputBarEl) inputBarEl.classList.add('hidden');
  setStatus('Terminal cleared', 2000);
}

// ── Resizable divider ─────────────────────────────────────────
function bindDivider(container) {
  const divider = container.querySelector('#js-divider');
  const edPanel = container.querySelector('#js-editor-panel');
  const tmPanel = container.querySelector('#js-terminal-panel');
  if (!divider || !edPanel || !tmPanel) return () => {};

  let dragging = false, startX = 0, startEd = 0, startTm = 0;

  const onDown = e => {
    dragging = true;
    startX = e.clientX;
    startEd = edPanel.getBoundingClientRect().width;
    startTm = tmPanel.getBoundingClientRect().width;
    divider.classList.add('dragging');
    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  const onMove = e => {
    if (!dragging) return;
    const dx    = e.clientX - startX;
    const total = startEd + startTm;
    const newEd = Math.max(200, Math.min(total - 220, startEd + dx));
    edPanel.style.flex  = 'none';
    edPanel.style.width = `${newEd}px`;
    tmPanel.style.width = `${total - newEd}px`;
  };

  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor     = '';
    document.body.style.userSelect = '';
  };

  const onKey = e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const step  = e.shiftKey ? 50 : 16;
    const edW   = edPanel.getBoundingClientRect().width;
    const tmW   = tmPanel.getBoundingClientRect().width;
    const total = edW + tmW;
    const delta = e.key === 'ArrowLeft' ? -step : step;
    const newEd = Math.max(200, Math.min(total - 220, edW + delta));
    edPanel.style.flex  = 'none';
    edPanel.style.width = `${newEd}px`;
    tmPanel.style.width = `${total - newEd}px`;
  };

  divider.addEventListener('mousedown', onDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);
  divider.addEventListener('keydown',    onKey);

  return () => {
    divider.removeEventListener('mousedown', onDown);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
    divider.removeEventListener('keydown',    onKey);
  };
}

// ── Public content API (used by fileManager) ─────────────────
export function getJSContent()                      { return _view ? getDoc(_view) : ''; }
export function setJSContent(text, name = 'untitled.js') {
  if (_view) setDoc(_view, text);
  const el = _container?.querySelector('#js-filename');
  if (el) el.textContent = name;
  markUnsaved(false);
}