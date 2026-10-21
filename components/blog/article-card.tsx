import { Fragment, type CSSProperties } from "react"
import Link from "next/link"
import { ArrowUpRight, CalendarDays, Clock, Newspaper, Ship } from "lucide-react"
import { AdSlot } from "@/components/blog/ad-slot"
import { categoryLabel, coverSrc, formatDate, type BlogArticle, type BlogCategory } from "@/lib/blog"
import { cn } from "@/lib/utils"

// ---------- categoría ----------

const CHIP_SOFT: Record<BlogCategory, string> = {
  importacion: "bg-blue-50 text-blue-700 ring-blue-600/15",
  noticias: "bg-orange-50 text-orange-800 ring-orange-600/20",
}
const CHIP_SOLID: Record<BlogCategory, string> = {
  importacion: "bg-blue-600 text-white",
  noticias: "bg-orange-700 text-white",
}

export function CategoryChip({
  category,
  variant = "soft",
  href,
  className,
}: {
  category: BlogCategory
  variant?: "soft" | "solid"
  /** Si se indica, el chip es un enlace a la página de la categoría */
  href?: string
  className?: string
}) {
  const classes = cn(
    "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase leading-none tracking-wider",
    variant === "soft" ? cn("ring-1 ring-inset", CHIP_SOFT[category]) : CHIP_SOLID[category],
    className,
  )
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          classes,
          "transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        )}
      >
        {categoryLabel(category)}
      </Link>
    )
  }
  return <span className={classes}>{categoryLabel(category)}</span>
}

// ---------- portada ----------

const FALLBACK_BG: Record<BlogCategory, CSSProperties> = {
  importacion: {
    backgroundImage:
      "radial-gradient(circle at 18% 20%, rgba(96,165,250,0.45), transparent 50%), radial-gradient(circle at 85% 90%, rgba(37,99,235,0.55), transparent 55%), repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 22px), linear-gradient(135deg, #0b1220 0%, #0f2a5f 55%, #1d4ed8 100%)",
  },
  noticias: {
    backgroundImage:
      "radial-gradient(circle at 18% 20%, rgba(251,146,60,0.4), transparent 50%), radial-gradient(circle at 85% 90%, rgba(234,88,12,0.5), transparent 55%), repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 22px), linear-gradient(135deg, #0f0f14 0%, #3b1a0c 55%, #c2410c 100%)",
  },
}

/** Fondo de marca cuando el artículo no tiene portada (decorativo) */
export function CoverFallback({ category, showMark = true }: { category: BlogCategory; showMark?: boolean }) {
  const Icon = category === "noticias" ? Newspaper : Ship
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden" style={FALLBACK_BG[category]}>
      <Icon className="absolute right-[6%] top-1/2 h-[55%] w-auto -translate-y-1/2 text-white/15" strokeWidth={1.25} />
      {showMark && (
        <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">NorDrive</span>
      )}
    </div>
  )
}

export function ArticleCover({
  article,
  className,
  imgClassName,
  eager = false,
  sizes,
  showMark,
}: {
  article: BlogArticle
  className?: string
  imgClassName?: string
  eager?: boolean
  sizes?: string
  showMark?: boolean
}) {
  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden bg-slate-200", className)}>
      {article.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverSrc(article.cover)}
          alt={article.coverAlt}
          width={1200}
          height={630}
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding={eager ? "sync" : "async"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            imgClassName,
          )}
        />
      ) : (
        <CoverFallback category={article.category} showMark={showMark} />
      )}
    </div>
  )
}

// ---------- metadatos ----------

export function ArticleMeta({ article, className }: { article: BlogArticle; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500", className)}>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </span>
      <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-current opacity-50 sm:inline-block" />
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        {article.readingMinutes} min de lectura
      </span>
    </div>
  )
}

export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Etiquetas">
      {tags.map((t) => (
        <li key={t} className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
          #{t}
        </li>
      ))}
    </ul>
  )
}

// ---------- tarjetas ----------

type HeadingLevel = "h2" | "h3"

