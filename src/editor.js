/**
 * AKO SKRIPT — editor.js
 * Shared CodeMirror 6 configuration.
 * Provides: theme, base extensions, language loader, editor factory.
 * Used by all three mode modules.
 */

// ── CDN base for ESM imports ──────────────────────────────────
const CDN = 'https://esm.sh';

// ── Lazy-loaded CM module cache ───────────────────────────────
let _cmCore    = null;
let _cmCmds    = null;
let _cmLang    = null;
let _cmAuto    = null;
let _cmSearch  = null;

// ── Load all core CodeMirror modules (once) ───────────────────
async function loadCMCore() {
  if (_cmCore) return _cmCore;

  const [view, commands, language, autocomplete, search] = await Promise.all([
    import(`${CDN}/@codemirror/view@6`),
    import(`${CDN}/@codemirror/commands@6`),
    import(`${CDN}/@codemirror/language@6`),
    import(`${CDN}/@codemirror/autocomplete@6`),
    import(`${CDN}/@codemirror/search@6`),
  ]);

  _cmCore   = view;
  _cmCmds   = commands;
  _cmLang   = language;
  _cmAuto   = autocomplete;
  _cmSearch = search;

  // Expose EditorView globally so fileManager can reference it
  window._CM_MODULES_ = { EditorView: view.EditorView };

  return _cmCore;
}

// ── Load a language support module ───────────────────────────
async function loadLanguage(lang) {
  switch (lang) {
    case 'javascript':
    case 'typescript': {
      const mod = await import(`${CDN}/@codemirror/lang-javascript@6`);
      return lang === 'typescript'
        ? mod.javascript({ typescript: true })
        : mod.javascript();
    }
    case 'html': {
      const mod = await import(`${CDN}/@codemirror/lang-html@6`);
      return mod.html();
    }
    case 'css': {
      const mod = await import(`${CDN}/@codemirror/lang-css@6`);
      return mod.css();
    }
    default:
      return [];
  }
}

// ── Ako Skript custom CM theme ────────────────────────────────
function buildAkoTheme(cmView) {
  const { EditorView } = cmView;

  return EditorView.theme({
    '&': {
      height:          '100%',
      background:      'var(--bg-panel)',
      color:           'var(--text-primary)',
      fontFamily:      "var(--font-mono)",
      fontSize:        '13.5px',
    },
    '.cm-content': {
      padding:         '10px 0',
      caretColor:      'var(--yellow-green)',
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--yellow-green)',
      borderLeftWidth: '2px',
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      background:      'rgba(106,153,78,0.25)',
    },
    '.cm-activeLine': {
      background:      'rgba(56,102,65,0.15)',
    },
    '.cm-activeLineGutter': {
      background:      'rgba(56,102,65,0.2)',
    },
    '.cm-gutters': {
      background:      'var(--bg-panel-alt)',
      borderRight:     '1px solid var(--border-dim)',
      color:           'var(--text-dim)',
      minWidth:        '42px',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding:         '0 10px 0 6px',
      fontSize:        '11.5px',
    },
    '.cm-lineNumbers .cm-activeLineGutter': {
      color:           'var(--text-secondary)',
    },
    '.cm-scroller': {
      fontFamily:      "var(--font-mono)",
      lineHeight:      '1.65',
      overflow:        'auto',
    },
    '.cm-matchingBracket': {
      background:      'rgba(167,201,87,0.2)',
      outline:         '1px solid var(--yellow-green)',
    },
    '.cm-tooltip': {
      background:      'var(--bg-panel-alt)',
      border:          '1px solid var(--border-primary)',
      color:           'var(--text-primary)',
    },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      background:      'var(--hunter-green)',
      color:           'var(--vanilla-cream)',
    },
  }, { dark: true });
}

