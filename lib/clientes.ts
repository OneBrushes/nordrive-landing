// Tipos y utilidades del Área de Clientes.
// Los datos llegan de las funciones de Supabase portal_my_cars y portal_my_proposals (ya filtradas al cliente).

export type StepStatus = "completed" | "current" | "pending"
export type CarStage = "purchased" | "in_transit" | "homologation" | "detailing" | "ready" | "delivered"
export type TransportMode = "conduciendo" | "camion"
export type Reaction = "like" | "dislike"

export interface PortalFile {
  path: string
  name: string
  size?: number
}

export interface ChecklistEntry {
  checked: boolean
  note: string
  /** URLs públicas */
  photos: string[]
  label?: string
  section?: string
}

export type ChecklistData = Record<string, ChecklistEntry>

/** Datos técnicos comunes a coches comprados y propuestas */
interface CarSpecs {
  brand: string
  model: string
  year: number | null
  mileage: number | null
  cv: number | null
  fuel_type: string
  transmission: string
  color: string
  origin: string | null
  /** URLs públicas */
  images: string[]
  checklist: ChecklistData
}

export interface PortalCar extends CarSpecs {
  id: string
  stage: CarStage
  purchased_on: string | null
  delivered_on: string | null
  transport_mode: TransportMode
  note: string | null
  checklist_updated_at: string | null
  /** Fotos extra en el bucket privado (hay que firmarlas) */
  photos: PortalFile[]
  documents: PortalFile[]
  updated_at: string
}

export interface PortalProposal extends CarSpecs {
  id: string
  month: number | null
  equipment: string[]
  client_price: number | null
  message: string | null
  reaction: Reaction | null
  client_comment: string | null
  is_favorite: boolean
  created_at: string
}

export interface PortalPhase {
  key: string
  title: string
  desc: string
  status: StepStatus
  date?: string
}

export const TRANSPORT_LABELS: Record<TransportMode, string> = {
  conduciendo: "Conduciendo",
  camion: "En camión",
}

// --- Normalizadores defensivos ---

const STAGES: CarStage[] = ["purchased", "in_transit", "homologation", "detailing", "ready", "delivered"]

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : [])
const asText = (value: unknown): string => (typeof value === "string" ? value : value == null ? "" : String(value))
const asTextOrNull = (value: unknown): string | null => {
  const t = asText(value).trim()
  return t ? t : null
}
const asNumber = (v: unknown): number | null =>
  v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v)
const asStrings = (value: unknown): string[] =>
  asArray<unknown>(value)
    .map((v) => asText(v).trim())
    .filter(Boolean)
const asFiles = (value: unknown): PortalFile[] =>
  asArray<Record<string, unknown>>(value)
    .filter((f) => f && typeof f === "object" && typeof f.path === "string" && f.path)
    .map((f) => ({
      path: asText(f.path),
      name: asText(f.name) || asText(f.path).split("/").pop() || "archivo",
      size: asNumber(f.size) ?? undefined,
    }))

export function normalizeChecklist(value: unknown): ChecklistData {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  const out: ChecklistData = {}
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!raw || typeof raw !== "object") continue
    const e = raw as Record<string, unknown>
    out[key] = {
      checked: e.checked === true,
      note: asText(e.note).trim(),
      photos: asStrings(e.photos),
      label: asTextOrNull(e.label) ?? undefined,
      section: asTextOrNull(e.section) ?? undefined,
    }
  }
  return out
}

function normalizeSpecs(row: Record<string, unknown>): CarSpecs {
  return {
    brand: asText(row.brand).trim(),
    model: asText(row.model).trim(),
    year: asNumber(row.year),
    mileage: asNumber(row.mileage),
    cv: asNumber(row.cv),
    fuel_type: asText(row.fuel_type).trim(),
    transmission: asText(row.transmission).trim(),
    color: asText(row.color).trim(),
    origin: asTextOrNull(row.origin),
    images: asStrings(row.images),
    checklist: normalizeChecklist(row.checklist),
  }
}

export function normalizeCar(row: Record<string, unknown>): PortalCar {
  const stage = STAGES.includes(row.stage as CarStage) ? (row.stage as CarStage) : "purchased"
  return {
    ...normalizeSpecs(row),
    id: asText(row.id),
    stage,
    purchased_on: asTextOrNull(row.purchased_on),
    delivered_on: asTextOrNull(row.delivered_on),
    transport_mode: row.transport_mode === "camion" ? "camion" : "conduciendo",
    note: asTextOrNull(row.note),
    checklist_updated_at: asTextOrNull(row.checklist_updated_at),
    photos: asFiles(row.photos),
    documents: asFiles(row.documents),
    updated_at: asText(row.updated_at),
  }
}

