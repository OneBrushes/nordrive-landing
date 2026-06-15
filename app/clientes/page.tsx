"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { withBasePath } from "@/lib/utils"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Lock, 
  User, 
  Car, 
  MapPin, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  LogOut, 
  CheckCircle2, 
  Truck, 
  Clock, 
  ChevronRight,
  X,
  ShieldCheck,
  Search,
  Check,
  ClipboardList
} from "lucide-react"

export default function ClientesPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // Estado para el visor de fotos (Foto destacada)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)

  // Estado para abrir la tarjeta de detalle de cada paso
  const [selectedStepIdx, setSelectedStepIdx] = useState<number | null>(null)

  // Datos simulados del coche del cliente
  const clientCar = {
    name: "Audi A4 Avant S-Line 2.0 TFSI",
    year: 2019,
    km: "78.000 km",
    color: "Gris Daytona Metalizado",
    origin: "Frankfurt, Alemania",
    destination: "Madrid, España",
    status: "En transporte",
    steps: [
      { 
        title: "Búsqueda y selección", 
        desc: "Localización del coche ideal y verificación inicial.", 
        date: "12/05/2026", 
        status: "completed",
        details: {
          summary: "Filtramos más de 14 opciones en portales oficiales alemanes hasta dar con esta unidad en concesionario Audi oficial de Frankfurt. Cuenta con un solo propietario, libro de mantenimiento al día y libre de accidentes.",
          bullets: [
            "Concesionario: Audi Zentrum Frankfurt",
            "Garantía oficial: 12 meses incluida",
            "Revisiones previas: Todas pasadas en taller oficial Audi"
          ]
        }
      },
      { 
        title: "Inspección mecánica (150 puntos)", 
        desc: "Chequeo de 150 puntos en origen por nuestros ingenieros.", 
        date: "18/05/2026", 
        status: "completed",
        details: {
          summary: "Inspección física realizada por nuestro ingeniero en Frankfurt. Se verificó el espesor de la pintura (sin repintados significativos), se realizó diagnóstico OBD completo libre de fallos y prueba dinámica en carretera (Autobahn).",
          isInspection: true, // Indicador especial para renderizar los 150 puntos detallados
          categories: [
            {
              name: "Motor y Transmisión",
              status: "Perfecto",
              points: ["Estanqueidad de aceite y refrigerante", "Sonido y vibraciones en frío/caliente", "Rendimiento del turbo y embrague", "Estado de correa y tensores"],
              image: "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg",
              checkedCount: 45
            },
            {
              name: "Carrocería y Chasis",
              status: "Perfecto (Verificado espesor pintura)",
              points: ["Ausencia de daños estructurales", "Alineación de capó y puertas", "Estado de bajos / Óxido (cero óxido)", "Llantas y frenos (pastillas al 80%)"],
              image: "/client-with-audi.jpg",
              checkedCount: 40
            },
            {
              name: "Interior y Electrónica",
              status: "Excelente",
              points: ["Diagnosis de centralitas OBD (0 fallos)", "Desgaste de cuero y molduras", "Funcionamiento del climatizador y MMI", "Todos los asistentes ADAS activos"],
              image: "/client-with-bmw.jpg",
              checkedCount: 35
            },
            {
              name: "Prueba de Conducción",
              status: "Sobresaliente",
              points: ["Frenada de emergencia lineal", "Comportamiento de la suspensión", "Ausencia de ruidos aerodinámicos", "Dirección centrada y precisa"],
              image: "/client-with-mercedes.jpg",
              checkedCount: 30
            }
          ]
        }
      },
      { 
        title: "Compra y papeleo", 
        desc: "Gestión de factura, baja consular y placas temporales.", 
        date: "24/05/2026", 
        status: "completed",
        details: {
          summary: "Formalización del contrato de compraventa con IVA deducible alemán (MwSt. 19%). Obtención de placas de tránsito amarillas para el traslado legal y seguro a todo riesgo internacional.",
          bullets: [
            "Contrato de compra internacional firmado",
            "Baja en registro alemán (Zulassungsstelle) tramitada",
            "Certificado de Conformidad Europeo (COC) verificado"
          ]
        }
      },
      { 
        title: "Transporte en camión", 
        desc: "En tránsito hacia el centro logístico en España.", 
        date: "En camino (Est: 18/06)", 
        status: "current",
        details: {
          summary: "Cargado en camión portacoches cerrado. Actualmente cruzando la frontera de Francia con destino a Madrid. Transporte monitorizado e incluye seguro de carga completa de hasta 150.000€.",
          bullets: [
            "Transportista: EuroLogistics Trans",
            "Ubicación actual: Lyon, Francia",
            "Fecha estimada de llegada: 18 de Junio de 2026"
          ]
        }
      },
      { 
        title: "Matriculación y entrega", 
        desc: "ITV española, pago de impuestos y placas definitivas.", 
        date: "Pendiente", 
        status: "pending",
        details: {
          summary: "Pasos finales una vez el vehículo llegue a las instalaciones de NorDrive en Madrid. Prepararemos el expediente completo para la homologación nacional y matriculación.",
          bullets: [
            "Cita previa ITV ya reservada",
            "Cálculo del Impuesto de Matriculación (Modelo 576) pre-aprobado",
            "Detallado y limpieza exterior/interior pre-entrega incluido"
          ]
        }
      }
    ],
    photos: [
      "/client-with-audi.jpg",
      "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg",
      "/client-with-bmw.jpg",
      "/client-with-mercedes.jpg"
    ],
    documents: [
      { name: "Contrato de Gestión de Importación.pdf", size: "1.2 MB" },
      { name: "Informe de Inspección Técnica 150 Puntos.pdf", size: "4.8 MB" },
      { name: "Ficha Técnica Alemana (Fahrzeugbrief).pdf", size: "850 KB" }
    ]
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim().toLowerCase() === "admin" && password === "admin") {
      setIsLoggedIn(true)
      setError("")
    } else {
      setError("Usuario o contraseña incorrectos. Usa 'admin' / 'admin'.")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
    setPassword("")
    setSelectedStepIdx(null)
  }

  return (
    <main className="min-h-screen flex flex-col justify-between pt-24 bg-gradient-to-b from-background via-card/10 to-background overflow-hidden relative">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8 md:py-16 relative z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            
            /* --- PANTALLA DE LOGIN --- */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md bg-card border border-border/70 rounded-3xl p-8 shadow-2xl relative"
            >
              <div className="text-center space-y-2 mb-8">
                <span className="text-primary text-xs font-semibold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                  Área Privada de Clientes
                </span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sigue tu importación</h1>
                <p className="text-muted-foreground text-xs">
                  Introduce tus credenciales para ver el estado de tu coche.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Escribe 'admin'"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Escribe 'admin'"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-destructive font-medium text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-6 rounded-xl font-medium shadow">
                  Entrar a mi portal
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-[11px] text-muted-foreground/80">
                  Demo local: utiliza <strong>admin</strong> como usuario y contraseña.
                </p>
              </div>
            </motion.div>
          ) : (
            
            /* --- DASHBOARD CLIENTE LOGUEADO --- */
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
                <div className="space-y-1">
                  <h1 className="text-xl md:text-2xl font-extrabold text-foreground">¡Hola, Guillermo! 👋</h1>
                  <p className="text-sm text-muted-foreground">
                    Tu <strong className="text-primary">{clientCar.name}</strong> viene de camino de forma segura.
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl gap-2 font-medium self-end sm:self-auto"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Cerrar sesión
                </Button>
              </div>

              {/* Grid Principal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Columna Izquierda (Seguimiento / Timeline) */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-4">
                    <Truck className="h-5 w-5 text-primary animate-pulse" />
                    <h2 className="text-lg font-bold">Estado del Transporte y Gestiones</h2>
                  </div>
                  
                  <p className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10">
                    💡 <strong>Haz clic en cualquier fase</strong> de la línea de tiempo para ver los detalles del reporte, datos técnicos o la hoja de inspección.
                  </p>

                  <div className="relative pl-6 border-l border-border/85 space-y-8 py-2">
                    {clientCar.steps.map((step, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedStepIdx(idx)}
                        className="relative group cursor-pointer hover:bg-muted/30 p-3 rounded-xl transition-all border border-transparent hover:border-border/60"
                      >
                        {/* Indicador de estado en la línea */}
                        <span className="absolute -left-[35px] top-[18px] bg-background flex items-center justify-center rounded-full">
                          {step.status === "completed" && (
                            <CheckCircle2 className="h-6 w-6 text-green-500 bg-background rounded-full" />
                          )}
                          {step.status === "current" && (
                            <div className="h-6 w-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-ping" />
                          )}
                          {step.status === "current" && (
                            <Truck className="h-4.5 w-4.5 text-primary absolute bg-background p-0.5 rounded" />
                          )}
                          {step.status === "pending" && (
                            <Clock className="h-5.5 w-5.5 text-muted-foreground/60 bg-background rounded-full" />
                          )}
                        </span>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`font-semibold text-sm md:text-base ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"} group-hover:text-primary transition-colors`}>
                              {step.title}
                            </h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              step.status === "completed" ? "bg-green-500/10 text-green-600" :
                              step.status === "current" ? "bg-primary/10 text-primary" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {step.date}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{step.desc}</p>
                          <span className="text-[10px] text-primary/70 group-hover:underline flex items-center gap-0.5 mt-1 font-medium">
                            Ver reporte completo <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <div className="flex justify-between py-1 border-b border-border/20">
                        <span className="text-muted-foreground">Modelo</span>
                        <span className="font-semibold">{clientCar.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/20">
                        <span className="text-muted-foreground">Año</span>
                        <span className="font-semibold">{clientCar.year}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/20">
                        <span className="text-muted-foreground">Kilometraje</span>
                        <span className="font-semibold">{clientCar.km}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/20">
                        <span className="text-muted-foreground">Color</span>
                        <span className="font-semibold">{clientCar.color}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/20">
                        <span className="text-muted-foreground">Origen</span>
                        <span className="font-semibold flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 text-red-500" />
                          {clientCar.origin}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documentación */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border/60 pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      Documentación
                    </h2>
                    
                    <div className="space-y-2">
                      {clientCar.documents.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 bg-muted/30 hover:bg-muted/60 border border-border/40 rounded-xl transition-all">
                          <div className="space-y-0.5 max-w-[80%]">
                            <p className="text-xs font-semibold truncate text-foreground">{doc.name}</p>
                            <p className="text-[10px] text-muted-foreground">{doc.size}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-lg text-xs p-2 h-8">
                            Ver
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Visor de Galería de Fotos del Coche */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
                <div className="border-b border-border/60 pb-3">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Fotos Principales del Coche
                  </h2>
                  <p className="text-xs text-muted-foreground">Inspección de entrega y carga en Frankfurt.</p>
                </div>

                {/* Contenedor del visor interactivo */}
                <div className="space-y-4">
                  {/* Foto destacada grande */}
                  <div className="relative w-full h-[320px] md:h-[480px] rounded-2xl overflow-hidden bg-muted border border-border">
                    <img 
                      src={withBasePath(clientCar.photos[activePhotoIdx])} 
                      alt="Vista principal coche" 
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-xs px-3 py-1.5 rounded-xl font-semibold border border-border/40 flex items-center gap-2 shadow-sm text-foreground">
                      <Car className="h-4 w-4 text-primary" />
                      Foto #{activePhotoIdx + 1}
                    </div>
                  </div>

                  {/* Fila de miniaturas seleccionables */}
                  <div className="grid grid-cols-4 gap-3">
                    {clientCar.photos.map((photo, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`relative h-20 md:h-28 rounded-xl overflow-hidden border transition-all ${
                          activePhotoIdx === idx 
                            ? "border-primary ring-2 ring-primary/20 scale-[0.98]" 
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <img 
                          src={withBasePath(photo)} 
                          alt={`Miniatura ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MODAL DETALLE DE CADA PASO / REPORTE DE INSPECCIÓN --- */}
      <AnimatePresence>
        {selectedStepIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo oscuro traslúcido */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStepIdx(null)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />

            {/* Tarjeta de información */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-3xl bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Botón de cerrar */}
              <button 
                onClick={() => setSelectedStepIdx(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Cabecera del modal */}
              <div className="space-y-1.5 border-b border-border pb-4 mb-6">
                <span className="text-primary text-[10px] uppercase font-bold tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
                  Reporte del estado
                </span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                  {clientCar.steps[selectedStepIdx].title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Fase finalizada el: <strong>{clientCar.steps[selectedStepIdx].date}</strong>
                </p>
              </div>

              {/* Contenido */}
              <div className="space-y-6">
                <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl">
                  <p className="text-sm text-foreground leading-relaxed">
                    {clientCar.steps[selectedStepIdx].details.summary}
                  </p>
                </div>

                {/* Caso 1: Reporte de Inspección Mecánica de 150 Puntos */}
                {clientCar.steps[selectedStepIdx].details.isInspection ? (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                      <ClipboardList className="h-4 w-4" />
                      Desglose del Reporte Técnico (150 Puntos)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientCar.steps[selectedStepIdx].details.categories?.map((cat, idx) => (
                        <div key={idx} className="bg-card border border-border hover:border-primary/25 rounded-2xl p-4 transition-all shadow-sm space-y-4 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-foreground">{cat.name}</h4>
                              <span className="text-[10px] bg-green-500/10 text-green-600 font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check className="h-3 w-3" />
                                {cat.status}
                              </span>
                            </div>

                            <ul className="space-y-1 text-xs text-muted-foreground pl-1">
                              {cat.points.map((p, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-1">
                                  <span className="text-green-500 font-bold">✓</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Foto adjunta de la categoría */}
                          <div className="space-y-2 pt-2">
                            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-muted border border-border/40">
                              <img 
                                src={withBasePath(cat.image)} 
                                alt={cat.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                              <span>Total puntos inspeccionados:</span>
                              <span className="font-bold text-foreground">{cat.checkedCount} puntos</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Caso 2: Reporte estándar con listado de hitos (Bullets) */
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Hitos clave de la fase
                    </h3>
                    <ul className="space-y-2.5">
                      {clientCar.steps[selectedStepIdx].details.bullets?.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm">
                          <span className="flex-shrink-0 h-5 w-5 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                            ✓
                          </span>
                          <span className="text-muted-foreground">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Pie del modal */}
              <div className="mt-8 border-t border-border pt-4 flex justify-end">
                <Button 
                  onClick={() => setSelectedStepIdx(null)}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 rounded-xl"
                >
                  Entendido
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
