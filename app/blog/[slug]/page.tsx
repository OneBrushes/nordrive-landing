import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ChevronRight, ListOrdered, UserRound } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard, ArticleCover, ArticleMeta, TagList } from "@/components/blog/article-card"
import { ArticleMarkdown } from "@/components/blog/markdown"
import {
  absoluteUrl,
  articleUrl,
  extractHeadings,
  getAllArticles,
  getArticle,
  getArticleSlugs,
  relatedArticles,
  SITE_LOGO,
  SITE_NAME,
  SITE_URL,
} from "@/lib/blog"
import { withBasePath } from "@/lib/utils"

// Solo existen los slugs generados en el build (exportación estática)
export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getArticleSlugs()).map((slug) => ({ slug }))
}

const DEFAULT_OG = "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getArticle(slug)
  if (!post) return {}
  const title = `${post.seoTitle || post.title} | NorDrive`
  const description = post.seoDescription || post.excerpt
  const url = articleUrl(post.slug)
  const image = absoluteUrl(post.cover || DEFAULT_OG)
  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": [{ url: `${SITE_URL}/blog/rss.xml`, title: "Blog del motor · NorDrive" }] },
    },
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      type: "article",
      locale: "es_ES",
      siteName: SITE_NAME,
      url,
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.coverAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getArticle(slug)
  if (!post) notFound()

  const all = await getAllArticles()
  const related = relatedArticles(all, post, 3)
  const headings = post.format === "markdown" ? extractHeadings(post.content) : []
  const showToc = headings.length >= 3
  const url = articleUrl(post.slug)

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.seoDescription || post.excerpt,
      image: [absoluteUrl(post.cover || DEFAULT_OG)],
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      inLanguage: "es-ES",
      keywords: post.tags.join(", "),
      author: { "@type": "Organization", name: post.author, url: SITE_URL },
      publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: SITE_LOGO } },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ]

  return (
    <main className="min-h-screen pt-20 md:pt-24">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <article className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Migas de pan" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                <Link href="/blog/" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li aria-current="page" className="line-clamp-1 max-w-[60vw] text-foreground sm:max-w-md">
                {post.title}
              </li>
            </ol>
          </nav>

          <header className="space-y-4">
            <TagList tags={post.tags} />
            <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                Por <span className="font-medium text-foreground">{post.author}</span>
              </span>
              <ArticleMeta article={post} />
            </div>
          </header>
        </div>

        {post.cover && (
          <figure className="mx-auto mt-8 max-w-4xl">
            <ArticleCover article={post} eager sizes="(min-width: 896px) 896px, 100vw" className="rounded-2xl border border-border" />
          </figure>
        )}

        <div className="mx-auto mt-10 max-w-3xl">
          {showToc && (
            <nav aria-labelledby="toc-title" className="mb-10 rounded-2xl border border-border bg-slate-50 p-5 md:p-6">
              <p id="toc-title" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-700">
                <ListOrdered className="h-4 w-4" aria-hidden="true" /> En este artículo
              </p>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm marker:text-slate-400">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-slate-700 hover:text-blue-700 hover:underline">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="prose prose-slate max-w-none md:prose-lg prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:text-foreground prose-a:font-medium prose-a:text-blue-700 prose-a:underline-offset-2 hover:prose-a:text-blue-800 prose-blockquote:rounded-r-xl prose-blockquote:border-l-blue-600 prose-blockquote:bg-blue-50/60 prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-slate-700 prose-strong:text-foreground prose-img:rounded-xl">
            {post.format === "markdown" ? (
              <ArticleMarkdown content={post.content} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </div>

          <aside className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-lg md:p-10">
            <h2 className="text-2xl font-bold md:text-3xl">¿Quieres importar tu coche?</h2>
            <p className="mt-3 max-w-xl text-white/80">
              Te buscamos el coche en Alemania, lo inspeccionamos y te lo entregamos matriculado en España. Con el precio
              final cerrado desde el primer día.
            </p>
            <a
              href={withBasePath("/#formulario")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-blue-50"
            >
              Pide tu coche <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="border-t border-border bg-slate-50/60">
          <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
            <h2 id="relacionados" className="mb-6 text-2xl font-bold text-foreground">
              Artículos relacionados
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
