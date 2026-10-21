import type { MetadataRoute } from "next"
import { articleUrl, BLOG_CATEGORIES, categoryUrl, getAllArticles, SITE_URL } from "@/lib/blog"

export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles()
  const now = new Date()
  const latest = articles[0]?.updatedAt ? new Date(articles[0].updatedAt) : now

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/coches/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog/`, lastModified: latest, changeFrequency: "daily", priority: 0.8 },
    // categorías con al menos un artículo (una página vacía no aporta nada al buscador)
    ...BLOG_CATEGORIES.flatMap((c) => {
      const newest = articles.find((a) => a.category === c.slug)
      if (!newest) return []
      return [{ url: categoryUrl(c.slug), lastModified: new Date(newest.updatedAt), changeFrequency: "daily" as const, priority: 0.7 }]
    }),
    ...articles.map((a) => ({
      url: articleUrl(a.slug),
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/cookies/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]
}
