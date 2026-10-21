const DEFAULT_LABEL = "Copy Markdown"
const FEEDBACK_MS = 2000

// Last-resort copy for browsers/contexts where navigator.clipboard is missing or
// rejects (e.g. plain http on a non-localhost address). Shows the text in a
// selected textarea; if execCommand("copy") also fails, the user can press Cmd+C.
function fallbackCopy(container: HTMLElement, text: string): boolean {
  let area = container.querySelector<HTMLTextAreaElement>(".copy-markdown-fallback")
  if (!area) {
    area = document.createElement("textarea")
    area.className = "copy-markdown-fallback"
    area.readOnly = true
    area.setAttribute("aria-label", "Markdown source (select and copy)")
    container.appendChild(area)
  }
  area.value = text
  area.focus()
  area.select()
  area.setSelectionRange(0, text.length) // needed for Safari on iOS
  try {
    return document.execCommand("copy")
  } catch {
    return false
  }
}

document.addEventListener("nav", () => {
  for (const container of document.querySelectorAll<HTMLElement>(".copy-markdown")) {
    const button = container.querySelector<HTMLButtonElement>(".copy-markdown-button")
    const label = container.querySelector<HTMLElement>(".copy-markdown-label")
    const sourceEl = container.querySelector<HTMLScriptElement>(".copy-markdown-source")
    if (!button || !label || !sourceEl) continue

    let resetTimer: number | undefined

    const showFeedback = (message: string, state: "copied" | "manual") => {
      label.textContent = message
      button.dataset.state = state
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(() => {
        label.textContent = DEFAULT_LABEL
        delete button.dataset.state
      }, FEEDBACK_MS)
    }

    const onClick = () => {
      let text: string
      try {
        text = JSON.parse(sourceEl.textContent ?? '""')
      } catch (err) {
        console.error("Copy Markdown: could not read note source", err)
        return
      }

      const onFail = () => {
        if (fallbackCopy(container, text)) {
          showFeedback("Copied!", "copied")
        } else {
          showFeedback("Press ⌘C to copy", "manual")
        }
      }

      // Call writeText synchronously inside the click handler so Safari treats
      // it as part of the user gesture.
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          container.querySelector(".copy-markdown-fallback")?.remove()
          showFeedback("Copied!", "copied")
        }, onFail)
      } else {
        onFail()
      }
    }

    button.addEventListener("click", onClick)
    window.addCleanup(() => {
      button.removeEventListener("click", onClick)
      window.clearTimeout(resetTimer)
    })
  }
})
