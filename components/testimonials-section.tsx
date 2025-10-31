"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Carlos M.",
    location: "Madrid",
    car: "BMW 320d",
    rating: 5,
    text: "Increíble experiencia. Mi BMW llegó en perfectas condiciones y el ahorro fue considerable.",
    image: "/client-with-bmw.jpg",
  },
  {
    name: "Pablo G.",
    location: "Barcelona",
    car: "Audi A4 Avant",
    rating: 5,
    text: "Profesionalidad absoluta. Me mantuvieron informada en todo momento del proceso.",
    image: "/client-with-audi.jpg",
  },
  {
    name: "Miguel R.",
    location: "Valencia",
    car: "Mercedes C220",
    rating: 5,
    text: "La mejor decisión. Calidad alemana a precio justo y sin complicaciones.",
    image: "/client-with-mercedes.jpg",
  },
  {
    name: "Ana P.",
    location: "Sevilla",
    car: "Volkswagen Golf GTI",
    rating: 5,
    text: "Servicio impecable de principio a fin. Totalmente recomendable.",
    image: "/client-with-vw.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-12 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4 text-balance">
            Clientes felices con sus coches
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Historias reales de importaciones exitosas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden transition-all hover:bg-card/70 hover:border-primary/50 hover:scale-[1.02]">
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={`${testimonial.name} con su ${testimonial.car}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-foreground leading-relaxed mb-4 italic">"{testimonial.text}"</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{testimonial.car}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 md:mt-16 text-center"
        >
          <p className="text-base md:text-lg text-muted-foreground mb-4">¿Quieres ser el próximo cliente satisfecho?</p>
          <button
            onClick={() => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" })}
            className="text-primary hover:text-primary/80 font-semibold underline underline-offset-4 transition-colors"
          >
            Empieza tu búsqueda gratuita
          </button>
        </motion.div>
      </div>
    </section>
  )
}