// el enlace del título cubre toda la tarjeta; el foco se dibuja alrededor de la tarjeta entera
const CARD_LINK =
  "after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-blue-600"

/** Tarjeta vertical: imagen primero, chip, título, entradilla y fecha */
export function ArticleCard({ article, headingLevel = "h3" }: { article: BlogArticle; headingLevel?: HeadingLevel }) {
  const Heading = headingLevel
  return (
    <article className="group relative flex flex-col">
      <ArticleCover
        article={article}
        className="rounded-2xl shadow-sm ring-1 ring-black/5"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col gap-2.5 pt-4">
        <CategoryChip category={article.category} />
        <Heading className="text-pretty text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
          <Link href={`/blog/${article.slug}/`} className={CARD_LINK}>
            {article.title}
          </Link>
        </Heading>
        {article.excerpt && <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{article.excerpt}</p>}
        <ArticleMeta article={article} className="mt-auto pt-1" />
      </div>
    </article>
  )
}

/** Tarjeta horizontal compacta (miniatura + título) para la columna "Lo último" */
export function CompactArticleCard({ article, headingLevel = "h3" }: { article: BlogArticle; headingLevel?: HeadingLevel }) {
  const Heading = headingLevel
  return (
    <article className="group relative flex items-start gap-4">
      <ArticleCover
        article={article}
        showMark={false}
        className="aspect-[4/3] w-28 shrink-0 rounded-xl ring-1 ring-black/5 sm:w-32"
        sizes="128px"
      />
      <div className="flex min-w-0 flex-col gap-1.5">
        <CategoryChip category={article.category} className="px-2 py-0.5 text-[10px]" />
        <Heading className="line-clamp-3 text-pretty text-[15px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
          <Link href={`/blog/${article.slug}/`} className={CARD_LINK}>
            {article.title}
          </Link>
        </Heading>
        <time dateTime={article.publishedAt} className="text-xs text-slate-500">
          {formatDate(article.publishedAt)}
        </time>
      </div>
    </article>
  )
}

/** Gran portada del artículo destacado: imagen a sangre con degradado y el texto encima */
export function FeaturedArticle({ article, headingLevel = "h2" }: { article: BlogArticle; headingLevel?: HeadingLevel }) {
  const Heading = headingLevel
  return (
    <article className="group relative isolate flex min-h-[440px] flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 shadow-xl shadow-slate-900/10 sm:min-h-[480px] lg:min-h-[560px]">
      <ArticleCover
        article={article}
        eager
        showMark={false}
        className="absolute inset-0 -z-10 aspect-auto h-full"
        sizes="(min-width: 1024px) 66vw, 100vw"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/0" />
      <div className="flex flex-col gap-4 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase leading-none tracking-wider text-white backdrop-blur">
            Destacado
          </span>
          <CategoryChip category={article.category} variant="solid" />
        </div>
        <Heading className="max-w-3xl text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
          <Link
            href={`/blog/${article.slug}/`}
            className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-white"
          >
            {article.title}
          </Link>
        </Heading>
        {article.excerpt && (
          <p className="line-clamp-3 max-w-2xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">{article.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ArticleMeta article={article} className="text-white/80" />
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-transform group-hover:-translate-y-0.5"
          >
            Leer artículo <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  )
}

/**
 * Rejilla de tarjetas. Con `inFeedAd` mete el hueco de publicidad `listInFeed` tras la 6.ª tarjeta
 * (solo si hay más tarjetas detrás, para que no quede colgando al final).
 */
export function CardGrid({
  articles,
  inFeedAd = false,
  headingLevel = "h3",
  className,
}: {
  articles: BlogArticle[]
  inFeedAd?: boolean
  headingLevel?: HeadingLevel
  className?: string
}) {
  if (articles.length === 0) return null
  return (
    <div className={cn("grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {articles.map((a, i) => (
        <Fragment key={a.slug}>
          <ArticleCard article={a} headingLevel={headingLevel} />
          {inFeedAd && i === 5 && articles.length > 6 && <AdSlot name="listInFeed" className="col-span-full my-0" />}
        </Fragment>
      ))}
    </div>
  )
}
