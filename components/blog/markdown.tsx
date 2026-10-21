import type { ReactNode } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Element, ElementContent, Root, RootContent } from "hast"
import { AdSlot } from "@/components/blog/ad-slot"
import type { AdSlotName } from "@/lib/ads"
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

// ---------- paso rehype: figuras con pie de foto y huecos de publicidad ----------

function isElement(node: RootContent | ElementContent): node is Element {
  return node.type === "element"
}

function isBlank(node: ElementContent) {
  return node.type === "text" && node.value.trim() === ""
}

/** Párrafo que solo contiene imágenes (lo normal en `![alt](src "crédito")` en su propia línea) */
function isImageParagraph(node: RootContent): node is Element {
  if (!isElement(node) || node.tagName !== "p") return false
  const content = node.children.filter((c) => !isBlank(c))
  return content.length > 0 && content.every((c) => isElement(c) && c.tagName === "img")
}

/** <img title="Foto: …"> → <figure><img><figcaption>Foto: …</figcaption></figure> */
function toFigure(img: Element): Element {
  const { title, ...properties } = img.properties ?? {}
  const caption = typeof title === "string" ? title.trim() : ""
  const children: ElementContent[] = [{ ...img, properties }]
  if (caption) {
    children.push({ type: "element", tagName: "figcaption", properties: {}, children: [{ type: "text", value: caption }] })
  }
  return { type: "element", tagName: "figure", properties: {}, children }
}

function adMarker(name: AdSlotName): Element {
  return { type: "element", tagName: "div", properties: { dataAdSlot: name }, children: [] }
}

/**
 * Trabaja solo con los bloques de primer nivel del artículo:
 * 1. Convierte los párrafos de imágenes en <figure> con <figcaption> (del título de la imagen).
 * 2. Si `ads`, marca dónde van los huecos: `articleTop` tras el 2.º párrafo y `articleMiddle` antes del
 *    `##` más cercano a la mitad. Los marcadores son <div data-ad-slot> que luego pinta <AdSlot>.
 *    No se tocan los encabezados, así que los ids del índice siguen coincidiendo.
 */
function rehypeArticleBlocks({ ads }: { ads: boolean }) {
  return (tree: Root) => {
    const blocks: RootContent[] = []
    for (const node of tree.children) {
      if (isImageParagraph(node)) {
        for (const child of node.children) if (isElement(child) && child.tagName === "img") blocks.push(toFigure(child))
      } else {
        blocks.push(node)
      }
    }

    if (ads) {
      const elements = blocks.filter(isElement)
      const total = elements.length
      const inserts = new Map<Element, AdSlotName>() // el hueco va ANTES de este bloque

      // tras el 2.º párrafo (si queda contenido detrás)
      const paragraphs = elements.filter((e) => e.tagName === "p")
      const secondP = paragraphs[1]
      let topPos = -1
      if (secondP) {
        const pos = elements.indexOf(secondP)
        if (pos < total - 2) {
          inserts.set(elements[pos + 1], "articleTop")
          topPos = pos + 1
        }
      }

      // antes del ## más cercano a la mitad, lejos del primer hueco y del final (solo artículos largos)
      if (total >= 12) {
        const middle = total / 2
        const candidates = elements
          .map((e, i) => ({ e, i }))
          .filter(({ e, i }) => e.tagName === "h2" && i > topPos + 3 && i < total - 2)
        const best = candidates.sort((a, b) => Math.abs(a.i - middle) - Math.abs(b.i - middle))[0]
        if (best) inserts.set(best.e, "articleMiddle")
      }

      if (inserts.size > 0) {
        const withAds: RootContent[] = []
        for (const node of blocks) {
          const slot = isElement(node) ? inserts.get(node) : undefined
          if (slot) withAds.push(adMarker(slot), { type: "text", value: "\n" })
          withAds.push(node)
        }
        tree.children = withAds
        return
      }
    }

    tree.children = blocks
  }
}

// ---------- componente ----------

/** Cuerpo del artículo en Markdown (GFM: tablas, listas de tareas, tachado…) */
export function ArticleMarkdown({ content, ads = false }: { content: string; ads?: boolean }) {
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
    h3: ({ children }) => <h3 className="scroll-mt-28">{children}</h3>,
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
    img: ({ src, alt, title }) =>
      typeof src === "string" && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverSrc(src)}
          alt={alt ?? ""}
          title={title}
          loading="lazy"
          decoding="async"
          className={
            // las infografías SVG van sobre fondo blanco con borde para que los gráficos se lean bien
            /\.svg($|[?#])/i.test(src)
              ? "h-auto w-full rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-200 sm:p-5"
              : "h-auto w-full rounded-2xl bg-slate-100"
          }
        />
      ) : null,
    figure: ({ children }) => <figure className="my-10">{children}</figure>,
    figcaption: ({ children }) => (
      <figcaption className="mt-3 text-pretty text-xs leading-relaxed text-slate-500">{children}</figcaption>
    ),
    div: ({ node, children, ...props }) => {
      const slot = node?.properties?.dataAdSlot
      if (typeof slot === "string") return <AdSlot name={slot as AdSlotName} />
      return <div {...props}>{children}</div>
    },
    table: ({ children }) => (
      <div className="not-prose my-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-50 text-slate-700">{children}</thead>,
    th: ({ children, style }) => (
      <th style={style} className="border-b border-slate-200 px-4 py-3 font-semibold">
        {children}
      </th>
    ),
    td: ({ children, style }) => (
      <td style={style} className="border-b border-slate-100 px-4 py-3 align-top text-slate-700">
        {children}
      </td>
    ),
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeArticleBlocks, { ads }]]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
