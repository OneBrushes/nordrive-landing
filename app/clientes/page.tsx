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
  ClipboardList,
  Compass,
  Navigation,
  Info
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

  // Estado para abrir el sub-detalle de los 150 puntos (Categorías)
  const [selectedSubCatIdx, setSelectedSubCatIdx] = useState<number | null>(null)

  // Datos del coche simulado del cliente (incluyendo variables que el panel de administración podrá modificar)
  const clientCar = {
    name: "Audi A4 Avant S-Line 2.0 TFSI",
    year: 2019,
    km: "78.000 km",
    color: "Gris Daytona Metalizado",
    origin: "Frankfurt, Alemania",
    destination: "Madrid, España",
    status: "En transporte",
    
    // Variables dinámicas del transporte (Configurables desde el panel de control del administrador)
    transportMode: "conduciendo", // "camion" (por carretera en camión) o "conduciendo" (pilotado en persona)
    currentLocation: "Burdeos, Francia", // Dónde está actualmente el coche
    routeProgress: 60, // Porcentaje de progreso del viaje (0 a 100)
    routeCities: [
      { name: "Frankfurt", label: "Origen", status: "passed" },
      { name: "Estrasburgo", label: "Control", status: "passed" },
      { name: "Burdeos", label: "Actual", status: "current" },
      { name: "San Sebastián", label: "Aduana", status: "pending" },
      { name: "Madrid", label: "Destino", status: "pending" }
    ],

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
          isInspection: true,
          categories: [
            {
              name: "Motor y Transmisión",
              status: "Perfecto",
              image: "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg",
              checkedCount: 45,
              points: [
                { name: "Estanqueidad de aceite y refrigerante", value: "Sin fugas detectadas" },
                { name: "Sonido y vibraciones en frío/caliente", value: "Normal / Suave" },
                { name: "Rendimiento del turbo y empuje", value: "Óptimo" },
                { name: "Estado de correa auxiliar y poleas", value: "Excelente estado" },
                { name: "Nivel de compresión de cilindros", value: "Valores óptimos" },
                { name: "Caja de cambios S-Tronic", value: "Transición suave de marchas" },
                { name: "Embrague y tracción Quattro", value: "Respuesta inmediata" },
                { name: "Presión del sistema de inyección", value: "Correcta" }
              ]
            },
            {
              name: "Carrocería y Chasis",
              status: "Verificado original",
              image: "/client-with-audi.jpg",
              checkedCount: 40,
              points: [
                { name: "Ausencia de daños estructurales", value: "Estructura 100% íntegra" },
                { name: "Alineación de capó, puertas y portón", value: "Perfecto ajuste" },
                { name: "Medición espesor de pintura (Micras)", value: "110-125µm (Pintura de origen)" },
                { name: "Ausencia de óxido en bajos", value: "Verificado (Libre de óxido)" },
                { name: "Llantas y neumáticos delanteros", value: "Neumáticos al 80%" },
                { name: "Amortiguadores y fuelles de dirección", value: "Sin pérdidas ni holguras" },
                { name: "Pastillas y discos de freno", value: "Mitad de vida útil restante" }
              ]
            },
            {
              name: "Interior y Electrónica",
              status: "Excelente",
              image: "/client-with-bmw.jpg",
              checkedCount: 35,
              points: [
                { name: "Diagnosis OBD centralita general", value: "0 códigos de error" },
                { name: "Estado del tapizado de cuero S-Line", value: "Sin grietas ni desgaste" },
                { name: "Funcionamiento del climatizador bi-zona", value: "Correcto" },
                { name: "Audi Virtual Cockpit y pantalla MMI", value: "Perfecto estado" },
                { name: "Asistentes a la conducción (ADAS)", value: "Calibrados y funcionando" },
                { name: "Sistema de sonido y conectividad", value: "Verificado" },
                { name: "Techo solar panorámico", value: "Desplazamiento fluido y estanco" }
              ]
            },
            {
              name: "Prueba de Conducción",
              status: "Aprobado",
              image: "/client-with-mercedes.jpg",
              checkedCount: 30,
              points: [
                { name: "Arranque en frío inmediato", value: "Batería al 95%" },
                { name: "Estabilidad en autopista (Autobahn)", value: "Estable a 150 km/h" },
                { name: "Frenada lineal sin desviaciones", value: "Correcta" },
                { name: "Guiado y precisión de dirección", value: "Excelente respuesta" },
                { name: "Ausencia de ruidos de rodadura", value: "Insonorización correcta" },
                { name: "Respuesta del modo Dynamic", value: "Cambio de carácter inmediato" }
              ]
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
          summary: "Formalización del contrato de compraventa con IVA deducible alemán (MwSt. 19%). Obtención de placas de tránsito temporales para el traslado legal y seguro a todo riesgo internacional.",
          bullets: [
            "Contrato de compra internacional firmado",
            "Baja en registro alemán (Zulassungsstelle) tramitada",
            "Certificado de Conformidad Europeo (COC) verificado"
          ]
        }
      },
      { 
        title: "Transporte y Ruta", 
        desc: "Traslado en curso del coche hacia España.", 
        date: "En tránsito", 
        status: "current",
        details: {
          summary: "El coche se encuentra actualmente en la fase de traslado físico hacia nuestro taller en Madrid, España.",
          isRoute: true,
          bullets: []
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
    setSelectedSubCatIdx(null)
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
                    Tu <strong className="text-primary">{clientCar.name}</strong> se encuentra actualmente: <span className="font-semibold text-primary">{clientCar.status}</span>.
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
                    💡 <strong>Haz clic en cualquier fase</strong> de la línea de tiempo para ver los detalles del reporte, mapa de ruta en tiempo real o la hoja de inspección de 150 puntos.
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
                              {step.status === "current" && clientCar.transportMode === "conduciendo" ? "Conduciendo" : step.date}
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
                  <p className="text-xs text-muted-foreground">Reporte fotográfico de inspección y carga.</p>
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
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
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
              className="relative w-full max-w-3xl bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
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
                <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
                  {clientCar.steps[selectedStepIdx].title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Fase finalizada el: <strong>{clientCar.steps[selectedStepIdx].date}</strong>
                </p>
              </div>

              {/* Contenido */}
              <div className="space-y-6">
                
                {/* --- CASO RUTAS Y LOCALIZACIÓN EN TRANSPORTE --- */}
                {clientCar.steps[selectedStepIdx].details.isRoute ? (
                  <div className="space-y-6">
                    {/* Modo de transporte */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted/40 rounded-2xl border border-border/40 gap-4">
                      <div className="flex items-center gap-3">
                        {clientCar.transportMode === "conduciendo" ? (
                          <div className="bg-primary/10 text-primary p-3 rounded-xl border border-primary/20 animate-pulse">
                            <Compass className="h-6 w-6" />
                          </div>
                        ) : (
                          <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl border border-blue-500/20">
                            <Truck className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm">
                            {clientCar.transportMode === "conduciendo" ? "Modo: Pilotado en persona" : "Modo: Camión Portacoches"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {clientCar.transportMode === "conduciendo" ? "Guillermo va conduciendo tu coche hacia España." : "El coche se traslada en transporte logístico pesado."}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Ubicación actual:</span>
                        <p className="text-sm font-bold text-primary flex items-center justify-end gap-1">
                          <MapPin className="h-4 w-4 text-red-500 animate-bounce" />
                          {clientCar.currentLocation}
                        </p>
                      </div>
                    </div>

                    {/* Ruta de ciudades simulada interactiva */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ruta de importación en tiempo real:</h4>
                      
                      {/* Línea horizontal en desktop / vertical en móvil */}
                      <div className="flex flex-col md:flex-row justify-between items-center relative py-6 gap-6 md:gap-2">
                        {/* Línea gris de fondo */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 hidden md:block" />
                        
                        {/* Línea de progreso coloreada */}
                        <div 
                          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 hidden md:block transition-all duration-700" 
                          style={{ width: `${clientCar.routeProgress}%` }}
                        />

                        {clientCar.routeCities.map((city, cIdx) => (
                          <div key={cIdx} className="flex flex-row md:flex-col items-center gap-3 md:gap-2 z-10 w-full md:w-auto relative">
                            {/* Círculo indicador */}
                            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              city.status === "passed" ? "bg-green-500 border-green-600 text-white" :
                              city.status === "current" ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 scale-110" :
                              "bg-background border-border text-muted-foreground"
                            }`}>
                              {city.status === "passed" && <Check className="h-4 w-4" />}
                              {city.status === "current" && <Navigation className="h-4 w-4 rotate-45 animate-pulse" />}
                              {city.status === "pending" && <span className="text-[10px]">{cIdx + 1}</span>}
                            </div>

                            {/* Textos de la ciudad */}
                            <div className="text-left md:text-center">
                              <p className={`text-xs font-bold ${city.status === "current" ? "text-primary text-sm" : "text-foreground"}`}>{city.name}</p>
                              <p className="text-[9px] text-muted-foreground uppercase">{city.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nota aclaratoria */}
                    <div className="text-xs text-muted-foreground flex gap-1.5 p-3 bg-muted/30 border border-border/40 rounded-xl">
                      <Info className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                      <span>El sistema actualiza la ubicación mediante geolocalización satelital cuando el coche está en marcha.</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 border border-border/40 p-4 rounded-2xl">
                    <p className="text-sm text-foreground leading-relaxed">
                      {clientCar.steps[selectedStepIdx].details.summary}
                    </p>
                  </div>
                )}

                {/* --- CASO 1: REPORTE DE INSPECCIÓN MECÁNICA DE 150 PUNTOS --- */}
                {clientCar.steps[selectedStepIdx].details.isInspection && (
                  <div className="space-y-6">
                    <div className="border-b border-border/60 pb-2">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                        <ClipboardList className="h-4 w-4" />
                        Desglose del Reporte Técnico (150 Puntos)
                      </h3>
                      <p className="text-[10px] text-muted-foreground">Haz clic en cualquiera de las 4 categorías para abrir el desglose de comprobaciones y fotos.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientCar.steps[selectedStepIdx].details.categories?.map((cat, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedSubCatIdx(idx)}
                          className="bg-card border border-border hover:border-primary/40 rounded-2xl p-4 transition-all shadow-sm space-y-4 flex flex-col justify-between cursor-pointer group hover:bg-muted/20"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{cat.name}</h4>
                              <span className="text-[10px] bg-green-500/10 text-green-600 font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check className="h-3 w-3" />
                                {cat.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Puntos de control: {cat.checkedCount} (Verificados OK)</p>
                          </div>

                          {/* Foto adjunta de la categoría */}
                          <div className="space-y-2 pt-1">
                            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-muted border border-border/40">
                              <img 
                                src={withBasePath(cat.image)} 
                                alt={cat.name} 
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                              />
                            </div>
                            <span className="text-[10px] text-primary group-hover:underline flex items-center gap-0.5 justify-end font-semibold">
                              Abrir reporte detallado <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caso 2: Reporte estándar con listado de hitos (Bullets) */}
                {!clientCar.steps[selectedStepIdx].details.isInspection && !clientCar.steps[selectedStepIdx].details.isRoute && (
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
                  Cerrar fase
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SUB-MODAL: DETALLES DE COMPROBACIONES DE LOS 150 PUNTOS (MOTOR, CARROCERÍA, ETC.) --- */}
      <AnimatePresence>
        {selectedSubCatIdx !== null && selectedStepIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo oscuro traslúcido */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubCatIdx(null)}
              className="absolute inset-0 bg-background/70 backdrop-blur-md"
            />

            {/* Tarjeta de información del sub-detalle */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
            >
              {/* Botón de cerrar */}
              <button 
                onClick={() => setSelectedSubCatIdx(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Cabecera */}
              <div className="space-y-1.5 border-b border-border pb-4 mb-6">
                <span className="text-primary text-[10px] uppercase font-bold tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
                  Reporte técnico detallado
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  Comprobaciones de {clientCar.steps[selectedStepIdx].details.categories[selectedSubCatIdx].name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Inspección física independiente · <strong>100% Verificado</strong>
                </p>
              </div>

              {/* Foto grande adjunta */}
              <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-muted border border-border mb-6">
                <img 
                  src={withBasePath(clientCar.steps[selectedStepIdx].details.categories[selectedSubCatIdx].image)} 
                  alt="Inspección en origen" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Estado: {clientCar.steps[selectedStepIdx].details.categories[selectedSubCatIdx].status}
                </div>
              </div>

              {/* Listado detallado de puntos */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Puntos del checklist inspeccionados:</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clientCar.steps[selectedStepIdx].details.categories[selectedSubCatIdx].points.map((p, pIdx) => (
                    <div key={pIdx} className="flex justify-between items-center p-3 bg-muted/40 border border-border/40 rounded-xl">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <span className="h-4.5 w-4.5 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center font-bold text-xs flex-shrink-0">✓</span>
                        <span className="text-xs text-foreground font-medium truncate">{p.name}</span>
                      </div>
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                        {p.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pie del modal */}
              <div className="mt-8 border-t border-border pt-4 flex justify-end">
                <Button 
                  onClick={() => setSelectedSubCatIdx(null)}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 rounded-xl"
                >
                  Volver al informe general
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
