"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function LeadFormSection() {
  const handleTallyClick = () => {
    // Replace with your actual Tally form URL
    window.open("https://tally.so")
  }

  return (
    <section id="formulario" className="py-12 md:py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4 text-balance">
              Empieza tu búsqueda gratis
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Sin compromiso · Te respondo en menos de 24 horas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-12 text-center"
          >
            <div className="mb-6 md:mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <ExternalLink className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">Cuéntame qué coche buscas</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Completa un breve formulario para que pueda entender exactamente lo que necesitas. Te haré algunas
                preguntas sobre tu presupuesto, preferencias y plazos.
              </p>
            </div>

            <Button
              onClick={handleTallyClick}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-lg transition-all hover:scale-105"
            >
              Abrir formulario
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-sm text-muted-foreground mt-4 md:mt-6">
              El formulario se abre en una nueva ventana · Solo 2-3 minutos
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
