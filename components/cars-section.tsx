"use client"

import { motion } from "framer-motion"
import { carsForSale } from "@/content/cars"
import { withBasePath } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTallyModal } from "@/contexts/tally-modal-context"
import { Calendar, Gauge, TrendingDown } from "lucide-react"

export function CarsSection() {
  const { openModal } = useTallyModal()

  return (
    <section id="coches-venta" className="py-16 md:py-24 bg-card/10">
      <div className="container mx-auto px-4">
        
        {/* Encabezado */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-sm font-semibold tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full">
              Oportunidades destacadas
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-foreground"
          >
            Vehículos en Venta
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            Selección de coches revisados y listos para importar. Compáralos con el mercado nacional y descubre cuánto ahorras con nosotros.
          </motion.p>
        </div>

        {/* Grid de Coches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {carsForSale.map((car, index) => {
            const savings = car.spainPrice - car.ourPrice

            return (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col bg-card hover:bg-card/80 border border-border hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl"
              >
                {/* Imagen del coche */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={withBasePath(car.image)}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-green-600/90 text-white font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <TrendingDown className="h-3.5 w-3.5" />
                    Ahorras {savings.toLocaleString("es-ES")} €
                  </div>
                </div>

                {/* Contenido / Detalles */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {car.name}
                    </h3>
                    
                    {/* Año y Kilómetros */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-primary/70" />
                        <span>{car.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="h-4 w-4 text-primary/70" />
                        <span>{car.km.toLocaleString("es-ES")} km</span>
                      </div>
                    </div>
                  </div>

                  {/* Precios */}
                  <div className="bg-card-muted/50 rounded-xl p-3 border border-border/50 space-y-1">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Precio medio en España:</span>
                      <span className="line-through">{car.spainPrice.toLocaleString("es-ES")} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">Nuestro precio:</span>
                      <span className="text-xl font-extrabold text-primary">
                        {car.ourPrice.toLocaleString("es-ES")} €
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={openModal}
                    className="w-full bg-primary/90 hover:bg-primary text-primary-foreground font-medium rounded-xl transition-all"
                  >
                    Solicitar información
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
