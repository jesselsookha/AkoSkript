# Ako Skript

> **Ako** (Māori) — *to learn and to teach, simultaneously*  
> **Skript** (Old Norse) — *writing, script*

A browser-based educational code editor for JavaScript, TypeScript, and HTML/CSS/JS development.

---

## Running Locally

Because Ako Skript uses ES modules (`import`/`export`), you **cannot** open `index.html` directly via `file://`. You need a local server.

**Option A — VS Code Live Server** (recommended)
Right-click `index.html` → Open with Live Server

**Option B — Node.js**
```bash
npx serve .
```

**Option C — Python**
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`

---

## GitHub Pages

Push to your repository and enable GitHub Pages on the `main` branch root.

---

## Project Structure

```
ako-skript/
├── index.html                 App shell + welcome overlay
├── assets/
│   └── css/
│       ├── main.css           Variables, global styles, retro theme
│       ├── terminal.css       Terminal/console panel styles
│       └── editor.css         CodeMirror overrides, editor panels
├── src/
│   ├── app.js                 Bootstrap, mode switching, shortcuts
│   ├── editor.js              CodeMirror 6 shared factory
│   ├── runner.js              JS execution engine, custom console/prompt
│   ├── transpiler.js          TypeScript transpilation (Phase 4)
│   ├── fileManager.js         Save / open / localStorage
│   ├── errors/
│   │   ├── errorEngine.js     Error matching + teachable rendering
│   │   ├── jsErrors.js        JavaScript error catalog
│   │   ├── tsErrors.js        TypeScript error catalog
│   │   ├── htmlErrors.js      HTML parser error catalog
│   │   └── cssErrors.js       CSS error catalog
│   └── modes/
│       ├── jsMode.js          JavaScript mode (complete)
│       ├── tsMode.js          TypeScript mode (Phase 4)
│       └── splitMode.js       HTML/CSS/JS split mode (Phase 5)
└── data/projects/             Placeholder for saved projects
```

---

## Build Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 & 2 | Structure, shell, welcome overlay, JS mode | ✅ Complete |
| 3 | Error teaching engine — full JS/HTML/CSS catalogs | Next |
| 4 | TypeScript mode + TS error catalog | Pending |
| 5 | HTML/CSS/JS split mode + live preview | Pending |
| 6 | Save/open file management polish | Pending |
| 7 | GitHub Pages deployment + final polish | Pending |