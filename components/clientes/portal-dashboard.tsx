"use client"

import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Car,
  MapPin,
  FileText,
  Image as ImageIcon,
  LogOut,
  CheckCircle2,
  Truck,
  Clock,
  ChevronRight,
  X,
  Compass,
  Navigation,
  Info,
  Check,
  KeyRound,
  Loader2,
  CircleDot,
  Ship,
  TrainFront,
  Hourglass,
  RefreshCw,
  Download,
  CalendarClock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase, PORTAL_BUCKET } from "@/lib/supabase"
import {
  type PortalCar,
  type PortalStep,
  TRANSPORT_LABELS,
  normalizeCar,
  statusHeadline,
  routeProgress,
  formatFileSize,
  formatDate,
  isNotReadyError,
} from "@/lib/clientes"

type LoadState = "loading" | "ready" | "not-ready" | "error"

const TRANSPORT_DESCRIPTIONS: Record<string, string> = {
  camion: "Tu coche viaja en un camión portacoches.",
  conduciendo: "Un miembro del equipo de NorDrive conduce tu coche hacia su destino.",
  tren: "Tu coche viaja en tren de mercancías.",
  barco: "Tu coche viaja en barco.",
}

function TransportIcon({ mode, className }: { mode: string | null; className?: string }) {
  if (mode === "conduciendo") return <Compass className={className} />
  if (mode === "barco") return <Ship className={className} />
  if (mode === "tren") return <TrainFront className={className} />
  return <Truck className={className} />
}

