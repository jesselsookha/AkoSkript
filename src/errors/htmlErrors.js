/**
 * AKO SKRIPT — htmlErrors.js
 * HTML parser error teaching catalog.
 * Used by the split mode's live preview error detection.
 *
 * These are matched against parser messages and lint warnings
 * generated when validating the HTML panel content.
 */
export const HTMLErrors = [

  // ════════════════════════════════
  // DOCUMENT STRUCTURE
  // ════════════════════════════════
  {
    code: 'HTML001',
    category: 'Error',
    pattern: /missing <!doctype/i,
    explanation:
      'Your HTML document is missing the <!DOCTYPE html> declaration. ' +
      'This must be the very first line of every HTML file. ' +
      'Without it, browsers may render the page in "quirks mode" which causes inconsistent styling.',
    example: '<!DOCTYPE html>',
  },
  {
    code: 'HTML002',
    category: 'Error',
    pattern: /missing <html>/i,
    explanation:
      'The <html> element is missing. Every HTML document must have a root <html> tag ' +
      'that wraps the entire document: <html lang="en"> ... </html>',
  },
  {
    code: 'HTML003',
    category: 'Error',
    pattern: /missing <head>/i,
    explanation:
      'The <head> section is missing. The <head> element contains metadata like the page title, ' +
      'character set, and links to stylesheets. It comes before <body>.',
  },
  {
    code: 'HTML004',
    category: 'Error',
    pattern: /missing <body>/i,
    explanation:
      'The <body> element is missing. All visible content of your page goes inside the <body> tag.',
  },
  {
    code: 'HTML005',
    category: 'Error',
    pattern: /missing <title>/i,
    explanation:
      'The <title> element is missing from the <head> section. ' +
      'The title appears in the browser tab and is important for accessibility and SEO. ' +
      'Add it inside <head>: <title>My Page</title>',
  },
  {
    code: 'HTML006',
    category: 'Warning',
    pattern: /missing lang attribute/i,
    explanation:
      'The <html> element is missing the lang attribute. ' +
      'This attribute tells browsers and screen readers what language the page is in. ' +
      'Add it: <html lang="en">',
  },
  {
    code: 'HTML007',
    category: 'Error',
    pattern: /missing charset/i,
    explanation:
      'No character encoding is declared. ' +
      'Add this as the first element inside <head>: <meta charset="UTF-8"> ' +
      'Without it, special characters may display incorrectly.',
  },

  // ════════════════════════════════
  // UNCLOSED / MISMATCHED TAGS
  // ════════════════════════════════
  {
    code: 'HTML010',
    category: 'Error',
    pattern: /unclosed tag|tag not closed/i,
    explanation:
      'An HTML tag was opened but never closed. ' +
      'Most HTML elements need a closing tag: <div> ... </div>. ' +
      'Check that every opening tag has a matching closing tag in the right order.',
  },
  {
    code: 'HTML011',
    category: 'Error',
    pattern: /unexpected end tag|stray end tag/i,
    explanation:
      'A closing tag was found with no matching opening tag. ' +
      'For example, </div> appears without a corresponding <div>. ' +
      'Check that your tags are properly nested and balanced.',
  },
  {
    code: 'HTML012',
    category: 'Error',
    pattern: /end tag .(\w+). violates nesting rules/i,
    explanation:
      'HTML tags must be properly nested — the last tag opened must be the first tag closed. ' +
      'Wrong: <b><i>text</b></i>. Correct: <b><i>text</i></b>',
  },
  {
    code: 'HTML013',
    category: 'Error',
    pattern: /self.closing syntax .(\w+). is not permitted/i,
    explanation:
      'In HTML5, only void elements (like <br>, <img>, <input>) can self-close. ' +
      'Elements like <div />, <span />, or <p /> are not valid. ' +
      'Use a proper closing tag: <div></div>',
  },

  // ════════════════════════════════
  // ATTRIBUTE ERRORS
  // ════════════════════════════════
  {
    code: 'HTML020',
    category: 'Error',
    pattern: /attribute value must be quoted/i,
    explanation:
      'Attribute values must be enclosed in quotes. ' +
      'Wrong: <div class=myClass>. Correct: <div class="myClass">',
  },
  {
    code: 'HTML021',
    category: 'Error',
    pattern: /duplicate attribute/i,
    explanation:
      'The same attribute appears more than once on this element. ' +
      'For example: <div class="a" class="b"> — only one class attribute is allowed. ' +
      'Combine the values into one attribute.',
  },
  {
    code: 'HTML022',
    category: 'Error',
    pattern: /bad value .* for attribute (href|src|action)/i,
    explanation:
      'The URL you provided for this attribute is invalid. ' +
      'Check that it is a properly formatted relative or absolute URL without illegal characters.',
  },
  {
    code: 'HTML023',
    category: 'Warning',
    pattern: /attribute .(\w+). not allowed on element/i,
    explanation:
      'This attribute is not valid on this HTML element. ' +
      'Check the HTML specification for which attributes are allowed on this tag.',
  },
  {
    code: 'HTML024',
    category: 'Error',
    pattern: /bad value for attribute type on element input/i,
    explanation:
      'The type attribute on <input> has an invalid value. ' +
      'Valid values include: text, password, email, number, checkbox, radio, submit, button, date, file.',
  },

  // ════════════════════════════════
  // NESTING ERRORS
  // ════════════════════════════════
  {
    code: 'HTML030',
    category: 'Error',
    pattern: /element .(\w+). not allowed as child of/i,
    explanation:
      'This element cannot be placed inside its parent element. ' +
      'HTML has strict rules about which elements can contain others. ' +
      'For example, <li> can only go inside <ul> or <ol>, and <td> can only go inside <tr>.',
  },
  {
    code: 'HTML031',
    category: 'Error',
    pattern: /a element must not contain/i,
    explanation:
      '<a> (anchor) elements must not contain interactive elements like buttons or other links. ' +
      'You cannot nest a <button> or another <a> inside an <a> tag.',
  },
  {
    code: 'HTML032',
    category: 'Error',
    pattern: /p element must not contain block/i,
    explanation:
      'A <p> (paragraph) element cannot contain block-level elements like <div>, <h1>-<h6>, <ul>, or <table>. ' +
      'If you need a block inside, close the paragraph first.',
  },
  {
    code: 'HTML033',
    category: 'Error',
    pattern: /table element missing|tr must contain/i,
    explanation:
      'HTML table structure must be correct. ' +
      'Tables need: <table> → <thead>/<tbody>/<tfoot> → <tr> → <th>/<td>. ' +
      'Do not skip levels in the hierarchy.',
  },

  // ════════════════════════════════
  // FORM ERRORS
  // ════════════════════════════════
  {
    code: 'HTML040',
    category: 'Error',
    pattern: /input.*missing.*(?:name|id)/i,
    explanation:
      'Form input elements should have both a name attribute (for form submission) ' +
      'and an id attribute (to link with a <label>). ' +
      'Example: <input type="text" id="username" name="username">',
  },
  {
    code: 'HTML041',
    category: 'Warning',
    pattern: /label.*missing.*for|for attribute.*not.*input/i,
    explanation:
      'A <label> element should have a for attribute that matches the id of its input. ' +
      'This makes the label clickable and improves accessibility. ' +
      'Example: <label for="email">Email:</label> <input id="email" type="email">',
  },
  {
    code: 'HTML042',
    category: 'Error',
    pattern: /form.*no.*action/i,
    explanation:
      'A <form> element has no action attribute. ' +
      'The action tells the browser where to send the form data. ' +
      'For JavaScript-only forms, you can use action="#" or handle submission with JavaScript.',
  },

  // ════════════════════════════════
  // IMAGE & MEDIA
  // ════════════════════════════════
  {
    code: 'HTML050',
    category: 'Error',
    pattern: /img.*missing alt/i,
    explanation:
      'The <img> element is missing an alt attribute. ' +
      'The alt attribute provides alternative text for screen readers and when images fail to load. ' +
      'If the image is decorative only, use an empty alt: alt=""',
  },
  {
    code: 'HTML051',
    category: 'Error',
    pattern: /img.*missing src/i,
    explanation:
      'The <img> element is missing the src attribute. ' +
      'The src must point to a valid image file: <img src="images/photo.jpg" alt="Description">',
  },
  {
    code: 'HTML052',
    category: 'Warning',
    pattern: /img.*width.*height.*missing/i,
    explanation:
      'The <img> element is missing explicit width and height attributes. ' +
      'Adding these helps the browser reserve space for the image before it loads, ' +
      'preventing layout shifts.',
  },

  // ════════════════════════════════
  // ACCESSIBILITY
  // ════════════════════════════════
  {
    code: 'HTML060',
    category: 'Warning',
    pattern: /missing aria-label|missing role/i,
    explanation:
      'This interactive element is missing an accessible label or role. ' +
      'Screen readers need context to describe elements to users. ' +
      'Add an aria-label attribute or ensure there is visible text content.',
  },
  {
    code: 'HTML061',
    category: 'Warning',
    pattern: /heading.*skipped|h[1-6].*out of order/i,
    explanation:
      'Heading levels should not be skipped — for example, going from <h1> directly to <h3>. ' +
      'Headings create a document outline that helps screen reader users navigate. ' +
      'Use headings in order: h1, h2, h3...',
  },
  {
    code: 'HTML062',
    category: 'Warning',
    pattern: /button.*no.*text|button.*empty/i,
    explanation:
      'A button has no text content or accessible label. ' +
      'Buttons must have a descriptive label so screen readers can announce them. ' +
      'Add visible text, or use aria-label for icon buttons.',
  },

  // ════════════════════════════════
  // OBSOLETE / DEPRECATED
  // ════════════════════════════════
  {
    code: 'HTML070',
    category: 'Warning',
    pattern: /(?:center|font|marquee|blink|strike|tt|big|small) is obsolete/i,
    explanation:
      'This HTML element is obsolete and should not be used in new code. ' +
      'Use CSS to achieve the same visual effect instead. ' +
      'For example, instead of <center>, use CSS: text-align: center;',
  },
  {
    code: 'HTML071',
    category: 'Warning',
    pattern: /(?:align|bgcolor|border|cellpadding|cellspacing|color|face|size|valign|width|height) attribute.*obsolete/i,
    explanation:
      'This HTML attribute for styling is obsolete. ' +
      'Use CSS in a stylesheet instead of inline HTML attributes for all visual styling.',
  },
  {
    code: 'HTML072',
    category: 'Warning',
    pattern: /style attribute.*inline/i,
    explanation:
      'You are using inline styles (style="..."). While this works, it is better practice to ' +
      'put styles in a separate CSS file or a <style> block, ' +
      'which keeps your HTML and CSS separated and easier to maintain.',
  },

  // ════════════════════════════════
  // SCRIPT / LINK
  // ════════════════════════════════
  {
    code: 'HTML080',
    category: 'Warning',
    pattern: /script.*type.*text\/javascript.*unnecessary/i,
    explanation:
      'The attribute type="text/javascript" on <script> is no longer needed in HTML5. ' +
      'JavaScript is the default scripting language. You can simply write: <script src="..."></script>',
  },
  {
    code: 'HTML081',
    category: 'Error',
    pattern: /link.*rel.*stylesheet.*missing href/i,
    explanation:
      'A <link rel="stylesheet"> is missing the href attribute. ' +
      'The href must point to your CSS file: <link rel="stylesheet" href="styles.css">',
  },
];