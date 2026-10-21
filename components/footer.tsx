import { withBasePath } from "@/lib/utils"

const NAV = [
  { label: "Beneficios", href: "/#beneficios" },
  { label: "Proceso", href: "/#proceso" },
  { label: "Coches en venta", href: "/coches/" },
  { label: "Testimonios", href: "/#testimonios" },
]

const RESOURCES = [
  { label: "Área de clientes", href: "/clientes/" },
  { label: "Blog del motor", href: "/blog/" },
  { label: "Pide tu coche", href: "/#formulario" },
]

const LEGAL = [{ label: "Política de cookies", href: "/cookies/" }]

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <a href={withBasePath(l.href)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="container mx-auto grid grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:grid-cols-3 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-6">
        <div className="col-span-2 space-y-3 sm:col-span-3 md:col-span-1">
          <a href={withBasePath("/")} className="inline-block" aria-label="NorDrive, inicio">
            <img src={withBasePath("/Logo.png")} alt="NorDrive" className="h-9 w-auto object-contain" />
          </a>
          <p className="max-w-xs text-sm text-muted-foreground">
            Importamos tu coche de Europa por menos de lo que cuesta en España. Búsqueda gratuita, inspección profesional y entrega en España.
          </p>
        </div>
        <Column title="NorDrive" links={NAV} />
        <Column title="Recursos" links={RESOURCES} />
        <Column title="Legal" links={LEGAL} />
      </div>
      <div className="border-t border-border">
        <p className="container mx-auto px-4 py-5 text-center text-xs text-muted-foreground md:px-6">
          © {year} NorDrive. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
