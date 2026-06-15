import { notFound } from 'next/navigation'
import { posts } from '@/content/blog/posts'
import { withBasePath } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Deshabilitamos params dinámicos para que sólo existan los slugs generados y se exporten en estático
export const dynamicParams = false

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params
  const post = posts.find(p => p.slug === resolvedParams.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params
  const post = posts.find(p => p.slug === resolvedParams.slug)
  if (!post) return notFound()

  return (
    <main className="container mx-auto px-4 md:px-6 py-12 md:py-20 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al blog
        </Link>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{post.tags.join(' · ')}</p>
        <h1 className="text-3xl md:text-5xl font-bold">{post.title}</h1>
        <p className="text-muted-foreground">{new Date(post.date).toLocaleDateString('es-ES')}</p>
      </div>

      <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-xl border border-border bg-card">
        <img
          src={withBasePath(post.cover)}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <article
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  )
}

