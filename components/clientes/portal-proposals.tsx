"use client"

import { useEffect, useState } from "react"
import {
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageSquareText,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { type PortalProposal, type Reaction, carTitle, specLine, formatPrice, groupChecklist } from "@/lib/clientes"
import { ChecklistView } from "./portal-shared"

export interface ProposalPatch {
  reaction: Reaction | null
  comment: string | null
  favorite: boolean
}

const MAX_CHIPS = 8

export function ProposalCard({
  proposal,
  onReact,
  onComment,
  onOpenPhotos,
}: {
  proposal: PortalProposal
  /** Guarda la reacción; devuelve false si falla */
  onReact: (id: string, patch: ProposalPatch) => Promise<boolean>
  /** Envía un mensaje a NorDrive sobre este coche; devuelve false si falla */
  onComment: (id: string, text: string) => Promise<boolean>
  onOpenPhotos: (images: string[], index: number) => void
}) {
  const p = proposal
  const [photoIdx, setPhotoIdx] = useState(0)
  const [comment, setComment] = useState("")
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<"" | "saved" | "error">("")
  const [showChecklist, setShowChecklist] = useState(false)
  const [showAllChips, setShowAllChips] = useState(false)

  useEffect(() => {
    if (status !== "saved") return
    const t = setTimeout(() => setStatus(""), 2500)
    return () => clearTimeout(t)
  }, [status])

  const save = async (patch: Partial<ProposalPatch>) => {
    setSaving(true)
    setStatus("")
    const ok = await onReact(p.id, {
      reaction: p.reaction,
      comment: p.client_comment,
      favorite: p.is_favorite,
      ...patch,
    })
    setSaving(false)
    setStatus(ok ? "saved" : "error")
    return ok
  }

  const toggleReaction = (r: Reaction) => save({ reaction: p.reaction === r ? null : r })
  const toggleFavorite = () => save({ favorite: !p.is_favorite })
  const sendComment = async () => {
    const text = comment.trim()
    if (!text) return
    setSaving(true)
    setStatus("")
    const ok = await onComment(p.id, text)
    setSaving(false)
    setStatus(ok ? "saved" : "error")
    if (ok) setComment("")
  }

  const images = p.images
  const idx = Math.min(photoIdx, Math.max(images.length - 1, 0))
  const specs = specLine(p)
  const hasChecklist = groupChecklist(p.checklist).length > 0
  const chips = showAllChips ? p.equipment : p.equipment.slice(0, MAX_CHIPS)
  const hiddenChips = p.equipment.length - MAX_CHIPS
  const canSend = comment.trim().length > 0

  return (
    <article
      className={`bg-card rounded-2xl shadow-sm overflow-hidden flex flex-col border transition-colors ${
        p.is_favorite ? "border-amber-400 ring-2 ring-amber-400/30" : "border-border"
      }`}
    >
      {/* Fotos */}
      <div className="relative bg-muted aspect-[16/10]">
        {images.length > 0 ? (
          <>
            <button
              type="button"
              onClick={() => onOpenPhotos(images, idx)}
              className="absolute inset-0 w-full h-full"
              aria-label="Ver fotos"
            >
              <img src={images[idx]} alt={carTitle(p)} className="w-full h-full object-cover" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setPhotoIdx((i) => (i - 1 + images.length) % images.length)}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground shadow"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoIdx((i) => (i + 1) % images.length)}
                  aria-label="Foto siguiente"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground shadow"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            <span className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-md text-xs px-2.5 py-1 rounded-lg font-semibold border border-border/40 flex items-center gap-1.5 text-foreground pointer-events-none">
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
              {idx + 1}/{images.length}
            </span>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
            <Car className="h-14 w-14" />
          </div>
        )}
        {p.is_favorite && (
          <span className="absolute top-3 left-3 bg-amber-400 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow pointer-events-none">
            <Star className="h-3.5 w-3.5 fill-current" />
            Tu favorito
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground leading-tight">{carTitle(p)}</h3>
          {specs && <p className="text-sm text-muted-foreground">{specs}</p>}
          {p.origin && (
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              {p.origin}
            </p>
          )}
        </div>

        {p.client_price != null && (
          <p className="text-sm text-foreground">
            Precio en España: <strong className="text-lg text-primary">{formatPrice(p.client_price)}</strong>
          </p>
        )}

        {p.message && (
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <MessageSquareText className="h-3.5 w-3.5" />
              Nota de NorDrive
            </p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{p.message}</p>
          </div>
        )}

        {p.equipment.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((item, i) => (
              <span key={item + i} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                {item}
              </span>
            ))}
            {hiddenChips > 0 && (
              <button
                type="button"
                onClick={() => setShowAllChips((v) => !v)}
                className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/15"
              >
                {showAllChips ? "Ver menos" : `+${hiddenChips}`}
              </button>
            )}
          </div>
        )}

        {hasChecklist && (
          <div className="border border-border/60 rounded-xl">
            <button
              type="button"
              onClick={() => setShowChecklist((v) => !v)}
              aria-expanded={showChecklist}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/40 rounded-xl"
            >
              <span className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                {showChecklist ? "Ocultar inspección" : "Ver inspección"}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showChecklist ? "rotate-180" : ""}`} />
            </button>
            {showChecklist && (
              <div className="p-3 pt-0">
                <ChecklistView checklist={p.checklist} onOpenPhotos={onOpenPhotos} compact />
              </div>
            )}
          </div>
        )}

        {/* Opinión del cliente */}
        <div className="mt-auto pt-4 border-t border-border/60 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              aria-pressed={p.reaction === "like"}
              onClick={() => toggleReaction("like")}
              className={`rounded-xl gap-1.5 ${
                p.reaction === "like" ? "bg-green-500/15 border-green-500/50 text-green-700 hover:bg-green-500/20 dark:text-green-400" : ""
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              Me gusta
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              aria-pressed={p.reaction === "dislike"}
              onClick={() => toggleReaction("dislike")}
              className={`rounded-xl gap-1.5 ${
                p.reaction === "dislike" ? "bg-red-500/10 border-red-500/40 text-red-600 hover:bg-red-500/15 dark:text-red-400" : ""
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
              No me convence
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              aria-pressed={p.is_favorite}
              onClick={toggleFavorite}
              className={`rounded-xl gap-1.5 ${
                p.is_favorite ? "bg-amber-400/20 border-amber-400/60 text-amber-700 hover:bg-amber-400/25 dark:text-amber-300" : ""
              }`}
            >
              <Star className={`h-4 w-4 ${p.is_favorite ? "fill-current" : ""}`} />
              Mi favorito
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <MessageSquareText className="h-3.5 w-3.5" />
              {p.thread.length ? "Conversación con NorDrive" : "¿Alguna duda sobre este coche?"}
            </p>
            {p.thread.length > 0 && (
              <div className="space-y-2 rounded-xl bg-muted/40 p-2.5 max-h-72 overflow-y-auto">
                {p.thread.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                        m.from === "client" ? "bg-primary text-primary-foreground" : "bg-background border border-border text-foreground"
                      }`}
                    >
                      <p className={`text-[10px] font-semibold mb-0.5 ${m.from === "client" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {m.from === "client" ? "Tú" : "NorDrive"}
                        {m.at ? ` · ${new Date(m.at).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}` : ""}
                      </p>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label htmlFor={`comment-${p.id}`} className="sr-only">
              Escribe a NorDrive
            </label>
            <textarea
              id={`comment-${p.id}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder={p.thread.length ? "Escribe tu respuesta…" : "¿Qué te parece este coche? Cuéntanos cualquier duda."}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium min-h-4" aria-live="polite">
                {saving && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Guardando…
                  </span>
                )}
                {!saving && status === "saved" && (
                  <span className="text-green-600 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Guardado
                  </span>
                )}
                {!saving && status === "error" && <span className="text-destructive">No se ha podido guardar</span>}
              </span>
              <Button
                type="button"
                size="sm"
                disabled={saving || !canSend}
                onClick={sendComment}
                className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
