import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CardGrid } from "@/components/blog/article-card"
import { BlogMasthead, EmptyBlog, LeadStories, SectionHeading } from "@/components/blog/blog-layout"
import {
  absoluteUrl,
  BLOG_CATEGORIES,
  categoryUrl,
  getAllArticles,
  SITE_LOGO,
  SITE_NAME,
  SITE_URL,
  type BlogCategory,
} from "@/lib/blog"

// Solo existen las categorías conocidas (exportación estática); la lista nunca está vacía
export const dynamicParams = false

type Props = { params: Promise<{ categoria: string }> }

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ categoria: c.slug }))
}

const DEFAULT_OG = "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg"

function findCategory(slug: string) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  const info = findCategory(categoria)
  if (!info) return {}
  const all = await getAllArticles()
  const latestCover = all.find((a) => a.category === info.slug && a.cover)?.cover
  const title = `${info.pageTitle} | Blog del motor · NorDrive`
  const url = categoryUrl(info.slug)
  const image = absoluteUrl(latestCover || DEFAULT_OG)
  return {
    title,
    description: info.description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": [{ url: `${SITE_URL}/blog/rss.xml`, title: "Blog del motor · NorDrive" }] },
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: SITE_NAME,
      url,
      title,
      description: info.description,
      images: [{ url: image, alt: info.pageTitle }],
    },
    twitter: { card: "summary_large_image", title, description: info.description, images: [image] },
  }
}

export default async function BlogCategoryPage({ params }: Props) {
  const { categoria } = await params
  const info = findCategory(categoria)
  if (!info) notFound()
  const category: BlogCategory = info.slug

  const all = await getAllArticles()
  const articles = all.filter((a) => a.category === category)
  const [featured, ...rest] = articles
  const latest = rest.slice(0, 3)
  const grid = rest.slice(3)
  const url = categoryUrl(category)

  const counts = {
    todo: all.length,
    importacion: all.filter((a) => a.category === "importacion").length,
    noticias: all.filter((a) => a.category === "noticias").length,
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: info.pageTitle,
      description: info.description,
      url,
      inLanguage: "es-ES",
      isPartOf: { "@type": "Blog", name: "Blog del motor", url: `${SITE_URL}/blog/` },
      publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: SITE_LOGO } },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: articles.slice(0, 30).map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/blog/${a.slug}/`,
          name: a.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
        { "@type": "ListItem", position: 3, name: info.label, item: url },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50/60 pt-20 md:pt-24">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <BlogMasthead
          eyebrow={`Blog del motor · ${info.label}`}
          title={info.pageTitle}
          description={info.description}
          active={category}
          counts={counts.todo > 0 ? counts : undefined}
        />

        {!featured ? (
          <EmptyBlog
            message={
              category === "noticias"
                ? "Pronto publicaremos aquí las noticias del motor. Mientras tanto, echa un vistazo a nuestras guías de importación."
                : undefined
            }
          />
        ) : (
          <div className="mt-8 space-y-16 md:mt-10 md:space-y-20">
            <LeadStories featured={featured} latest={latest} />

            {grid.length > 0 && (
              <section aria-labelledby="mas-articulos">
                <SectionHeading id="mas-articulos" title={category === "noticias" ? "Más noticias" : "Más guías"} />
                <CardGrid articles={grid} inFeedAd />
              </section>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
