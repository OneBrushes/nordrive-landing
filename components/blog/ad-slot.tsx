"use client"

// Hueco de publicidad del blog. Configuración en lib/ads.ts:
// - Con ADSENSE_CLIENT y el id del hueco rellenos → bloque adaptable de AdSense (el script se carga una sola vez).
// - Sin configurar → no pinta nada, salvo con ?anuncios=1 en la URL: recuadro de muestra para ver la posición.
import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { ADSENSE_CLIENT, AD_SLOTS, AD_SLOT_INFO, isAdSlotConfigured, type AdSlotName } from "@/lib/ads"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

function usePreviewFlag() {
  const [preview, setPreview] = useState(false)
  useEffect(() => {
    try {
      setPreview(new URLSearchParams(window.location.search).get("anuncios") === "1")
    } catch {
      setPreview(false)
    }
  }, [])
  return preview
}

export function AdSlot({ name, className }: { name: AdSlotName; className?: string }) {
  const configured = isAdSlotConfigured(name)
  const preview = usePreviewFlag()
  const pushed = useRef(false)
  const info = AD_SLOT_INFO[name]

  useEffect(() => {
    if (!configured || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // bloqueadores de anuncios: no pasa nada, el hueco se queda vacío
    }
  }, [configured])

  if (configured) {
    return (
      <aside aria-label="Publicidad" className={cn("not-prose my-10 w-full", className)}>
        <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">Publicidad</p>
        <div style={{ minHeight: info.minHeight }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={AD_SLOTS[name]}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
        <Script
          id="adsbygoogle-js"
          strategy="lazyOnload"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        />
      </aside>
    )
  }

  if (!preview) return null

  return (
    <aside aria-label={`Hueco de publicidad: ${name}`} className={cn("not-prose my-10 w-full", className)}>
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">Publicidad</p>
      <div
        style={{ minHeight: info.minHeight }}
        className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50/70 p-4 text-center"
      >
        <span className="font-mono text-sm font-semibold text-amber-900">{name}</span>
        <span className="text-xs text-amber-800">{info.size}</span>
        <span className="text-[11px] text-amber-700">Vista previa (?anuncios=1) · configúralo en lib/ads.ts</span>
      </div>
    </aside>
  )
}
