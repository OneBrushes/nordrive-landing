"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { withBasePath } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"
import { Wrench, Settings, AlertTriangle, ArrowLeft } from "lucide-react"

export default function ClientesPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between pt-24 bg-gradient-to-b from-background via-card/20 to-background overflow-hidden relative">
      <Navbar />

      {/* Elementos flotantes decorativos animados */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: 360,
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-10 md:left-24 text-primary/10"
        >
          <Settings className="h-24 w-24 md:h-36 md:w-36" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: -360,
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-10 md:right-24 text-primary/10"
        >
          <Settings className="h-32 w-32 md:h-44 md:w-44" />
        </motion.div>
      </div>

      {/* Contenedor Principal */}
      <div className="flex-grow flex items-center justify-center container mx-auto px-4 py-12 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-2xl w-full bg-card/60 backdrop-blur-xl border border-primary/15 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Luz de fondo suave */}
          <div className="absolute -top-20 -left-20 w-44 h-44 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-primary/25 rounded-full blur-3xl" />

          {/* Iconos animados superiores */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="bg-primary/10 p-4 rounded-2xl text-primary border border-primary/20"
            >
              <Wrench className="h-8 w-8" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="bg-primary/5 p-3 rounded-2xl text-primary/80 border border-primary/10"
            >
              <Settings className="h-6 w-6" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="bg-amber-500/10 p-3 rounded-2xl text-amber-500 border border-amber-500/20"
            >
              <AlertTriangle className="h-6 w-6" />
            </motion.div>
          </div>

          {/* Textos */}
          <div className="space-y-4 mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
              ¡Zona bajo el capó!
            </h1>
            <h2 className="text-lg md:text-xl font-semibold text-primary/85 uppercase tracking-wide">
              Área de Clientes en Desarrollo
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto">
              Nuestros mecánicos de software y ingenieros digitales están poniendo a punto esta sección para que pronto puedas seguir la importación de tu coche en tiempo real. ¡Disculpa las salpicaduras de grasa digital en el código! 🧑‍💻⚙️
            </p>
          </div>

          {/* Progreso ficticio animado */}
          <div className="max-w-xs mx-auto mb-10 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Calentando motores...</span>
              <span>10% listo</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "10%" }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              />
            </div>
          </div>

          {/* Botón Volver */}
          <Link href={withBasePath("/")} className="inline-block">
            <Button className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-5 rounded-xl transition-all shadow-md hover:scale-105 inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al taller principal
            </Button>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
