export type Post = {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string // ISO
  tags: string[]
  cover: string
  draft?: boolean
}

export const posts: Post[] = [
  {
    slug: "ejemplo-ahorro-importacion",
    title: "Cómo ahorrar al importar un coche premium",
    excerpt: "Claves rápidas para comprar en Alemania y traerlo a España con garantías.",
    content: `
      <p>La importación permite acceder a mejores precios y configuraciones.</p>
      <p>Verifica historial, inspección independiente y logística asegurada.</p>
      <p>Con Nordrive gestionas búsqueda, inspección y entrega en España.</p>
    `,
    date: "2024-12-15",
    tags: ["importación", "ahorro", "premium"],
    cover: "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg",
  },
]

