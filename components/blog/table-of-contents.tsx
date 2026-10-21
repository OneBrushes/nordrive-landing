"use client"

// Índice del artículo: resalta el apartado que se está leyendo (sin JS sigue funcionando como lista de enlaces)
import { useEffect, useState } from "react"
import type { TocHeading } from "@/lib/blog"
import { cn } from "@/lib/utils"

export function TableOfContents({ headings, className }: { headings: TocHeading[]; className?: string }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => Boolean(e))
    if (elements.length === 0) return
    const update = () => {
      // el último encabezado que ya ha pasado por la parte de arriba de la pantalla
      let current: string | null = null
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= 140) current = el.id
        else break
      }
      setActive(current)
    }
    let frame = 0
    const onScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0
          update()
        })
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [headings])

  return (
    <ol className={cn("space-y-1 border-l border-slate-200", className)}>
      {headings.map((h) => {
        const current = h.id === active
        return (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={current ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                current
                  ? "border-blue-600 font-semibold text-slate-900"
                  : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900",
              )}
            >
              {h.text}
            </a>
          </li>
        )
      })}
    </ol>
  )
}
