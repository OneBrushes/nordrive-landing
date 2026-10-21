"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Mail, ArrowLeft, Loader2, MailCheck, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { withBasePath } from "@/lib/utils"
import { isNotReadyError } from "@/lib/clientes"

const NOT_READY_MSG = "El área de clientes se está preparando. Vuelve a intentarlo en unos días o escríbenos."
const NO_ACCESS_MSG = "Este correo no tiene acceso al área de clientes. Si eres cliente de NorDrive, escríbenos."

function isRateLimit(error: { status?: number; message?: string; code?: string } | null | undefined) {
  if (!error) return false
  const msg = (error.message || "").toLowerCase()
  return error.status === 429 || error.code === "over_email_send_rate_limit" || msg.includes("rate limit") || msg.includes("security purposes")
}

const cardClass =
  "w-full max-w-md bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-2xl relative"

function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center space-y-2 mb-8">
      <span className="text-primary text-xs font-semibold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
        Área Privada de Clientes
      </span>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-muted-foreground text-xs">{subtitle}</p>
    </div>
  )
}

function FormError({ message }: { message: string }) {
  if (!message) return null
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="alert"
      className="text-xs text-destructive font-medium text-center"
    >
      {message}
    </motion.p>
  )
}

/** Inicio de sesión con contraseña o, la primera vez, con enlace por correo */
export function PortalLogin({ initialError = "" }: { initialError?: string }) {
  const [mode, setMode] = useState<"password" | "link">("password")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(initialError)
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState("")

  const switchMode = (next: "password" | "link") => {
    setMode(next)
    setError("")
    setSentTo("")
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) {
        const msg = (error.message || "").toLowerCase()
        if (isRateLimit(error)) setError("Demasiados intentos. Espera unos minutos y vuelve a probar.")
        else if (msg.includes("not confirmed")) setError("Aún no has confirmado tu correo. Usa el enlace de abajo para recibir uno nuevo.")
        else setError("Correo o contraseña incorrectos. Si es tu primera vez, entra con el enlace de la invitación que te enviamos por correo.")
      }
    } catch {
      setError("No hemos podido conectar. Revisa tu conexión e inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    setError("")
    setLoading(true)
    try {
      const { data: allowed, error: rpcError } = await supabase.rpc("portal_email_allowed", { check_email: cleanEmail })
      if (rpcError) {
        setError(isNotReadyError(rpcError) ? NOT_READY_MSG : "No hemos podido comprobar tu correo. Inténtalo de nuevo en unos minutos.")
        return
      }
      if (!allowed) {
        setError(NO_ACCESS_MSG)
        return
      }
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: window.location.origin + withBasePath("/clientes/"),
          // Las cuentas solo se crean con la invitación que manda NorDrive desde su app
          shouldCreateUser: false,
        },
      })
      if (error) {
        setError(
          isRateLimit(error)
            ? "Ya te hemos enviado un enlace hace poco. Espera unos minutos antes de pedir otro."
            : /signup|not allowed|not found|user/i.test(error.message || "")
              ? "Todavía no tienes cuenta. NorDrive te enviará una invitación por correo para crearla; si no la encuentras, mira en spam o escríbenos."
              : "No hemos podido enviarte el enlace. Inténtalo de nuevo en unos minutos."
        )
        return
      }
      setSentTo(cleanEmail)
    } catch {
      setError("No hemos podido conectar. Revisa tu conexión e inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (mode === "link" && sentTo) {
    return (
      <motion.div key="sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-2xl text-primary border border-primary/20">
            <MailCheck className="h-8 w-8" />
          </div>
        </div>
        <CardHeader title="Revisa tu correo" subtitle="El enlace caduca al cabo de un rato; si no lo ves, mira en spam." />
        <p className="text-sm text-center text-foreground leading-relaxed mb-8">
          Te hemos enviado un enlace a <strong className="text-primary break-all">{sentTo}</strong>. Ábrelo desde este dispositivo.
        </p>
        <Button variant="outline" onClick={() => switchMode("password")} className="w-full border-border rounded-xl font-medium gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de sesión
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cardClass}
    >
      {mode === "password" ? (
        <>
          <CardHeader title="Sigue tu importación" subtitle="Entra con tu correo y contraseña para ver el estado de tu coche." />
          <form onSubmit={handlePasswordLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl bg-background border-border"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 rounded-xl bg-background border-border"
                  required
                />
              </div>
            </div>
            <FormError message={error} />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-medium shadow gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => switchMode("link")}
              className="text-xs text-primary font-medium hover:underline"
            >
              ¿Has olvidado tu contraseña?
            </button>
          </div>
        </>
      ) : (
        <>
          <CardHeader
            title="Recuperar contraseña"
            subtitle="Escribe tu correo y te enviaremos un enlace para entrar y elegir una contraseña nueva. ¿Es tu primera vez? Entra con el enlace de la invitación que te enviamos."
          />
          <form onSubmit={handleSendLink} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="link-email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="link-email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl bg-background border-border"
                  required
                />
              </div>
            </div>
            <FormError message={error} />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => switchMode("password")}
                className="w-1/3 border-border rounded-xl font-medium"
              >
                Volver
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-medium shadow gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Enviarme el enlace
              </Button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  )
}

/** Elegir (primera vez) o cambiar la contraseña con la sesión ya iniciada */
export function PortalSetPassword({
  isChange = false,
  onDone,
  onCancel,
}: {
  isChange?: boolean
  onDone: () => void
  onCancel?: () => void
}) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.")
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password, data: { password_set: true } })
      if (error) {
        const msg = (error.message || "").toLowerCase()
        if (msg.includes("different from the old")) setError("La nueva contraseña debe ser distinta de la anterior.")
        else if (msg.includes("weak") || msg.includes("at least")) setError("Esa contraseña es demasiado débil. Prueba con una más larga.")
        else if (isRateLimit(error)) setError("Demasiados intentos. Espera unos minutos y vuelve a probar.")
        else setError("No hemos podido guardar la contraseña. Inténtalo de nuevo.")
        return
      }
      onDone()
    } catch {
      setError("No hemos podido conectar. Revisa tu conexión e inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      key="set-password"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cardClass}
    >
      <div className="flex justify-center mb-6">
        <div className="bg-primary/10 p-4 rounded-2xl text-primary border border-primary/20">
          <KeyRound className="h-8 w-8" />
        </div>
      </div>
      <CardHeader
        title={isChange ? "Cambiar contraseña" : "Elige tu contraseña"}
        subtitle={
          isChange
            ? "Escribe tu nueva contraseña (mínimo 8 caracteres)."
            : "La usarás para entrar la próxima vez con tu correo. Mínimo 8 caracteres."
        }
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="new-password">Nueva contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 rounded-xl bg-background border-border"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Repite la contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pl-10 rounded-xl bg-background border-border"
              required
            />
          </div>
        </div>
        <FormError message={error} />
        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="w-1/3 border-border rounded-xl font-medium">
              {isChange ? "Cancelar" : "Salir"}
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className={`${onCancel ? "w-2/3" : "w-full"} bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-medium shadow gap-2`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar contraseña
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
