// @ts-ignore
import script from "./scripts/markupexerciseframe.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

// Renders nothing. It adds the styles and the resize listener for
// <iframe class="markup-exercise"> embeds (see content/2. Programming/Markup Exercises).
const MarkupExerciseFrame: QuartzComponent = () => null

MarkupExerciseFrame.css = `
iframe.markup-exercise {
  display: block;
  width: 100%;
  height: 1400px; /* fallback until the exercise reports its real height */
  border: 0;
  margin: 1rem 0;
  background: transparent;
}
`
MarkupExerciseFrame.afterDOMLoaded = script

export default (() => MarkupExerciseFrame) satisfies QuartzComponentConstructor
