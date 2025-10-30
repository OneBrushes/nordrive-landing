"use client"

import { motion } from "framer-motion"
import { Search, CheckCircle2, Plane, HandshakeIcon } from "lucide-react"

const benefits = [
  {
    icon: Search,
    title: "Búsqueda gratuita",
    description: "Investigo y busco el coche perfecto para ti sin coste inicial ni compromiso",
  },
  {
    icon: CheckCircle2,
    title: "Inspección in situ",
    description: "Viajo a Alemania para verificar personalmente el estado del vehículo antes de comprarlo",
  },
  {
    icon: Plane,
    title: "Gestión completa",
    description: "Me encargo de toda la documentación, compra, transporte y entrega en España",
  },
  {
    icon: HandshakeIcon,
    title: "Servicio transparente",
    description: "Proceso claro y honesto. Solo pagas si estás satisfecho con el coche encontrado",
  },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-12 md:py-24 relative">
      {/* Subtle blur background */}
      <div className="absolute inset-0 bg-card/30 backdrop-blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4 text-balance">
            Cómo funciona nordrive
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Un servicio personalizado de principio a fin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8 h-full transition-all hover:bg-card/70 hover:border-primary/50 hover:scale-105">
                <div className="mb-4 md:mb-6">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
