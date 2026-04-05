/**
 * AKO SKRIPT — app.js
 * Application entry point.
 * Handles: welcome overlay, mode switching, toolbar wiring,
 * keyboard shortcuts, status bar updates.
 */

import { initJSMode, destroyJSMode }     from './modes/jsMode.js';
import { initTSMode, destroyTSMode }     from './modes/tsMode.js';
import { initSplitMode, destroySplitMode } from './modes/splitMode.js';
import { newFile, openFile, saveFile }   from './fileManager.js';

// ── State ────────────────────────────────────────────────────
export const AppState = {
  currentMode:    null,   // 'javascript' | 'typescript' | 'split'
  currentFile:    null,   // { name, content, language }
  unsaved:        false,
  editorInstance: null,   // CodeMirror EditorView (set by mode modules)
};

// ── DOM References ───────────────────────────────────────────
const welcomeOverlay  = document.getElementById('welcome-overlay');
const appShell        = document.getElementById('app');
const mainContent     = document.getElementById('main-content');
const modeBadge       = document.getElementById('mode-badge');
const statusMode      = document.getElementById('status-mode');
const statusFilename  = document.getElementById('status-filename');
const statusMsg       = document.getElementById('status-msg');
const fileInput       = document.getElementById('file-input');

// ── Mode Labels & File Extensions ───────────────────────────
const MODE_META = {
  javascript: { label: 'JAVASCRIPT', ext: '.js',   statusLabel: 'JS' },
  typescript: { label: 'TYPESCRIPT', ext: '.ts',   statusLabel: 'TS' },
  split:      { label: 'HTML · CSS · JS', ext: '.html', statusLabel: 'HTML/CSS/JS' },
};

// ── Bootstrap ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bindWelcomeOverlay();
  bindToolbar();
  bindKeyboardShortcuts();
  bindModeButtons();
});

// ── Welcome Overlay ──────────────────────────────────────────
function bindWelcomeOverlay() {
  const modeCards = welcomeOverlay.querySelectorAll('.mode-card');

  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      const mode = card.dataset.mode;
      launchMode(mode);
    });

    // Keyboard accessibility
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

// ── Launch a Mode ─────────────────────────────────────────────
export function launchMode(mode) {
  if (!MODE_META[mode]) {
    console.warn(`[AkoSkript] Unknown mode: ${mode}`);
    return;
  }

  // Tear down previous mode if switching
  if (AppState.currentMode) {
    destroyCurrentMode();
  }

  AppState.currentMode = mode;

  // Hide welcome, show app
  welcomeOverlay.classList.add('hidden');
  appShell.classList.remove('hidden');

  // Clear main content area
  mainContent.innerHTML = '';

  // Update UI labels
  const meta = MODE_META[mode];
  modeBadge.textContent    = meta.label;
  statusMode.textContent   = meta.statusLabel;
  statusFilename.textContent = `untitled${meta.ext}`;

  // Highlight active mode button in toolbar
  document.querySelectorAll('.mode-switch-btn').forEach(btn => {
    btn.classList.toggle('active-mode', btn.dataset.mode === mode);
  });

  // Initialise the chosen mode
  switch (mode) {
    case 'javascript': initJSMode(mainContent);   break;
    case 'typescript': initTSMode(mainContent);   break;
    case 'split':      initSplitMode(mainContent); break;
  }

  setStatus(`${meta.label} mode ready`);
}

// ── Destroy Current Mode ─────────────────────────────────────
function destroyCurrentMode() {
  switch (AppState.currentMode) {
    case 'javascript': destroyJSMode();    break;
    case 'typescript': destroyTSMode();    break;
    case 'split':      destroySplitMode(); break;
  }
  AppState.editorInstance = null;
}

// ── Toolbar Bindings ──────────────────────────────────────────
function bindToolbar() {
  document.getElementById('btn-new').addEventListener('click',   handleNew);
  document.getElementById('btn-open').addEventListener('click',  handleOpen);
  document.getElementById('btn-save').addEventListener('click',  handleSave);
  document.getElementById('btn-run').addEventListener('click',   handleRun);
  document.getElementById('btn-clear').addEventListener('click', handleClear);

  // File input for open dialog
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) openFile(file);
    fileInput.value = ''; // reset so same file can be reopened
  });
}

// ── Toolbar Button Handlers ───────────────────────────────────
function handleNew() {
  if (AppState.unsaved) {
    if (!confirm('You have unsaved changes. Start a new file anyway?')) return;
  }
  newFile();
}

function handleOpen() {
  fileInput.click();
}

function handleSave() {
  saveFile();
}

export function handleRun() {
  // Delegated to the active mode module via a custom event
  mainContent.dispatchEvent(new CustomEvent('ako:run'));
}

export function handleClear() {
  mainContent.dispatchEvent(new CustomEvent('ako:clear'));
}

// ── Mode Switch Buttons in Toolbar ────────────────────────────
function bindModeButtons() {
  document.querySelectorAll('.mode-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newMode = btn.dataset.mode;
      if (newMode === AppState.currentMode) return;

      if (AppState.unsaved) {
        if (!confirm('Switching mode will discard unsaved changes. Continue?')) return;
      }
      launchMode(newMode);
    });
  });
}

// ── Keyboard Shortcuts ────────────────────────────────────────
function bindKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (!ctrl) return;

    switch (e.key.toLowerCase()) {
      case 'enter': e.preventDefault(); handleRun();   break;
      case 's':     e.preventDefault(); handleSave();  break;
      case 'o':     e.preventDefault(); handleOpen();  break;
      case 'n':     e.preventDefault(); handleNew();   break;
    }
  });
}

// ── Status Bar Helpers ────────────────────────────────────────
export function setStatus(msg, duration = 4000) {
  statusMsg.textContent = msg;
  if (duration > 0) {
    setTimeout(() => {
      statusMsg.textContent = 'Ready';
    }, duration);
  }
}

export function setFilename(name) {
  statusFilename.textContent = name;
  AppState.currentFile = { ...(AppState.currentFile || {}), name };
}

export function setCursorPos(line, col) {
  document.getElementById('status-cursor').textContent = `Ln ${line}, Col ${col}`;
}

export function markUnsaved(flag = true) {
  AppState.unsaved = flag;
  const el = document.querySelector('.file-name-display');
  if (el) el.classList.toggle('unsaved', flag);
}

// ── Show welcome overlay (used by "switch mode" flow) ─────────
export function showWelcome() {
  appShell.classList.add('hidden');
  welcomeOverlay.classList.remove('hidden');
  destroyCurrentMode();
  AppState.currentMode = null;
}
