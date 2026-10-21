import Link from "next/link"
import { CalendarDays, Clock, Newspaper } from "lucide-react"
import { coverSrc, formatDate, type BlogArticle } from "@/lib/blog"
import { cn } from "@/lib/utils"

export function ArticleCover({
  article,
  className,
  eager = false,
  sizes,
}: {
  article: BlogArticle
  className?: string
  eager?: boolean
  sizes?: string
}) {
  return (
    <div className={cn("relative aspect-[1200/630] w-full overflow-hidden bg-muted", className)}>
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
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900">
          <Newspaper className="h-10 w-10 text-white/60" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

export function ArticleMeta({ article, className }: { article: BlogArticle; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground", className)}>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </span>
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
        <li key={t} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {t}
        </li>
      ))}
    </ul>
  )
}

export function ArticleCard({ article, headingLevel = "h2" }: { article: BlogArticle; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <ArticleCover article={article} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <TagList tags={article.tags.slice(0, 3)} />
        <Heading className="text-lg font-semibold leading-snug text-foreground">
          <Link href={`/blog/${article.slug}/`} className="after:absolute after:inset-0 group-hover:text-blue-700">
            {article.title}
          </Link>
        </Heading>
        {article.excerpt && <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>}
        <ArticleMeta article={article} className="mt-auto pt-2" />
      </div>
    </article>
  )
}
