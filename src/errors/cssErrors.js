/**
 * AKO SKRIPT — cssErrors.js
 * Complete CSS error teaching catalog — CSS001 through CSS105.
 * Sourced and structured from the original AkoSkript conversation.
 */
export const CSSErrors = [

  // ════════════════════════════════
  // BATCH 1 — CSS001–015: Fundamentals
  // ════════════════════════════════
  {
    code: 'CSS001', category: 'Error',
    pattern: /missing closing brace|unclosed rule/i,
    message: 'Missing closing brace in rule.',
    explanation: 'Every CSS rule block must be closed with a }. ' +
      'Check that each { has a matching }. Missing braces are one of the most common CSS mistakes.',
    example: 'body { color: red;',
  },
  {
    code: 'CSS002', category: 'Error',
    pattern: /invalid property name/i,
    message: 'Invalid CSS property name.',
    explanation: 'The property name you wrote is not a recognised CSS property. ' +
      'Check your spelling — CSS property names use hyphens, not underscores: background-color not background_color.',
    example: 'div { colour: red; }',
  },
  {
    code: 'CSS003', category: 'Error',
    pattern: /unexpected token in property value/i,
    message: 'Unexpected token in property value.',
    explanation: 'The CSS parser found something unexpected in a property value. ' +
      'Check for missing quotes around string values, or an extra character.',
    example: 'p { font-family: Arial, ; }',
  },
  {
    code: 'CSS004', category: 'Error',
    pattern: /missing colon in declaration/i,
    message: 'Missing colon between property and value.',
    explanation: 'Every CSS declaration needs a colon between the property name and its value. ' +
      'Correct format: property: value;',
    example: 'div { color red; }',
  },
  {
    code: 'CSS005', category: 'Error',
    pattern: /invalid selector/i,
    message: 'Invalid CSS selector.',
    explanation: 'The selector you wrote is not valid CSS. ' +
      'Check for typos, unclosed brackets, or unsupported pseudo-class names.',
    example: 'div# { color: red; }',
  },
  {
    code: 'CSS006', category: 'Warning',
    pattern: /missing semicolon/i,
    message: 'Missing semicolon after declaration.',
    explanation: 'A CSS declaration should end with a semicolon. ' +
      'The last declaration before } can technically omit it, but it\'s best practice to always include it.',
    example: 'p { color: blue }',
  },
  {
    code: 'CSS007', category: 'Error',
    pattern: /unknown pseudo-class|unknown pseudo-element/i,
    message: 'Unknown pseudo-class or pseudo-element.',
    explanation: 'The pseudo-class or pseudo-element you used is not recognised. ' +
      'Check the spelling — common examples: :hover, :focus, :nth-child(), ::before, ::after.',
    example: 'a:hovr { color: red; }',
  },
  {
    code: 'CSS008', category: 'Error',
    pattern: /invalid hex color/i,
    message: 'Invalid hex colour value.',
    explanation: 'A hex colour must be exactly 3 or 6 hex digits after the #. ' +
      'Valid: #fff, #ff0000. Invalid: #gg0000 or #ff.',
    example: 'div { color: #gg0000; }',
  },
  {
    code: 'CSS009', category: 'Error',
    pattern: /invalid rgb(?:a)? syntax/i,
    message: 'Invalid rgb() or rgba() colour syntax.',
    explanation: 'rgb() takes three values (0–255 or 0%–100%). ' +
      'rgba() takes three colour values plus an alpha (0–1). ' +
      'Example: rgb(255, 0, 0) or rgba(255, 0, 0, 0.5)',
    example: 'div { color: rgb(300, -1, 0); }',
  },
  {
    code: 'CSS010', category: 'Error',
    pattern: /invalid unit/i,
    message: 'Invalid or unknown CSS unit.',
    explanation: 'The unit you used is not valid. ' +
      'Common length units: px, em, rem, %, vw, vh. ' +
      'Make sure the unit is spelled correctly and attached to the number with no space.',
    example: 'div { width: 100pixels; }',
  },
  {
    code: 'CSS011', category: 'Error',
    pattern: /value out of range/i,
    message: 'Property value is out of the allowed range.',
    explanation: 'The number you provided is outside the valid range for this property. ' +
      'For example, opacity must be between 0 and 1.',
    example: 'div { opacity: 2; }',
  },
  {
    code: 'CSS012', category: 'Error',
    pattern: /unknown at-rule/i,
    message: 'Unknown CSS at-rule.',
    explanation: 'The @ rule you wrote is not recognised. ' +
      'Valid at-rules include: @media, @keyframes, @import, @font-face, @layer, @supports.',
    example: '@unknown { }',
  },
  {
    code: 'CSS013', category: 'Error',
    pattern: /invalid @media query/i,
    message: 'Invalid @media query syntax.',
    explanation: 'The @media query syntax is incorrect. ' +
      'Example of correct syntax: @media (max-width: 768px) { ... }',
    example: '@media max-width 768px { }',
  },
  {
    code: 'CSS014', category: 'Error',
    pattern: /duplicate property/i,
    message: 'Duplicate CSS property in rule.',
    explanation: 'The same property appears more than once in the same rule. ' +
      'Only the last one takes effect. Remove the duplicate or combine them intentionally for browser fallbacks.',
    example: 'div { color: red; color: blue; }',
  },
  {
    code: 'CSS015', category: 'Error',
    pattern: /invalid @keyframes/i,
    message: 'Invalid @keyframes syntax.',
    explanation: '@keyframes must have a name and use valid percentage stops or from/to keywords. ' +
      'Example: @keyframes slide { from { left: 0; } to { left: 100px; } }',
    example: '@keyframes { from { left: 0; } }',
  },

  // ════════════════════════════════
  // BATCH 2 — CSS016–030: Values & Units
  // ════════════════════════════════
  {
    code: 'CSS016', category: 'Error',
    pattern: /invalid hsl(?:a)? syntax/i,
    message: 'Invalid hsl() or hsla() colour syntax.',
    explanation: 'hsl() takes hue (0–360), saturation (0%–100%), and lightness (0%–100%). ' +
      'Example: hsl(120, 100%, 50%)',
    example: 'div { color: hsl(400, 110%, 50%); }',
  },
  {
    code: 'CSS017', category: 'Error',
    pattern: /invalid gradient syntax/i,
    message: 'Invalid CSS gradient syntax.',
    explanation: 'Check your linear-gradient() or radial-gradient() syntax. ' +
      'Example: background: linear-gradient(to right, red, blue);',
    example: 'div { background: linear-gradient(red blue); }',
  },
  {
    code: 'CSS018', category: 'Error',
    pattern: /invalid transform/i,
    message: 'Invalid CSS transform function.',
    explanation: 'A transform function is incorrect. Common functions: ' +
      'translate(x, y), rotate(45deg), scale(1.5), skew(10deg).',
    example: 'div { transform: spin(45deg); }',
  },
  {
    code: 'CSS019', category: 'Error',
    pattern: /invalid transition/i,
    message: 'Invalid CSS transition syntax.',
    explanation: 'The transition shorthand needs: property duration timing-function delay. ' +
      'Example: transition: all 0.3s ease;',
    example: 'div { transition: 0.3s; color; }',
  },
  {
    code: 'CSS020', category: 'Error',
    pattern: /invalid animation/i,
    message: 'Invalid CSS animation syntax.',
    explanation: 'Check your animation shorthand: name duration timing-function delay iteration-count direction. ' +
      'Example: animation: slide 1s ease 0s 1 normal;',
    example: 'div { animation: 1s; }',
  },
  {
    code: 'CSS021', category: 'Error',
    pattern: /invalid calc\(\)/i,
    message: 'Invalid calc() syntax.',
    explanation: 'calc() requires operators (+, -, *, /) with spaces around + and -. ' +
      'Example: width: calc(100% - 20px);',
    example: 'div { width: calc(100%-20px); }',
  },
  {
    code: 'CSS022', category: 'Error',
    pattern: /invalid var\(\)/i,
    message: 'Invalid CSS custom property (var()) syntax.',
    explanation: 'CSS custom properties must start with -- and be referenced with var(). ' +
      'Define: --my-color: red; then use: color: var(--my-color);',
    example: 'div { color: var(my-color); }',
  },
  {
    code: 'CSS023', category: 'Error',
    pattern: /invalid z-index/i,
    message: 'Invalid z-index value.',
    explanation: 'z-index must be an integer (whole number) or auto. ' +
      'It only works on elements with a position other than static.',
    example: 'div { z-index: 1.5; }',
  },
  {
    code: 'CSS024', category: 'Error',
    pattern: /invalid font-weight/i,
    message: 'Invalid font-weight value.',
    explanation: 'font-weight accepts numeric values (100–900 in 100 steps) or keywords: ' +
      'normal, bold, lighter, bolder.',
    example: 'p { font-weight: 250; }',
  },
  {
    code: 'CSS025', category: 'Error',
    pattern: /invalid font-size/i,
    message: 'Invalid font-size value.',
    explanation: 'font-size needs a valid length unit or keyword. ' +
      'Keywords: small, medium, large, x-large. Units: px, em, rem, %.',
    example: 'p { font-size: huge; }',
  },
  {
    code: 'CSS026', category: 'Error',
    pattern: /invalid line-height/i,
    message: 'Invalid line-height value.',
    explanation: 'line-height accepts: a number (multiplier of font-size), ' +
      'a length (1.5em), a percentage, or normal.',
    example: 'p { line-height: -1; }',
  },
  {
    code: 'CSS027', category: 'Error',
    pattern: /invalid letter-spacing/i,
    message: 'Invalid letter-spacing value.',
    explanation: 'letter-spacing takes a length value or normal. ' +
      'Example: letter-spacing: 2px; or letter-spacing: 0.1em;',
    example: 'p { letter-spacing: loose; }',
  },
  {
    code: 'CSS028', category: 'Error',
    pattern: /invalid word-spacing/i,
    message: 'Invalid word-spacing value.',
    explanation: 'word-spacing takes a length value or normal. ' +
      'Example: word-spacing: 4px;',
    example: 'p { word-spacing: thick; }',
  },
  {
    code: 'CSS029', category: 'Error',
    pattern: /invalid text-decoration/i,
    message: 'Invalid text-decoration value.',
    explanation: 'text-decoration accepts: none, underline, overline, line-through, ' +
      'or a combination with a colour and style.',
    example: 'a { text-decoration: dashed; }',
  },
  {
    code: 'CSS030', category: 'Error',
    pattern: /invalid text-transform/i,
    message: 'Invalid text-transform value.',
    explanation: 'text-transform only accepts: none, uppercase, lowercase, or capitalize.',
    example: 'p { text-transform: ALLCAPS; }',
  },

  // ════════════════════════════════
  // BATCH 3 — CSS031–045: Layout
  // ════════════════════════════════
  {
    code: 'CSS031', category: 'Error',
    pattern: /invalid display value/i,
    message: 'Invalid display property value.',
    explanation: 'Common valid display values: block, inline, inline-block, flex, grid, none, contents.',
    example: 'div { display: diagonal; }',
  },
  {
    code: 'CSS032', category: 'Error',
    pattern: /invalid position value/i,
    message: 'Invalid position property value.',
    explanation: 'position accepts: static, relative, absolute, fixed, or sticky.',
    example: 'div { position: floating; }',
  },
  {
    code: 'CSS033', category: 'Error',
    pattern: /invalid overflow value/i,
    message: 'Invalid overflow value.',
    explanation: 'overflow accepts: visible, hidden, scroll, auto, or clip.',
    example: 'div { overflow: collapse; }',
  },
  {
    code: 'CSS034', category: 'Error',
    pattern: /invalid flex shorthand/i,
    message: 'Invalid flex shorthand syntax.',
    explanation: 'The flex shorthand accepts: flex-grow flex-shrink flex-basis. ' +
      'Example: flex: 1 1 auto; or just flex: 1;',
    example: 'div { flex: auto auto; }',
  },
  {
    code: 'CSS035', category: 'Error',
    pattern: /invalid grid-template/i,
    message: 'Invalid grid-template syntax.',
    explanation: 'grid-template-columns and grid-template-rows take track sizes: ' +
      'px, fr, %, auto, repeat(). Example: grid-template-columns: repeat(3, 1fr);',
    example: 'div { grid-template-columns: 3cols; }',
  },
  {
    code: 'CSS036', category: 'Error',
    pattern: /invalid border shorthand/i,
    message: 'Invalid border shorthand syntax.',
    explanation: 'border shorthand: width style colour. ' +
      'Example: border: 2px solid red; The style keyword is required.',
    example: 'div { border: 2px red; }',
  },
  {
    code: 'CSS037', category: 'Error',
    pattern: /invalid border-radius/i,
    message: 'Invalid border-radius value.',
    explanation: 'border-radius accepts length values (px, em, %) or percentages. ' +
      'Example: border-radius: 8px; or border-radius: 50%;',
    example: 'div { border-radius: round; }',
  },
  {
    code: 'CSS038', category: 'Error',
    pattern: /invalid padding/i,
    message: 'Invalid padding value.',
    explanation: 'padding requires non-negative length values. ' +
      'Shorthand: padding: top right bottom left;',
    example: 'div { padding: -10px; }',
  },
  {
    code: 'CSS039', category: 'Error',
    pattern: /invalid margin/i,
    message: 'Invalid margin value.',
    explanation: 'margin accepts length values, auto, or percentages. ' +
      'Negative margins are allowed, but percentage values are relative to the container width.',
    example: 'div { margin: undefined; }',
  },
  {
    code: 'CSS040', category: 'Error',
    pattern: /invalid width|invalid height/i,
    message: 'Invalid width or height value.',
    explanation: 'width and height accept: length values (px, em, %), auto, min-content, max-content, or fit-content.',
    example: 'div { width: stretch; }',
  },
  {
    code: 'CSS041', category: 'Error',
    pattern: /invalid background shorthand/i,
    message: 'Invalid background shorthand syntax.',
    explanation: 'background shorthand combines: color image repeat attachment position/size. ' +
      'Example: background: #fff url("img.png") no-repeat center / cover;',
    example: 'div { background: red repeat fixed sticky; }',
  },
  {
    code: 'CSS042', category: 'Error',
    pattern: /invalid background-size/i,
    message: 'Invalid background-size value.',
    explanation: 'background-size accepts: auto, cover, contain, or length values. ' +
      'Example: background-size: cover; or background-size: 200px 100px;',
    example: 'div { background-size: full; }',
  },
  {
    code: 'CSS043', category: 'Error',
    pattern: /invalid cursor value/i,
    message: 'Invalid cursor property value.',
    explanation: 'Common cursor values: auto, default, pointer, text, move, crosshair, not-allowed, grab, zoom-in.',
    example: 'div { cursor: hand-pointer; }',
  },
  {
    code: 'CSS044', category: 'Error',
    pattern: /invalid box-shadow/i,
    message: 'Invalid box-shadow syntax.',
    explanation: 'box-shadow: offset-x offset-y blur-radius spread-radius colour. ' +
      'Example: box-shadow: 2px 2px 8px 0 rgba(0,0,0,0.3);',
    example: 'div { box-shadow: solid 5px black; }',
  },
  {
    code: 'CSS045', category: 'Error',
    pattern: /invalid text-shadow/i,
    message: 'Invalid text-shadow syntax.',
    explanation: 'text-shadow: offset-x offset-y blur-radius colour. ' +
      'Example: text-shadow: 1px 1px 2px rgba(0,0,0,0.5);',
    example: 'p { text-shadow: black; }',
  },

  // ════════════════════════════════
  // BATCH 4 — CSS046–060: Advanced Properties
  // ════════════════════════════════
  {
    code: 'CSS046', category: 'Error',
    pattern: /invalid opacity/i,
    message: 'Invalid opacity value.',
    explanation: 'opacity must be a number between 0 (fully transparent) and 1 (fully opaque). ' +
      'Example: opacity: 0.5;',
    example: 'div { opacity: 50%; }',
  },
  {
    code: 'CSS047', category: 'Error',
    pattern: /invalid filter/i,
    message: 'Invalid filter property syntax.',
    explanation: 'CSS filter functions: blur(px), brightness(%), contrast(%), ' +
      'grayscale(%), saturate(%), hue-rotate(deg). ' +
      'Example: filter: blur(4px) brightness(120%);',
    example: 'div { filter: greyscale; }',
  },
  {
    code: 'CSS048', category: 'Error',
    pattern: /invalid clip-path/i,
    message: 'Invalid clip-path value.',
    explanation: 'clip-path accepts: none, url(), inset(), circle(), ellipse(), polygon(). ' +
      'Example: clip-path: circle(50% at center);',
    example: 'div { clip-path: round; }',
  },
  {
    code: 'CSS049', category: 'Error',
    pattern: /invalid object-fit/i,
    message: 'Invalid object-fit value.',
    explanation: 'object-fit accepts: fill, contain, cover, none, or scale-down.',
    example: 'img { object-fit: stretch; }',
  },
  {
    code: 'CSS050', category: 'Error',
    pattern: /invalid resize value/i,
    message: 'Invalid resize value.',
    explanation: 'resize accepts: none, both, horizontal, or vertical. ' +
      'Note: resize only works on elements with overflow other than visible.',
    example: 'textarea { resize: all; }',
  },
  {
    code: 'CSS051', category: 'Error',
    pattern: /invalid outline/i,
    message: 'Invalid outline shorthand.',
    explanation: 'outline shorthand: width style colour — the style keyword is required. ' +
      'Example: outline: 2px solid blue;',
    example: 'div { outline: 2px blue; }',
  },
  {
    code: 'CSS052', category: 'Error',
    pattern: /invalid table-layout/i,
    message: 'Invalid table-layout value.',
    explanation: 'table-layout accepts: auto or fixed.',
    example: 'table { table-layout: equal; }',
  },
  {
    code: 'CSS053', category: 'Error',
    pattern: /invalid border-collapse/i,
    message: 'Invalid border-collapse value.',
    explanation: 'border-collapse only accepts: separate or collapse.',
    example: 'table { border-collapse: merge; }',
  },
  {
    code: 'CSS054', category: 'Error',
    pattern: /invalid vertical-align/i,
    message: 'Invalid vertical-align value.',
    explanation: 'vertical-align accepts keywords: baseline, top, middle, bottom, text-top, text-bottom, sub, super. ' +
      'Or a length value.',
    example: 'td { vertical-align: center; }',
  },
  {
    code: 'CSS055', category: 'Error',
    pattern: /invalid text-align/i,
    message: 'Invalid text-align value.',
    explanation: 'text-align accepts: left, right, center, justify, start, end.',
    example: 'p { text-align: middle; }',
  },
  {
    code: 'CSS056', category: 'Error',
    pattern: /invalid flex-direction/i,
    message: 'Invalid flex-direction value.',
    explanation: 'flex-direction accepts: row, row-reverse, column, or column-reverse.',
    example: 'div { flex-direction: diagonal; }',
  },
  {
    code: 'CSS057', category: 'Error',
    pattern: /invalid justify-content/i,
    message: 'Invalid justify-content value.',
    explanation: 'justify-content accepts: flex-start, flex-end, center, space-between, space-around, space-evenly.',
    example: 'div { justify-content: spread; }',
  },
  {
    code: 'CSS058', category: 'Error',
    pattern: /invalid align-items/i,
    message: 'Invalid align-items value.',
    explanation: 'align-items accepts: stretch, flex-start, flex-end, center, baseline.',
    example: 'div { align-items: middle; }',
  },
  {
    code: 'CSS059', category: 'Error',
    pattern: /invalid flex-wrap/i,
    message: 'Invalid flex-wrap value.',
    explanation: 'flex-wrap accepts: nowrap, wrap, or wrap-reverse.',
    example: 'div { flex-wrap: yes; }',
  },
  {
    code: 'CSS060', category: 'Error',
    pattern: /invalid grid-gap|invalid gap/i,
    message: 'Invalid gap value.',
    explanation: 'gap (or grid-gap) accepts non-negative length values or percentages. ' +
      'Example: gap: 16px; or gap: 1rem 2rem;',
    example: 'div { gap: auto; }',
  },

  // ════════════════════════════════
  // BATCH 5 — CSS061–075
  // ════════════════════════════════
  {
    code: 'CSS061', category: 'Error',
    pattern: /invalid @supports syntax/i,
    message: 'Invalid @supports syntax.',
    explanation: '@supports tests for CSS feature support. ' +
      'Syntax: @supports (property: value) { ... } ' +
      'Example: @supports (display: grid) { ... }',
    example: '@supports display grid { }',
  },
  {
    code: 'CSS062', category: 'Error',
    pattern: /invalid @font-face/i,
    message: 'Invalid @font-face syntax.',
    explanation: '@font-face requires at minimum font-family and src. ' +
      'Example: @font-face { font-family: "MyFont"; src: url("font.woff2"); }',
    example: '@font-face { font-family; }',
  },
  {
    code: 'CSS063', category: 'Error',
    pattern: /invalid @import/i,
    message: 'Invalid @import syntax.',
    explanation: '@import must be at the top of the stylesheet before any rules. ' +
      'Syntax: @import url("file.css"); or @import "file.css";',
    example: '@import styles.css;',
  },
  {
    code: 'CSS064', category: 'Error',
    pattern: /invalid counter-reset|invalid counter-increment/i,
    message: 'Invalid counter property.',
    explanation: 'counter-reset and counter-increment take a valid identifier and optional number. ' +
      'Example: counter-reset: section; counter-increment: section 1;',
    example: 'ol { counter-reset: 123counter; }',
  },
  {
    code: 'CSS065', category: 'Error',
    pattern: /invalid content value/i,
    message: 'Invalid content property value.',
    explanation: 'content is used in ::before and ::after pseudoelements. ' +
      'It accepts: strings "text", counter(), attr(), url(), or none/normal. ' +
      'Example: content: "• ";',
    example: '::before { content: red; }',
  },
  {
    code: 'CSS066', category: 'Error',
    pattern: /invalid will-change/i,
    message: 'Invalid will-change value.',
    explanation: 'will-change hints to the browser about what will change. ' +
      'Use property names: will-change: transform; or will-change: opacity; ' +
      'Avoid: will-change: all;',
    example: 'div { will-change: everything; }',
  },
  {
    code: 'CSS067', category: 'Error',
    pattern: /invalid scroll-behavior/i,
    message: 'Invalid scroll-behavior value.',
    explanation: 'scroll-behavior accepts: auto or smooth.',
    example: 'html { scroll-behavior: fast; }',
  },
  {
    code: 'CSS068', category: 'Error',
    pattern: /invalid mix-blend-mode/i,
    message: 'Invalid mix-blend-mode value.',
    explanation: 'mix-blend-mode controls how an element blends with what is behind it. ' +
      'Valid values: normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn, difference, exclusion.',
    example: 'div { mix-blend-mode: blend; }',
  },
  {
    code: 'CSS069', category: 'Error',
    pattern: /invalid isolation/i,
    message: 'Invalid isolation value.',
    explanation: 'isolation accepts: auto or isolate. ' +
      'Use isolate to create a new stacking context.',
    example: 'div { isolation: true; }',
  },
  {
    code: 'CSS070', category: 'Error',
    pattern: /invalid grid-column|invalid grid-row/i,
    message: 'Invalid grid-column or grid-row value.',
    explanation: 'grid-column and grid-row use line numbers or named lines. ' +
      'Examples: grid-column: 1 / 3; or grid-column: span 2;',
    example: 'div { grid-column: A / B; }',
  },
  {
    code: 'CSS071', category: 'Error',
    pattern: /invalid grid-area/i,
    message: 'Invalid grid-area value.',
    explanation: 'grid-area places an item using named grid areas defined in grid-template-areas, ' +
      'or using line numbers: grid-area: row-start / col-start / row-end / col-end;',
    example: 'div { grid-area: 1 / 2 / 3; }',
  },
  {
    code: 'CSS072', category: 'Error',
    pattern: /invalid place-items/i,
    message: 'Invalid place-items value.',
    explanation: 'place-items is shorthand for align-items and justify-items. ' +
      'Example: place-items: center start;',
    example: 'div { place-items: middle; }',
  },
  {
    code: 'CSS073', category: 'Error',
    pattern: /invalid place-content/i,
    message: 'Invalid place-content value.',
    explanation: 'place-content is shorthand for align-content and justify-content. ' +
      'Example: place-content: space-between center;',
    example: 'div { place-content: spread evenly; }',
  },
  {
    code: 'CSS074', category: 'Error',
    pattern: /invalid place-self/i,
    message: 'Invalid place-self value.',
    explanation: 'place-self is shorthand for align-self and justify-self on a grid/flex item. ' +
      'Example: place-self: end center;',
    example: 'div { place-self: stretch stretch stretch; }',
  },
  {
    code: 'CSS075', category: 'Error',
    pattern: /invalid writing-mode/i,
    message: 'Invalid writing-mode value.',
    explanation: 'writing-mode accepts: horizontal-tb, vertical-rl, or vertical-lr.',
    example: 'div { writing-mode: diagonal; }',
  },

  // ════════════════════════════════
  // BATCH 6 — CSS076–090
  // ════════════════════════════════
  {
    code: 'CSS076', category: 'Error',
    pattern: /invalid animation-timing-function/i,
    message: 'Invalid animation-timing-function.',
    explanation: 'animation-timing-function accepts: ease, linear, ease-in, ease-out, ease-in-out, ' +
      'step-start, step-end, or cubic-bezier(n,n,n,n).',
    example: 'div { animation-timing-function: fast; }',
  },
  {
    code: 'CSS077', category: 'Error',
    pattern: /invalid animation-fill-mode/i,
    message: 'Invalid animation-fill-mode value.',
    explanation: 'animation-fill-mode accepts: none, forwards, backwards, or both.',
    example: 'div { animation-fill-mode: stay; }',
  },
  {
    code: 'CSS078', category: 'Error',
    pattern: /invalid animation-iteration-count/i,
    message: 'Invalid animation-iteration-count.',
    explanation: 'animation-iteration-count accepts a positive number or infinite.',
    example: 'div { animation-iteration-count: -2; }',
  },
  {
    code: 'CSS079', category: 'Error',
    pattern: /invalid animation-direction/i,
    message: 'Invalid animation-direction value.',
    explanation: 'animation-direction accepts: normal, reverse, alternate, or alternate-reverse.',
    example: 'div { animation-direction: backwards; }',
  },
  {
    code: 'CSS080', category: 'Error',
    pattern: /invalid grid-auto-flow/i,
    message: 'Invalid grid-auto-flow value.',
    explanation: 'grid-auto-flow accepts: row, column, row dense, or column dense.',
    example: 'div { grid-auto-flow: diagonal; }',
  },
  {
    code: 'CSS081', category: 'Error',
    pattern: /invalid lab\(\) syntax/i,
    message: 'Invalid lab() colour function.',
    explanation: 'lab() requires lightness (0–100), a (-125 to 125), b (-125 to 125). ' +
      'Example: color: lab(50 40 -30);',
    example: 'div { color: lab(50% 30); }',
  },
  {
    code: 'CSS082', category: 'Error',
    pattern: /invalid lch\(\) syntax/i,
    message: 'Invalid lch() colour function.',
    explanation: 'lch() requires lightness, chroma, and hue values. ' +
      'Example: color: lch(50% 30 120);',
    example: 'div { color: lch(50% 30); }',
  },
  {
    code: 'CSS083', category: 'Error',
    pattern: /invalid color-mix\(\)/i,
    message: 'Invalid color-mix() syntax.',
    explanation: 'color-mix() blends two colours: ' +
      'color-mix(in srgb, red 50%, blue)',
    example: 'div { color: color-mix(red blue); }',
  },
  {
    code: 'CSS084', category: 'Error',
    pattern: /invalid @import layer/i,
    message: 'Invalid @import layer usage.',
    explanation: 'Layered imports must follow: @import "file.css" layer(name);',
    example: '@import layer utilities "styles.css";',
  },
  {
    code: 'CSS085', category: 'Error',
    pattern: /invalid grid-template-areas/i,
    message: 'Invalid grid-template-areas syntax.',
    explanation: 'Grid template areas must form consistent rectangles. ' +
      'Each row must have the same number of cells. ' +
      'Example: grid-template-areas: "header header" "sidebar content";',
    example: '.container { grid-template-areas: "header header" "sidebar content" "footer"; }',
  },
  {
    code: 'CSS086', category: 'Error',
    pattern: /invalid flex-basis/i,
    message: 'Invalid flex-basis value.',
    explanation: 'flex-basis accepts: auto, content, or a valid length/percentage. ' +
      'Example: flex-basis: 200px; or flex-basis: 25%;',
    example: '.item { flex-basis: stretch; }',
  },
  {
    code: 'CSS087', category: 'Error',
    pattern: /negative gap/i,
    message: 'Invalid gap value — negative values not allowed.',
    explanation: 'gap values must be non-negative. Use 0 or a positive length.',
    example: '.container { gap: -10px; }',
  },
  {
    code: 'CSS088', category: 'Error',
    pattern: /invalid aspect-ratio/i,
    message: 'Invalid aspect-ratio fraction.',
    explanation: 'aspect-ratio accepts: auto, a single number, or a ratio like 16 / 9. ' +
      'Both numbers must be positive. Example: aspect-ratio: 16 / 9;',
    example: 'div { aspect-ratio: 16 / 0; }',
  },
  {
    code: 'CSS089', category: 'Error',
    pattern: /invalid @layer nested/i,
    message: 'Invalid nested @layer rule.',
    explanation: 'Nested @layer blocks must be properly closed. ' +
      'Example: @layer utilities { .mt-1 { margin-top: 1rem; } }',
    example: '@layer utilities { @layer { .mt-1 { margin-top: 1rem; } }',
  },
  {
    code: 'CSS090', category: 'Error',
    pattern: /invalid font shorthand/i,
    message: 'Invalid font shorthand — missing required values.',
    explanation: 'The font shorthand requires at minimum font-size and font-family. ' +
      'Example: font: bold 16px/1.5 Arial, sans-serif;',
    example: 'p { font: bold italic; }',
  },

  // ════════════════════════════════
  // BATCH 7 — CSS091–105: Edge Cases
  // ════════════════════════════════
  {
    code: 'CSS091', category: 'Error',
    pattern: /invalid @charset placement/i,
    message: 'Invalid @charset placement.',
    explanation: '@charset must be the very first statement in a stylesheet — before everything else, ' +
      'including comments. Example: @charset "UTF-8";',
    example: 'body { color: black; } @charset "UTF-8";',
  },
  {
    code: 'CSS092', category: 'Error',
    pattern: /invalid @namespace/i,
    message: 'Invalid @namespace syntax.',
    explanation: '@namespace requires a valid URL and optional prefix. ' +
      'Example: @namespace svg "http://www.w3.org/2000/svg";',
    example: '@namespace svg "http://www.w3.org/2000/svg"',
  },
  {
    code: 'CSS093', category: 'Error',
    pattern: /invalid counter-reset value/i,
    message: 'Invalid counter-reset identifier.',
    explanation: 'counter-reset identifiers must be valid CSS identifiers — they cannot start with a number. ' +
      'Example: counter-reset: section;',
    example: 'ol { counter-reset: 123counter; }',
  },
  {
    code: 'CSS094', category: 'Error',
    pattern: /invalid counter-increment value/i,
    message: 'Invalid counter-increment.',
    explanation: 'counter-increment takes an identifier and an optional step number. ' +
      'Example: counter-increment: item; or counter-increment: item 2;',
    example: 'li { counter-increment: item one; }',
  },
  {
    code: 'CSS095', category: 'Error',
    pattern: /invalid content property/i,
    message: 'Invalid content property value.',
    explanation: 'content must use strings ("text"), counters, attr(), url(), or keywords like none/normal. ' +
      'You cannot use a CSS colour name as a content value.',
    example: '::before { content: red; }',
  },
  {
    code: 'CSS096', category: 'Error',
    pattern: /invalid quotes property/i,
    message: 'Invalid quotes property.',
    explanation: 'quotes must contain pairs of string values (opening and closing). ' +
      'Example: quotes: "\\201C" "\\201D" "\\2018" "\\2019";',
    example: 'q { quotes: "\\ab" "\\bb" "\\8b"; }',
  },
  {
    code: 'CSS097', category: 'Error',
    pattern: /invalid list-style/i,
    message: 'Invalid list-style shorthand.',
    explanation: 'list-style combines: type position image. ' +
      'Valid example: list-style: square inside; ' +
      'You cannot include unknown values.',
    example: 'ul { list-style: square inside invalid; }',
  },
  {
    code: 'CSS098', category: 'Error',
    pattern: /invalid outline shorthand/i,
    message: 'Invalid outline shorthand.',
    explanation: 'outline: width style colour — only one value from each category allowed. ' +
      'Example: outline: 2px dashed blue;',
    example: 'div { outline: thick red dashed solid; }',
  },
  {
    code: 'CSS099', category: 'Error',
    pattern: /invalid float value/i,
    message: 'Invalid float value.',
    explanation: 'float accepts: left, right, none, inline-start, or inline-end.',
    example: 'img { float: center; }',
  },
  {
    code: 'CSS100', category: 'Error',
    pattern: /invalid clear value/i,
    message: 'Invalid clear value.',
    explanation: 'clear accepts: none, left, right, or both.',
    example: 'div { clear: both-sides; }',
  },
  {
    code: 'CSS101', category: 'Error',
    pattern: /invalid visibility/i,
    message: 'Invalid visibility value.',
    explanation: 'visibility accepts: visible, hidden, or collapse. ' +
      'Note: visibility: hidden hides the element but still takes up space (unlike display: none).',
    example: 'div { visibility: invisible; }',
  },
  {
    code: 'CSS102', category: 'Error',
    pattern: /invalid white-space/i,
    message: 'Invalid white-space value.',
    explanation: 'white-space accepts: normal, nowrap, pre, pre-wrap, pre-line, or break-spaces.',
    example: 'p { white-space: wrap; }',
  },
  {
    code: 'CSS103', category: 'Error',
    pattern: /invalid pointer-events/i,
    message: 'Invalid pointer-events value.',
    explanation: 'For HTML elements, pointer-events accepts: auto or none. ' +
      'Use none to make an element unclickable.',
    example: 'div { pointer-events: clickable; }',
  },
  {
    code: 'CSS104', category: 'Error',
    pattern: /invalid user-select/i,
    message: 'Invalid user-select value.',
    explanation: 'user-select accepts: auto, none, text, or all. ' +
      'Use none to prevent text selection on an element.',
    example: 'div { user-select: enable; }',
  },
  {
    code: 'CSS105', category: 'Info',
    pattern: /declaration ignored.*override|overridden by later declaration/i,
    message: 'Declaration ignored due to later override.',
    explanation: 'You have the same property declared twice in one rule — the later one wins. ' +
      'This can be intentional (browser fallback pattern) or a mistake. ' +
      'If unintentional, remove the duplicate.',
    example: 'div { color: red; color: blue; }',
  },
];