function stepBadge(step: PortalStep) {
  if (step.date) return step.date
  if (step.status === "completed") return "Completado"
  if (step.status === "current") return "En curso"
  return "Pendiente"
}

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
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)

  const [photoUrls, setPhotoUrls] = useState<(string | null)[] | null>(null)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [selectedStepIdx, setSelectedStepIdx] = useState<number | null>(null)
  const [openingDoc, setOpeningDoc] = useState<string | null>(null)
  const [docError, setDocError] = useState("")

  const load = useCallback(async () => {
    setState("loading")
    try {
      const [customerRes, carsRes] = await Promise.all([
        supabase.from("customers").select("name").limit(1),
        supabase.from("client_portal_cars").select("*").order("updated_at", { ascending: false }),
      ])
      if (carsRes.error) {
        setState(isNotReadyError(carsRes.error) ? "not-ready" : "error")
        return
      }
      const name = !customerRes.error ? (customerRes.data?.[0] as { name?: string } | undefined)?.name : ""
      setFirstName((name || "").trim().split(/\s+/)[0] || "")
      const list = (carsRes.data || []).map((row) => normalizeCar(row as Record<string, unknown>))
      setCars(list)
      setSelectedCarId((prev) => (prev && list.some((c) => c.id === prev) ? prev : list[0]?.id ?? null))
      setState("ready")
    } catch {
      setState("error")
    }
  }, [])

  useEffect(() => {
    load()
  }, [load, userId])

  const car = cars.find((c) => c.id === selectedCarId) || null

  // Fotos: URLs firmadas del bucket privado
  useEffect(() => {
    setActivePhotoIdx(0)
    setSelectedStepIdx(null)
    setDocError("")
    if (!car || car.photos.length === 0) {
      setPhotoUrls([])
      return
    }
    let cancelled = false
    setPhotoUrls(null)
    supabase.storage
      .from(PORTAL_BUCKET)
      .createSignedUrls(
        car.photos.map((p) => p.path),
        3600
      )
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) {
          setPhotoUrls([])
          return
        }
        const byPath = new Map(data.map((d) => [d.path, d.signedUrl]))
        setPhotoUrls(car.photos.map((p) => byPath.get(p.path) || null))
      })
      .catch(() => {
        if (!cancelled) setPhotoUrls([])
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car?.id, car?.updated_at])

  // Cerrar el modal con Escape
  useEffect(() => {
    if (selectedStepIdx === null) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedStepIdx(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedStepIdx])

  const openDocument = async (path: string, name: string) => {
    setDocError("")
    setOpeningDoc(path)
    try {
      const { data, error } = await supabase.storage.from(PORTAL_BUCKET).createSignedUrl(path, 300, { download: name })
      if (error || !data?.signedUrl) {
        setDocError("No hemos podido abrir el documento. Inténtalo de nuevo.")
        return
      }
      const w = window.open(data.signedUrl, "_blank")
      if (!w) window.location.href = data.signedUrl
    } catch {
      setDocError("No hemos podido abrir el documento. Inténtalo de nuevo.")
    } finally {
      setOpeningDoc(null)
    }
  }

  const visiblePhotos = (photoUrls || [])
    .map((url, idx) => ({ url, name: car?.photos[idx]?.name || `Foto ${idx + 1}` }))
    .filter((p): p is { url: string; name: string } => Boolean(p.url))
  const activePhoto = visiblePhotos[Math.min(activePhotoIdx, Math.max(visiblePhotos.length - 1, 0))]

  const selectedStep = car && selectedStepIdx !== null ? car.steps[selectedStepIdx] : null
  const transportLabel = car?.transport_mode ? TRANSPORT_LABELS[car.transport_mode] : ""

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
          {car ? (
            <p className="text-sm text-muted-foreground">
              Tu <strong className="text-primary">{car.title}</strong> se encuentra actualmente:{" "}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-busy="true">
          <div className="lg:col-span-2 h-96 bg-card border border-border rounded-2xl animate-pulse" />
          <div className="h-96 bg-card border border-border rounded-2xl animate-pulse" />
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

      {state === "ready" && !car && (
        <div className="flex justify-center">
          <InfoCard icon={<Car className="h-8 w-8" />} title="Aún no hay coches en tu cuenta">
            Todavía no hay ningún coche asignado a tu cuenta. En cuanto empecemos con tu importación lo verás aquí.
          </InfoCard>
        </div>
      )}

      {state === "ready" && car && (
        <>
          {/* Selector de coche (si hay varios) */}
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
                  {c.title}
                  {c.year ? ` · ${c.year}` : ""}
                </button>
              ))}
            </div>
          )}

          {/* Estado actual */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary/5 border border-primary/15 p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-3 rounded-xl border border-primary/20">
                <TransportIcon mode={car.transport_mode} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">Estado actual</p>
                <p className="text-lg font-bold text-foreground">{statusHeadline(car)}</p>
                {transportLabel && <p className="text-xs text-primary font-medium">{transportLabel}</p>}
              </div>
            </div>
            <div className="md:text-right space-y-1">
              {car.current_location && (
                <p className="text-sm font-bold text-primary flex items-center md:justify-end gap-1">
                  <MapPin className="h-4 w-4 text-red-500" />
                  {car.current_location}
                </p>
              )}
              {formatDate(car.updated_at) && (
                <p className="text-xs text-muted-foreground flex items-center md:justify-end gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Actualizado el {formatDate(car.updated_at)}
                </p>
              )}
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda (Seguimiento / Timeline) */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Estado del Transporte y Gestiones</h2>
              </div>

              {car.steps.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Pronto verás aquí cada fase de tu importación, desde la búsqueda hasta la entrega.
                </p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10">
                    💡 <strong>Haz clic en cualquier fase</strong> de la línea de tiempo para ver sus detalles y, durante el
                    transporte, la ruta de tu coche.
                  </p>

                  <div className="relative pl-6 border-l border-border/85 space-y-8 py-2 ml-2">
                    {car.steps.map((step, idx) => (
                      <button
                        type="button"
                        key={`${step.key}-${idx}`}
                        onClick={() => setSelectedStepIdx(idx)}
                        className="relative block w-full text-left group cursor-pointer hover:bg-muted/30 p-3 rounded-xl transition-all border border-transparent hover:border-border/60"
                      >
                        {/* Indicador de estado en la línea */}
                        <span className="absolute -left-[35px] top-[18px] bg-background flex items-center justify-center rounded-full">
                          {step.status === "completed" && (
                            <CheckCircle2 className="h-6 w-6 text-green-500 bg-background rounded-full" />
                          )}
                          {step.status === "current" && (
                            <div className="h-6 w-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-ping" />
                          )}
                          {step.status === "current" &&
                            (step.key === "transport" ? (
                              <Truck className="h-4.5 w-4.5 text-primary absolute bg-background p-0.5 rounded" />
                            ) : (
                              <CircleDot className="h-4.5 w-4.5 text-primary absolute bg-background p-0.5 rounded-full" />
                            ))}
                          {step.status === "pending" && (
                            <Clock className="h-5.5 w-5.5 text-muted-foreground/60 bg-background rounded-full" />
                          )}
                        </span>

                        <span className="block space-y-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span
                              className={`font-semibold text-sm md:text-base ${
                                step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                              } group-hover:text-primary transition-colors`}
                            >
                              {step.title}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                step.status === "completed"
                                  ? "bg-green-500/10 text-green-600"
                                  : step.status === "current"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {stepBadge(step)}
                            </span>
                          </span>
                          {step.desc && <span className="block text-xs text-muted-foreground">{step.desc}</span>}
                          <span className="text-[10px] text-primary/70 group-hover:underline flex items-center gap-0.5 mt-1 font-medium">
                            Ver detalles <ChevronRight className="h-3 w-3" />
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Columna Derecha (Resumen y Documentación) */}
            <div className="space-y-6">
              {/* Ficha técnica resumida */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border/60 pb-3">
                  <Car className="h-5 w-5 text-primary" />
                  Ficha del coche
                </h2>

                <div className="text-sm space-y-3">
                  {[
                    { label: "Modelo", value: car.title },
                    { label: "Año", value: car.year ? String(car.year) : "" },
                    { label: "Kilometraje", value: car.mileage != null ? `${car.mileage.toLocaleString("es-ES")} km` : "" },
                    { label: "Color", value: car.color || "" },
                  ]
                    .filter((row) => row.value)
                    .map((row) => (
                      <div key={row.label} className="flex justify-between gap-4 py-1 border-b border-border/20">
                        <span className="text-muted-foreground flex-shrink-0">{row.label}</span>
                        <span className="font-semibold text-right">{row.value}</span>
                      </div>
                    ))}
                  {car.origin && (
                    <div className="flex justify-between gap-4 py-1 border-b border-border/20">
                      <span className="text-muted-foreground flex-shrink-0">Origen</span>
                      <span className="font-semibold flex items-center gap-0.5 text-right">
                        <MapPin className="h-3 w-3 text-red-500 flex-shrink-0" />
                        {car.origin}
                      </span>
                    </div>
                  )}
                  {car.destination && (
                    <div className="flex justify-between gap-4 py-1 border-b border-border/20">
                      <span className="text-muted-foreground flex-shrink-0">Destino</span>
                      <span className="font-semibold flex items-center gap-0.5 text-right">
                        <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                        {car.destination}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Documentación */}
              {car.documents.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border/60 pb-3">
                    <FileText className="h-5 w-5 text-primary" />
                    Documentación
                  </h2>

                  <div className="space-y-2">
                    {car.documents.map((doc) => (
                      <div
                        key={doc.path}
                        className="flex justify-between items-center gap-2 p-2.5 bg-muted/30 hover:bg-muted/60 border border-border/40 rounded-xl transition-all"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-xs font-semibold truncate text-foreground" title={doc.name}>
                            {doc.name || "Documento"}
                          </p>
                          {formatFileSize(doc.size) && (
                            <p className="text-[10px] text-muted-foreground">{formatFileSize(doc.size)}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={openingDoc === doc.path}
                          onClick={() => openDocument(doc.path, doc.name || "documento")}
                          className="text-primary hover:bg-primary/10 rounded-lg text-xs p-2 h-8 gap-1 flex-shrink-0"
                        >
                          {openingDoc === doc.path ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                  {docError && <p className="text-xs text-destructive font-medium">{docError}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Visor de Galería de Fotos del Coche */}
          {car.photos.length > 0 && (photoUrls === null || visiblePhotos.length > 0) && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
              <div className="border-b border-border/60 pb-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Fotos del Coche
                </h2>
                <p className="text-xs text-muted-foreground">Reporte fotográfico de inspección y carga.</p>
              </div>

              {photoUrls === null ? (
                <div className="space-y-4" aria-busy="true">
                  <div className="w-full h-[260px] md:h-[480px] rounded-2xl bg-muted animate-pulse" />
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: Math.min(car.photos.length, 4) }).map((_, i) => (
                      <div key={i} className="h-20 md:h-28 rounded-xl bg-muted animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : (
                activePhoto && (
                  <div className="space-y-4">
                    <div className="relative w-full h-[260px] md:h-[480px] rounded-2xl overflow-hidden bg-muted border border-border">
                      <img
                        src={activePhoto.url}
                        alt={activePhoto.name}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-xs px-3 py-1.5 rounded-xl font-semibold border border-border/40 flex items-center gap-2 shadow-sm text-foreground">
                        <Car className="h-4 w-4 text-primary" />
                        Foto {Math.min(activePhotoIdx, visiblePhotos.length - 1) + 1} de {visiblePhotos.length}
                      </div>
                    </div>

                    {visiblePhotos.length > 1 && (
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {visiblePhotos.map((photo, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIdx(idx)}
                            aria-label={`Ver ${photo.name}`}
                            className={`relative h-20 md:h-28 rounded-xl overflow-hidden border transition-all ${
                              activePhotoIdx === idx
                                ? "border-primary ring-2 ring-primary/20 scale-[0.98]"
                                : "border-border hover:border-primary/40"
                            }`}
                          >
                            <img src={photo.url} alt={photo.name} loading="lazy" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}

      {/* --- MODAL DETALLE DE CADA PASO --- */}
      {/* En un portal: el contenedor animado crea su propio contexto de apilado y quedaría bajo el navbar */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {car && selectedStep && (
              <StepModal car={car} step={selectedStep} onClose={() => setSelectedStepIdx(null)} />
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.div>
  )
}

function StepModal({ car, step, onClose }: { car: PortalCar; step: PortalStep; onClose: () => void }) {
  const isTransport = step.key === "transport"
  const showRoute = isTransport && car.route.length > 0
  const showMode = isTransport && Boolean(car.transport_mode || car.current_location)
  const bullets = step.bullets || []
  const progress = routeProgress(car.route)
  const isEmpty = !step.note && bullets.length === 0 && !showRoute && !showMode

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={step.title}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-3xl bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cabecera del modal */}
        <div className="space-y-1.5 border-b border-border pb-4 mb-6 pr-8">
          <span className="text-primary text-[10px] uppercase font-bold tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
            Reporte del estado
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">{step.title}</h2>
          <p className="text-xs text-muted-foreground">
            Fase: <strong>{stepBadge(step)}</strong>
          </p>
        </div>

        <div className="space-y-6">
          {/* Modo de transporte y ubicación */}
          {showMode && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted/40 rounded-2xl border border-border/40 gap-4">
              {car.transport_mode ? (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl border border-primary/20">
                    <TransportIcon mode={car.transport_mode} className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{TRANSPORT_LABELS[car.transport_mode] || "En transporte"}</h4>
                    <p className="text-xs text-muted-foreground">{TRANSPORT_DESCRIPTIONS[car.transport_mode] || ""}</p>
                  </div>
                </div>
              ) : (
                <div />
              )}

              {car.current_location && (
                <div className="md:text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Ubicación actual:</span>
                  <p className="text-sm font-bold text-primary flex items-center md:justify-end gap-1">
                    <MapPin className="h-4 w-4 text-red-500" />
                    {car.current_location}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ruta de ciudades */}
          {showRoute && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ruta de tu coche:</h4>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative py-6 gap-6 md:gap-2">
                {/* Línea gris de fondo */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 hidden md:block" />
                {/* Línea de progreso coloreada */}
                <div
                  className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 hidden md:block transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />

                {car.route.map((city, cIdx) => (
                  <div
                    key={`${city.name}-${cIdx}`}
                    className="flex flex-row md:flex-col items-center gap-3 md:gap-2 z-10 w-full md:w-auto relative"
                  >
                    <div
                      className={`h-8 w-8 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                        city.status === "passed"
                          ? "bg-green-500 border-green-600 text-white"
                          : city.status === "current"
                            ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                            : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      {city.status === "passed" && <Check className="h-4 w-4" />}
                      {city.status === "current" && <Navigation className="h-4 w-4 rotate-45 animate-pulse" />}
                      {city.status === "pending" && <span className="text-[10px]">{cIdx + 1}</span>}
                    </div>
                    <div className="text-left md:text-center md:bg-card md:px-1 rounded">
                      <p className={`text-xs font-bold ${city.status === "current" ? "text-primary text-sm" : "text-foreground"}`}>
                        {city.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase">{city.label || " "}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumen */}
          {step.note && (
            <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{step.note}</p>
            </div>
          )}

          {/* Hitos */}
          {bullets.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Hitos clave de la fase</h3>
              <ul className="space-y-2.5">
                {bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm">
                    <span className="flex-shrink-0 h-5 w-5 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-muted-foreground">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isEmpty && (
            <p className="text-sm text-muted-foreground">
              {step.desc || "Todavía no hay más detalles de esta fase. Te avisaremos en cuanto avance."}
            </p>
          )}

          {(showRoute || showMode) && (
            <div className="text-xs text-muted-foreground flex gap-1.5 p-3 bg-muted/30 border border-border/40 rounded-xl">
              <Info className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Ubicación actualizada por el equipo de NorDrive.</span>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-border pt-4 flex justify-end">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 rounded-xl">
            Cerrar fase
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
