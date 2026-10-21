"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Car, Info, KeyRound, LogOut, Hourglass, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import {
  type PortalCar,
  type PortalProposal,
  carTitle,
  normalizeCar,
  normalizeProposal,
  statusHeadline,
  isNotReadyError,
} from "@/lib/clientes"
import { CarView } from "./portal-car"
import { ProposalCard, type ProposalPatch } from "./portal-proposals"
import { Lightbox, type LightboxState } from "./portal-shared"

type LoadState = "loading" | "ready" | "not-ready" | "error"
type Tab = "cars" | "proposals"

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-8 shadow-sm text-center space-y-4">
      <div className="flex justify-center">
        <div className="bg-primary/10 p-4 rounded-2xl text-primary border border-primary/20">{icon}</div>
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

/** Favorito primero; luego el orden del servidor */
const sortProposals = (list: PortalProposal[]) =>
  [...list].sort((a, b) => Number(b.is_favorite) - Number(a.is_favorite))

export function PortalDashboard({
  userId,
  onChangePassword,
  onSignOut,
}: {
  userId: string
  onChangePassword: () => void
  onSignOut: () => void
}) {
  const [state, setState] = useState<LoadState>("loading")
  const [firstName, setFirstName] = useState("")
  const [cars, setCars] = useState<PortalCar[]>([])
  const [proposals, setProposals] = useState<PortalProposal[]>([])
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("cars")
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const firstLoad = useRef(true)
  const proposalsRef = useRef<PortalProposal[]>([])
  useEffect(() => {
    proposalsRef.current = proposals
  }, [proposals])

  const fetchProposals = useCallback(() => supabase.rpc("portal_my_proposals"), [])

  const load = useCallback(async () => {
    setState("loading")
    try {
      const [customerRes, carsRes, proposalsRes] = await Promise.all([
        supabase.from("customers").select("name").limit(1),
        supabase.rpc("portal_my_cars"),
        fetchProposals(),
      ])
      const carsMissing = carsRes.error && isNotReadyError(carsRes.error)
      const proposalsMissing = proposalsRes.error && isNotReadyError(proposalsRes.error)
      if (carsMissing && proposalsMissing) return setState("not-ready")
      if ((carsRes.error && !carsMissing) || (proposalsRes.error && !proposalsMissing)) return setState("error")

      const name = !customerRes.error ? (customerRes.data?.[0] as { name?: string } | undefined)?.name : ""
      setFirstName((name || "").trim().split(/\s+/)[0] || "")

      const carList = (Array.isArray(carsRes.data) ? carsRes.data : []).map((row) =>
        normalizeCar(row as Record<string, unknown>)
      )
      const proposalList = sortProposals(
        (Array.isArray(proposalsRes.data) ? proposalsRes.data : []).map((row) =>
          normalizeProposal(row as Record<string, unknown>)
        )
      )
      setCars(carList)
      setProposals(proposalList)
      setSelectedCarId((prev) => (prev && carList.some((c) => c.id === prev) ? prev : carList[0]?.id ?? null))
      if (firstLoad.current) {
        firstLoad.current = false
        setTab(carList.length === 0 && proposalList.length > 0 ? "proposals" : "cars")
      }
      setState("ready")
    } catch {
      setState("error")
    }
  }, [fetchProposals])

  useEffect(() => {
    load()
  }, [load, userId])

  const openPhotos = useCallback((images: string[], index: number) => {
    if (images.length) setLightbox({ images, index })
  }, [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  /** Guarda la opinión del cliente: cambio optimista, RPC y recarga silenciosa de las propuestas */
  const reactToProposal = useCallback(
    async (id: string, patch: ProposalPatch): Promise<boolean> => {
      const previous = proposalsRef.current
      setProposals(
        previous.map((p) =>
          p.id === id
            ? { ...p, reaction: patch.reaction, is_favorite: patch.favorite }
            : patch.favorite
              ? { ...p, is_favorite: false } // solo un favorito por cliente
              : p
        )
      )
      try {
        const { error } = await supabase.rpc("portal_react_proposal", {
          proposal: id,
          new_reaction: patch.reaction,
          // se reenvía el último comentario para no borrarlo (los mensajes nuevos van por portal_comment_proposal)
          new_comment: patch.comment,
          favorite: patch.favorite,
        })
        if (error) {
          setProposals(previous)
          return false
        }
        const fresh = await fetchProposals()
        if (!fresh.error && Array.isArray(fresh.data)) {
          setProposals(sortProposals(fresh.data.map((row) => normalizeProposal(row as Record<string, unknown>))))
        }
        return true
      } catch {
        setProposals(previous)
        return false
      }
    },
    [fetchProposals]
  )

  /** El cliente escribe a NorDrive sobre un coche propuesto */
  const commentOnProposal = useCallback(
    async (id: string, text: string): Promise<boolean> => {
      try {
        const { error } = await supabase.rpc("portal_comment_proposal", { proposal: id, body: text })
        if (error) return false
        const fresh = await fetchProposals()
        if (!fresh.error && Array.isArray(fresh.data)) {
          setProposals(sortProposals(fresh.data.map((row) => normalizeProposal(row as Record<string, unknown>))))
        }
        return true
      } catch {
        return false
      }
    },
    [fetchProposals]
  )

  const car = cars.find((c) => c.id === selectedCarId) || null
  const pendingProposals = proposals.some((p) => p.reaction === null)

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl space-y-6"
    >
      {/* Barra superior de bienvenida */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="space-y-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-extrabold text-foreground">
            {firstName ? `¡Hola, ${firstName}!` : "¡Hola!"} 👋
          </h1>
          {state === "ready" && car ? (
            <p className="text-sm text-muted-foreground">
              Tu <strong className="text-primary">{carTitle(car)}</strong>:{" "}
              <span className="font-semibold text-primary">{statusHeadline(car)}</span>.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Bienvenido a tu área de cliente de NorDrive.</p>
          )}
        </div>
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <Button
            variant="ghost"
            onClick={onChangePassword}
            className="text-muted-foreground hover:text-foreground rounded-xl gap-2 font-medium text-xs sm:text-sm"
          >
            <KeyRound className="h-4 w-4" />
            Cambiar contraseña
          </Button>
          <Button
            variant="ghost"
            onClick={onSignOut}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl gap-2 font-medium text-xs sm:text-sm"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      {state === "loading" && (
        <div className="space-y-6" aria-busy="true">
          <div className="h-10 w-72 bg-card border border-border rounded-full animate-pulse" />
          <div className="h-80 bg-card border border-border rounded-2xl animate-pulse" />
        </div>
      )}

      {state === "not-ready" && (
        <div className="flex justify-center">
          <InfoCard icon={<Hourglass className="h-8 w-8" />} title="El área de clientes se está preparando">
            Estamos terminando de configurar tu espacio. Vuelve a entrar en unos días o escríbenos si tienes cualquier duda.
          </InfoCard>
        </div>
      )}

      {state === "error" && (
        <div className="flex justify-center">
          <InfoCard icon={<Info className="h-8 w-8" />} title="No hemos podido cargar tus datos">
            <p className="mb-5">Puede ser un problema de conexión momentáneo.</p>
            <Button onClick={load} className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </InfoCard>
        </div>
      )}

      {state === "ready" && (
        <>
          {/* Pestañas */}
          <div className="inline-flex p-1 bg-card border border-border rounded-full shadow-sm" role="tablist" aria-label="Secciones">
            {(
              [
                { key: "cars", label: cars.length > 1 ? "Mis coches" : "Mi coche", count: cars.length, dot: false },
                { key: "proposals", label: "Propuestas", count: proposals.length, dot: pendingProposals },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`relative flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  tab === t.key ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                <span
                  className={`text-[11px] min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center ${
                    tab === t.key ? "bg-primary-foreground/20" : "bg-muted"
                  }`}
                >
                  {t.count}
                </span>
                {t.dot && (
                  <span
                    className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-card"
                    aria-label="Propuestas sin valorar"
                  />
                )}
              </button>
            ))}
          </div>

          {tab === "cars" &&
            (car ? (
              <div className="space-y-6">
                {cars.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Tus coches">
                    {cars.map((c) => (
                      <button
                        key={c.id}
                        role="tab"
                        aria-selected={c.id === car.id}
                        onClick={() => setSelectedCarId(c.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                          c.id === car.id
                            ? "bg-primary text-primary-foreground border-primary shadow"
                            : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {carTitle(c)}
                        {c.year ? ` · ${c.year}` : ""}
                      </button>
                    ))}
                  </div>
                )}
                <CarView key={car.id} car={car} onOpenPhotos={openPhotos} />
              </div>
            ) : (
              <div className="flex justify-center">
                <InfoCard icon={<Car className="h-8 w-8" />} title="Aún no hay coches comprados">
                  {proposals.length > 0
                    ? "Cuando elijas uno de los coches que te proponemos y lo compremos, podrás seguir aquí cada paso de su importación."
                    : "En cuanto compremos tu coche podrás seguir aquí cada paso de su importación."}
                </InfoCard>
              </div>
            ))}

          {tab === "proposals" &&
            (proposals.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Coches que te proponemos. Dinos cuál te gusta más.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {proposals.map((p) => (
                    <ProposalCard key={p.id} proposal={p} onReact={reactToProposal}
                    onComment={commentOnProposal} onOpenPhotos={openPhotos} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <InfoCard icon={<Sparkles className="h-8 w-8" />} title="Aún no hay propuestas">
                  Cuando encontremos coches que encajen con lo que buscas, te los enseñaremos aquí para que nos digas cuál te gusta.
                </InfoCard>
              </div>
            ))}
        </>
      )}

      <Lightbox state={lightbox} onClose={closeLightbox} />
    </motion.div>
  )
}
