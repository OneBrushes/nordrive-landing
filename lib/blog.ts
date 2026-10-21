// Blog del motor: los artículos vienen de Supabase (tabla public.blog_posts, gestionada desde la app
// de gestión) y se leen SOLO en el build (web estática). Si Supabase falla o la tabla aún no existe,
// se usan los artículos antiguos de content/blog/posts.ts: el build nunca debe romperse por el blog.
import { createClient } from "@supabase/supabase-js"
import { posts as legacyPosts } from "@/content/blog/posts"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase"

export const SITE_URL = "https://www.nordrivecars.com"
export const SITE_NAME = "NorDrive"
export const SITE_LOGO = `${SITE_URL}/Logo.png`

// ---------- categorías ----------

export type BlogCategory = "importacion" | "noticias"

export const BLOG_CATEGORIES: {
  slug: BlogCategory
  /** Etiqueta corta (chip, migas de pan, articleSection) */
  label: string
  /** Título de la sección en el índice del blog */
  sectionTitle: string
  /** H1 de la página de la categoría */
  pageTitle: string
  description: string
}[] = [
  {
    slug: "noticias",
    label: "Noticias del motor",
    sectionTitle: "Últimas noticias",
    pageTitle: "Noticias del motor",
    description:
      "Lanzamientos, precios, normativa y todo lo que se mueve en el mundo del motor en Europa, contado de forma clara.",
  },
  {
    slug: "importacion",
    label: "Importación",
    sectionTitle: "Guías de importación",
    pageTitle: "Guías de importación",
    description:
      "Cómo importar un coche de Alemania a España: costes reales, impuestos, trámites, inspecciones y los modelos que más salen a cuenta.",
  },
]

export function categoryInfo(category: BlogCategory) {
  return BLOG_CATEGORIES.find((c) => c.slug === category) ?? BLOG_CATEGORIES[1]
}

export function categoryLabel(category: BlogCategory) {
  return categoryInfo(category).label
}

/** Las filas antiguas (sin categoría o con un valor desconocido) cuentan como importación */
export function normalizeCategory(value: string | null | undefined): BlogCategory {
  return value === "noticias" ? "noticias" : "importacion"
}

export function categoryUrl(category: BlogCategory) {
  return `${SITE_URL}/blog/categoria/${category}/`
}

export type BlogArticle = {
  slug: string
  title: string
  excerpt: string
  /** Markdown (artículos nuevos) o HTML (artículos antiguos) según `format` */
  content: string
  format: "markdown" | "html"
  /** URL absoluta (https://…) o ruta local de /public ("/foto.jpg"), o null */
  cover: string | null
  coverAlt: string
  /** Crédito de la foto de portada, p. ej. "Foto: Jane Doe / Flickr · CC BY 2.0" */
  coverCredit: string | null
  category: BlogCategory
  tags: string[]
  author: string
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string // ISO
  updatedAt: string // ISO
  readingMinutes: number
}

export type TocHeading = { id: string; text: string }

type BlogPostRow = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  cover_url: string | null
  cover_alt: string | null
  cover_credit?: string | null
  category?: string | null
  tags: string[] | null
  author: string | null
  seo_title: string | null
  seo_description: string | null
  status: string
  published_at: string | null
  source: string | null
  reading_minutes: number | null
  created_at: string | null
  updated_at: string | null
}

// ---------- utilidades ----------

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

/** Genera ids únicos (slug, slug-2, slug-3…) en el mismo orden en el TOC y en el cuerpo */
export function createHeadingIdFactory() {
  const seen = new Map<string, number>()
  return (text: string) => {
    const base = slugify(text) || "seccion"
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)
    return n === 1 ? base : `${base}-${n}`
  }
}

/** Quita el formato inline de Markdown para quedarse con el texto plano */
export function stripInlineMarkdown(text: string) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]+/g, "")
    .replace(/<[^>]+>/g, "")
    .trim()
}

/** Encabezados `##` del Markdown (fuera de bloques de código) para el índice */
export function extractHeadings(markdown: string): TocHeading[] {
  const nextId = createHeadingIdFactory()
  const out: TocHeading[] = []
  let inFence = false
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = /^##\s+(.+?)\s*#*\s*$/.exec(line)
    if (m) {
      const text = stripInlineMarkdown(m[1])
      out.push({ id: nextId(text), text })
    }
  }
  return out
}

