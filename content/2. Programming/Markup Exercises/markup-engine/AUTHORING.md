# Code Markup Exercises: Authoring Guide

This guide explains how to build a new interactive "code markup" vocabulary exercise. It's written for whoever makes the next one: Mr. Karnes or a Claude Code session given some Java code.

This file is **not published**. `quartz.config.ts` ignores `**/markup-engine/AUTHORING.md`.

## How the system fits together

```
content/2. Programming/Markup Exercises/
  index.md                    <- list of all exercises (one line each)
  Arcade Markup.md            <- embedding page: a short intro + <iframe>
  exercises/
    arcade-markup.htm         <- one exercise: code + EXERCISE data, nothing else
  markup-engine/
    engine.js                 <- ALL rendering, interaction, checking
    engine.css                <- ALL styles (follows the site's light/dark theme)
    AUTHORING.md              <- this guide (ignored by Quartz)
quartz/components/MarkupExerciseFrame.tsx   <- site-wide: iframe styles + auto-height listener
```

- Fixing a bug in `engine.js` / `engine.css` fixes every exercise at once. Never put exercise content in the engine.
- Exercise files use the **`.htm`** extension on purpose. Quartz strips `.html` from files it copies out of `content/`, which would break them on GitHub Pages. Quartz copies `.htm` unchanged.
- The embedding page uses an `<iframe>` rather than inline scripts, because Quartz's SPA navigation doesn't re-run inline scripts. The engine posts its height to the page and `MarkupExerciseFrame` resizes the iframe, so there's no inner scrollbar.
- Student progress is saved in `localStorage` per exercise `id`. If you edit an exercise's code or data, saved progress for it is discarded automatically (it would no longer line up).

## Making a new exercise (checklist)

1. Copy `exercises/arcade-markup.htm` to `exercises/<topic>-markup.htm`. **The file name must be unique across the whole vault**, because the iframe `src` is just the bare file name.
2. Replace the `<script type="text/plain" data-file="...">` blocks with the new code (one block per file) and rewrite the `EXERCISE` object. Change `id` and `title`.
3. Create the embedding page `<Topic> Markup.md` next to `Arcade Markup.md` (copy it and change the title, intro, iframe `src` and `title`, and the "open in its own tab" link).
4. Add one line to `index.md`: `- [[<Topic> Markup|<Title>]]: short description`.
5. Run `npx quartz build --serve`, open the page, and make sure **no red "Exercise data problems" box** appears at the top. Click through each part and press Check. After editing an exercise or the engine, **hard-refresh** (Cmd+Shift+R) because browsers cache the `.htm`/`.js` files. If the dev server stops with an `ENOENT ... .tmp` error after a save, just restart it. That's a Quartz file-watcher quirk with some editors, not a problem in the exercise.

## Exercise file template

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TITLE HERE</title>
    <link rel="stylesheet" href="../markup-engine/engine.css" />
  </head>
  <body>
    <div id="markup-app"></div>

<script type="text/plain" data-file="Main.java">
...paste Java here, unchanged...
</script>

    <script>
      const EXERCISE = { /* see schema below */ }
    </script>
    <script src="../markup-engine/engine.js"></script>
  </body>
