/**
 * AKO SKRIPT — fileManager.js
 * Handles save / open / new file operations.
 * Uses:
 *   - Browser File System API (download/upload) for true file I/O
 *   - localStorage for quick project persistence
 */

import { AppState, setStatus, setFilename, markUnsaved } from './app.js';

const STORAGE_KEY_PREFIX = 'akoskript_project_';
const STORAGE_INDEX_KEY  = 'akoskript_index';

// ── Get current editor content ────────────────────────────────
function getEditorContent() {
  if (!AppState.editorInstance) return '';
  // editorInstance is a CodeMirror EditorView
  return AppState.editorInstance.state.doc.toString();
}

// ── Set editor content ────────────────────────────────────────
function setEditorContent(content) {
  if (!AppState.editorInstance) return;
  AppState.editorInstance.dispatch({
    changes: {
      from: 0,
      to: AppState.editorInstance.state.doc.length,
      insert: content,
    }
  });
}

// ── New File ──────────────────────────────────────────────────
export function newFile() {
  const ext = getExtForMode(AppState.currentMode);
  const name = `untitled${ext}`;

  setEditorContent('');
  AppState.currentFile = { name, content: '' };
  setFilename(name);
  markUnsaved(false);
  setStatus('New file created');
}

// ── Open File (from <input type="file">) ─────────────────────
export function openFile(fileObj) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const content = e.target.result;
    setEditorContent(content);
    AppState.currentFile = { name: fileObj.name, content };
    setFilename(fileObj.name);
    markUnsaved(false);
    setStatus(`Opened: ${fileObj.name}`);
  };

  reader.onerror = () => {
    setStatus('Error: Could not read file');
  };

  reader.readAsText(fileObj);
}

// ── Save File (download to user's machine) ───────────────────
export function saveFile() {
  const content = getEditorContent();
  const name    = AppState.currentFile?.name || `untitled${getExtForMode(AppState.currentMode)}`;

  // Save to localStorage as well
  saveToLocalStorage(name, content);

  // Trigger browser download
  const blob = new Blob([content], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);

  AppState.currentFile = { name, content };
  markUnsaved(false);
  setStatus(`Saved: ${name}`);
}

// ── Save to localStorage ──────────────────────────────────────
export function saveToLocalStorage(name, content) {
  const key     = STORAGE_KEY_PREFIX + name;
  const project = {
    name,
    content,
    mode:      AppState.currentMode,
    savedAt:   new Date().toISOString(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(project));
    updateStorageIndex(name);
  } catch (err) {
    console.warn('[AkoSkript] localStorage save failed:', err);
  }
}

// ── Load from localStorage ────────────────────────────────────
export function loadFromLocalStorage(name) {
  const key = STORAGE_KEY_PREFIX + name;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── List saved projects ───────────────────────────────────────
export function listSavedProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ── Delete a saved project ─────────────────────────────────────
export function deleteProject(name) {
  const key = STORAGE_KEY_PREFIX + name;
  localStorage.removeItem(key);

  // Remove from index
  const index = listSavedProjects().filter(n => n !== name);
  localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
}

// ── Internal: keep a project name index ──────────────────────
function updateStorageIndex(name) {
  const index = listSavedProjects();
  if (!index.includes(name)) {
    index.push(name);
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
  }
}

// ── Helper: extension for current mode ───────────────────────
function getExtForMode(mode) {
  switch (mode) {
    case 'typescript': return '.ts';
    case 'split':      return '.html';
    default:           return '.js';
  }
}
