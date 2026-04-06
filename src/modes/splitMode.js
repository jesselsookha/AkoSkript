/**
 * AKO SKRIPT — splitMode.js
 * HTML / CSS / JS four-panel split mode.
 * Currently renders a placeholder panel — full implementation in Phase 5.
 * This file MUST exist to prevent import errors in app.js.
 */

import { AppState, setStatus } from '../app.js';

export async function initSplitMode(container) {
  container.innerHTML = `
    <div style="
      flex:1; display:flex; align-items:center; justify-content:center;
      flex-direction:column; gap:14px;
      font-family:var(--font-ui); color:var(--text-dim);
    ">
      <div style="display:flex; gap:8px; font-family:var(--font-display); font-size:42px;">
        <span style="color:var(--blushed-brick);">H</span>
        <span style="color:#4a90d9;">C</span>
        <span style="color:var(--yellow-green);">J</span>
      </div>
      <div style="font-size:13px; letter-spacing:1px;">
        HTML &middot; CSS &middot; JS split mode &mdash; coming in Phase 5
      </div>
      <div style="font-size:11px; opacity:0.6;">
        Three editors + live preview panel
      </div>
    </div>
  `;
  setStatus('HTML/CSS/JS split mode — coming soon', 4000);
}

export function destroySplitMode() {
  AppState.editorInstance = null;
}