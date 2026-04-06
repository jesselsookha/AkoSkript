/**
 * AKO SKRIPT — editor.js
 * Shared CodeMirror 6 factory used by all three mode modules.
 */

const CDN = 'https://esm.sh';

// Module cache — loaded once, reused
let _loaded = false;
let _CM = {};

async function loadModules() {
  if (_loaded) return _CM;

  const [view, commands, language, autocomplete, search, langJS, langHTML, langCSS, lezerHL] =
    await Promise.all([
      import(`${CDN}/@codemirror/view@6`),
      import(`${CDN}/@codemirror/commands@6`),
      import(`${CDN}/@codemirror/language@6`),
      import(`${CDN}/@codemirror/autocomplete@6`),
      import(`${CDN}/@codemirror/search@6`),
      import(`${CDN}/@codemirror/lang-javascript@6`),
      import(`${CDN}/@codemirror/lang-html@6`),
      import(`${CDN}/@codemirror/lang-css@6`),
      import(`${CDN}/@lezer/highlight@1`),
    ]);

  _CM = { view, commands, language, autocomplete, search, langJS, langHTML, langCSS, lezerHL };
  _loaded = true;

  // Expose EditorView globally for fileManager
  window._AKO_CM_ = { EditorView: view.EditorView };

  return _CM;
}

// ── Language support loader ───────────────────────────────────
function getLanguageSupport(lang, CM) {
  switch (lang) {
    case 'typescript': return CM.langJS.javascript({ typescript: true });
    case 'html':       return CM.langHTML.html();
    case 'css':        return CM.langCSS.css();
    default:           return CM.langJS.javascript();
  }
}

// ── Ako Skript syntax highlight style ────────────────────────
function buildHighlightStyle(CM) {
  const { HighlightStyle, syntaxHighlighting } = CM.language;
  const { tags } = CM.lezerHL;

  const style = HighlightStyle.define([
    { tag: tags.keyword,                         color: '#a7c957' },
    { tag: tags.controlKeyword,                  color: '#a7c957' },
    { tag: tags.moduleKeyword,                   color: '#a7c957' },
    { tag: tags.string,                          color: '#c5a06e' },
    { tag: tags.number,                          color: '#8ec07c' },
    { tag: tags.bool,                            color: '#a7c957' },
    { tag: tags.null,                            color: '#4a6b4a', fontStyle: 'italic' },
    { tag: tags.comment,                         color: '#4a6b4a', fontStyle: 'italic' },
    { tag: tags.variableName,                    color: '#d4e8a0' },
    { tag: tags.definition(tags.variableName),   color: '#d4b896' },
    { tag: tags.function(tags.variableName),     color: '#6a994e' },
    { tag: tags.typeName,                        color: '#7ec8c8' },
    { tag: tags.className,                       color: '#e0c07a' },
    { tag: tags.propertyName,                    color: '#d4b896' },
    { tag: tags.operator,                        color: '#f2e8cf', opacity: '0.8' },
    { tag: tags.punctuation,                     color: '#6a994e' },
    { tag: tags.bracket,                         color: '#6a994e' },
    { tag: tags.tagName,                         color: '#6a994e' },
    { tag: tags.attributeName,                   color: '#a7c957', opacity: '0.85' },
    { tag: tags.attributeValue,                  color: '#c5a06e' },
    { tag: tags.self,                            color: '#7ec8c8' },
  ]);

  return syntaxHighlighting(style);
}

// ── Theme ─────────────────────────────────────────────────────
function buildTheme(CM) {
  return CM.view.EditorView.theme({
    '&': {
      height: '100%',
      background: 'var(--bg-panel)',
      color: 'var(--text-primary)',
      fontFamily: "'Fira Mono', 'Share Tech Mono', monospace",
      fontSize: '13.5px',
    },
    '.cm-content':    { padding: '10px 0', caretColor: 'var(--yellow-green)' },
    '.cm-cursor':     { borderLeftColor: 'var(--yellow-green)', borderLeftWidth: '2px' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground':
                      { background: 'rgba(106,153,78,0.25)' },
    '.cm-activeLine': { background: 'rgba(56,102,65,0.15)' },
    '.cm-activeLineGutter': { background: 'rgba(56,102,65,0.20)' },
    '.cm-gutters':    {
      background: 'var(--bg-panel-alt)',
      borderRight: '1px solid var(--border-dim)',
      color: 'var(--text-dim)',
      fontFamily: "'Share Tech Mono', monospace",
    },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 10px 0 6px', fontSize: '11.5px' },
    '.cm-lineNumbers .cm-activeLineGutter': { color: 'var(--text-secondary)' },
    '.cm-matchingBracket': { background: 'rgba(167,201,87,0.2)', outline: '1px solid var(--yellow-green)' },
    '.cm-tooltip': {
      background: 'var(--bg-panel-alt)',
      border: '1px solid var(--border-primary)',
      color: 'var(--text-primary)',
    },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      background: 'var(--hunter-green)',
      color: 'var(--vanilla-cream)',
    },
  }, { dark: true });
}

// ── Main factory ──────────────────────────────────────────────
/**
 * Creates a CodeMirror 6 EditorView.
 * @param {HTMLElement} parent
 * @param {object} options
 *   - doc       {string}   initial content
 *   - language  {string}   'javascript'|'typescript'|'html'|'css'
 *   - onChange  {Function} (view) => void — called when doc changes
 *   - onCursor  {Function} (line, col) => void
 *   - extraKeys {Array}    [{key, run}] additional keybindings
 * @returns {Promise<EditorView>}
 */
export async function createEditor(parent, options = {}) {
  const { doc = '', language = 'javascript', onChange, onCursor, extraKeys = [] } = options;

  const CM = await loadModules();
  const { view: V, commands: C, language: L, autocomplete: A, search: S } = CM;
  const {
    EditorView, keymap, lineNumbers, highlightActiveLine,
    highlightActiveLineGutter, drawSelection, dropCursor,
  } = V;
  const { defaultKeymap, historyKeymap, history, indentWithTab } = C;
  const { indentOnInput, bracketMatching, codeFolding, foldGutter } = L;
  const { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } = A;
  const { search, searchKeymap } = S;

  const langSupport  = getLanguageSupport(language, CM);
  const akoTheme     = buildTheme(CM);
  const akoHighlight = buildHighlightStyle(CM);

  const updateListener = EditorView.updateListener.of(update => {
    if (update.docChanged  && onChange) onChange(update.view);
    if (update.selectionSet && onCursor) {
      const sel  = update.state.selection.main;
      const line = update.state.doc.lineAt(sel.from);
      onCursor(line.number, sel.from - line.from + 1);
    }
  });

  const callerKeys = extraKeys.length ? keymap.of(extraKeys) : [];

  const extensions = [
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    drawSelection(),
    dropCursor(),
    history(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    codeFolding(),
    foldGutter(),
    autocompletion(),
    search({ top: true }),
    langSupport,
    akoTheme,
    akoHighlight,
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...completionKeymap,
      ...searchKeymap,
      indentWithTab,
    ]),
    callerKeys,
    updateListener,
  ];

  return new EditorView({ doc, extensions, parent });
}

export function getDoc(view) {
  return view ? view.state.doc.toString() : '';
}

export function setDoc(view, content) {
  if (!view) return;
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: content }
  });
}