function plainText(content: string, format: BlogArticle["format"]) {
  return format === "html" ? content.replace(/<[^>]+>/g, " ") : stripInlineMarkdown(content.replace(/[#>|-]/g, " "))
}

function estimateReadingMinutes(content: string, format: BlogArticle["format"]) {
  const words = plainText(content, format).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** src utilizable en <img>: respeta el basePath para las rutas locales */
export function coverSrc(cover: string) {
  if (/^https?:\/\//i.test(cover)) return cover
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH || ""
  return `${prefix}${cover.startsWith("/") ? cover : `/${cover}`}`
}

/** URL absoluta (para Open Graph, JSON-LD, RSS) */
export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`
}

export function articleUrl(slug: string) {
  return `${SITE_URL}/blog/${slug}/`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric", timeZone: "Europe/Madrid" })
}

function toIso(value: string | null | undefined, fallback: string) {
  if (!value) return fallback
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? fallback : d.toISOString()
}

// ---------- normalización ----------

function fromRow(row: BlogPostRow): BlogArticle {
  const content = row.content ?? ""
  const publishedAt = toIso(row.published_at, toIso(row.created_at, new Date().toISOString()))
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content,
    format: "markdown",
    cover: row.cover_url || null,
    coverAlt: row.cover_alt || row.title,
    coverCredit: row.cover_credit?.trim() || null,
    category: normalizeCategory(row.category),
    tags: (row.tags ?? []).filter(Boolean),
    author: row.author || SITE_NAME,
    seoTitle: row.seo_title || null,
    seoDescription: row.seo_description || null,
    publishedAt,
    updatedAt: toIso(row.updated_at, publishedAt),
    readingMinutes: row.reading_minutes && row.reading_minutes > 0 ? row.reading_minutes : estimateReadingMinutes(content, "markdown"),
  }
}

function fromLegacy(): BlogArticle[] {
  return legacyPosts
    .filter((p) => !p.draft)
    .map((p) => {
      const publishedAt = toIso(p.date, new Date().toISOString())
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        format: "html" as const,
        cover: p.cover || null,
        coverAlt: p.title,
        coverCredit: null,
        category: "importacion" as const,
        tags: p.tags,
        author: SITE_NAME,
        seoTitle: null,
        seoDescription: null,
        publishedAt,
        updatedAt: publishedAt,
        readingMinutes: estimateReadingMinutes(p.content, "html"),
      }
    })
}

function byDateDesc(a: BlogArticle, b: BlogArticle) {
  return b.publishedAt.localeCompare(a.publishedAt)
}

// ---------- carga (en el build) ----------

async function fetchFromSupabase(): Promise<BlogArticle[] | null> {
  try {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
    const { data, error } = await client
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .abortSignal(AbortSignal.timeout(15000))
    if (error) {
      console.warn(`[blog] No se pudieron leer los artículos de Supabase (${error.message}). Se usan los artículos locales.`)
      return null
    }
    return (data as BlogPostRow[]).filter((r) => r.slug && r.title).map(fromRow)
  } catch (e) {
    console.warn(`[blog] Error al conectar con Supabase (${e instanceof Error ? e.message : String(e)}). Se usan los artículos locales.`)
    return null
  }
}

let cached: Promise<BlogArticle[]> | null = null

async function load(): Promise<BlogArticle[]> {
  if (process.env.BLOG_SAMPLE === "1") return [...samplePosts()].sort(byDateDesc)
  if (process.env.BLOG_SAMPLE === "empty") return [] // para revisar el blog sin ningún artículo

  const remote = await fetchFromSupabase()
  const legacy = fromLegacy()
  if (!remote) return legacy.sort(byDateDesc)

  // Supabase manda; los antiguos solo se añaden si su slug no existe ya en Supabase
  const slugs = new Set(remote.map((p) => p.slug))
  return [...remote, ...legacy.filter((p) => !slugs.has(p.slug))].sort(byDateDesc)
}

/** Todos los artículos publicados, del más nuevo al más antiguo (memorizado durante el build) */
export function getAllArticles(): Promise<BlogArticle[]> {
  if (!cached) cached = load()
  return cached
}

export async function getArticle(slug: string) {
  return (await getAllArticles()).find((p) => p.slug === slug) ?? null
}

export async function getArticlesByCategory(category: BlogCategory) {
  return (await getAllArticles()).filter((p) => p.category === category)
}

/**
 * Hasta `limit` artículos relacionados: primero los de la misma categoría (ordenados por etiquetas
 * en común y luego por fecha), después los que comparten etiquetas y, si faltan, los más recientes.
 */
export function relatedArticles(all: BlogArticle[], current: BlogArticle, limit = 3) {
  const tags = new Set(current.tags.map((t) => t.toLowerCase()))
  const others = all.filter((p) => p.slug !== current.slug)
  const scored = others
    .map((p) => ({
      p,
      score: (p.category === current.category ? 10 : 0) + p.tags.filter((t) => tags.has(t.toLowerCase())).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || byDateDesc(a.p, b.p))
    .map((x) => x.p)
  const picked = scored.slice(0, limit)
  for (const p of others) {
    if (picked.length >= limit) break
    if (!picked.includes(p)) picked.push(p)
  }
  return picked
}

/**
 * Slug de relleno: la exportación estática necesita al menos una página en /blog/[slug]/. Si no hay
 * ningún artículo publicado se genera solo esta página ("próximamente", con noindex y fuera del sitemap).
 */
export const PLACEHOLDER_SLUG = "proximamente"

/** Slugs para generateStaticParams: nunca vacío */
export async function getArticleSlugs() {
  const slugs = (await getAllArticles()).map((p) => p.slug)
  return slugs.length > 0 ? slugs : [PLACEHOLDER_SLUG]
}

// ---------- datos de ejemplo (solo para revisar en local con BLOG_SAMPLE=1) ----------

function samplePosts(): BlogArticle[] {
  const base = {
    format: "markdown" as const,
    author: SITE_NAME,
    seoTitle: null,
    seoDescription: null,
  }
  const a1 = `Importar un coche de Alemania sigue siendo una de las mejores formas de conseguir un premium bien equipado a buen precio. Pero el precio del anuncio **no es el precio final**: hay impuestos, transporte y trámites que conviene tener claros desde el principio.

En esta guía repasamos, partida a partida, todo lo que pagas desde que eliges el coche en un portal alemán hasta que lo aparcas en tu garaje con matrícula española.

## El precio del coche en Alemania

En portales como mobile.de o AutoScout24 los precios suelen ser entre un 10 % y un 20 % más bajos que en España para el mismo modelo, sobre todo en berlinas y SUV de BMW, Mercedes-Benz y Audi.

![Berlinas y SUV alemanes en un concesionario](/luxury-german-cars-bmw-mercedes-audi-showroom.jpg "Foto: NorDrive · Todos los derechos reservados")

- Fíjate si el precio incluye IVA (*MwSt. ausweisbar*): si eres empresa o autónomo puedes recuperarlo.
- Pide siempre el historial de mantenimiento (*Scheckheft*).
- Desconfía de precios muy por debajo del mercado.

## Impuestos al matricular en España

El gran coste "oculto" es el **Impuesto Especial sobre Determinados Medios de Transporte (IEDMT)**, que depende de las emisiones de CO₂ del coche:

| Emisiones CO₂ (WLTP) | Tipo IEDMT |
| --- | --- |
| Hasta 120 g/km | 0 % |
| 121 – 159 g/km | 4,75 % |
| 160 – 199 g/km | 9,75 % |
| 200 g/km o más | 14,75 % |

Además, hay que pagar el Impuesto de Transmisiones Patrimoniales (ITP) si el coche es de segunda mano y lo compras a un particular.

### ¿Y si el coche es eléctrico?

Los eléctricos puros tributan al 0 % de IEDMT, así que el ahorro suele ser todavía mayor.

## Transporte y trámites

El transporte en camión portacoches desde Alemania cuesta normalmente entre **700 € y 1.200 €**, según la ciudad de origen. A eso hay que sumar:

1. Ficha técnica reducida y homologación.
2. ITV de importación.
3. Tasas de la DGT y placas.

![Cliente recogiendo su BMW importado](/client-with-bmw.jpg "Foto: NorDrive · Entrega a un cliente en Madrid")

## ¿Cuánto me ahorro de verdad?

En un coche de 40.000 € el ahorro neto, una vez pagado todo, suele estar entre **3.000 € y 6.000 €**. Puedes consultar las tablas oficiales en la [web de la Agencia Tributaria](https://sede.agenciatributaria.gob.es/).

> Calcula siempre el coste total antes de dar una señal: el precio del anuncio es solo el principio.

Si quieres, te preparamos el cálculo cerrado de tu coche sin compromiso.
`
  const a2 = `Comprar un coche a 2.000 km de distancia da respeto. La clave está en **verificar antes de pagar** y en hacerlo con un método.

Estos son los pasos que seguimos en cada compra para que no haya sorpresas al recibir el coche.

## Revisa el historial y los papeles

Pide el *Fahrzeugbrief* (Zulassungsbescheinigung Teil II) y comprueba que el número de bastidor coincide con el del coche.

![Mercedes revisado antes de la compra](/client-with-mercedes.jpg "Foto: NorDrive")

## Inspección independiente

Una inspección por un taller o perito independiente cuesta poco comparado con el riesgo de comprar mal. Debe incluir:

- Medición de pintura en todas las piezas.
- Diagnosis electrónica.
- Prueba en carretera.

## Pago seguro

Nunca pagues por adelantado a desconocidos. Usa transferencia a cuenta de empresa verificada o un servicio de custodia.

![Audi entregado a su nuevo propietario](/client-with-audi.jpg)

## Entrega en España

Cuando el coche llega, revisa que el estado coincide con las fotos de la inspección antes de firmar el albarán de entrega.
`
  const n1 = `Volkswagen ha confirmado los precios para Alemania del nuevo ID. Polo, el eléctrico compacto con el que quiere volver a llenar las calles de utilitarios asequibles.

La versión de acceso arranca por debajo de los 25.000 euros antes de ayudas, una cifra que lo coloca en la pelea directa con los eléctricos urbanos de origen chino.

## Qué ofrece

El ID. Polo estrena la plataforma MEB+ de tracción delantera, con baterías de dos tamaños y una autonomía homologada que supera los 400 km en la versión mayor.

![Volkswagen en la entrega a un cliente](/client-with-vw.jpg "Foto: NorDrive · Imagen ilustrativa")

## Cuándo llega a España

Las primeras unidades llegarán a los concesionarios españoles en primavera. Hasta entonces, el mercado de segunda mano alemán seguirá siendo la forma más rápida de conseguir un eléctrico compacto.

![Concesionario con coches alemanes](/luxury-german-cars-bmw-mercedes-audi-showroom.jpg "Foto: NorDrive")

## Lo que significa para el comprador

Más competencia en el segmento suele traducirse en descuentos en los modelos que ya están en el mercado, sobre todo en las unidades de kilómetro cero.
`
  // noticias cortas para ver la rejilla con muchas tarjetas (y el anuncio tras la 6ª)
  const briefs: { title: string; excerpt: string; cover: string | null }[] = [
    { title: "La UE aprueba la norma Euro 7: qué cambia para los coches nuevos", excerpt: "Frenos, neumáticos y baterías entran por primera vez en la normativa de emisiones.", cover: "/client-with-mercedes.jpg" },
    { title: "BMW presenta el nuevo iX3 de la Neue Klasse", excerpt: "Hasta 800 km de autonomía y carga a 400 kW: así es el primer modelo de la nueva era de BMW.", cover: null },
    { title: "Los precios de los coches usados bajan en Alemania por tercer mes", excerpt: "El mercado de ocasión alemán encadena tres meses de descensos, sobre todo en diésel.", cover: "/client-with-audi.jpg" },
    { title: "La DGT revisa la etiqueta ambiental de los híbridos ligeros", excerpt: "Qué coches podrían perder la etiqueta ECO y desde cuándo se aplicaría el cambio.", cover: "/client-with-vw.jpg" },
    { title: "Audi confirma que el cinco cilindros seguirá en el RS 3", excerpt: "El mítico motor de cinco cilindros aguantará al menos hasta el final de la década.", cover: "/client-with-bmw.jpg" },
    { title: "Mercedes rebaja el precio del CLA eléctrico en Alemania", excerpt: "La berlina eléctrica baja de precio para competir con el Tesla Model 3.", cover: null },
    { title: "Toyota prepara un deportivo eléctrico con cambio manual simulado", excerpt: "La marca japonesa insiste en que conducir un eléctrico también puede ser divertido.", cover: "/client-with-mercedes.jpg" },
    { title: "Alemania estudia un nuevo plan de ayudas para el coche eléctrico", excerpt: "El Gobierno alemán vuelve a plantear incentivos para las rentas medias.", cover: null },
    { title: "Porsche retrasa el Cayenne eléctrico hasta 2027", excerpt: "La marca de Stuttgart ajusta su calendario de lanzamientos eléctricos.", cover: "/client-with-audi.jpg" },
    { title: "Ventas de eléctricos en Europa: nuevo récord en septiembre", excerpt: "Los eléctricos superan por primera vez el 20 % de cuota en la Unión Europea.", cover: "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg" },
  ]
  const briefBody = `Resumen de la noticia en dos párrafos para revisar el diseño de las tarjetas y de la página de la categoría.

Las noticias cortas también deben verse bien: con portada, sin portada y con muy poco texto.

## Contexto

Un poco más de contexto para que el artículo tenga al menos un apartado.
`
  return [
    {
      ...base,
      slug: "volkswagen-id-polo-precio-alemania",
      title: "El Volkswagen ID. Polo ya tiene precio en Alemania: menos de 25.000 euros",
      excerpt:
        "El eléctrico compacto de Volkswagen llega para plantar cara a los urbanos chinos. Esto es lo que sabemos de su precio y de su llegada a España.",
      content: n1,
      cover: "/client-with-vw.jpg",
      coverAlt: "Volkswagen aparcado delante de un edificio",
      coverCredit: "Foto: NorDrive · Imagen ilustrativa",
      category: "noticias" as const,
      tags: ["Volkswagen", "eléctricos", "precios"],
      publishedAt: "2026-10-19T08:00:00.000Z",
      updatedAt: "2026-10-19T08:00:00.000Z",
      readingMinutes: estimateReadingMinutes(n1, "markdown"),
    },
    {
      ...base,
      slug: "cuanto-cuesta-importar-un-coche-de-alemania-2026",
      title: "Cuánto cuesta importar un coche de Alemania en 2026",
      excerpt: "Precio, impuestos, transporte y trámites: todo lo que pagas para traer un coche de Alemania a España, con ejemplos reales.",
      content: a1,
      cover: "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg",
      coverAlt: "BMW, Mercedes y Audi en un concesionario alemán",
      coverCredit: "Foto: Jane Doe / Flickr · CC BY 2.0",
      category: "importacion" as const,
      tags: ["importación", "impuestos", "Alemania"],
      publishedAt: "2026-10-15T08:00:00.000Z",
      updatedAt: "2026-10-18T08:00:00.000Z",
      readingMinutes: estimateReadingMinutes(a1, "markdown"),
    },
    {
      ...base,
      slug: "como-comprar-un-coche-en-alemania-sin-riesgos",
      title: "Cómo comprar un coche en Alemania sin riesgos",
      excerpt: "Historial, inspección independiente y pago seguro: el método para no llevarte sorpresas.",
      content: a2,
      cover: "/client-with-bmw.jpg",
      coverAlt: "Cliente de NorDrive recogiendo su BMW",
      coverCredit: "Foto: NorDrive",
      category: "importacion" as const,
      tags: ["importación", "consejos"],
      publishedAt: "2026-10-01T08:00:00.000Z",
      updatedAt: "2026-10-01T08:00:00.000Z",
      readingMinutes: estimateReadingMinutes(a2, "markdown"),
    },
    {
      ...base,
      slug: "mejores-coches-electricos-para-importar",
      title: "Los mejores coches eléctricos para importar de Alemania",
      excerpt: "Tesla, BMW i4 o ID.4: qué eléctricos salen más a cuenta y qué revisar en la batería.",
      content: a1,
      cover: null,
      coverAlt: "",
      coverCredit: null,
      category: "importacion" as const,
      tags: ["eléctricos", "Alemania"],
      publishedAt: "2026-09-20T08:00:00.000Z",
      updatedAt: "2026-09-20T08:00:00.000Z",
      readingMinutes: estimateReadingMinutes(a1, "markdown"),
    },
    ...briefs.map((b, i) => {
      const date = new Date(Date.UTC(2026, 9, 17 - i * 2, 8)).toISOString()
      return {
        ...base,
        slug: `noticia-de-ejemplo-${i + 1}`,
        title: b.title,
        excerpt: b.excerpt,
        content: briefBody,
        cover: b.cover,
        coverAlt: b.cover ? "Coche alemán (imagen de ejemplo)" : "",
        coverCredit: b.cover ? "Foto: NorDrive" : null,
        category: "noticias" as const,
        tags: ["actualidad"],
        publishedAt: date,
        updatedAt: date,
        readingMinutes: estimateReadingMinutes(briefBody, "markdown"),
      }
    }),
  ]
}
