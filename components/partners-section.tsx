"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

const partners = [
  { name: "TÜV Rheinland", logo: "/tuv.png", url: "https://www.tuv.com/world/en/" },
  { name: "SGS", logo: "/sgs.png", url: "https://www.sgs.es/" },
  { name: "DEKRA", logo: "/dekra.png", url: "https://www.dekra.es/es/" },
]

export function PartnersSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  // Opcional: podrías auto-scroll con useEffect, pero lo dejamos scrollable manual y swipe.
  return (
    <section className="pb-14 pt-10 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-bold text-lg md:text-2xl text-muted-foreground mb-10 uppercase tracking-wide">Colaboradores de confianza</h2>
        <div 
          ref={trackRef}
          className="flex gap-8 overflow-x-auto scrollbar-none scroll-smooth items-center py-5"
          tabIndex={0}
          aria-label="Logos de partners colaboradores"
        >
          {partners.map((p, i) => (
            <motion.a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 280, damping: 17 }}
              className="bg-white px-7 py-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-center h-20 w-[140px] md:w-[190px] hover:shadow-xl focus:outline-primary transition-all cursor-pointer"
              aria-label={`Colaboración con ${p.name}`}
            >
              <img src={p.logo} alt={p.name} className="h-11 w-auto max-w-[130px] grayscale hover:grayscale-0 object-contain transition-all duration-300" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
