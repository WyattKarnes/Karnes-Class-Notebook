/*
 * Code Markup engine
 * ------------------
 * Shared by every markup exercise. It holds all rendering, interaction and
 * checking logic, and no exercise content. Each exercise .htm file supplies its
 * code in <script type="text/plain" data-file="..."> blocks and defines one
 * `EXERCISE` object, then loads this file. See AUTHORING.md for the schema.
 *
 * No external libraries. Works when opened directly or inside an iframe on the
 * Quartz site (it posts its height to the parent and follows the site theme).
 */
;(function () {
  "use strict"

  const STORAGE_PREFIX = "markup-exercise:"
  const HEIGHT_MESSAGE = "markup-exercise:height"
  const MARKS = ["circle", "box", "underline", "double-underline", "wavy", "star", "highlight"]
  const MARK_NAMES = {
    circle: "circle",
    box: "box",
    underline: "underline",
    "double-underline": "double underline",
    wavy: "wavy underline",
    star: "star",
    highlight: "highlight",
  }
  const PART_LABELS = {
    nameIt: "Name It",
    findIt: "Find It",
    markUp: "Mark It Up",
    bonus: "Bonus",
    score: "Score",
  }

  const JAVA_KEYWORDS = new Set(
    (
      "abstract assert break case catch class const continue default do else enum extends final " +
      "finally for goto if implements import instanceof interface native new package private " +
      "protected public return static strictfp super switch synchronized this throw throws " +
      "transient try volatile while var record yield"
    ).split(" "),
  )
  const JAVA_PRIMITIVES = new Set(
    "boolean byte char double float int long short void".split(" "),
  )
  const JAVA_LITERALS = new Set(["true", "false", "null"])

  // ---------------------------------------------------------------------------
  // Small helpers
  // ---------------------------------------------------------------------------

  function h(tag, attrs, ...children) {
    const node = document.createElement(tag)
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === undefined || v === null || v === false) continue
        if (k === "class") node.className = v
        else if (k === "text") node.textContent = v
        else if (k === "html") node.innerHTML = v
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v)
        else node.setAttribute(k, v === true ? "" : String(v))
      }
    }
    for (const c of children.flat()) {
      if (c === undefined || c === null || c === false) continue
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c)
    }
    return node
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  }

  // Prompts and explanations may use `code` and **bold**. Everything else is escaped.
  function inlineMd(s) {
    return escapeHtml(s || "")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  }

  function normTerm(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
  }

  function normFreeText(s, opts) {
    let t = String(s || "").trim()
    if (opts.ignoreQuotes !== false) {
      t = t.replace(/^["'\u201c\u201d\u2018\u2019]+|["'\u201c\u201d\u2018\u2019]+$/g, "").trim()
    }
    t = t.replace(/\s+/g, " ")
    if (!opts.caseSensitive) t = t.toLowerCase()
    return t
  }

  function hashString(s) {
    let x = 2166136261
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i)
      x = Math.imul(x, 16777619)
    }
    return (x >>> 0).toString(36)
  }

  function isWordChar(c) {
    return !!c && /[\w$]/.test(c)
  }

  function rangeKey(r) {
    return r.file + ":" + r.line + ":" + r.start + ":" + r.end
  }

  function storageGet(key) {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // private mode / blocked storage: progress just isn't saved
    }
  }

  function storageRemove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch {}
  }

  // ---------------------------------------------------------------------------
  // Code loading and tokenizing
  // ---------------------------------------------------------------------------

  function loadCode(name) {
    const node = Array.from(document.querySelectorAll('script[type="text/plain"][data-file]')).find(
      (s) => s.getAttribute("data-file") === name,
    )
    if (!node) return null
    let text = node.textContent.replace(/\r\n?/g, "\n")
    text = text.replace(/^[ \t]*\n/, "").replace(/\s+$/, "")
    let lines = text.split("\n")
    // remove indentation shared by every non-blank line (in case the block was indented in the HTML)
    let common = Infinity
    for (const l of lines) {
      if (!l.trim()) continue
      common = Math.min(common, l.match(/^[ \t]*/)[0].length)
    }
    if (common !== Infinity && common > 0) lines = lines.map((l) => l.slice(common))
    return lines
  }

  // Single-pass, line-based tokenizer for Java-like languages.
  const TOKEN_RE =
    /("(?:\\.|[^"\\])*"?)|('(?:\\.|[^'\\])*'?)|(\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDlL]?|\.\d+)|([A-Za-z_$][\w$]*)|(\+\+|--|&&|\|\||->|::|[=!<>]=|[+\-*/%&|^]=|[+\-*/%=<>!&|^~?:])|([(){}\[\];,.@])|(\s+)|(.)/y

  function tokenizeLines(lines) {
    let inBlock = false
    return lines.map((line) => {
      const toks = []
      let i = 0
      if (inBlock) {
        const close = line.indexOf("*/")
        const end = close === -1 ? line.length : close + 2
        toks.push({ start: 0, end, kind: "comment" })
        i = end
        inBlock = close === -1
      }
      while (i < line.length) {
        if (line.startsWith("//", i)) {
          toks.push({ start: i, end: line.length, kind: "comment" })
          break
        }
        if (line.startsWith("/*", i)) {
          const close = line.indexOf("*/", i + 2)
          const end = close === -1 ? line.length : close + 2
          toks.push({ start: i, end, kind: "comment" })
          i = end
          if (close === -1) inBlock = true
          continue
        }
        TOKEN_RE.lastIndex = i
        const m = TOKEN_RE.exec(line)
        if (!m) break
        const text = m[0]
        let kind
        if (m[1] || m[2]) kind = "string"
        else if (m[3]) kind = "number"
        else if (m[4]) {
          if (JAVA_KEYWORDS.has(text)) kind = "keyword"
          else if (JAVA_PRIMITIVES.has(text)) kind = "type"
          else if (JAVA_LITERALS.has(text)) kind = "literal"
          else if (/^[A-Z]/.test(text)) kind = "class"
          else kind = "ident"
        } else if (m[5]) kind = "op"
        else if (m[6]) kind = "punct"
        else if (m[7]) kind = null
        else kind = "other"
        if (kind) toks.push({ start: i, end: i + text.length, kind })
        i += text.length
      }
      return toks
    })
  }

  // ---------------------------------------------------------------------------
  // Rendering a line with nested, possibly overlapping ranges
  // ---------------------------------------------------------------------------
  // Each range: { start, end, cls, attrs?, prio }. Lower prio = drawn outside.
  // Ranges that partly overlap are split so the DOM stays well-formed.

  function renderLine(container, text, ranges) {
    const valid = ranges.filter((r) => r.end > r.start)
    const points = new Set([0, text.length])
    for (const r of valid) {
      points.add(Math.max(0, Math.min(text.length, r.start)))
      points.add(Math.max(0, Math.min(text.length, r.end)))
    }
    const sorted = Array.from(points).sort((a, b) => a - b)
    const order = valid
      .map((r, idx) => ({ r, idx }))
      .sort(
        (a, b) =>
          a.r.start - b.r.start ||
          b.r.end - a.r.end ||
          (a.r.prio || 0) - (b.r.prio || 0) ||
          a.idx - b.idx,
      )
      .map((x) => x.r)
    const stack = []
    for (let p = 0; p < sorted.length - 1; p++) {
      const a = sorted[p]
      const b = sorted[p + 1]
      if (a === b) continue
      const covering = order.filter((r) => r.start <= a && r.end >= b)
      let k = 0
      while (k < stack.length && k < covering.length && stack[k].r === covering[k]) k++
      stack.length = k
      let parent = k ? stack[k - 1].el : container
      for (let j = k; j < covering.length; j++) {
        const r = covering[j]
        const span = document.createElement("span")
        if (r.cls) span.className = r.cls
        if (r.attrs) for (const [ak, av] of Object.entries(r.attrs)) span.setAttribute(ak, av)
        parent.appendChild(span)
        stack.push({ r, el: span })
        parent = span
      }
      parent.appendChild(document.createTextNode(text.slice(a, b)))
    }
  }

  // ---------------------------------------------------------------------------
  // Code viewer: file tabs + numbered lines, with hooks for each part
  // ---------------------------------------------------------------------------

  function createViewer(app, opts) {
    const files = opts.files
    let current = files[0]
    const tabs = h("div", { class: "mk-file-tabs", role: "tablist", "aria-label": "Code files" })
    const block = h("div", { class: "mk-code-block" })
    const root = h("div", { class: "mk-viewer" }, files.length > 1 ? tabs : null, block)
    if (files.length === 1) root.insertBefore(h("div", { class: "mk-file-name", text: files[0] }), block)

    const tabButtons = {}
    for (const f of files) {
      const btn = h("button", {
        type: "button",
        class: "mk-file-tab",
        role: "tab",
        text: f,
        onclick: () => show(f),
      })
      tabButtons[f] = btn
      tabs.appendChild(btn)
    }

    function show(file) {
      if (!files.includes(file)) return
      current = file
      refresh()
    }

    function refresh() {
      for (const f of files) {
        tabButtons[f].classList.toggle("is-active", f === current)
        tabButtons[f].setAttribute("aria-selected", f === current ? "true" : "false")
      }
      const lines = app.code[current]
      const toks = app.tokens[current]
      const wrap = h("div", { class: "mk-lines" })
      lines.forEach((text, i) => {
        const lineNo = i + 1
        const ranges = toks[i].map((t, ti) => ({
          start: t.start,
          end: t.end,
          prio: 1000,
          cls:
            "mk-tok mk-k-" +
            t.kind +
            (opts.tokenClass ? " " + (opts.tokenClass(current, lineNo, t) || "") : ""),
          attrs: { "data-tok": String(ti) },
        }))
        if (opts.ranges) ranges.push(...opts.ranges(current, lineNo))
        const code = h("span", { class: "mk-code" })
        renderLine(code, text, ranges)
        const badges = opts.badges ? opts.badges(current, lineNo) : null
        const row = h(
          "div",
          {
            class: "mk-row " + (opts.rowClass ? opts.rowClass(current, lineNo) || "" : ""),
            "data-line": String(lineNo),
          },
          h("span", { class: "mk-gutter" }, h("span", { class: "mk-ln", text: String(lineNo) })),
          code,
          // badges go after the code so they never shift its alignment
          badges && badges.length ? h("span", { class: "mk-badges" }, badges) : null,
        )
        wrap.appendChild(row)
      })
      block.replaceChildren(wrap)
    }

    function locate(ev) {
      const row = ev.target.closest(".mk-row")
      if (!row || !block.contains(row)) return null
      const tokEl = ev.target.closest(".mk-tok")
      return {
        file: current,
        line: Number(row.getAttribute("data-line")),
        tok: tokEl ? Number(tokEl.getAttribute("data-tok")) : null,
        row,
        tokEl,
      }
    }

    block.addEventListener("click", (ev) => {
      const loc = locate(ev)
      if (loc && opts.onClick) opts.onClick(loc, ev)
    })
    block.addEventListener("mouseover", (ev) => {
      if (!opts.onHover) return
      opts.onHover(locate(ev))
    })
    block.addEventListener("mouseleave", () => opts.onHover && opts.onHover(null))

    return {
      el: root,
      block,
      show,
      refresh,
      get file() {
        return current
      },
    }
  }

  // ---------------------------------------------------------------------------
  // Validation and target resolution
  // ---------------------------------------------------------------------------

  function findOccurrences(line, text) {
    const out = []
    if (!text) return out
    let i = line.indexOf(text)
    while (i !== -1) {
      const before = line[i - 1]
      const after = line[i + text.length]
      const okBefore = !(isWordChar(text[0]) && isWordChar(before))
      const okAfter = !(isWordChar(text[text.length - 1]) && isWordChar(after))
      if (okBefore && okAfter) out.push(i)
      i = line.indexOf(text, i + 1)
    }
    return out
  }

  function makeResolver(app) {
    function fileFor(ref, where, defaultFile) {
      const file = ref.file || defaultFile
      if (!file) {
        app.errors.push(where + ': missing "file"')
        return null
      }
      if (!app.code[file]) {
        app.errors.push(where + ': unknown file "' + file + '"')
        return null
      }
      return file
    }

    function lineFor(ref, file, where) {
      const n = app.code[file].length
      if (!Number.isInteger(ref.line) || ref.line < 1 || ref.line > n) {
        app.errors.push(where + ": line " + ref.line + " is not a line in " + file + " (1-" + n + ")")
        return null
      }
      return ref.line
    }

    return {
      target(ref, where, defaultFile) {
        if (!ref || typeof ref !== "object") {
          app.errors.push(where + ": target is missing")
          return null
        }
        const file = fileFor(ref, where, defaultFile)
        if (!file) return null
        const line = lineFor(ref, file, where)
        if (!line) return null
        if (typeof ref.text !== "string" || !ref.text) {
          app.errors.push(where + ': missing "text"')
          return null
        }
        const lineText = app.code[file][line - 1]
        const hits = findOccurrences(lineText, ref.text)
        const occ = ref.occurrence === undefined ? 1 : ref.occurrence
        if (!hits.length) {
          app.errors.push(
            where +
              ': "' +
              ref.text +
              '" not found on ' +
              file +
              " line " +
              line +
              ". That line is: " +
              (lineText.trim() || "(blank)"),
          )
          return null
        }
        if (!Number.isInteger(occ) || occ < 1 || occ > hits.length) {
          app.errors.push(
            where +
              ": occurrence " +
              occ +
              ' of "' +
              ref.text +
              '" requested, but ' +
              file +
              " line " +
              line +
              " has " +
              hits.length,
          )
          return null
        }
        const start = hits[occ - 1]
        const r = { file, line, start, end: start + ref.text.length, text: ref.text }
        r.key = rangeKey(r)
        return r
      },
      line(ref, where, defaultFile) {
        if (!ref || typeof ref !== "object") {
          app.errors.push(where + ": line reference is missing")
          return null
        }
        const file = fileFor(ref, where, defaultFile)
        if (!file) return null
        const line = lineFor(ref, file, where)
        if (!line) return null
        return { file, line }
      },
    }
  }

  // ---------------------------------------------------------------------------
  // App
  // ---------------------------------------------------------------------------

  function start(ex) {
    const mount = document.getElementById("markup-app") || document.body.appendChild(h("div"))
    mount.classList.add("mk-app")

    const app = { ex, code: {}, tokens: {}, errors: [] }

    if (!ex || typeof ex !== "object") {
      app.errors.push("No EXERCISE object was found. Define `const EXERCISE = {...}` before loading engine.js.")
      showErrors(mount, app.errors)
      return
    }

    const fileNames = Array.isArray(ex.files)
      ? ex.files.map((f) => (typeof f === "string" ? f : f && f.name))
      : []
    if (!fileNames.length) app.errors.push('EXERCISE.files: list at least one file name, e.g. ["Main.java"]')
    for (const name of fileNames) {
      const lines = loadCode(name)
      if (!lines) {
        app.errors.push(
          'EXERCISE.files: no <script type="text/plain" data-file="' + name + '"> block found',
        )
        continue
      }
      app.code[name] = lines
      app.tokens[name] = tokenizeLines(lines)
    }
    app.fileNames = fileNames.filter((n) => app.code[n])

    const resolve = makeResolver(app)
    const wordBank = Array.isArray(ex.wordBank) ? ex.wordBank.slice() : []
    const bankSet = new Set(wordBank.map(normTerm))
    const onlyFile = app.fileNames.length === 1 ? app.fileNames[0] : undefined

    // ---- Normalize parts (and validate) -------------------------------------
    let num = 0
    const parts = []

    if (ex.nameIt && Array.isArray(ex.nameIt.items) && ex.nameIt.items.length) {
      if (!wordBank.length) app.errors.push("nameIt: needs a non-empty EXERCISE.wordBank")
      const items = ex.nameIt.items.map((it, i) => {
        const where = "nameIt item " + (i + 1)
        const answers = Array.isArray(it.answers) ? it.answers : it.answer ? [it.answer] : []
        const also = Array.isArray(it.alsoAccept) ? it.alsoAccept : []
        if (!answers.length) app.errors.push(where + ': needs "answers"')
        for (const t of answers.concat(also)) {
          if (!bankSet.has(normTerm(t)))
            app.errors.push(where + ': "' + t + '" is not in the word bank, so students cannot pick it')
        }
        return {
          n: ++num,
          target: resolve.target(it.target, where, onlyFile),
          answers,
          accepted: new Set(answers.concat(also).map(normTerm)),
          prompt: it.prompt,
        }
      })
      parts.push({ id: "nameIt", cfg: ex.nameIt, items })
    }

    if (ex.findIt && Array.isArray(ex.findIt.items) && ex.findIt.items.length) {
      const items = ex.findIt.items.map((it, i) => {
        const where = "findIt item " + (i + 1)
        if (!it.prompt) app.errors.push(where + ': needs a "prompt"')
        const refs = Array.isArray(it.lines) ? it.lines : []
        if (!refs.length) app.errors.push(where + ': needs "lines" (the correct line or lines)')
        const lines = refs
          .map((ref, j) => resolve.line(ref, where + " line " + (j + 1), onlyFile))
          .filter(Boolean)
        return { n: ++num, prompt: it.prompt || "", lines }
      })
      parts.push({ id: "findIt", cfg: ex.findIt, items })
    }

    if (ex.markUp && Array.isArray(ex.markUp.tools) && ex.markUp.tools.length) {
      const partFiles = (Array.isArray(ex.markUp.files) ? ex.markUp.files : app.fileNames).filter(
        (f) => {
          if (app.code[f]) return true
          app.errors.push('markUp.files: unknown file "' + f + '"')
          return false
        },
      )
      const seenIds = new Set()
      const tools = ex.markUp.tools.map((t, i) => {
        const where = 'markUp tool "' + (t.label || t.id || i + 1) + '"'
        const id = t.id || "tool" + (i + 1)
        if (seenIds.has(id)) app.errors.push(where + ': duplicate id "' + id + '"')
        seenIds.add(id)
        const mark = t.mark || MARKS[i % MARKS.length]
        if (!MARKS.includes(mark))
          app.errors.push(where + ': unknown mark "' + mark + '". Use one of: ' + MARKS.join(", "))
        const select = t.select === "unit" ? "unit" : "token"
        const files = (Array.isArray(t.files) ? t.files : partFiles).filter((f) => {
          if (partFiles.includes(f)) return true
          app.errors.push(where + ': file "' + f + '" is not in markUp.files')
          return false
        })
        const defFile = files.length === 1 ? files[0] : undefined
        const resolveList = (list, label) =>
          (Array.isArray(list) ? list : [])
            .map((ref, j) => {
              const r = resolve.target(ref, where + " " + label + " " + (j + 1), defFile)
              if (r && !files.includes(r.file)) {
                app.errors.push(
                  where + " " + label + " " + (j + 1) + ": file " + r.file + " is not one of this tool's files",
                )
                return null
              }
              return r
            })
            .filter(Boolean)
        const targets = resolveList(t.targets, "target")
        const decoys = select === "unit" ? resolveList(t.decoys, "decoy") : []
        if (!targets.length) app.errors.push(where + ": has no valid targets")
        if (select === "token") {
          targets.forEach((r, j) => {
            const toks = app.tokens[r.file][r.line - 1]
            const tok = toks.find((x) => x.start === r.start && x.end === r.end)
            if (!tok || tok.kind === "punct")
              app.errors.push(
                where +
                  " target " +
                  (j + 1) +
                  ': "' +
                  r.text +
                  '" is not a single clickable token. Use select: "unit" for multi-token pieces.',
              )
          })
        }
        const candidates = select === "unit" ? dedupeRanges(targets.concat(decoys)) : []
        return {
          id,
          index: i,
          label: t.label || id,
          hint: t.hint || "",
          mark,
          select,
          files,
          targets,
          targetKeys: new Set(targets.map((r) => r.key)),
          candidates,
        }
      })
      parts.push({ id: "markUp", cfg: ex.markUp, tools, files: partFiles })
    }

    if (ex.bonus && Array.isArray(ex.bonus.items) && ex.bonus.items.length) {
      const items = ex.bonus.items.map((it, i) => {
        const where = "bonus item " + (i + 1)
        if (!it.prompt) app.errors.push(where + ': needs a "prompt"')
        const answers = Array.isArray(it.answers) ? it.answers : it.answer ? [it.answer] : []
        if (!answers.length) app.errors.push(where + ': needs "answers"')
        return {
          n: ++num,
          prompt: it.prompt || "",
          answers,
          explanation: it.explanation || "",
          caseSensitive: !!it.caseSensitive,
          ignoreQuotes: it.ignoreQuotes !== false,
        }
      })
      parts.push({ id: "bonus", cfg: ex.bonus, items })
    }

    if (!parts.length) app.errors.push("EXERCISE has no parts. Add nameIt, findIt, markUp and/or bonus.")

    // ---- State -------------------------------------------------------------
    const storeKey = STORAGE_PREFIX + (ex.id || location.pathname)
    const fingerprint = hashString(
      JSON.stringify(ex) + JSON.stringify(app.code),
    )
    const fresh = () => ({ v: fingerprint, tab: null, name: "", a: {}, b: {}, c: {}, bonus: {} })
    let state = storageGet(storeKey)
    if (!state || state.v !== fingerprint) state = fresh()
    const save = () => storageSet(storeKey, state)

    const feedback = { nameIt: false, findIt: false, markUp: false, bonus: false }

    // ---- Layout ------------------------------------------------------------
    mount.replaceChildren()
    if (app.errors.length) showErrors(mount, app.errors)
    if (ex.intro) mount.appendChild(h("p", { class: "mk-intro", html: inlineMd(ex.intro) }))
    if (!parts.length || !app.fileNames.length) {
      startHeightReporting()
      return
    }

    const tabList = h("div", { class: "mk-tabs", role: "tablist", "aria-label": "Exercise parts" })
    const panelsWrap = h("div", { class: "mk-panels" })
    mount.append(tabList, panelsWrap)

    const tabIds = parts.map((p) => p.id).concat("score")
    const panels = {}
    const tabBtns = {}
    const builders = {
      nameIt: buildNameIt,
      findIt: buildFindIt,
      markUp: buildMarkUp,
      bonus: buildBonus,
      score: buildScore,
    }
    const views = {}

    tabIds.forEach((id, i) => {
      const partLetter = id === "score" || id === "bonus" ? "" : String.fromCharCode(65 + i) + ". "
      const btn = h("button", {
        type: "button",
        class: "mk-tab",
        role: "tab",
        id: "mk-tab-" + id,
        "aria-controls": "mk-panel-" + id,
        text: partLetter + PART_LABELS[id],
        onclick: () => selectTab(id),
      })
      tabBtns[id] = btn
      tabList.appendChild(btn)
      const panel = h("section", {
        class: "mk-panel",
        role: "tabpanel",
        id: "mk-panel-" + id,
        "aria-labelledby": "mk-tab-" + id,
      })
      panels[id] = panel
      panelsWrap.appendChild(panel)
      const part = parts.find((p) => p.id === id)
      views[id] = builders[id](panel, part)
    })

    function selectTab(id) {
      if (!tabIds.includes(id)) id = tabIds[0]
      state.tab = id
      save()
      for (const t of tabIds) {
        tabBtns[t].classList.toggle("is-active", t === id)
        tabBtns[t].setAttribute("aria-selected", t === id ? "true" : "false")
        panels[t].hidden = t !== id
      }
      if (views[id] && views[id].onShow) views[id].onShow()
    }

    mount.appendChild(
      h(
        "div",
        { class: "mk-footer" },
        resetButton(() => {
          storageRemove(storeKey)
          state = fresh()
          for (const k of Object.keys(feedback)) feedback[k] = false
          for (const id of tabIds) if (views[id] && views[id].reset) views[id].reset()
          selectTab(tabIds[0])
        }),
      ),
    )

    selectTab(state.tab || tabIds[0])
    startHeightReporting()

    // =========================================================================
    // Grading (shared by Check buttons and the Score tab)
    // =========================================================================

    function gradeNameItItem(item) {
      const sels = state.a[item.n] || []
      const seen = new Set()
      const slots = item.answers.map((_, k) => {
        const v = normTerm(sels[k])
        const ok = !!v && item.accepted.has(v) && !seen.has(v)
        if (v) seen.add(v)
        return ok
      })
      return { ok: item.target !== null && slots.every(Boolean), slots }
    }

    function gradeFindItItem(item) {
      const sel = state.b[item.n]
      return !!sel && item.lines.some((l) => l.file === sel.file && l.line === sel.line)
    }

    function gradeTool(tool) {
      const tags = new Set(state.c[tool.id] || [])
      let correct = 0
      let wrong = 0
      for (const k of tags) {
        if (tool.targetKeys.has(k)) correct++
        else wrong++
      }
      const total = tool.targets.length
      return { correct, wrong, missed: total - correct, total, points: Math.max(0, correct - wrong) }
    }

    function gradeBonusItem(item) {
      const v = normFreeText(state.bonus[item.n], item)
      return !!v && item.answers.some((a) => normFreeText(a, item) === v)
    }

    function partScore(part) {
      if (part.id === "nameIt") {
        const res = part.items.map((it) => ({ n: it.n, ok: gradeNameItItem(it).ok }))
        return { points: res.filter((r) => r.ok).length, total: res.length, missed: res.filter((r) => !r.ok).map((r) => r.n) }
      }
      if (part.id === "findIt") {
        const res = part.items.map((it) => ({ n: it.n, ok: gradeFindItItem(it) }))
        return { points: res.filter((r) => r.ok).length, total: res.length, missed: res.filter((r) => !r.ok).map((r) => r.n) }
      }
      if (part.id === "markUp") {
        let points = 0
        let total = 0
        const detail = part.tools.map((t) => {
          const g = gradeTool(t)
          points += g.points
          total += g.total
          return { label: t.label, ...g }
        })
        return { points, total, detail }
      }
      if (part.id === "bonus") {
        const res = part.items.map((it) => ({ n: it.n, ok: gradeBonusItem(it) }))
        return { points: res.filter((r) => r.ok).length, total: res.length, missed: res.filter((r) => !r.ok).map((r) => r.n) }
      }
      return { points: 0, total: 0 }
    }

    function checkBar(partId, onCheck, describe) {
      const result = h("span", { class: "mk-result", "aria-live": "polite" })
      const btn = h("button", {
        type: "button",
        class: "mk-btn mk-btn-primary",
        text: "Check",
        onclick: () => {
          feedback[partId] = true
          onCheck()
          result.textContent = describe()
        },
      })
      return {
        el: h("div", { class: "mk-checkbar" }, btn, result),
        clear: () => (result.textContent = ""),
        refresh: () => {
          if (feedback[partId]) result.textContent = describe()
        },
      }
    }

    // =========================================================================
    // Part A: Name It
    // =========================================================================

    function buildNameIt(panel, part) {
      let active = null
      panel.appendChild(
        h("p", {
          class: "mk-instructions",
          html: inlineMd(
            part.cfg.instructions ||
              "Each highlighted piece of code has a name from the word bank. Pick the term for each one. Some pieces need two terms.",
          ),
        }),
      )
      const viewer = createViewer(app, {
        files: app.fileNames,
        ranges: (file, line) => {
          const it = part.items.find((x) => x.n === active)
          if (!it || !it.target || it.target.file !== file || it.target.line !== line) return []
          return [{ start: it.target.start, end: it.target.end, cls: "mk-target", prio: 1 }]
        },
        rowClass: (file, line) => {
          const it = part.items.find((x) => x.n === active)
          return it && it.target && it.target.file === file && it.target.line === line ? "is-current" : ""
        },
      })
      panel.appendChild(viewer.el)

      const list = h("ol", { class: "mk-cards" })
      panel.appendChild(list)
      const cards = {}

      function setActive(n) {
        active = n
        const it = part.items.find((x) => x.n === n)
        for (const [k, c] of Object.entries(cards)) c.el.classList.toggle("is-active", Number(k) === n)
        if (it && it.target) viewer.show(it.target.file)
        else viewer.refresh()
      }

      for (const it of part.items) {
        const selects = []
        const marks = []
        const card = h("li", { class: "mk-card", "data-n": String(it.n) })
        const head = h(
          "div",
          { class: "mk-card-head" },
          h("span", { class: "mk-num", text: String(it.n) }),
          h("span", {
            class: "mk-where",
            text: it.target ? it.target.file + ", line " + it.target.line : "(target not found)",
          }),
        )
        card.appendChild(head)
        if (it.prompt) card.appendChild(h("div", { class: "mk-prompt", html: inlineMd(it.prompt) }))
        if (it.target) {
          const snippet = h("div", { class: "mk-snippet" })
          const code = h("span", { class: "mk-code" })
          const toks = app.tokens[it.target.file][it.target.line - 1]
          const ranges = toks.map((t) => ({ start: t.start, end: t.end, prio: 1000, cls: "mk-tok mk-k-" + t.kind }))
          ranges.push({ start: it.target.start, end: it.target.end, cls: "mk-target", prio: 1 })
          renderLine(code, app.code[it.target.file][it.target.line - 1], ranges)
          snippet.append(h("span", { class: "mk-ln", text: String(it.target.line) }), code)
          card.appendChild(snippet)
        }
        const pickers = h("div", { class: "mk-pickers" })
        it.answers.forEach((_, k) => {
          const sel = h(
            "select",
            {
              class: "mk-select",
              "aria-label": "Item " + it.n + (it.answers.length > 1 ? ", term " + (k + 1) : ""),
              onchange: () => {
                const arr = (state.a[it.n] = state.a[it.n] || [])
                arr[k] = sel.value
                save()
                clearCard(it.n)
              },
            },
            h("option", { value: "", text: it.answers.length > 1 ? "— term " + (k + 1) + " —" : "— choose —" }),
            wordBank.map((w) => h("option", { value: w, text: w })),
          )
          const mark = h("span", { class: "mk-mark", "aria-hidden": "true" })
          selects.push(sel)
          marks.push(mark)
          pickers.appendChild(h("span", { class: "mk-picker" }, sel, mark))
        })
        card.appendChild(pickers)
        card.addEventListener("focusin", () => setActive(it.n))
        card.addEventListener("click", () => setActive(it.n))
        list.appendChild(card)
        cards[it.n] = { el: card, selects, marks }
      }

      const bar = checkBar("nameIt", showFeedback, () => {
        const s = partScore(part)
        return s.points + " / " + s.total + " correct"
      })
      panel.appendChild(bar.el)

      function clearCard(n) {
        const c = cards[n]
        c.el.classList.remove("is-ok", "is-bad")
        c.marks.forEach((m) => {
          m.textContent = ""
          m.className = "mk-mark"
        })
        c.selects.forEach((s) => s.classList.remove("is-ok", "is-bad"))
      }

      function showFeedback() {
        for (const it of part.items) {
          const c = cards[it.n]
          const g = gradeNameItItem(it)
          c.el.classList.toggle("is-ok", g.ok)
          c.el.classList.toggle("is-bad", !g.ok)
          g.slots.forEach((ok, k) => {
            c.marks[k].textContent = ok ? "✓" : "✗"
            c.marks[k].className = "mk-mark " + (ok ? "is-ok" : "is-bad")
            c.selects[k].classList.toggle("is-ok", ok)
            c.selects[k].classList.toggle("is-bad", !ok)
          })
        }
      }

      function load() {
        for (const it of part.items) {
          const sels = state.a[it.n] || []
          cards[it.n].selects.forEach((s, k) => (s.value = sels[k] || ""))
          clearCard(it.n)
        }
        bar.clear()
      }

      load()
      setActive(part.items[0] ? part.items[0].n : null)
      return { reset: load, onShow: () => viewer.refresh() }
    }

    // =========================================================================
    // Part B: Find It
    // =========================================================================

    function buildFindIt(panel, part) {
      let active = (part.items.find((it) => !state.b[it.n]) || part.items[0]).n
      panel.appendChild(
        h("p", {
          class: "mk-instructions",
          html: inlineMd(
            part.cfg.instructions ||
              "Pick a question, then click the line of code that matches it. Your choice moves on to the next question automatically.",
          ),
        }),
      )
      const list = h("ol", { class: "mk-find-list" })
      panel.appendChild(list)
      const status = h("div", { class: "mk-status", "aria-live": "polite" })
      panel.appendChild(status)

      const viewer = createViewer(app, {
        files: app.fileNames,
        rowClass: (file, line) => {
          const sel = state.b[active]
          let cls = "is-clickable"
          if (sel && sel.file === file && sel.line === line) cls += " is-chosen"
          return cls
        },
        badges: (file, line) =>
          part.items
            .filter((it) => {
              const s = state.b[it.n]
              return s && s.file === file && s.line === line
            })
            .map((it) => {
              let cls = "mk-badge"
              if (feedback.findIt && rows[it.n].checked) cls += gradeFindItItem(it) ? " is-ok" : " is-bad"
              if (it.n === active) cls += " is-active"
              return h("span", { class: cls, text: "#" + it.n })
            }),
        onClick: (loc) => {
          state.b[active] = { file: loc.file, line: loc.line }
          save()
          clearRow(active)
          const next = part.items.find((it) => it.n > active && !state.b[it.n])
          if (next) active = next.n
          refreshAll()
        },
      })
      panel.appendChild(viewer.el)

      const rows = {}
      for (const it of part.items) {
        const answer = h("span", { class: "mk-answer" })
        const mark = h("span", { class: "mk-mark", "aria-hidden": "true" })
        const row = h(
          "li",
          {},
          h(
            "button",
            {
              type: "button",
              class: "mk-find-item",
              onclick: () => {
                active = it.n
                const s = state.b[it.n]
                if (s) viewer.show(s.file)
                refreshAll()
              },
            },
            h("span", { class: "mk-num", text: String(it.n) }),
            h("span", { class: "mk-find-prompt", html: inlineMd(it.prompt) }),
            answer,
            mark,
          ),
        )
        list.appendChild(row)
        rows[it.n] = { el: row.firstChild, answer, mark, checked: false }
      }

      const bar = checkBar("findIt", showFeedback, () => {
        const s = partScore(part)
        return s.points + " / " + s.total + " correct"
      })
      panel.appendChild(bar.el)

      function clearRow(n) {
        const r = rows[n]
        r.checked = false
        r.el.classList.remove("is-ok", "is-bad")
        r.mark.textContent = ""
        r.mark.className = "mk-mark"
      }

      function showFeedback() {
        for (const it of part.items) {
          const r = rows[it.n]
          const ok = gradeFindItItem(it)
          r.checked = true
          r.el.classList.toggle("is-ok", ok)
          r.el.classList.toggle("is-bad", !ok)
          r.mark.textContent = ok ? "✓" : "✗"
          r.mark.className = "mk-mark " + (ok ? "is-ok" : "is-bad")
        }
        viewer.refresh()
      }

      function refreshAll() {
        for (const it of part.items) {
          const r = rows[it.n]
          const s = state.b[it.n]
          r.el.classList.toggle("is-active", it.n === active)
          r.answer.textContent = s ? s.file + " line " + s.line : "not answered"
          r.answer.classList.toggle("is-empty", !s)
        }
        const cur = part.items.find((it) => it.n === active)
        status.innerHTML =
          "<strong>Now finding #" + cur.n + ":</strong> " + inlineMd(cur.prompt) + " — click a line below."
        viewer.refresh()
      }

      function load() {
        active = (part.items.find((it) => !state.b[it.n]) || part.items[0]).n
        for (const it of part.items) clearRow(it.n)
        bar.clear()
        refreshAll()
      }

      load()
      return { reset: load, onShow: refreshAll }
    }

    // =========================================================================
    // Part C: Mark It Up
    // =========================================================================

    function buildMarkUp(panel, part) {
      let activeTool = part.tools[0]
      let hoverCand = null
      panel.appendChild(
        h("p", {
          class: "mk-instructions",
          html: inlineMd(
            part.cfg.instructions ||
              "Choose a tool, then click pieces of code to mark them. Click a marked piece again to remove the mark. Each tool has its own shape.",
          ),
        }),
      )
      const toolbar = h("div", { class: "mk-toolbar", role: "radiogroup", "aria-label": "Markup tools" })
      panel.appendChild(toolbar)
      const toolHint = h("div", { class: "mk-status", "aria-live": "polite" })
      panel.appendChild(toolHint)

      const toolBtns = {}
      for (const tool of part.tools) {
        const count = h("span", { class: "mk-count" })
        const btn = h(
          "button",
          {
            type: "button",
            class: "mk-tool mk-tool-" + (tool.index % 6),
            role: "radio",
            onclick: () => {
              activeTool = tool
              refreshAll()
            },
          },
          h("span", { class: "mk-sample mk-tag mk-mark-" + tool.mark, text: "Aa" }),
          h("span", { class: "mk-tool-label", text: tool.label }),
          count,
        )
        toolBtns[tool.id] = { btn, count }
        toolbar.appendChild(btn)
      }

      const tagsOf = (tool) => (state.c[tool.id] = state.c[tool.id] || [])

      function candidateAt(tool, file, line, tok) {
        const t = app.tokens[file][line - 1][tok]
        if (!t) return null
        let best = null
        for (const c of tool.candidates) {
          if (c.file !== file || c.line !== line || c.start > t.start || c.end < t.end) continue
          if (!best || c.end - c.start < best.end - best.start) best = c
        }
        return best
      }

      const viewer = createViewer(app, {
        files: part.files,
        tokenClass: (file, line, t) => {
          if (!activeTool.files.includes(file)) return ""
          if (activeTool.select === "token") return t.kind === "punct" ? "" : "is-clickable"
          return ""
        },
        ranges: (file, line) => {
          const out = []
          for (const tool of part.tools) {
            const tags = new Set(tagsOf(tool))
            const color = " mk-tool-" + (tool.index % 6)
            for (const key of tags) {
              const [f, l, s, e] = splitKey(key)
              if (f !== file || l !== line) continue
              let fb = ""
              if (feedback.markUp) fb = tool.targetKeys.has(key) ? " mk-fb-ok" : " mk-fb-bad"
              out.push({
                start: s,
                end: e,
                prio: 10 + tool.index,
                cls: "mk-tag mk-mark-" + tool.mark + color + fb,
                attrs: { title: tool.label },
              })
            }
            if (feedback.markUp) {
              for (const r of tool.targets) {
                if (r.file !== file || r.line !== line || tags.has(r.key)) continue
                out.push({
                  start: r.start,
                  end: r.end,
                  prio: 10 + tool.index,
                  cls: "mk-missed" + color,
                  attrs: { title: "missed: " + tool.label },
                })
              }
            }
          }
          if (activeTool.select === "unit" && activeTool.files.includes(file)) {
            activeTool.candidates.forEach((c, i) => {
              if (c.file !== file || c.line !== line) return
              out.push({
                start: c.start,
                end: c.end,
                prio: 500,
                cls: "mk-cand",
                attrs: { "data-cand": String(i) },
              })
            })
          }
          return out
        },
        onHover: (loc) => {
          let next = null
          if (loc && loc.tok !== null && activeTool.select === "unit" && activeTool.files.includes(loc.file)) {
            const c = candidateAt(activeTool, loc.file, loc.line, loc.tok)
            if (c) next = activeTool.candidates.indexOf(c)
          }
          if (next === hoverCand) return
          hoverCand = next
          viewer.block.querySelectorAll(".mk-cand.is-hover").forEach((n) => n.classList.remove("is-hover"))
          if (next !== null)
            viewer.block
              .querySelectorAll('.mk-cand[data-cand="' + next + '"]')
              .forEach((n) => n.classList.add("is-hover"))
        },
        onClick: (loc) => {
          if (loc.tok === null || !activeTool.files.includes(loc.file)) return
          let key = null
          if (activeTool.select === "token") {
            const t = app.tokens[loc.file][loc.line - 1][loc.tok]
            if (!t || t.kind === "punct") return
            key = rangeKey({ file: loc.file, line: loc.line, start: t.start, end: t.end })
          } else {
            const c = candidateAt(activeTool, loc.file, loc.line, loc.tok)
            if (!c) return
            key = c.key
          }
          const tags = tagsOf(activeTool)
          const i = tags.indexOf(key)
          if (i === -1) tags.push(key)
          else tags.splice(i, 1)
          save()
          if (feedback.markUp) {
            feedback.markUp = false
            bar.clear()
            results.replaceChildren()
          }
          hoverCand = null
          refreshAll()
        },
      })
      panel.appendChild(viewer.el)

      const legend = h(
        "div",
        { class: "mk-legend", hidden: true },
        h("span", {}, h("span", { class: "mk-legend-sym is-ok", text: "✓" }), " correct mark"),
        h("span", {}, h("span", { class: "mk-legend-sym is-bad", text: "✗" }), " wrong mark"),
        h("span", {}, h("span", { class: "mk-legend-sym is-missed", text: "?" }), " missed (dashed outline)"),
      )
      panel.appendChild(legend)

      const results = h("ul", { class: "mk-tool-results" })
      const bar = checkBar("markUp", showFeedback, () => {
        const s = partScore(part)
        return s.points + " / " + s.total + " points"
      })
      panel.appendChild(bar.el)
      panel.appendChild(results)

      function showFeedback() {
        results.replaceChildren(
          ...part.tools.map((tool) => {
            const g = gradeTool(tool)
            return h(
              "li",
              {},
              h("strong", { text: tool.label + ": " }),
              g.correct + " of " + g.total + " found",
              g.wrong ? ", " + g.wrong + " wrong" : "",
              g.missed ? ", " + g.missed + " missed" : "",
            )
          }),
        )
        refreshAll()
      }

      function refreshAll() {
        for (const tool of part.tools) {
          const tb = toolBtns[tool.id]
          const on = tool === activeTool
          tb.btn.classList.toggle("is-active", on)
          tb.btn.setAttribute("aria-checked", on ? "true" : "false")
          tb.count.textContent = String(tagsOf(tool).length)
        }
        const how =
          activeTool.select === "unit"
            ? "Click anywhere in a piece of code to mark the whole piece."
            : "Click a word or symbol to mark it."
        toolHint.innerHTML =
          "<strong>Marking: " +
          escapeHtml(activeTool.label) +
          "</strong> (" +
          MARK_NAMES[activeTool.mark] +
          ")" +
          (activeTool.hint ? " — " + inlineMd(activeTool.hint).replace(/[.!?]*$/, "") : "") +
          ". " +
          how
        legend.hidden = !feedback.markUp
        viewer.refresh()
      }

      function load() {
        activeTool = part.tools[0]
        hoverCand = null
        results.replaceChildren()
        bar.clear()
        refreshAll()
      }

      load()
      return { reset: load, onShow: refreshAll }
    }

    // =========================================================================
    // Bonus
    // =========================================================================

    function buildBonus(panel, part) {
      if (part.cfg.instructions)
        panel.appendChild(h("p", { class: "mk-instructions", html: inlineMd(part.cfg.instructions) }))
      const list = h("ol", { class: "mk-cards" })
      panel.appendChild(list)
      const cards = {}
      for (const it of part.items) {
        const input = h("input", {
          type: "text",
          class: "mk-input",
          autocomplete: "off",
          spellcheck: "false",
          "aria-label": "Answer to bonus question " + it.n,
          oninput: () => {
            state.bonus[it.n] = input.value
            save()
            clear(it.n)
          },
        })
        const mark = h("span", { class: "mk-mark", "aria-hidden": "true" })
        const explain = h("div", { class: "mk-explain", hidden: true, html: inlineMd(it.explanation) })
        const card = h(
          "li",
          { class: "mk-card" },
          h(
            "div",
            { class: "mk-card-head" },
            h("span", { class: "mk-num", text: String(it.n) }),
            h("span", { class: "mk-prompt", html: inlineMd(it.prompt) }),
          ),
          h("div", { class: "mk-pickers" }, h("span", { class: "mk-picker" }, input, mark)),
          explain,
        )
        list.appendChild(card)
        cards[it.n] = { el: card, input, mark, explain }
      }
      const bar = checkBar("bonus", showFeedback, () => {
        const s = partScore(part)
        return s.points + " / " + s.total + " correct"
      })
      panel.appendChild(bar.el)

      function clear(n) {
        const c = cards[n]
        c.el.classList.remove("is-ok", "is-bad")
        c.mark.textContent = ""
        c.mark.className = "mk-mark"
        c.input.classList.remove("is-ok", "is-bad")
      }

      function showFeedback() {
        for (const it of part.items) {
          const c = cards[it.n]
          const ok = gradeBonusItem(it)
          c.el.classList.toggle("is-ok", ok)
          c.el.classList.toggle("is-bad", !ok)
          c.input.classList.toggle("is-ok", ok)
          c.input.classList.toggle("is-bad", !ok)
          c.mark.textContent = ok ? "✓" : "✗"
          c.mark.className = "mk-mark " + (ok ? "is-ok" : "is-bad")
          c.explain.hidden = !it.explanation
        }
      }

      function load() {
        for (const it of part.items) {
          cards[it.n].input.value = state.bonus[it.n] || ""
          cards[it.n].explain.hidden = true
          clear(it.n)
        }
        bar.clear()
      }

      load()
      return { reset: load }
    }

    // =========================================================================
    // Score summary
    // =========================================================================

    function buildScore(panel) {
      const nameInput = h("input", {
        type: "text",
        class: "mk-input mk-name",
        placeholder: "Your name",
        autocomplete: "name",
        "aria-label": "Your name",
        oninput: () => {
          state.name = nameInput.value
          save()
          render()
        },
      })
      panel.appendChild(
        h(
          "p",
          { class: "mk-instructions" },
          "Type your name, then take a screenshot of the box below and submit it on Canvas. ",
          h("span", { class: "mk-hint", text: "(Mac: Shift + Command + 4, then drag over the box.)" }),
        ),
      )
      panel.appendChild(h("div", { class: "mk-name-row" }, nameInput))
      const card = h("div", { class: "mk-score-card" })
      panel.appendChild(card)

      function render() {
        const rows = []
        let points = 0
        let total = 0
        parts.forEach((part, i) => {
          const s = partScore(part)
          const label = (part.id === "bonus" ? "" : String.fromCharCode(65 + i) + ". ") + PART_LABELS[part.id]
          points += s.points
          total += s.total
          let detail = ""
          if (s.missed && s.missed.length) detail = "Recheck #" + s.missed.join(", #")
          else if (s.detail)
            detail = s.detail
              .map((d) => d.label + " " + d.correct + "/" + d.total + (d.wrong ? " (" + d.wrong + " wrong)" : ""))
              .join("; ")
          else detail = "All correct"
          rows.push(
            h(
              "tr",
              {},
              h("th", { scope: "row", text: label }),
              h("td", { class: "mk-score-num", text: s.points + " / " + s.total }),
              h("td", { class: "mk-score-detail", text: detail }),
            ),
          )
        })
        const pct = total ? Math.round((points / total) * 100) : 0
        card.replaceChildren(
          h("div", { class: "mk-score-title", text: ex.title || document.title }),
          h("div", { class: "mk-score-name", text: state.name ? state.name : "(type your name above)" }),
          h("table", { class: "mk-score-table" }, h("tbody", {}, rows)),
          h(
            "div",
            { class: "mk-score-total" },
            h("span", { text: "Total" }),
            h("span", { class: "mk-score-big", text: points + " / " + total }),
            h("span", { text: pct + "%" }),
          ),
          h("div", { class: "mk-score-time", text: new Date().toLocaleString() }),
        )
      }

      function load() {
        nameInput.value = state.name || ""
        render()
      }
      load()
      return { onShow: load, reset: load }
    }
  }

  function splitKey(key) {
    const parts = key.split(":")
    const end = Number(parts.pop())
    const start = Number(parts.pop())
    const line = Number(parts.pop())
    return [parts.join(":"), line, start, end]
  }

  function dedupeRanges(list) {
    const seen = new Set()
    return list.filter((r) => {
      if (seen.has(r.key)) return false
      seen.add(r.key)
      return true
    })
  }

  function resetButton(onReset) {
    let armed = false
    let timer
    const btn = h("button", {
      type: "button",
      class: "mk-btn mk-btn-quiet",
      text: "Start over",
      onclick: () => {
        if (!armed) {
          armed = true
          btn.textContent = "Click again to erase all answers"
          btn.classList.add("is-armed")
          timer = setTimeout(() => {
            armed = false
            btn.textContent = "Start over"
            btn.classList.remove("is-armed")
          }, 4000)
          return
        }
        clearTimeout(timer)
        armed = false
        btn.textContent = "Start over"
        btn.classList.remove("is-armed")
        onReset()
      },
    })
    return btn
  }

  function showErrors(mount, errors) {
    console.error("[markup engine] Exercise data problems:\n- " + errors.join("\n- "))
    const box = h(
      "div",
      { class: "mk-errors", role: "alert" },
      h("strong", { text: "Exercise data problems (" + errors.length + ")" }),
      h("p", { text: "These entries don't match the code. Fix them in the exercise file:" }),
      h("ul", {}, errors.map((e) => h("li", { text: e }))),
    )
    mount.prepend(box)
  }

  // ---------------------------------------------------------------------------
  // Iframe integration: height reporting and site theme
  // ---------------------------------------------------------------------------

  let heightStarted = false
  function startHeightReporting() {
    if (heightStarted || window.parent === window) return
    heightStarted = true
    let last = -1
    const post = () => {
      const height = Math.ceil(document.documentElement.getBoundingClientRect().height)
      if (height === last) return
      last = height
      try {
        window.parent.postMessage({ type: HEIGHT_MESSAGE, height }, "*")
      } catch {}
    }
    if (window.ResizeObserver) new ResizeObserver(post).observe(document.documentElement)
    window.addEventListener("load", post)
    post()
  }

  function setupTheme() {
    const root = document.documentElement
    const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null
    let parentRoot = null
    try {
      if (window.parent !== window) parentRoot = window.parent.document.documentElement
    } catch {
      parentRoot = null // different origin: fall back to the OS setting
    }
    const apply = () => {
      const fromParent = parentRoot && parentRoot.getAttribute("saved-theme")
      const theme = fromParent || (media && media.matches ? "dark" : "light")
      root.setAttribute("data-theme", theme)
    }
    apply()
    if (parentRoot && window.MutationObserver) {
      const obs = new MutationObserver(apply)
      obs.observe(parentRoot, { attributes: true, attributeFilter: ["saved-theme"] })
      window.addEventListener("pagehide", () => obs.disconnect())
    } else if (media && media.addEventListener) {
      media.addEventListener("change", apply)
    }
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------

  setupTheme()
  const boot = () => {
    // `const EXERCISE` in a classic script is a global binding but not a window property
    // eslint-disable-next-line no-undef
    const ex = typeof EXERCISE !== "undefined" ? EXERCISE : window.EXERCISE
    try {
      start(ex)
    } catch (err) {
      console.error(err)
      const mount = document.getElementById("markup-app") || document.body
      showErrors(mount, ["The engine crashed while loading this exercise: " + (err && err.message)])
      startHeightReporting()
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot)
  else boot()

  window.MarkupEngine = { version: 1 }
})()
