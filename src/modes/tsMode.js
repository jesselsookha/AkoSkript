/**
 * AKO SKRIPT — tsMode.js
 * TypeScript editor mode.
 * Currently renders a placeholder panel — full implementation in Phase 4.
 * This file MUST exist to prevent import errors in app.js.
 */

import { AppState, setStatus } from '../app.js';

export async function initTSMode(container) {
  container.innerHTML = `
    <div style="
      flex:1; display:flex; align-items:center; justify-content:center;
      flex-direction:column; gap:14px;
      font-family:var(--font-ui); color:var(--text-dim);
    ">
      <div style="
        font-family:var(--font-display); font-size:48px;
        color:var(--sage-green);
        text-shadow:0 0 12px rgba(106,153,78,0.4);
      ">TS</div>
      <div style="font-size:13px; letter-spacing:1px;">
        TypeScript mode &mdash; coming in Phase 4
      </div>
      <div style="font-size:11px; opacity:0.6;">
        Full in-browser TypeScript compilation with error catalog
      </div>
    </div>
  `;
  setStatus('TypeScript mode — coming soon', 4000);
}

export function destroyTSMode() {
  AppState.editorInstance = null;
}