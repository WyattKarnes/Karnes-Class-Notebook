import fs from "fs"
import path from "path"
// @ts-ignore
import copyMarkdownScript from "./scripts/copymarkdown.inline"
import styles from "./styles/copymarkdown.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface Options {
  /** Remove the YAML frontmatter block (--- ... ---) from the copied text. */
  stripFrontmatter: boolean
}

const defaultOptions: Options = {
  stripFrontmatter: true,
}

// Matches a YAML frontmatter block at the very start of the file, plus any
// blank lines right after it. Handles CRLF line endings and empty frontmatter.
const frontmatterRegex = /^---[ \t]*\r?\n(?:[\s\S]*?\r?\n)?---[ \t]*(?:\r?\n|$)(?:[ \t]*\r?\n)*/

function readSource(filePath: string, stripFrontmatter: boolean): string | null {
  try {
    let text = fs.readFileSync(path.resolve(filePath), "utf-8")
    // drop a byte-order mark if the editor saved one
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
    if (stripFrontmatter) text = text.replace(frontmatterRegex, "")
    return text
  } catch {
    return null
  }
}

export default ((userOpts?: Partial<Options>) => {
  const opts: Options = { ...defaultOptions, ...userOpts }

  const CopyMarkdown: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const filePath = fileData.filePath
    const slug = fileData.slug ?? ""

    // Only regular note pages: they have a real .md file on disk.
    // Folder listings, tag pages and the 404 page are skipped.
    if (!filePath || !filePath.endsWith(".md")) return null
    if (slug === "404" || slug.startsWith("tags/") || slug.endsWith("/index")) return null

    const source = readSource(filePath, opts.stripFrontmatter)
    if (source === null) return null

    // Escape "<" so text like "</script>" inside a note can't close the tag early.
    const json = JSON.stringify(source).replace(/</g, "\\u003c")

    return (
      <div class={classNames(displayClass, "copy-markdown")}>
        <button type="button" class="copy-markdown-button" aria-label="Copy this note's Markdown">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="currentColor"
            class="copy-markdown-icon"
          >
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z" />
            <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z" />
          </svg>
          <span class="copy-markdown-label">Copy Markdown</span>
        </button>
        <script
          type="application/json"
          class="copy-markdown-source"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      </div>
    )
  }

  CopyMarkdown.css = styles
  CopyMarkdown.afterDOMLoaded = copyMarkdownScript

  return CopyMarkdown
}) satisfies QuartzComponentConstructor
