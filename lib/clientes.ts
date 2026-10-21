// Tipos y utilidades del Área de Clientes (datos de la tabla client_portal_cars de Supabase).

export type RouteCityStatus = "passed" | "current" | "pending"
export type StepStatus = "completed" | "current" | "pending"
export type TransportMode = "camion" | "conduciendo" | "tren" | "barco" | ""

export interface PortalRouteCity {
  name: string
  label?: string
  status: RouteCityStatus
}

export interface PortalStep {
  key: string
  title: string
  desc: string
  status: StepStatus
  date?: string
  note?: string
  bullets?: string[]
}

export interface PortalFile {
  path: string
  name: string
  size?: number
}

export interface PortalCar {
  id: string
  title: string
  year: number | null
  mileage: number | null
  color: string | null
  origin: string | null
  destination: string | null
  status_text: string | null
  current_location: string | null
  transport_mode: TransportMode | null
  route: PortalRouteCity[]
  steps: PortalStep[]
  photos: PortalFile[]
  documents: PortalFile[]
  published: boolean
  updated_at: string
}

export const TRANSPORT_LABELS: Record<string, string> = {
  camion: "En camión",
  conduciendo: "Conduciendo",
  tren: "En tren",
  barco: "En barco",
}

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : [])
const asText = (value: unknown): string => (typeof value === "string" ? value : value == null ? "" : String(value))

/** Limpia una fila de Supabase para que el JSON mal formado no rompa la página */
export function normalizeCar(row: Record<string, unknown>): PortalCar {
  const toNumber = (v: unknown) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v))
  return {
    id: asText(row.id),
    title: asText(row.title) || "Tu coche",
    year: toNumber(row.year),
    mileage: toNumber(row.mileage),
    color: (row.color as string) || null,
    origin: (row.origin as string) || null,
    destination: (row.destination as string) || null,
    status_text: (row.status_text as string) || null,
    current_location: (row.current_location as string) || null,
    transport_mode: (row.transport_mode as TransportMode) || null,
    route: asArray<PortalRouteCity>(row.route)
      .filter((c) => c && typeof c === "object" && c.name)
      .map((c) => ({
        name: asText(c.name),
        label: c.label ? asText(c.label) : undefined,
        status: (["passed", "current", "pending"].includes(c.status) ? c.status : "pending") as RouteCityStatus,
      })),
    steps: asArray<PortalStep>(row.steps)
      .filter((s) => s && typeof s === "object" && s.title)
      .map((s) => ({
        key: asText(s.key),
        title: asText(s.title),
        desc: asText(s.desc),
        status: (["completed", "current", "pending"].includes(s.status) ? s.status : "pending") as StepStatus,
        date: s.date ? asText(s.date) : undefined,
        note: s.note ? asText(s.note) : undefined,
        bullets: asArray<unknown>(s.bullets).map(asText).filter(Boolean),
      })),
    photos: asArray<PortalFile>(row.photos).filter((p) => p && p.path),
    documents: asArray<PortalFile>(row.documents).filter((d) => d && d.path),
    published: Boolean(row.published),
    updated_at: asText(row.updated_at),
  }
}

/** Titular del estado: status_text, si no el paso en curso, si no "En proceso" */
export function statusHeadline(car: PortalCar): string {
  return car.status_text || car.steps.find((s) => s.status === "current")?.title || "En proceso"
}

/** Porcentaje recorrido de la ruta (ciudad actual, o la última pasada) */
export function routeProgress(route: PortalRouteCity[]): number {
  if (route.length < 2) return route.length === 1 && route[0].status !== "pending" ? 100 : 0
  let idx = route.findIndex((c) => c.status === "current")
  if (idx === -1) {
    for (let i = route.length - 1; i >= 0; i--) {
      if (route[i].status === "passed") {
        idx = i
        break
      }
    }
  }
  if (idx <= 0) return 0
  return Math.round((idx / (route.length - 1)) * 100)
}

export function formatFileSize(size?: number): string {
  if (!size || size <= 0) return ""
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toLocaleString("es-ES", { maximumFractionDigits: 1 })} MB`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (!iso || isNaN(d.getTime())) return ""
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

/** ¿El error indica que las tablas/funciones del área de clientes aún no existen? */
export function isNotReadyError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const e = error as { code?: string; message?: string }
  const msg = (e.message || "").toLowerCase()
  return (
    e.code === "42P01" ||
    e.code === "42883" ||
    e.code === "PGRST202" ||
    e.code === "PGRST205" ||
    msg.includes("does not exist") ||
    msg.includes("could not find")
  )
}
