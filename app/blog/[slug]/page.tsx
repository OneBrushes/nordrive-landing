import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Camera, ChevronRight, ListOrdered } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdSlot } from "@/components/blog/ad-slot"
import { ArticleCover, ArticleMeta, CardGrid, CategoryChip, TagList } from "@/components/blog/article-card"
import { EmptyBlog, SectionHeading } from "@/components/blog/blog-layout"
import { ArticleMarkdown } from "@/components/blog/markdown"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { ShareButtons } from "@/components/blog/share-buttons"
import { TableOfContents } from "@/components/blog/table-of-contents"
import {
  absoluteUrl,
  articleUrl,
  categoryLabel,
  categoryUrl,
  extractHeadings,
  formatDate,
  getAllArticles,
  getArticle,
  getArticleSlugs,
  PLACEHOLDER_SLUG,
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
const BODY_ID = "articulo-cuerpo"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getArticle(slug)
  if (!post) {
    // página de relleno cuando aún no hay artículos: que no la indexe nadie
    return slug === PLACEHOLDER_SLUG ? { title: "Blog del motor | NorDrive", robots: { index: false, follow: true } } : {}
  }
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
      section: categoryLabel(post.category),
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.coverAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  }
}

function sameDay(a: string, b: string) {
  return formatDate(a) === formatDate(b)
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getArticle(slug)
  if (!post && slug === PLACEHOLDER_SLUG) {
    return (
      <main className="min-h-screen bg-slate-50/60 pt-20 md:pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-12 md:px-6">
          <EmptyBlog />
        </div>
        <Footer />
      </main>
    )
  }
  if (!post) notFound()

  const all = await getAllArticles()
  const related = relatedArticles(all, post, 3)
  const headings = post.format === "markdown" ? extractHeadings(post.content) : []
  const showToc = headings.length >= 3
  const url = articleUrl(post.slug)
  const section = categoryLabel(post.category)
  const categoryHref = `/blog/categoria/${post.category}/`
  const updated = !sameDay(post.publishedAt, post.updatedAt)

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.seoDescription || post.excerpt,
      image: [absoluteUrl(post.cover || DEFAULT_OG)],
      articleSection: section,
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
        { "@type": "ListItem", position: 3, name: section, item: categoryUrl(post.category) },
        { "@type": "ListItem", position: 4, name: post.title, item: url },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-white pt-20 md:pt-24">
      <Navbar />
      <ReadingProgress target={BODY_ID} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <article>
        {/* ---------- cabecera inmersiva ---------- */}
        <header className="container mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-8">
          <nav aria-label="Migas de pan" className="mb-4">
            <ol className="flex min-w-0 items-center gap-1 text-sm text-slate-500">
              <li className="shrink-0">
                <Link href="/" className="rounded hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true" className="shrink-0">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li className="shrink-0">
                <Link href="/blog/" className="rounded hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true" className="shrink-0">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li className="shrink-0">
                <Link href={categoryHref} className="rounded hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600">
                  {section}
                </Link>
              </li>
              <li aria-hidden="true" className="hidden shrink-0 sm:block">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li aria-current="page" className="hidden min-w-0 truncate text-slate-900 sm:block">
                {post.title}
              </li>
            </ol>
          </nav>

          <div className="relative isolate flex min-h-[400px] flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 shadow-xl shadow-slate-900/10 sm:min-h-[460px] lg:min-h-[540px]">
            <ArticleCover article={post} eager showMark={false} sizes="(min-width: 1280px) 1232px, 100vw" className="absolute inset-0 -z-10 aspect-auto h-full" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-slate-950/5" />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-5 pb-8 pt-24 sm:px-8 sm:pb-10 lg:pb-14">
              <CategoryChip category={post.category} variant="solid" href={categoryHref} />
              <h1 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[3.4rem]">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/85">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900"
                  >
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                  <span>
                    Por <span className="font-semibold text-white">{post.author}</span>
                  </span>
                </span>
                <ArticleMeta article={post} className="text-sm text-white/85" />
              </div>
            </div>
          </div>
          {post.cover && post.coverCredit && (
            <p className="mt-2 flex items-center justify-end gap-1.5 px-1 text-right text-xs text-slate-500">
              <Camera className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{post.coverCredit}</span>
            </p>
          )}
        </header>

        {/* ---------- cuerpo + barra lateral ---------- */}
        <div className="container mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          <div className="mx-auto w-full min-w-0 max-w-[720px] lg:mx-0">
            {post.excerpt && (
              <p className="text-pretty text-xl leading-relaxed text-slate-700 md:text-[1.35rem] md:leading-relaxed">{post.excerpt}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 py-3">
              <p className="text-xs text-slate-500">
                Publicado el <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                {updated && (
                  <>
                    {" "}· Actualizado el <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                  </>
                )}
              </p>
              <ShareButtons url={url} title={post.title} />
            </div>

            {showToc && (
              <details className="group mt-6 rounded-2xl border border-slate-200 bg-slate-50 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex items-center gap-2">
                    <ListOrdered className="h-4 w-4 text-blue-700" aria-hidden="true" /> En este artículo
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-90" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-4">
                  <TableOfContents headings={headings} />
                </div>
              </details>
            )}

            <div
              id={BODY_ID}
              className="prose prose-slate mt-8 max-w-none text-[1.0625rem] leading-[1.8] md:prose-lg md:leading-[1.8]
                prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
                prose-h2:mt-14 prose-h2:text-[1.6rem] md:prose-h2:text-3xl
                prose-h3:mt-10 prose-h3:text-xl
                prose-p:text-slate-700 prose-li:text-slate-700 prose-li:marker:text-blue-600
                prose-a:font-medium prose-a:text-blue-700 prose-a:decoration-blue-300 prose-a:underline-offset-4 hover:prose-a:decoration-blue-700
                prose-strong:text-slate-900
                prose-blockquote:my-10 prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-6 prose-blockquote:text-xl prose-blockquote:font-semibold prose-blockquote:not-italic prose-blockquote:leading-snug prose-blockquote:text-slate-900 md:prose-blockquote:text-2xl
                prose-img:rounded-2xl prose-figure:my-10 prose-hr:border-slate-200"
            >
              {post.format === "markdown" ? (
                <ArticleMarkdown content={post.content} ads />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              )}
            </div>

            <footer className="mt-12 space-y-6 border-t border-slate-200 pt-6">
              <TagList tags={post.tags} />
              <ShareButtons url={url} title={post.title} label="¿Te ha sido útil? Compártelo" />
            </footer>

            <AdSlot name="articleBottom" className="mb-0 mt-12" />
          </div>

          <aside aria-label="Contenido complementario" className="hidden lg:block">
            <div className="sticky top-28 space-y-8">
              {showToc && (
                <nav aria-labelledby="toc-title">
                  <p id="toc-title" className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    En este artículo
                  </p>
                  <TableOfContents headings={headings} />
                </nav>
              )}
              <AdSlot name="sidebar" className="my-0" />
              {post.category === "importacion" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">¿Buscas un coche en Alemania?</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">Te lo buscamos y te lo entregamos matriculado.</p>
                  <a
                    href={withBasePath("/#formulario")}
                    className="group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Cuéntanos qué buscas
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="border-t border-slate-200 bg-slate-50/70">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
            <SectionHeading id="relacionados" title="Artículos relacionados" href="/blog/" linkLabel="Ir al blog" />
            <CardGrid articles={related} />
            <p className="mt-12 text-center">
              <Link
                href={categoryHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Más en {section}
              </Link>
            </p>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
