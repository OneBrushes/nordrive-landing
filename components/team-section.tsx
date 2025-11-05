"use client"

import { motion } from "framer-motion"

const team = [
  {
    name: "Guillermo Fabregat",
    role: "Fundador e Importador",
    desc: "Ingeniero Mecánico y Especialista en Importación de Vehículos. Con un nivel C1 de Alemán. Más de 5 años analizando el mercado de importación de vehículos en España.",
    image: "/fotoperfilguille.webp"
  },
  ]

export function TeamSection() {
  return (
    <section id="equipo" className="py-12 md:py-20 relative bg-card/20 backdrop-blur-2xl">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4 text-balance">
            Nuestro equipo
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Personas reales detrás de la importación, a tu lado en cada paso
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-8 justify-center">
          {team.map((persona, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx*0.08 }}
              className="bg-card/50 rounded-2xl shadow-lg border border-border backdrop-blur-lg p-7 md:p-9 max-w-xs w-full flex flex-col items-center text-center hover:scale-[1.03] hover:shadow-2xl transition-all"
            >
              <img src={persona.image} className="w-24 h-24 mb-5 rounded-full object-cover border-2 border-primary shadow-md" alt={persona.name} />
              <div className="font-semibold text-lg text-foreground">{persona.name}</div>
              <div className="font-medium text-primary mb-2">{persona.role}</div>
              <div className="text-muted-foreground text-sm">{persona.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