export function normalizeProposal(row: Record<string, unknown>): PortalProposal {
  return {
    ...normalizeSpecs(row),
    id: asText(row.id),
    month: asNumber(row.month),
    equipment: asStrings(row.equipment),
    client_price: asNumber(row.client_price),
    message: asTextOrNull(row.message),
    reaction: row.reaction === "like" || row.reaction === "dislike" ? row.reaction : null,
    client_comment: asTextOrNull(row.client_comment),
    is_favorite: row.is_favorite === true,
    created_at: asText(row.created_at),
  }
}

// --- Presentación ---

export function carTitle(c: { brand: string; model: string }): string {
  return [c.brand, c.model].filter(Boolean).join(" ") || "Tu coche"
}

/** "2019 · 78.000 km · 190 CV · Diésel · Automático · Gris" */
export function specLine(c: CarSpecs, opts: { color?: boolean } = {}): string {
  return [
    c.year ? String(c.year) : "",
    c.mileage != null ? `${c.mileage.toLocaleString("es-ES")} km` : "",
    c.cv != null ? `${c.cv.toLocaleString("es-ES")} CV` : "",
    c.fuel_type,
    c.transmission,
    opts.color !== false ? c.color : "",
  ]
    .filter(Boolean)
    .join(" · ")
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString("es-ES", { maximumFractionDigits: 0 })} €`
}

export function formatFileSize(size?: number): string {
  if (!size || size <= 0) return ""
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toLocaleString("es-ES", { maximumFractionDigits: 1 })} MB`
}

/** Fecha legible; las fechas "YYYY-MM-DD" se leen en hora local para no saltar de día */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ""
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(iso)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

// --- Fases del coche (derivadas de stage) ---

/** Paso (1-8) que está en curso para cada stage; delivered = todo completado */
const STAGE_CURRENT_STEP: Record<CarStage, number> = {
  purchased: 3,
  in_transit: 4,
  homologation: 5,
  detailing: 6,
  ready: 7,
  delivered: 9,
}

export function hasCheckedItems(checklist: ChecklistData): boolean {
  return Object.values(checklist).some((e) => e.checked)
}

export function carPhases(car: PortalCar): PortalPhase[] {
  const current = STAGE_CURRENT_STEP[car.stage]
  const statusOf = (n: number): StepStatus => (n < current ? "completed" : n === current ? "current" : "pending")
  const inspected = hasCheckedItems(car.checklist)

  return [
    { key: "search", title: "Búsqueda y selección", desc: "Encontramos el coche que encaja contigo.", status: "completed" },
    {
      key: "inspection",
      title: "Inspección",
      desc: "Revisamos el coche punto por punto antes de comprarlo.",
      status: inspected ? "completed" : "pending",
      date: inspected ? formatDate(car.checklist_updated_at) || undefined : undefined,
    },
    {
      key: "purchased",
      title: "Comprado",
      desc: current === 3 ? "Comprado, preparando la recogida." : "El coche ya es tuyo.",
      status: statusOf(3),
      date: formatDate(car.purchased_on) || undefined,
    },
    {
      key: "transit",
      title: "De camino a España",
      desc: car.transport_mode === "camion" ? "Viaja en camión hacia España." : "Lo traemos conduciendo hasta España.",
      status: statusOf(4),
    },
    { key: "homologation", title: "Homologación y matrícula", desc: "ITV, papeles y matrícula española.", status: statusOf(5) },
    { key: "detailing", title: "Preparación", desc: "Limpieza y puesta a punto para la entrega.", status: statusOf(6) },
    { key: "ready", title: "Listo para entregar", desc: "Te avisamos para quedar el día de la entrega.", status: statusOf(7) },
    {
      key: "delivered",
      title: "Entregado",
      desc: "¡Disfruta de tu coche!",
      status: statusOf(8),
      date: formatDate(car.delivered_on) || undefined,
    },
  ]
}

/** Titular del estado actual, p. ej. "De camino a España · Conduciendo" */
export function statusHeadline(car: PortalCar): string {
  switch (car.stage) {
    case "purchased":
      return "Comprado · Preparando la recogida"
    case "in_transit":
      return `De camino a España · ${TRANSPORT_LABELS[car.transport_mode]}`
    case "homologation":
      return "Homologación y matrícula"
    case "detailing":
      return "En preparación"
    case "ready":
      return "Listo para entregar"
    case "delivered":
      return "Entregado"
  }
}

