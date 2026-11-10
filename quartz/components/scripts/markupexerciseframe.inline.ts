// Markup exercises post their content height so the iframe fits without an inner scrollbar.
// This listener is registered once per full page load. It finds the sending iframe at
// message time, so it keeps working after SPA navigation swaps the page content.
const MESSAGE_TYPE = "markup-exercise:height"

const w = window as Window & { __markupExerciseFrame?: boolean }
if (!w.__markupExerciseFrame) {
  w.__markupExerciseFrame = true
  window.addEventListener("message", (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return
    const data = event.data
    if (!data || data.type !== MESSAGE_TYPE || typeof data.height !== "number") return
    for (const frame of document.querySelectorAll<HTMLIFrameElement>("iframe.markup-exercise")) {
      if (frame.contentWindow === event.source) {
        const height = Math.min(Math.max(Math.ceil(data.height), 200), 20000)
        frame.style.height = `${height}px`
      }
    }
  })
}
