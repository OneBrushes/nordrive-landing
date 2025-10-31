"use client"

import { motion } from "framer-motion"
import { MessageSquare, Search, CheckCircle, Truck } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Cuéntame qué buscas",
    description: "Completa el formulario con el modelo que deseas. Es gratis y sin compromiso.",
  },
  {
    number: "02",
    icon: Search,
    title: "Busco tu coche ideal",
    description: "Investigo el mercado alemán y te presento opciones con fotos, videos e informe técnico.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Apruebas y confirmas",
    description: "Si te gusta el coche, confirmas y viajo a Alemania para inspeccionarlo personalmente.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Entrega en España",
    description: "Compro el coche, lo traigo a España y te lo entrego con toda la documentación.",
  },
]

export function ProcessSection() {
  return (
    <section id="proceso" className="py-12 md:py-24 relative bg-background/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4 text-balance">
            El proceso paso a paso
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Simple, transparente y sin sorpresas
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8 h-full hover:bg-card/70 hover:border-primary/50 transition-all">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-4xl md:text-5xl font-bold text-primary/20 mb-2">{step.number}</div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 md:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-4 md:px-6 py-2 md:py-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Si el coche no te convence, seguimos buscando hasta que lo encuentres
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
