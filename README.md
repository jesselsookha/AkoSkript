# Ako Skript

> **Ako** (Māori) — *to learn and to teach, simultaneously*  
> **Skript** (Old Norse) — *writing, script*

A browser-based educational code editor for JavaScript, TypeScript, and HTML/CSS/JS development. Built for students learning web development and React Native.

## Features

- **JavaScript Mode** — Editor + terminal console with custom `prompt()` and `console.log()`
- **TypeScript Mode** — In-browser TypeScript compilation with type error support
- **HTML/CSS/JS Split Mode** — Three editors + live preview panel (CodePen-style)
- **Teaching Error Engine** — Errors matched to a comprehensive catalog with student-friendly explanations
- **Save / Open** — Download files to your machine or save to browser storage

## Running Locally

1. Clone or download this repository
2. Open `index.html` in a modern browser (Chrome, Firefox, Edge)
   - **Note:** Due to ES module imports, you may need a local server:
   - `npx serve .` or `python3 -m http.server 8080`
3. Navigate to `http://localhost:8080`

## GitHub Pages

Push to your repository and enable GitHub Pages on the `main` branch root.

## Project Structure

```
ako-skript/
├── index.html              ← App shell + welcome overlay
├── assets/css/             ← Styles (main, terminal, editor)
├── src/
│   ├── app.js              ← App bootstrap + mode switching
│   ├── editor.js           ← CodeMirror configuration
│   ├── runner.js           ← Execution engine
│   ├── transpiler.js       ← TypeScript transpilation
│   ├── fileManager.js      ← Save / open / storage
│   ├── errors/             ← Error engine + catalogs
│   └── modes/              ← JS, TS, Split mode modules
└── data/projects/          ← Saved project placeholder
```

## License

MIT