</html>
```

**Code blocks.** Paste Java verbatim inside `<script type="text/plain" data-file="NAME">`. No escaping is needed (backslashes, `$`, quotes and backticks are all fine). The only thing that can't appear in the code is the literal text `</script>`. The engine drops the first blank line and trailing whitespace, and removes indentation shared by every line. **Line 1 is the first line of code.** Count lines from there for every target.

## The `EXERCISE` schema

Every part is optional, and the engine only shows tabs for the parts present (plus a Score tab). Questions are numbered automatically across parts, in order: Name It, then Find It, then Bonus. Mark It Up tools aren't numbered.

```js
const EXERCISE = {
  id: "arcade-markup",          // unique; used as the localStorage key
  title: "Arcade Code Markup",  // shown on the Score card
  intro: "Optional text above the tabs. Supports `code` and **bold**.",
  files: ["Main.java", "Arcade.java"],   // names of the data-file code blocks, in tab order

  wordBank: ["argument", "data type", ...],   // dropdown choices for Name It, shown in this order

  nameIt: {
    instructions: "Optional, replaces the default instructions.",
    items: [
      // answers: one dropdown per answer. Order doesn't matter.
      // alsoAccept: extra terms accepted in place of an answer.
      { target: { file: "Main.java", line: 3, text: "arcade" }, answers: ["identifier"], alsoAccept: ["object"] },
      { target: { file: "Main.java", line: 3, text: "new Arcade()" }, answers: ["instantiation", "initialization"] },
      { target: { file: "Arcade.java", line: 4, text: "int", occurrence: 1 }, answers: ["return type"] },
      // optional: prompt: "Extra question text shown on the card"
    ],
  },

  findIt: {
    instructions: "Optional.",
    items: [
      // lines: every line that counts as correct (any one of them is right)
      { prompt: "a method call with exactly one argument",
        lines: [{ file: "Main.java", line: 9 }, { file: "Arcade.java", line: 23 }] },
    ],
  },

  markUp: {
    instructions: "Optional.",
    files: ["Arcade.java"],       // files shown in this part (default: all files)
    tools: [
      {
        id: "dataType",           // unique within the exercise
        label: "data type",       // shown on the tool button and in results
        mark: "circle",           // circle | box | underline | double-underline | wavy | star | highlight
        hint: "`void` doesn't count. There are 9.",   // optional, shown while the tool is active
        select: "token",          // "token": student clicks single words/symbols
                                  // "unit": student clicks a multi-token piece as one unit
        // files: ["Arcade.java"] // optional, defaults to markUp.files
        targets: [                // the correct marks
          { line: 4, text: "int", occurrence: 1 },   // `file` can be left out when the tool has one file
          { line: 4, text: "int", occurrence: 2 },
        ],
        // decoys: [...]          // "unit" tools only; see below
      },
      {
        id: "methodHeader", label: "method header", mark: "box", select: "unit",
        targets: [{ line: 4, text: "public int playGames(int tokens, int games)" }],
        decoys:  [{ line: 1, text: "public class Arcade" },
                  { line: 6, text: "for (int i = 0; i < games; i++)" }],
      },
    ],
  },

  bonus: {
    instructions: "Optional.",
    items: [
      { prompt: "What is stored in `prize` after Main.java, line 9 runs?",
        answers: ["Yo-yo"],                // any of these is correct
        // caseSensitive: false (default), ignoreQuotes: true (default)
        explanation: "Shown after the student presses Check." },
    ],
  },
}
```

### Targets (how code pieces are identified)

A target is `{ file, line, text, occurrence }`:

- `file`: one of `files`. It can be omitted when only one file is possible (the exercise has one file, or a Mark It Up tool uses one file).
- `line`: 1-based line number in that file.
- `text`: the **exact** text of the piece, copied character for character from the line (case and spaces matter). Escape `"` inside JS strings: `text: "\"Giant Panda\""`.
- `occurrence`: which match on that line, counting from 1 (default 1). Use it when the same text appears more than once on the line, e.g. the three `int`s in `public int playGames(int tokens, int games)`.

Matching respects word boundaries: `text: "int"` does not match inside `println` or `print`, and `text: "i"` does not match the `i` in `int`. Symbols like `+`, `>`, `++` match anywhere. So for `i++`, the `++` is found by `text: "++"`. Count occurrences with this rule in mind. For example, in `if (x >= 5 && y > 2)` the `>` in `>=` counts as an occurrence of `">"`. Prefer longer, unique text when you can.

Targets must sit on one line. A multi-token target (a method header, a condition, a whole statement) is just a longer `text`.

### Mark It Up: token vs unit tools

- `select: "token"`: the student can click **any** word, number, string, operator or comment in the tool's files. Each target must be exactly one token (an identifier, keyword, literal, operator like `+=` or `<`, or a whole `// comment`). Punctuation like `( ) { } ; , .` isn't clickable. The engine reports a target that isn't a single token.
- `select: "unit"`: the student clicks anywhere inside a piece and the **whole piece** is marked. Only targets and decoys are clickable, so **always add decoys**. Otherwise hovering reveals the answers. Good decoys look like plausible answers: other headers/loops for "method header", assignments or expressions for "condition". Nested candidates are fine: a click marks the smallest unit containing the clicked token.
- Scoring per tool: points = correct marks − wrong marks (never below 0), out of the number of targets. Feedback after Check shows ✓ on correct marks, ✗ on wrong ones, and a dashed outline with "?" on missed ones.
- Use a **different `mark` for each tool**, so marks don't rely on color (colorblind-friendly). Colors are assigned automatically by tool order.

### Scoring summary

- Name It: 1 point per item when every dropdown is correct. Each dropdown gets its own ✓/✗. Duplicate picks don't count twice.
- Find It: 1 point per item when the chosen line is one of `lines`.
- Mark It Up: see above.
- Bonus: 1 point per item. Answers are trimmed, case-insensitive and ignore surrounding quotes unless you set otherwise.
- The Score tab totals the current answers (no need to press Check first) and lists item numbers to recheck. Students screenshot it for Canvas.

### Text formatting

`intro`, `instructions`, `prompt`, `hint` and `explanation` support `` `code` `` and `**bold**`. Everything else is shown as plain text (HTML is escaped).

## Validation

When the page loads, the engine checks every target, line reference and answer, including:

- unknown file names, or a missing code block for a name in `files`
- line numbers out of range
- `text` not found on the line (the message shows what the line actually says)
- `occurrence` higher than the number of matches
- token-tool targets that aren't a single clickable token
- Name It answers / `alsoAccept` terms missing from `wordBank` (students couldn't select them)
- duplicate tool ids, unknown mark names, items without answers or prompts

Problems appear in a **red box at the top of the exercise** and in the browser console as `[markup engine]`. A published exercise must show no red box.

## Guidance for generating an exercise from pasted Java (for Claude Code)

When asked to "make a new markup exercise from this code":

1. Read this guide and `exercises/arcade-markup.htm` as the reference example.
2. Keep the student's code exactly as given. Number lines starting at 1 from the first line of code, counting blank lines.
3. Reuse the Arcade word bank unless told otherwise. Add terms only if the new code needs them, and keep the list alphabetical.
4. Write items that cover the vocabulary in the code. Aim for roughly 15-25 Name It items, 5-8 Find It prompts, 2-4 Mark It Up tools (with decoys for unit tools) and 1 Bonus "trace the code" question with an explanation. Follow any counts or items the teacher gives.
5. For each target, double-check the exact text and the occurrence count against the line, using the word-boundary rule above.
6. Create the `.htm`, the embedding `.md` and the `index.md` line, then build, open the page and confirm there's no red validation box.
7. Don't commit or push unless asked.
