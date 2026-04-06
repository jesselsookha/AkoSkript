/**
 * AKO SKRIPT — fileManager.js
 * Save / open / new file + localStorage project persistence.
 */

import { AppState, setStatus, setFilename, markUnsaved } from './app.js';

const PREFIX    = 'akoskript_proj_';
const INDEX_KEY = 'akoskript_index';

// ── Get / Set editor content via AppState.editorInstance ─────
function getContent() {
  if (!AppState.editorInstance) return '';
  return AppState.editorInstance.state.doc.toString();
}
function setContent(text) {
  if (!AppState.editorInstance) return;
  AppState.editorInstance.dispatch({
    changes: { from: 0, to: AppState.editorInstance.state.doc.length, insert: text }
  });
}

// ── New ───────────────────────────────────────────────────────
export function newFile() {
  const ext  = extForMode(AppState.currentMode);
  const name = `untitled${ext}`;
  setContent('');
  AppState.currentFile = { name, content: '' };
  setFilename(name);
  markUnsaved(false);
  setStatus('New file created');
}

// ── Open ──────────────────────────────────────────────────────
export function openFile(fileObj) {
  const reader = new FileReader();
  reader.onload = e => {
    const content = e.target.result;
    setContent(content);
    AppState.currentFile = { name: fileObj.name, content };
    setFilename(fileObj.name);
    markUnsaved(false);
    setStatus(`Opened: ${fileObj.name}`);
  };
  reader.onerror = () => setStatus('Error reading file');
  reader.readAsText(fileObj);
}

// ── Save (download + localStorage) ───────────────────────────
export function saveFile() {
  const content = getContent();
  const name    = AppState.currentFile?.name || `untitled${extForMode(AppState.currentMode)}`;

  // localStorage
  try {
    const data = { name, content, mode: AppState.currentMode, savedAt: new Date().toISOString() };
    localStorage.setItem(PREFIX + name, JSON.stringify(data));
    const idx = listProjects();
    if (!idx.includes(name)) {
      idx.push(name);
      localStorage.setItem(INDEX_KEY, JSON.stringify(idx));
    }
  } catch (e) { console.warn('localStorage save failed', e); }

  // Download
  const blob = new Blob([content], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);

  AppState.currentFile = { name, content };
  markUnsaved(false);
  setStatus(`Saved: ${name}`);
}

// ── localStorage helpers ──────────────────────────────────────
export function listProjects() {
  try { return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]'); }
  catch { return []; }
}
export function loadProject(name) {
  try { return JSON.parse(localStorage.getItem(PREFIX + name) || 'null'); }
  catch { return null; }
}
export function deleteProject(name) {
  localStorage.removeItem(PREFIX + name);
  const idx = listProjects().filter(n => n !== name);
  localStorage.setItem(INDEX_KEY, JSON.stringify(idx));
}

function extForMode(mode) {
  if (mode === 'typescript') return '.ts';
  if (mode === 'split')      return '.html';
  return '.js';
}