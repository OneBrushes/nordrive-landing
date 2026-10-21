import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Newspaper, Rss } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard, ArticleCover, ArticleMeta, TagList } from "@/components/blog/article-card"
import { getAllArticles, SITE_LOGO, SITE_NAME, SITE_URL } from "@/lib/blog"
import { withBasePath } from "@/lib/utils"

const TITLE = "Blog del motor | NorDrive"
const DESCRIPTION =
  "Guías y consejos para importar tu coche de Alemania a España: precios, impuestos, trámites, inspecciones y los modelos que más salen a cuenta."
const PAGE_URL = `${SITE_URL}/blog/`
const OG_IMAGE = "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
    types: { "application/rss+xml": [{ url: `${SITE_URL}/blog/rss.xml`, title: "Blog del motor · NorDrive" }] },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    url: PAGE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1024, height: 1024, alt: "Coches alemanes premium" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default async function BlogPage() {
  const articles = await getAllArticles()
  const [featured, ...rest] = articles

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog del motor",
    description: DESCRIPTION,
    url: PAGE_URL,
    inLanguage: "es-ES",
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: SITE_LOGO } },
    blogPost: articles.slice(0, 20).map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `${SITE_URL}/blog/${a.slug}/`,
      datePublished: a.publishedAt,
      dateModified: a.updatedAt,
    })),
  }

  return (
    <main className="min-h-screen pt-20 md:pt-24">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
            Guías y novedades
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">Blog del motor</h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Todo lo que necesitas saber para importar tu coche de Alemania: costes reales, impuestos, trámites y consejos
            de quienes lo hacemos cada semana.
          </p>
        </header>

        {!featured ? (
          <section className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">Muy pronto, nuevos artículos</h2>
            <p className="mt-2 text-muted-foreground">
              Estamos preparando guías sobre importación de coches. Mientras tanto, cuéntanos qué coche buscas.
            </p>
            <a
              href={withBasePath("/#formulario")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Pide tu coche <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </section>
        ) : (
          <>
            <section aria-label="Artículo destacado" className="mt-10 md:mt-14">
              <article className="group relative grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg md:grid-cols-2">
                <ArticleCover
                  article={featured}
                  eager
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="md:aspect-auto md:h-full md:min-h-[320px]"
                />
                <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
                  <TagList tags={featured.tags.slice(0, 3)} />
                  <h2 className="text-balance text-2xl font-bold leading-tight text-foreground md:text-3xl">
                    <Link href={`/blog/${featured.slug}/`} className="after:absolute after:inset-0 group-hover:text-blue-700">
                      {featured.title}
                    </Link>
                  </h2>
                  {featured.excerpt && <p className="text-pretty leading-relaxed text-muted-foreground">{featured.excerpt}</p>}
                  <ArticleMeta article={featured} className="text-sm" />
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                    Leer artículo{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </article>
            </section>

            {rest.length > 0 && (
              <section aria-labelledby="mas-articulos" className="mt-14">
                <h2 id="mas-articulos" className="mb-6 text-2xl font-bold text-foreground">
                  Más artículos
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((a) => (
                    <ArticleCard key={a.slug} article={a} headingLevel="h3" />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <p className="mt-12 text-center text-sm text-muted-foreground">
          <a href={withBasePath("/blog/rss.xml")} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Rss className="h-4 w-4" aria-hidden="true" /> Suscríbete por RSS
          </a>
        </p>
      </div>

      <Footer />
    </main>
  )
}
