import type { ReactNode } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { coverSrc, createHeadingIdFactory, SITE_URL } from "@/lib/blog"

function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children)
  }
  return ""
}

function isExternal(href: string) {
  if (!/^https?:\/\//i.test(href)) return false
  try {
    return new URL(href).host !== new URL(SITE_URL).host
  } catch {
    return true
  }
}

/** Cuerpo del artículo en Markdown (GFM: tablas, listas de tareas, tachado…) */
export function ArticleMarkdown({ content }: { content: string }) {
  // mismos ids que extractHeadings() para que el índice enlace con los ## del texto
  const nextId = createHeadingIdFactory()

  const components: Components = {
    h1: ({ children }) => <h2>{children}</h2>, // solo hay un H1 por página (el título)
    h2: ({ children }) => {
      const id = nextId(textOf(children))
      return (
        <h2 id={id} className="scroll-mt-28">
          {children}
        </h2>
      )
    },
    a: ({ href = "", children }) => {
      if (isExternal(href)) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )
      }
      const local = href.startsWith("/") ? coverSrc(href) : href
      return <a href={local}>{children}</a>
    },
    img: ({ src, alt }) =>
      typeof src === "string" && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverSrc(src)} alt={alt ?? ""} loading="lazy" decoding="async" className="rounded-xl" />
      ) : null,
    table: ({ children }) => (
      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-left text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-50 text-slate-700">{children}</thead>,
    th: ({ children, style }) => (
      <th style={style} className="border-b border-border px-4 py-2.5 font-semibold">
        {children}
      </th>
    ),
    td: ({ children, style }) => (
      <td style={style} className="border-b border-border px-4 py-2.5 align-top">
        {children}
      </td>
    ),
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
