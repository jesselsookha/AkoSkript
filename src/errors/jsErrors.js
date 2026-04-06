/**
 * AKO SKRIPT — jsErrors.js
 * Complete JavaScript error teaching catalog.
 *
 * Each entry:
 *   code:          string    — catalog ID
 *   pattern:       RegExp    — tested against error.message
 *   explanation:   string    — student-friendly explanation ({symbol} replaced if extractSymbol present)
 *   extractSymbol: Function? — (msg, src) => string|null
 */
export const JSErrors = [

  // ════════════════════════════════
  // REFERENCE ERRORS
  // ════════════════════════════════

  {
    code: 'JS001',
    pattern: /(\w+) is not defined/i,
    explanation:
      'You are trying to use a variable or function called {symbol} that has not been declared. ' +
      'Check your spelling carefully — JavaScript is case-sensitive, so "myVar" and "myvar" are completely different. ' +
      'Make sure you declared it with let, const, or var before using it.',
    extractSymbol: (msg) => { const m = msg.match(/^(\w+) is not defined/i); return m ? m[1] : null; },
  },
  {
    code: 'JS002',
    pattern: /can.t access lexical declaration .(\w+). before initialization/i,
    explanation:
      'You tried to use the variable {symbol} before the line where it is declared. ' +
      'Variables declared with let or const cannot be read until their declaration is reached — ' +
      'this is called the Temporal Dead Zone. Move the declaration above where you use it.',
    extractSymbol: (msg) => { const m = msg.match(/'(\w+)'/); return m ? m[1] : null; },
  },
  {
    code: 'JS003',
    pattern: /assignment to undeclared variable/i,
    explanation:
      'You assigned a value to a variable without declaring it first. ' +
      'Always use let, const, or var to declare variables. ' +
      'Skipping the declaration creates a hidden global variable that causes hard-to-find bugs.',
  },

  // ════════════════════════════════
  // TYPE ERRORS
  // ════════════════════════════════

  {
    code: 'JS010',
    pattern: /cannot read propert(?:y|ies) of (null|undefined)/i,
    explanation:
      'You are trying to read a property on a value that is null or undefined — ' +
      'meaning the variable exists but holds no object. ' +
      'Check that the variable has been assigned a real object before accessing its properties. ' +
      'A common cause is forgetting to return a value from a function, or a DOM element that does not exist yet.',
  },
  {
    code: 'JS011',
    pattern: /cannot set propert(?:y|ies) of (null|undefined)/i,
    explanation:
      'You are trying to set a property on null or undefined. ' +
      'Make sure the object exists and has been created before you try to assign properties to it.',
  },
  {
    code: 'JS012',
    pattern: /(\S+) is not a function/i,
    explanation:
      'You are trying to call {symbol} as a function, but it is not one. ' +
      'Check that you defined it as a function, that the name is spelled correctly, ' +
      'and that you have not accidentally overwritten it by assigning another value to the same name.',
    extractSymbol: (msg) => { const m = msg.match(/^(\S+) is not a function/i); return m ? m[1] : null; },
  },
  {
    code: 'JS013',
    pattern: /(\S+) is not a constructor/i,
    explanation:
      'You tried to use {symbol} with the new keyword, but it cannot be used as a constructor. ' +
      'Arrow functions cannot be constructors. Use a regular function declaration or a class instead.',
    extractSymbol: (msg) => { const m = msg.match(/^(\S+) is not a constructor/i); return m ? m[1] : null; },
  },
  {
    code: 'JS014',
    pattern: /assignment to constant variable/i,
    explanation:
      'You declared this variable with const, which means its binding cannot be reassigned after the first assignment. ' +
      'If you need to change the value later, declare it with let instead. ' +
      'Note: const on an object means the reference is fixed, but the object\'s properties can still be modified.',
  },
  {
    code: 'JS015',
    pattern: /cannot assign to read.?only property/i,
    explanation:
      'You tried to change a property that is read-only. ' +
      'This can happen with frozen objects (Object.freeze()), built-in properties, or strict mode restrictions.',
  },
  {
    code: 'JS016',
    pattern: /null is not an object/i,
    explanation:
      'You tried to access a property or call a method on null. ' +
      'A variable holding null has no value at all. ' +
      'Check that the variable has been assigned a real object before using it.',
  },
  {
    code: 'JS017',
    pattern: /undefined is not an object/i,
    explanation:
      'You tried to use undefined as though it were an object. ' +
      'This often happens when a function does not return a value, or a variable was never assigned anything. ' +
      'Add a check before using it: if (myVar) { ... }',
  },
  {
    code: 'JS018',
    pattern: /cannot convert undefined or null to object/i,
    explanation:
      'You passed undefined or null to a method like Object.keys() or Object.values() that needs a real object. ' +
      'Check that the variable holds a valid object before passing it to object utility functions.',
  },
  {
    code: 'JS019',
    pattern: /(\S+) is not iterable/i,
    explanation:
      '{symbol} cannot be looped over with for...of or spread (...) because it is not iterable. ' +
      'Only arrays, strings, Maps, Sets, and some other objects support iteration. ' +
      'If you expected an array, check what value the variable actually holds at runtime.',
    extractSymbol: (msg) => { const m = msg.match(/^(\S+) is not iterable/i); return m ? m[1] : null; },
  },
  {
    code: 'JS020',
    pattern: /reduce of empty array with no initial value/i,
    explanation:
      'You called .reduce() on an empty array without providing an initial value as the second argument. ' +
      'Either make sure the array has at least one item, ' +
      'or provide a starting value: array.reduce((acc, item) => acc + item, 0)',
  },
  {
    code: 'JS021',
    pattern: /invalid date/i,
    explanation:
      'You created a Date with an invalid value. ' +
      'Check the string or number passed to new Date(). ' +
      'Valid examples: new Date("2024-01-15") or new Date(2024, 0, 15).',
  },
  {
    code: 'JS022',
    pattern: /converting circular structure to json/i,
    explanation:
      'JSON.stringify() found an object that references itself — a circular structure. ' +
      'For example: const obj = {}; obj.self = obj; JSON.stringify(obj); — this fails. ' +
      'Remove the circular reference, or use a replacer function to skip the circular property.',
  },
  {
    code: 'JS023',
    pattern: /object could not be cloned/i,
    explanation:
      'You tried to pass an object that cannot be cloned to a Web Worker or structured clone algorithm. ' +
      'Functions, DOM nodes, and certain other objects cannot be transferred this way.',
  },
  {
    code: 'JS024',
    pattern: /method called on incompatible/i,
    explanation:
      'You called a method with the wrong type of object as context (this). ' +
      'This often happens when you pass a method as a callback without binding it: use .bind(this), ' +
      'an arrow function, or a wrapper function.',
  },

  // ════════════════════════════════
  // SYNTAX ERRORS
  // ════════════════════════════════

  {
    code: 'JS030',
    pattern: /unexpected token ['"]?}['"]?/i,
    explanation:
      'JavaScript found a closing brace } where it did not expect one. ' +
      'You may have one extra closing brace. Count your { and } pairs — they must match.',
  },
  {
    code: 'JS031',
    pattern: /unexpected token ['"]?\)['"]?/i,
    explanation:
      'JavaScript found an unexpected closing parenthesis. ' +
      'Count your ( and ) pairs to find where they go out of balance.',
  },
  {
    code: 'JS032',
    pattern: /unexpected token ['"]?\]['"]?/i,
    explanation:
      'JavaScript found an unexpected closing bracket. ' +
      'Count your [ and ] pairs to find the mismatch.',
  },
  {
    code: 'JS033',
    pattern: /unexpected end of input/i,
    explanation:
      'Your code ends before JavaScript expected it to. ' +
      'The most common cause is a missing closing brace }, parenthesis ), or bracket ]. ' +
      'Count your opening and closing pairs carefully from the top.',
  },
  {
    code: 'JS034',
    pattern: /unexpected token/i,
    explanation:
      'JavaScript found a character it did not expect at this position. ' +
      'This is usually caused by a missing comma between items, a missing closing bracket, ' +
      'or a typo just before the reported location. ' +
      'Look at the line above the error for missing punctuation.',
  },
  {
    code: 'JS035',
    pattern: /identifier ['"]?(\w+)['"]? has already been declared/i,
    explanation:
      'You declared a variable called {symbol} more than once in the same scope with let or const. ' +
      'Each name must be unique within its block. Remove the duplicate, or rename one of them.',
    extractSymbol: (msg) => { const m = msg.match(/'(\w+)'/); return m ? m[1] : null; },
  },
  {
    code: 'JS036',
    pattern: /missing \) after argument list/i,
    explanation:
      'A function call is missing its closing parenthesis. ' +
      'Every opening ( must have a matching closing ).',
  },
  {
    code: 'JS037',
    pattern: /missing ; before statement/i,
    explanation:
      'JavaScript expected a semicolon to end a statement but found something else. ' +
      'Check the end of the previous line — you may be missing a semicolon, ' +
      'or the line does not form a valid statement.',
  },
  {
    code: 'JS038',
    pattern: /missing : after property id/i,
    explanation:
      'You are writing an object literal and forgot the colon between a key and its value. ' +
      'The correct syntax is: { key: value, anotherKey: anotherValue }',
  },
  {
    code: 'JS039',
    pattern: /missing } after property list/i,
    explanation:
      'An object literal is not closed. Check that your object definition ends with a closing }.',
  },
  {
    code: 'JS040',
    pattern: /illegal return statement/i,
    explanation:
      'You used return outside of a function body. ' +
      'The return statement can only appear inside a function.',
  },
  {
    code: 'JS041',
    pattern: /(?:break|continue) must be inside/i,
    explanation:
      'You used break or continue outside of a loop. ' +
      'These keywords can only be used inside for, while, or do...while loops.',
  },
  {
    code: 'JS042',
    pattern: /invalid or unexpected token/i,
    explanation:
      'There is a character in your code that JavaScript cannot parse at this position. ' +
      'Common causes: a curly quote (" ") instead of a straight quote ("), ' +
      'a stray special character, or a character copy-pasted from a word processor.',
  },
  {
    code: 'JS043',
    pattern: /unterminated string/i,
    explanation:
      'A string in your code was opened with a quote character but never closed. ' +
      'Find the string missing its closing quote and add it. ' +
      'Also check that you have not used a single quote to start a string and a double quote to end it.',
  },
  {
    code: 'JS044',
    pattern: /octal literals are not allowed/i,
    explanation:
      'You wrote a number with a leading zero (like 07) which is octal notation. ' +
      'In strict mode this is not allowed. Use 0o7 for octal, or remove the leading zero for decimal.',
  },
  {
    code: 'JS045',
    pattern: /cannot use import statement outside a module/i,
    explanation:
      'You used the import keyword but the script is not running as an ES module. ' +
      'In a browser, add type="module" to the script tag: <script type="module" src="..."></script>',
  },
  {
    code: 'JS046',
    pattern: /private field .(\S+). must be declared/i,
    explanation:
      'You tried to use a private class field {symbol} that has not been declared in the class body. ' +
      'Private fields must be declared at the top of the class: class MyClass { #myField; }',
    extractSymbol: (msg) => { const m = msg.match(/'(#\w+)'/); return m ? m[1] : null; },
  },
  {
    code: 'JS047',
    pattern: /rest element must be last/i,
    explanation:
      'The rest parameter (...args) must always be the last parameter in a function or destructuring pattern. ' +
      'For example: function fn(a, b, ...rest) { } — rest must come at the end.',
  },
  {
    code: 'JS048',
    pattern: /duplicate parameter/i,
    explanation:
      'You have used the same parameter name more than once in a function definition. ' +
      'Each parameter in a function must have a unique name.',
  },

  // ════════════════════════════════
  // RANGE ERRORS
  // ════════════════════════════════

  {
    code: 'JS050',
    pattern: /maximum call stack size exceeded/i,
    explanation:
      'Your code caused infinite recursion — a function kept calling itself without ever stopping. ' +
      'Every call uses stack memory, and the browser ran out. ' +
      'Check your recursive function for a base case: a condition that stops the recursion. ' +
      'Example: function countdown(n) { if (n <= 0) return; countdown(n - 1); }',
  },
  {
    code: 'JS051',
    pattern: /invalid array length/i,
    explanation:
      'You tried to create an array with an invalid length value. ' +
      'Array lengths must be non-negative integers. ' +
      'Check the value you are passing to new Array() or setting to .length.',
  },
  {
    code: 'JS052',
    pattern: /toFixed\(\) digits argument must be/i,
    explanation:
      'The argument to toFixed() must be a number between 0 and 100. ' +
      'Example: (3.14159).toFixed(2) returns the string "3.14".',
  },
  {
    code: 'JS053',
    pattern: /invalid count value/i,
    explanation:
      'The count argument passed (to String.repeat() or similar) must be a non-negative finite number. ' +
      'Check what value you are passing.',
  },
  {
    code: 'JS054',
    pattern: /precision (\d+) out of range/i,
    explanation:
      'The precision passed to toPrecision() must be between 1 and 100. ' +
      'Example: (123.456).toPrecision(5) gives "123.46".',
  },

  // ════════════════════════════════
  // URI ERRORS
  // ════════════════════════════════

  {
    code: 'JS060',
    pattern: /uri malformed/i,
    explanation:
      'You passed a malformed string to decodeURI() or decodeURIComponent(). ' +
      'The string must be a properly percent-encoded URI. ' +
      'A lone % sign is invalid — it must be followed by exactly two hex digits, like %20.',
  },

  // ════════════════════════════════
  // PROMISE / ASYNC
  // ════════════════════════════════

  {
    code: 'JS070',
    pattern: /unhandled promise rejection/i,
    explanation:
      'An async operation (Promise) failed and the error was not caught. ' +
      'Always handle Promise errors with .catch(err => ...) or a try/catch block around await. ' +
      'Example: try { const data = await fetchData(); } catch (err) { console.error(err); }',
  },
  {
    code: 'JS071',
    pattern: /await is only valid/i,
    explanation:
      'You used await outside of an async function. ' +
      'Add the async keyword to the surrounding function: async function myFn() { ... }',
  },
  {
    code: 'JS072',
    pattern: /promise.*rejected/i,
    explanation:
      'A Promise was rejected — the async operation it represented encountered an error. ' +
      'Wrap your await call in a try/catch to handle this gracefully: ' +
      'try { await myPromise; } catch(err) { console.error("Failed:", err.message); }',
  },

  // ════════════════════════════════
  // DOM / BROWSER
  // ════════════════════════════════

  {
    code: 'JS080',
    pattern: /cannot set properties of null/i,
    explanation:
      'You tried to set a property on null — this almost always means a DOM element was not found. ' +
      'document.getElementById() returns null when no element with that ID exists in the HTML. ' +
      'Double-check the element ID for typos, and make sure the script runs after the HTML has loaded.',
  },
  {
    code: 'JS081',
    pattern: /failed to execute '(\w+)' on/i,
    explanation:
      'A browser API method called {symbol} failed to execute. ' +
      'This often means you passed the wrong type of argument or the element is in an invalid state. ' +
      'Check the arguments you are passing.',
    extractSymbol: (msg) => { const m = msg.match(/'(\w+)'/); return m ? m[1] : null; },
  },
  {
    code: 'JS082',
    pattern: /not a valid selector/i,
    explanation:
      'You passed an invalid CSS selector string to querySelector() or querySelectorAll(). ' +
      'Check that the selector string is valid CSS — for example: "#myId", ".myClass", "div > p".',
  },

  // ════════════════════════════════
  // LOGICAL / COMMON MISTAKES
  // ════════════════════════════════

  {
    code: 'JS090',
    pattern: /is nan/i,
    explanation:
      'Your operation produced NaN (Not a Number). ' +
      'This happens when arithmetic is performed on a non-numeric value, ' +
      'such as adding a number to undefined or calling parseInt() on text without digits. ' +
      'Use Number.isNaN() to detect it, and trace back where the non-numeric value came from.',
  },
  {
    code: 'JS091',
    pattern: /stack overflow/i,
    explanation:
      'The call stack overflowed — a function called itself too many times. ' +
      'Check your recursive function for a base case that stops the recursion.',
  },
  {
    code: 'JS092',
    pattern: /out of memory/i,
    explanation:
      'Your program used more memory than the browser allows. ' +
      'Check for infinite loops that keep creating new objects, ' +
      'or operations that produce very large arrays or strings.',
  },
  {
    code: 'JS093',
    pattern: /script timeout/i,
    explanation:
      'Your script ran for too long and the browser stopped it. ' +
      'Check for an infinite loop — a loop whose condition never becomes false.',
  },
];