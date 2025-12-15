import Link from 'next/link'
import Image from 'next/image'
import { posts } from '@/content/blog/posts'
import { withBasePath } from '@/lib/utils'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPage({ searchParams }: { searchParams: { page?: string, order?: 'asc'|'desc' } }) {
  const page = Math.max(1, parseInt(searchParams?.page || '1', 10))
  const order = (searchParams?.order === 'asc' ? 'asc' : 'desc') as 'asc'|'desc'
  const pageSize = 6

  const visible = posts.filter(p => !p.draft)
  visible.sort((a,b) => (order==='asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)))

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * pageSize
  const pageItems = visible.slice(start, start + pageSize)
  const hasPrev = current > 1
  const hasNext = current < totalPages

  return (
    <main className="container mx-auto px-4 md:px-6 py-12 md:py-20 space-y-10">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl md:text-5xl font-bold">Mundo del motor</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Orden:</span>
          <Link href="/blog?order=desc" className="px-3 py-1 rounded-lg border hover:border-primary/60">
            Más nuevos
          </Link>
          <Link href="/blog?order=asc" className="px-3 py-1 rounded-lg border hover:border-primary/60">
            Más antiguos
          </Link>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <div className="text-muted-foreground">Pronto añadiremos artículos.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl overflow-hidden border border-border bg-card/50 hover:bg-card/70 transition-all"
            >
              <div className="relative w-full h-44">
                <Image src={withBasePath(post.cover)} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <div className="text-xs text-muted-foreground">
                  {formatDate(post.date)} · {post.tags.join(', ')}
                </div>
                <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 mt-2">
        <Link
          href={`/blog?page=${current - 1}&order=${order}`}
          className={`px-3 py-1 rounded-lg border border-border hover:border-primary/50 ${!hasPrev ? 'opacity-50 pointer-events-none' : ''}`}
          aria-disabled={!hasPrev}
        >
          Anterior
        </Link>
        <span className="text-sm text-muted-foreground">Página {current} de {totalPages}</span>
        <Link
          href={`/blog?page=${current + 1}&order=${order}`}
          className={`px-3 py-1 rounded-lg border border-border hover:border-primary/50 ${!hasNext ? 'opacity-50 pointer-events-none' : ''}`}
          aria-disabled={!hasNext}
        >
          Siguiente
        </Link>
      </div>
    </main>
  )
}
