"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { type ChecklistData, groupChecklist } from "@/lib/clientes"

export interface LightboxState {
  images: string[]
  index: number
}

/** Visor de fotos a pantalla completa (en un portal sobre document.body; Escape cierra, flechas navegan) */
export function Lightbox({ state, onClose }: { state: LightboxState | null; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const images = state?.images || []

  useEffect(() => {
    if (state) setIndex(Math.min(Math.max(state.index, 0), Math.max(state.images.length - 1, 0)))
  }, [state])

  useEffect(() => {
    if (!state) return
    const count = state.images.length
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count)
      else if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count)
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [state, onClose])

  if (typeof document === "undefined") return null
  const count = images.length
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count)

  return createPortal(
    <AnimatePresence>
      {state && count > 0 && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Fotos"
          onClick={onClose}
        >
          <img
            src={images[index]}
            alt={`Foto ${index + 1} de ${count}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[94vw] max-h-[82vh] object-contain rounded-xl shadow-2xl select-none"
          />
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          {count > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                aria-label="Foto anterior"
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                aria-label="Foto siguiente"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/90 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">
            {index + 1} / {count}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

/** Inspección agrupada por sección; solo puntos revisados, con nota o con fotos */
export function ChecklistView({
  checklist,
  onOpenPhotos,
  compact = false,
}: {
  checklist: ChecklistData
  onOpenPhotos: (images: string[], index: number) => void
  compact?: boolean
}) {
  const groups = groupChecklist(checklist)
  if (groups.length === 0) return null

  return (
    <div className={`grid grid-cols-1 gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
      {groups.map((group) => (
        <div key={group.title} className="bg-muted/20 border border-border/60 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-foreground">{group.title}</h3>
            <span className="text-[11px] font-semibold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
              {group.checked}/{group.total} revisados
            </span>
          </div>
          <ul className="space-y-3">
            {group.items.map((item) => (
              <li key={item.key} className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                    item.checked ? "bg-green-500 text-white" : "bg-muted text-muted-foreground border border-border"
                  }`}
                  aria-label={item.checked ? "Revisado" : "Sin revisar"}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-sm font-medium text-foreground leading-snug">{item.label}</p>
                  {item.note && (
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{item.note}</p>
                  )}
                  {item.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {item.photos.map((src, idx) => (
                        <button
                          key={src + idx}
                          type="button"
                          onClick={() => onOpenPhotos(item.photos, idx)}
                          aria-label={`Ver foto ${idx + 1} de ${item.label}`}
                          className="h-14 w-14 rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:ring-2 hover:ring-primary/20 transition-all"
                        >
                          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function SectionCard({
  icon,
  title,
  subtitle,
  children,
  className = "",
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm space-y-4 ${className}`}>
      <div className="border-b border-border/60 pb-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          {title}
        </h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
