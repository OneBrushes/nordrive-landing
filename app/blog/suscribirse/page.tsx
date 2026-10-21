import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Rss } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CompactArticleCard } from "@/components/blog/article-card"
import { CopyField } from "@/components/blog/copy-field"
import { getAllArticles, SITE_URL } from "@/lib/blog"

// Página para suscribirse al blog por RSS. El icono de RSS del blog enlaza aquí (y no directamente
// al XML) porque los navegadores muestran el feed en bruto y Chrome está quitando el soporte de XSLT.

const FEED_URL = `${SITE_URL}/blog/rss.xml`
const PAGE_URL = `${SITE_URL}/blog/suscribirse/`

export const metadata: Metadata = {
  title: "Suscríbete al blog por RSS | NorDrive",
  description: "Recibe los nuevos artículos del Blog del motor de NorDrive en tu lector de RSS: Feedly, Inoreader, NetNewsWire…",
  alternates: {
    canonical: PAGE_URL,
    types: { "application/rss+xml": [{ url: FEED_URL, title: "Blog del motor · NorDrive" }] },
  },
  robots: { index: false, follow: true },
}

const READERS = [
  { name: "Feedly", href: `https://feedly.com/i/subscription/feed/${encodeURIComponent(FEED_URL)}` },
  { name: "Inoreader", href: `https://www.inoreader.com/?add_feed=${encodeURIComponent(FEED_URL)}` },
]

export default async function SubscribePage() {
  const latest = (await getAllArticles()).slice(0, 6)

  return (
    <main className="min-h-screen bg-slate-50/60 pt-20 md:pt-24">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <div
          className="rounded-3xl p-7 text-white md:p-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 15%, rgba(96,165,250,0.45), transparent 50%), linear-gradient(135deg, #0b1220 0%, #0f2a5f 60%, #1d4ed8 100%)",
          }}
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            <Rss className="h-4 w-4" aria-hidden="true" /> Feed RSS
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Blog del motor · NorDrive</h1>
          <p className="mt-3 text-pretty leading-relaxed text-white/85">
            El <strong className="text-white">RSS</strong> es una dirección que los lectores de noticias consultan solos para
            avisarte cada vez que publicamos un artículo nuevo. Sin registros ni correos.
          </p>
        </div>

        <section aria-labelledby="como" className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 id="como" className="text-lg font-semibold text-slate-900">
            Cómo suscribirte
          </h2>
          <p className="mb-4 mt-1 text-sm leading-relaxed text-slate-600">
            Copia esta dirección y pégala en tu lector de RSS favorito (Feedly, Inoreader, NetNewsWire, Reeder…), en la opción
            «Añadir feed» o «Suscribirse».
          </p>
          <CopyField value={FEED_URL} label="Dirección del feed RSS" />
          <div className="mt-4 flex flex-wrap gap-2">
            {READERS.map((r) => (
              <a
                key={r.name}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Abrir en {r.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="ultimos" className="mt-12">
          <h2 id="ultimos" className="mb-6 text-xl font-bold text-slate-900">
            Últimos artículos
          </h2>
          {latest.length > 0 ? (
            <ul className="divide-y divide-slate-200">
              {latest.map((a) => (
                <li key={a.slug} className="py-5 first:pt-0">
                  <CompactArticleCard article={a} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">Todavía no hay artículos publicados. ¡Suscríbete y te avisaremos del primero!</p>
          )}
          <p className="mt-8">
            <Link href="/blog/" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              ← Volver al blog
            </Link>
          </p>
        </section>
      </div>
      <Footer />
    </main>
  )
}
