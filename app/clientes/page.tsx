"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PortalLogin, PortalSetPassword } from "@/components/clientes/portal-auth"
import { PortalDashboard } from "@/components/clientes/portal-dashboard"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Session } from "@supabase/supabase-js"
import { Loader2, Settings } from "lucide-react"

/** Quita de la URL el #access_token=... (o el error) que deja el enlace del correo */
function cleanAuthHash() {
  if (typeof window === "undefined") return
  const hash = window.location.hash
  if (hash && /access_token|refresh_token|error|type=/.test(hash)) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search)
  }
}

/** Mensaje amable si el enlace del correo ha caducado o no es válido */
function readLinkError(): string {
  if (typeof window === "undefined") return ""
  const params = new URLSearchParams(window.location.hash.replace(/^#/, "") || window.location.search.replace(/^\?/, ""))
  if (!params.get("error") && !params.get("error_code")) return ""
  return "El enlace ha caducado o ya se ha usado. Pide uno nuevo con «¿Primera vez o has olvidado tu contraseña?»."
}

export default function ClientesPage() {
  // undefined = comprobando sesión; null = sin sesión
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [changingPassword, setChangingPassword] = useState(false)
  const [linkError, setLinkError] = useState("")

  useEffect(() => {
    let active = true
    const urlError = readLinkError()
    if (urlError) setLinkError(urlError)

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        setSession(data.session)
        if (data.session || urlError) cleanAuthHash()
      })
      .catch(() => {
        if (active) setSession(null)
      })

    // El callback debe ser síncrono: nada de await a Supabase aquí dentro
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!active) return
      setSession(newSession)
      if (newSession) setTimeout(cleanAuthHash, 0)
      if (event === "SIGNED_OUT") setChangingPassword(false)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    setChangingPassword(false)
    try {
      await supabase.auth.signOut()
    } catch {
      // aunque falle la red, la sesión local se borra
    }
    setSession(null)
  }

  const refreshSession = () => {
    // updateUser ya dispara USER_UPDATED; por si acaso, releemos la sesión fuera del callback
    setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => setSession(data.session))
    }, 0)
  }

  const needsPassword = Boolean(session && !session.user.user_metadata?.password_set)
  const view = session === undefined ? "loading" : !session ? "login" : needsPassword || changingPassword ? "password" : "dashboard"

  return (
    <main className="min-h-screen flex flex-col justify-between pt-24 bg-gradient-to-b from-background via-card/20 to-background overflow-hidden relative">
      <Navbar />

      {/* Elementos flotantes decorativos de fondo (solo fuera del panel) */}
      {view !== "dashboard" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <motion.div
            animate={{ y: [0, -15, 0], rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-10 md:left-24 text-primary/10"
          >
            <Settings className="h-24 w-24 md:h-36 md:w-36" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-10 md:right-24 text-primary/10"
          >
            <Settings className="h-32 w-32 md:h-44 md:w-44" />
          </motion.div>
        </div>
      )}

      <div className="flex-grow flex items-center justify-center container mx-auto px-4 py-12 md:py-16 relative z-10">
        <AnimatePresence mode="wait">
          {view === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-muted-foreground text-sm"
            >
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Cargando tu área de cliente...
            </motion.div>
          )}

          {view === "login" && <PortalLogin key="login" initialError={linkError} />}

          {view === "password" && (
            <PortalSetPassword
              key="password"
              isChange={!needsPassword}
              onDone={() => {
                setChangingPassword(false)
                refreshSession()
              }}
              onCancel={needsPassword ? handleSignOut : () => setChangingPassword(false)}
            />
          )}

          {view === "dashboard" && session && (
            <PortalDashboard
              key="dashboard"
              userId={session.user.id}
              onChangePassword={() => setChangingPassword(true)}
              onSignOut={handleSignOut}
            />
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  )
}