// --- Checklist de inspección ---

/** Copia de los puntos de la inspección de la app de gestión (para datos antiguos sin label/section) */
export const CHECKLIST_SECTIONS = {
  exterior: {
    title: "Exterior",
    items: [
      "Estado de la pintura (arañazos, golpes)",
      "Lunas y espejos",
      "Llantas y neumáticos (profundidad, marca)",
      "Luces y faros (funcionamiento, roturas)",
      "Ajuste de puertas y capó",
    ],
  },
  interior: {
    title: "Interior",
    items: [
      "Tapicería y asientos",
      "Volante y palanca de cambios",
      "Botones y mandos",
      "Aire acondicionado / Climatizador",
      "Cuadro de instrumentos (testigos)",
    ],
  },
  motor: {
    title: "Motor y Mecánica",
    items: [
      "Nivel de aceite",
      "Nivel de refrigerante",
      "Fugas visibles",
      "Ruidos extraños al arrancar",
      "Estado de correas (visual)",
    ],
  },
  prueba: {
    title: "Prueba Dinámica",
    items: [
      "Arranque en frío",
      "Frenada",
      "Dirección (holguras, ruidos)",
      "Cambio de marchas (suavidad)",
      "Suspensión (ruidos)",
    ],
  },
  documentacion: {
    title: "Documentación",
    items: [
      "Permiso de circulación",
      "Ficha técnica",
      "Libro de mantenimiento",
      "Número de llaves",
      "COC (Certificado de Conformidad)",
    ],
  },
  herramientas: {
    title: "Herramientas / Diagnóstico",
    items: ["Espesómetro (Pintura original)", "Lectura OBD (Códigos de error)"],
  },
}

const OTHER_SECTION = "Otros"

/** Texto y sección de un punto: los guardados con el punto, si no los de CHECKLIST_SECTIONS por su clave */
export function resolveChecklistItem(key: string, entry: ChecklistEntry): { label: string; section: string; order: number } {
  const m = /^([a-z]+)-(\d+)$/.exec(key)
  const sectionKeys = Object.keys(CHECKLIST_SECTIONS) as (keyof typeof CHECKLIST_SECTIONS)[]
  const def = m && (sectionKeys as string[]).includes(m[1]) ? CHECKLIST_SECTIONS[m[1] as keyof typeof CHECKLIST_SECTIONS] : null
  const idx = m ? Number(m[2]) : 999
  return {
    label: entry.label || def?.items[idx] || key,
    section: entry.section || def?.title || OTHER_SECTION,
    order: idx,
  }
}

export interface ChecklistItemView {
  key: string
  label: string
  checked: boolean
  note: string
  photos: string[]
}

export interface ChecklistGroup {
  title: string
  items: ChecklistItemView[]
  checked: number
  total: number
}

/** Agrupa por sección (en el orden de la app; las desconocidas al final) y deja solo los puntos con algo que enseñar */
export function groupChecklist(checklist: ChecklistData): ChecklistGroup[] {
  const order: string[] = Object.values(CHECKLIST_SECTIONS).map((s) => s.title)
  const groups = new Map<string, (ChecklistItemView & { order: number })[]>()
  const totals = new Map<string, { checked: number; total: number }>()
  for (const [key, entry] of Object.entries(checklist)) {
    const { label, section, order: o } = resolveChecklistItem(key, entry)
    const t = totals.get(section) || { checked: 0, total: 0 }
    t.total++
    if (entry.checked) t.checked++
    totals.set(section, t)
    if (!entry.checked && !entry.note && entry.photos.length === 0) continue
    if (!groups.has(section)) groups.set(section, [])
    groups.get(section)!.push({ key, label, checked: entry.checked, note: entry.note, photos: entry.photos, order: o })
  }
  const rank = (title: string) => {
    const i = order.indexOf(title)
    return i === -1 ? (title === OTHER_SECTION ? order.length + 1 : order.length) : i
  }
  return [...groups.entries()]
    .sort(([a], [b]) => rank(a) - rank(b))
    .map(([title, items]) => {
      items.sort((a, b) => a.order - b.order)
      return {
        title,
        items: items.map(({ order: _o, ...rest }) => rest),
        checked: totals.get(title)?.checked ?? 0,
        // los puntos de la sección según la app (aunque aún no se hayan guardado todos)
        total: Math.max(
          totals.get(title)?.total ?? 0,
          Object.values(CHECKLIST_SECTIONS).find((sec) => sec.title === title)?.items.length ?? 0
        ),
      }
    })
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
