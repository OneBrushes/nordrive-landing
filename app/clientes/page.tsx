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
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  LogOut, 
  CheckCircle2, 
  Truck, 
  Clock, 
  ChevronRight 
} from "lucide-react"

export default function ClientesPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

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
      { title: "Búsqueda y selección", desc: "Localización del coche ideal y verificación inicial.", date: "12/05/2026", status: "completed" },
      { title: "Inspección mecánica", desc: "Chequeo de 150 puntos en origen por nuestros ingenieros.", date: "18/05/2026", status: "completed" },
      { title: "Compra y papeleo", desc: "Gestión de factura, baja consular y placas temporales.", date: "24/05/2026", status: "completed" },
      { title: "Transporte en camión", desc: "En tránsito hacia el centro logístico en España.", date: "En camino (Est: 18/06)", status: "current" },
      { title: "Matriculación y entrega", desc: "ITV española, pago de impuestos y placas definitivas.", date: "Pendiente", status: "pending" }
    ],
    photos: [
      "/client-with-audi.jpg",
      "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg",
      "/client-with-bmw.jpg"
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
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    Tu <strong className="text-primary">{clientCar.name}</strong> viene de camino.
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

                  <div className="relative pl-6 border-l border-border/80 space-y-8 py-2">
                    {clientCar.steps.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Indicador de estado en la línea */}
                        <span className="absolute -left-[35px] top-1 bg-background flex items-center justify-center rounded-full">
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
                            <h3 className={`font-semibold text-sm md:text-base ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Columna Derecha (Resumen, fotos y documentos) */}
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

              {/* Galería de fotos completa */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border/60 pb-3">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Galería de Inspección y Carga
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {clientCar.photos.map((photo, idx) => (
                    <div 
                      key={idx} 
                      className={`relative h-56 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                        activePhoto === idx ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-primary/45"
                      }`}
                      onClick={() => setActivePhoto(idx)}
                    >
                      <img 
                        src={withBasePath(photo)} 
                        alt={`Inspección ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-full font-medium text-foreground border border-border/40">
                        Foto de Inspección #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  )
}
