/**
 * AKO SKRIPT — app.js
 * Bootstrap, welcome overlay, mode switching, toolbar, keyboard shortcuts.
 */

import { initJSMode,    destroyJSMode    } from './modes/jsMode.js';
import { initTSMode,    destroyTSMode    } from './modes/tsMode.js';
import { initSplitMode, destroySplitMode } from './modes/splitMode.js';
import { newFile, openFile, saveFile     } from './fileManager.js';

// ── App State ────────────────────────────────────────────────
export const AppState = {
  currentMode:    null,
  currentFile:    null,
  unsaved:        false,
  editorInstance: null,
};

// ── Mode metadata ────────────────────────────────────────────
const MODE_META = {
  javascript: { label: 'JAVASCRIPT',   ext: '.js',   statusLabel: 'JS' },
  typescript: { label: 'TYPESCRIPT',   ext: '.ts',   statusLabel: 'TS' },
  split:      { label: 'HTML · CSS · JS', ext: '.html', statusLabel: 'HTML/CSS/JS' },
};

// ── DOM refs ─────────────────────────────────────────────────
const welcomeOverlay = document.getElementById('welcome-overlay');
const appShell       = document.getElementById('app');
const mainContent    = document.getElementById('main-content');
const modeBadge      = document.getElementById('mode-badge');
const statusMode     = document.getElementById('status-mode');
const statusFilename = document.getElementById('status-filename');
const fileInput      = document.getElementById('file-input');

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bindWelcomeOverlay();
  bindToolbar();
  bindModeButtons();
  bindKeyboardShortcuts();
});

// ── Welcome overlay ──────────────────────────────────────────
function bindWelcomeOverlay() {
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => launchMode(card.dataset.mode));
  });
}

// ── Launch a mode ─────────────────────────────────────────────
export function launchMode(mode) {
  if (!MODE_META[mode]) return;

  // Destroy previous mode
  if (AppState.currentMode) {
    destroyCurrentMode();
  }

  AppState.currentMode = mode;

  // Hide welcome, show app
  welcomeOverlay.classList.add('hidden');
  appShell.classList.remove('hidden');

  // Clear workspace
  mainContent.innerHTML = '';

  // Update labels
  const meta = MODE_META[mode];
  modeBadge.textContent      = meta.label;
  statusMode.textContent     = meta.statusLabel;
  statusFilename.textContent = `untitled${meta.ext}`;

  // Update active mode button
  document.querySelectorAll('.mode-switch-btn').forEach(btn => {
    btn.classList.toggle('active-mode', btn.dataset.mode === mode);
  });

  // Launch mode module
  switch (mode) {
    case 'javascript': initJSMode(mainContent);    break;
    case 'typescript': initTSMode(mainContent);    break;
    case 'split':      initSplitMode(mainContent); break;
  }

  setStatus(`${meta.label} mode ready`);
}

function destroyCurrentMode() {
  switch (AppState.currentMode) {
    case 'javascript': destroyJSMode();    break;
    case 'typescript': destroyTSMode();    break;
    case 'split':      destroySplitMode(); break;
  }
  AppState.editorInstance = null;
}

// ── Toolbar ───────────────────────────────────────────────────
function bindToolbar() {
  document.getElementById('btn-new').addEventListener('click',   handleNew);
  document.getElementById('btn-open').addEventListener('click',  () => fileInput.click());
  document.getElementById('btn-save').addEventListener('click',  handleSave);
  document.getElementById('btn-run').addEventListener('click',   handleRun);
  document.getElementById('btn-clear').addEventListener('click', handleClear);

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) openFile(file);
    fileInput.value = '';
  });
}

function handleNew() {
  if (AppState.unsaved && !confirm('Unsaved changes — start new file anyway?')) return;
  newFile();
}
function handleSave() { saveFile(); }

export function handleRun() {
  mainContent.dispatchEvent(new CustomEvent('ako:run'));
}
export function handleClear() {
  mainContent.dispatchEvent(new CustomEvent('ako:clear'));
}

// ── Mode switch buttons ───────────────────────────────────────
function bindModeButtons() {
  document.querySelectorAll('.mode-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.mode === AppState.currentMode) return;
      if (AppState.unsaved && !confirm('Switching mode will discard unsaved changes. Continue?')) return;
      launchMode(btn.dataset.mode);
    });
  });
}

// ── Keyboard shortcuts ────────────────────────────────────────
function bindKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (!ctrl) return;
    switch (e.key.toLowerCase()) {
      case 'enter': e.preventDefault(); handleRun();   break;
      case 's':     e.preventDefault(); handleSave();  break;
      case 'o':     e.preventDefault(); fileInput.click(); break;
      case 'n':     e.preventDefault(); handleNew();   break;
    }
  });
}

// ── Status bar helpers ────────────────────────────────────────
export function setStatus(msg, duration = 4000) {
  const el = document.getElementById('status-msg');
  if (!el) return;
  el.textContent = msg;
  if (duration > 0) setTimeout(() => { el.textContent = 'Ready'; }, duration);
}
export function setFilename(name) {
  statusFilename.textContent = name;
  AppState.currentFile = { ...(AppState.currentFile || {}), name };
}
export function setCursorPos(line, col) {
  const el = document.getElementById('status-cursor');
  if (el) el.textContent = `Ln ${line}, Col ${col}`;
}
export function markUnsaved(flag = true) {
  AppState.unsaved = flag;
}