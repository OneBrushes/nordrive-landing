import Link from "next/link"
import { ArrowRight, Newspaper, Rss } from "lucide-react"
import { CompactArticleCard, FeaturedArticle } from "@/components/blog/article-card"
import { BLOG_CATEGORIES, type BlogArticle, type BlogCategory } from "@/lib/blog"
import { cn, withBasePath } from "@/lib/utils"

// Piezas comunes del índice del blog y de las páginas de categoría

type NavKey = "todo" | BlogCategory

const NAV: { key: NavKey; label: string; href: string }[] = [
  { key: "todo", label: "Todo", href: "/blog/" },
  ...BLOG_CATEGORIES.slice()
    .reverse() // primero Importación, luego Noticias
    .map((c) => ({ key: c.slug as NavKey, label: c.label, href: `/blog/categoria/${c.slug}/` })),
]

export function CategoryNav({ active, counts }: { active: NavKey; counts?: Partial<Record<NavKey, number>> }) {
  return (
    <nav aria-label="Categorías del blog">
      <ul className="flex flex-wrap gap-2">
        {NAV.map((item) => {
          const current = item.key === active
          const count = counts?.[item.key]
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                  current
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {item.label}
                {typeof count === "number" && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                      current ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function BlogMasthead({
  eyebrow,
  title,
  description,
  active,
  counts,
}: {
  eyebrow: string
  title: string
  description: string
  active: NavKey
  counts?: Partial<Record<NavKey, number>>
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{eyebrow}</p>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">{title}</h1>
        <p className="mt-3 text-pretty text-base leading-relaxed text-slate-600 md:text-lg">{description}</p>
      </div>
      <div className="flex min-w-0 items-start gap-2">
        <div className="min-w-0">
          <CategoryNav active={active} counts={counts} />
        </div>
        <Link
          href="/blog/suscribirse/"
          title="Suscribirse por RSS"
          aria-label="Suscribirse por RSS"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-orange-50 hover:text-orange-600 hover:ring-orange-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Rss className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}

/** Artículo destacado grande y, al lado (o debajo en móvil), "Lo último" con los siguientes */
export function LeadStories({ featured, latest }: { featured: BlogArticle; latest: BlogArticle[] }) {
  return (
    <section aria-label="Artículo destacado" className={cn("grid gap-8", latest.length > 0 && "lg:grid-cols-3 lg:gap-10")}>
      <div className={cn(latest.length > 0 && "lg:col-span-2")}>
        <FeaturedArticle article={featured} />
      </div>
      {latest.length > 0 && (
        <aside aria-labelledby="lo-ultimo" className="flex flex-col">
          <h2 id="lo-ultimo" className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Lo último <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-slate-200">
            {latest.map((a) => (
              <li key={a.slug} className="lg:py-5 lg:first:pt-0">
                <CompactArticleCard article={a} />
              </li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  )
}

export function SectionHeading({ id, title, href, linkLabel }: { id: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
      <h2 id={id} className="relative text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {title}
        <span aria-hidden="true" className="absolute -bottom-[13px] left-0 h-[3px] w-12 rounded-full bg-blue-600" />
      </h2>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {linkLabel ?? "Ver todo"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export function EmptyBlog({ message }: { message?: string }) {
  return (
    <section className="mx-auto mt-12 max-w-xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <Newspaper className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold text-slate-900">Muy pronto, nuevos artículos</h2>
      <p className="mt-2 text-slate-600">
        {message ?? "Estamos preparando guías y noticias del motor. Mientras tanto, cuéntanos qué coche buscas."}
      </p>
      <a
        href={withBasePath("/#formulario")}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Pide tu coche <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  )
}