// ── Syntax highlight override for our palette ─────────────────
async function buildHighlightStyle(cmLang) {
  const { HighlightStyle, syntaxHighlighting } = cmLang;
  const { tags } = await import(`${CDN}/@lezer/highlight@1`);

  const akoHighlight = HighlightStyle.define([
    { tag: tags.keyword,           color: '#a7c957' },   // yellow-green
    { tag: tags.string,            color: '#c5a06e' },   // warm tan
    { tag: tags.number,            color: '#8ec07c' },   // muted green
    { tag: tags.comment,           color: '#4a6b4a', fontStyle: 'italic' },
    { tag: tags.variableName,      color: '#a7c957', opacity: '0.85' },
    { tag: tags.function(tags.variableName), color: '#6a994e' },
    { tag: tags.operator,          color: '#f2e8cf', opacity: '0.8' },
    { tag: tags.typeName,          color: '#7ec8c8' },   // teal for TS types
    { tag: tags.propertyName,      color: '#d4b896' },   // warm sand
    { tag: tags.bool,              color: '#a7c957' },
    { tag: tags.null,              color: '#4a6b4a', fontStyle: 'italic' },
    { tag: tags.className,         color: '#e0c07a' },   // golden
    { tag: tags.tagName,           color: '#6a994e' },   // HTML tags
    { tag: tags.attributeName,     color: '#a7c957', opacity: '0.85' },
    { tag: tags.attributeValue,    color: '#c5a06e' },
    { tag: tags.punctuation,       color: '#6a994e' },
    { tag: tags.bracket,           color: '#6a994e' },
    { tag: tags.definition(tags.variableName), color: '#d4b896' },
    { tag: tags.moduleKeyword,     color: '#a7c957' },
    { tag: tags.self,              color: '#7ec8c8' },
  ]);

  return syntaxHighlighting(akoHighlight);
}

// ── Main factory: create a CodeMirror EditorView ──────────────
/**
 * @param {HTMLElement} parent       - Mount target element
 * @param {object}      options
 * @param {string}      options.doc          - Initial document content
 * @param {string}      options.language     - 'javascript' | 'typescript' | 'html' | 'css'
 * @param {Function}    options.onChange     - Called when document changes (view) => void
 * @param {Function}    options.onCursor     - Called with (line, col) on cursor move
 * @param {Array}       options.extraKeys    - Additional keymap bindings [{key, run}]
 * @returns {Promise<EditorView>}
 */
export async function createEditor(parent, options = {}) {
  const {
    doc        = '',
    language   = 'javascript',
    onChange   = null,
    onCursor   = null,
    extraKeys  = [],
  } = options;

  const cmView  = await loadCMCore();
  const cmCmds  = _cmCmds;
  const cmLang  = _cmLang;
  const cmAuto  = _cmAuto;
  const cmSearch = _cmSearch;

  const {
    EditorView, keymap, lineNumbers,
    highlightActiveLine, highlightActiveLineGutter,
    drawSelection, rectangularSelection,
    crosshairCursor, dropCursor,
  } = cmView;

  const {
    defaultKeymap, historyKeymap, history,
    indentWithTab, standardKeymap,
  } = cmCmds;

  const {
    indentOnInput, bracketMatching,
    foldGutter, codeFolding,
  } = cmLang;

  const {
    autocompletion, closeBrackets,
    closeBracketsKeymap, completionKeymap,
  } = cmAuto;

  const { search, searchKeymap } = cmSearch;

  const langSupport    = await loadLanguage(language);
  const akoTheme       = buildAkoTheme(cmView);
  const akoHighlight   = await buildHighlightStyle(cmLang);

  // Build update listener
  const updateListener = EditorView.updateListener.of(update => {
    if (update.docChanged && onChange) {
      onChange(update.view);
    }
    if (update.selectionSet && onCursor) {
      const sel  = update.state.selection.main;
      const line = update.state.doc.lineAt(sel.from);
      onCursor(line.number, sel.from - line.from + 1);
    }
  });

  // Extra keybindings from caller
  const callerKeys = extraKeys.length
    ? keymap.of(extraKeys)
    : [];

  const extensions = [
    // Core features
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    drawSelection(),
    dropCursor(),
    rectangularSelection(),
    crosshairCursor(),

    // Editing helpers
    history(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    codeFolding(),
    foldGutter(),

    // Autocomplete
    autocompletion(),

    // Search
    search({ top: true }),

    // Language
    langSupport,

    // Theme + highlighting
    akoTheme,
    akoHighlight,

    // Keymaps
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

  const view = new EditorView({ doc, extensions, parent });
  return view;
}

// ── Utility: get full document text from a view ───────────────
export function getDoc(view) {
  return view ? view.state.doc.toString() : '';
}

// ── Utility: replace full document content ────────────────────
export function setDoc(view, content) {
  if (!view) return;
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: content }
  });
}
