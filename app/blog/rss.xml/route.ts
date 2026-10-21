import { absoluteUrl, articleUrl, categoryLabel, getAllArticles, SITE_URL } from "@/lib/blog"

export const dynamic = "force-static"

function esc(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const articles = await getAllArticles()
  const lastBuild = articles[0]?.updatedAt ? new Date(articles[0].updatedAt) : new Date()

  const items = articles
    .map((a) => {
      const url = articleUrl(a.slug)
      const enclosure = a.cover && /\.jpe?g($|\?)/i.test(a.cover)
        ? `\n      <enclosure url="${esc(absoluteUrl(a.cover))}" type="image/jpeg" length="0" />`
        : ""
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(a.seoDescription || a.excerpt)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${esc(a.author)}</dc:creator>
      <category>${esc(categoryLabel(a.category))}</category>${a.tags.map((t) => `\n      <category>${esc(t)}</category>`).join("")}${enclosure}
    </item>`
    })
    .join("\n")

  // hoja XSLT para que el navegador muestre una página bonita en vez del XML en bruto (el feed sigue siendo RSS 2.0)
  const xsl = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/blog/rss.xsl`
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${xsl}"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Blog del motor · NorDrive</title>
    <link>${SITE_URL}/blog/</link>
    <description>Noticias del motor y guías para importar tu coche de Alemania a España.</description>
    <language>es-ES</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
