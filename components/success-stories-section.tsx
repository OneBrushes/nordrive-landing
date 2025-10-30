"use client"

import { motion } from "framer-motion"

const stories = [
  {
    cliente: "Carlos M.",
    ciudad: "Valencia",
    modelo: "BMW Serie 3 Touring",
    pasos: [
      {
        label: "1. Definición",
        desc: "Carlos buscaba una berlina familiar seminueva. Definimos juntos el modelo y presupuesto perfecto.",
        img: "/client-with-bmw.jpg"
      },
      {
        label: "2. Búsqueda y verificación",
        desc: "Encontramos dos opciones top en Alemania y le mostramos los informes técnicos e imágenes en detalle.",
        img: "/luxury-german-cars-bmw-mercedes-audi-showroom.jpg"
      },
      {
        label: "3. Entrega y felicidad",
        desc: "Entrega del coche en Valencia, con toda la documentación y garantía. Carlos ahorró 4.800 €.",
        img: "/client-with-bmw.jpg"
      },
    ]
  },
  {
    cliente: "Laura G.",
    ciudad: "Madrid",
    modelo: "Audi Q3 S-Line",
    pasos: [
      {
        label: "1. Asesoría personalizada",
        desc: "Descubrimos sus preferencias y necesidades específicas para un SUV premium compacto.",
        img: "/client-with-audi.jpg"
      },
      {
        label: "2. Verificación en Alemania",
        desc: "Inspección presencial antes de comprar, con test de conducción y revisión TÜV.",
        img: "/tuv.png"
      },
      {
        label: "3. Entrega y sorpresa",
        desc: "Laura recibió su Audi listo para circular en Madrid y con seguimiento postventa.",
        img: "/client-with-audi.jpg"
      },
    ]
  }
]

export function SuccessStoriesSection() {
  return (
    <section className="py-12 md:py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.57 }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Casos de éxito reales</h2>
          <p className="text-muted-foreground md:text-base">Así ayudamos a nuestros clientes, paso a paso</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-8">
          {stories.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.91 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx*0.13 }}
              className="bg-card/40 rounded-2xl shadow-lg border border-border backdrop-blur-xl max-w-md w-full px-0 py-7"
            >
              <div className="flex flex-col items-center mb-3 mt-1">
                <img src={s.pasos[0].img} alt={s.cliente} className="w-20 h-20 rounded-full object-cover border-2 border-primary mb-2" />
                <div className="font-bold text-lg text-primary">{s.cliente}</div>
                <div className="font-medium text-muted-foreground">{s.ciudad} – {s.modelo}</div>
              </div>
              <div className="flex flex-col gap-5 px-6 mt-4">
                {s.pasos.map((p, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <img src={p.img} alt={p.label} className="w-14 h-14 rounded-xl object-cover border border-border" />
                    <div>
                      <div className="font-semibold text-foreground mb-1">{p.label}</div>
                      <div className="text-muted-foreground text-sm">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
