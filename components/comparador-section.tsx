"use client"
import { motion } from "framer-motion"

export function ComparadorSection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-xl mx-auto text-center mb-11"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">¿Cuánto puedes ahorrar?</h2>
          <p className="text-muted-foreground md:text-base">Ejemplo real para un BMW Serie 3 2022</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-4">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.1}} className="bg-card/70 rounded-xl flex flex-col items-center justify-center py-8 px-5 border border-border">
            <span className="text-muted-foreground font-medium">En concesionario España</span>
            <span className="text-3xl font-bold mt-3 mb-2 line-through text-gray-400">38.900 €</span>
          </motion.div>
          <motion.div initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6, delay:0.16}} className="bg-card/90 rounded-xl flex flex-col items-center justify-center py-10 px-5 border border-blue-100 relative shadow-lg">
            <div className="flex w-full justify-center absolute -top-5 left-0 right-0">
              <span className="bg-primary/90 text-white rounded-full px-5 py-2 text-base font-bold shadow text-center">Ahorro real</span>
            </div>
            <span className="text-foreground font-semibold mt-7">Importando con NordDrive</span>
            <span className="text-4xl font-bold mt-4 mb-2 text-primary">34.000 €</span>
          </motion.div>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7, delay:0.23}} className="bg-card/70 rounded-xl flex flex-col items-center justify-center py-8 px-5 border border-border">
            <span className="text-muted-foreground font-medium mb-2">Ahorro típico</span>
            <span className="text-3xl font-bold text-green-600">4.900 €</span>
          </motion.div>
        </div>
        <div className="text-xs text-muted-foreground mt-6 text-center max-w-lg mx-auto">*Datos reales extraídos de operaciones realizadas y precios medios de webs oficiales de concesionarios españoles en 2023. El ahorro puede variar según modelo y condiciones.</div>
      </div>
    </section>
  )
}
