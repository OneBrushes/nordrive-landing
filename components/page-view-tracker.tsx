"use client"

// Contador de visitas propio y respetuoso con la privacidad: sin cookies, solo un id aleatorio en
// localStorage, la ruta y el referrer. Se registra con la función track_page_view de Supabase.
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const VISITOR_KEY = "nd-visitor"

function randomId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID()
  } catch {}
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function visitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY)
    if (existing) return existing
    const id = randomId()
    window.localStorage.setItem(VISITOR_KEY, id)
    return id
  } catch {
    return randomId() // almacenamiento bloqueado: id solo para esta visita
  }
}

function shouldSkip() {
  try {
    const nav = navigator as Navigator & { msDoNotTrack?: string }
    if (nav.doNotTrack === "1" || nav.msDoNotTrack === "1") return true
    if (nav.webdriver) return true
    const host = window.location.hostname
    if (host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".local")) return true
  } catch {
    return true
  }
  return false
}

export function PageViewTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return
    lastPath.current = pathname
    if (shouldSkip()) return

    const payload = {
      page_path: pathname, // usePathname() ya viene sin el basePath
      visitor_id: visitorId(),
      referrer: document.referrer || null,
    }

    // carga perezosa: supabase-js no entra en el JS inicial de la página
    import("@/lib/supabase")
      .then(({ supabase }) => supabase.rpc("track_page_view", payload))
      .then(
        () => undefined,
        () => undefined,
      )
      .catch(() => undefined)
  }, [pathname])

  return null
}
