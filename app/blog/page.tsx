import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CardGrid } from "@/components/blog/article-card"
import { BlogMasthead, EmptyBlog, LeadStories, SectionHeading } from "@/components/blog/blog-layout"
import { BLOG_CATEGORIES, getAllArticles, SITE_LOGO, SITE_NAME, SITE_URL } from "@/lib/blog"

const TITLE = "Blog del motor | NorDrive"
const DESCRIPTION =
  "Noticias del motor y guías para importar tu coche de Alemania a España: precios, impuestos, trámites, inspecciones y los modelos que más salen a cuenta."
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

/** Artículos que se ven arriba (destacado + "Lo último"); no se repiten en las secciones */
const LEAD_COUNT = 4
/** Máximo de tarjetas por sección en el índice (el resto, en la página de la categoría) */
const SECTION_LIMIT = 9

export default async function BlogPage() {
  const articles = await getAllArticles()
  const [featured, ...others] = articles
  const latest = others.slice(0, LEAD_COUNT - 1)
  const shown = new Set(articles.slice(0, LEAD_COUNT).map((a) => a.slug))

  const counts = {
    todo: articles.length,
    importacion: articles.filter((a) => a.category === "importacion").length,
    noticias: articles.filter((a) => a.category === "noticias").length,
  }

  const sections = BLOG_CATEGORIES.map((c) => ({
    ...c,
    items: articles.filter((a) => a.category === c.slug && !shown.has(a.slug)).slice(0, SECTION_LIMIT),
  })).filter((s) => s.items.length > 0)
  // un solo hueco in-feed por página: en la primera sección que tenga más de 6 tarjetas
  const adSection = sections.find((s) => s.items.length > 6)?.slug

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
    <main className="min-h-screen bg-slate-50/60 pt-20 md:pt-24">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <BlogMasthead
          eyebrow="Blog del motor · NorDrive"
          title="Noticias y guías del motor"
          description="Lo que se mueve en el mundo del motor y todo lo que necesitas para importar tu coche de Alemania: costes reales, impuestos y trámites."
          active="todo"
          counts={counts.todo > 0 ? counts : undefined}
        />

        {!featured ? (
          <EmptyBlog />
        ) : (
          <div className="mt-8 space-y-16 md:mt-10 md:space-y-20">
            <LeadStories featured={featured} latest={latest} />

            {sections.map((s) => (
              <section key={s.slug} aria-labelledby={`seccion-${s.slug}`}>
                <SectionHeading
                  id={`seccion-${s.slug}`}
                  title={s.sectionTitle}
                  href={`/blog/categoria/${s.slug}/`}
                />
                <CardGrid articles={s.items} inFeedAd={s.slug === adSection} />
              </section>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
