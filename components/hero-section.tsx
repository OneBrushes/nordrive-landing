"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { useTallyModal } from "@/contexts/tally-modal-context"
import { withBasePath } from "@/lib/utils"

export function HeroSection() {
  const { openModal } = useTallyModal()

  // Contador animado de porcentaje con observer
  const [percent, setPercent] = useState(0);
  const [started, setStarted] = useState(false);
  const percentRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (started) return;
    const handleAnimation = () => {
      let i = 0;
      let frame: number;
      function animate() {
        setPercent(Math.min(30, Math.round(i)));
        if (i < 30) {
          const remaining = 30 - i;
          // Frena mucho más al final (más visible)
          let step = Math.max(0.04, 0.5 * Math.pow(remaining / 30, 2));
          i += step;
          frame = requestAnimationFrame(animate);
        }
      }
      animate();
      return () => cancelAnimationFrame(frame);
    };
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
          handleAnimation();
        }
      },
      { threshold: 0.65 }
    );
    if (percentRef.current) observer.observe(percentRef.current);
    return () => {
      if (percentRef.current) observer.unobserve(percentRef.current);
    };
  }, [started]);

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={withBasePath("/luxury-german-cars-bmw-mercedes-audi-showroom.jpg")}
          alt="Luxury German Cars"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6 md:space-y-8"
        >
          <h2 className="text-3xl md:text-6xl font-bold text-foreground leading-tight text-balance">
            {/* Línea 1 móvil / inline desktop */}
            <span className="block sm:inline">Tu coche hasta</span>
            {/* Separador sólo para desktop */}
            <span className="hidden sm:inline"> </span>
            {/* Línea 2 móvil: número + "menos" unidos en una sola línea */}
            <span className="block sm:inline whitespace-nowrap">
              <motion.span 
                ref={percentRef}
                initial={{ y: 30, opacity: 0 }}
                animate={started ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.45, type: 'spring' }}
                className="inline-block text-primary"
              >
                {percent}%
              </motion.span>
              <span> menos</span>
            </span>
            {/* Separador sólo para desktop */}
            <span className="hidden sm:inline"> </span>
            {/* Línea 3 móvil */}
            <span className="block sm:inline">que en España</span>
          </h2>

          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Búsqueda gratuita · Inspección profesional · Entrega en España
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-2 md:pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {
                (() => {
                  const [hover, setHover] = useState(false);
                  const arrowVariants = {
                    hidden: { opacity: 0, x: -32 },
                    enter:  { opacity: 1, x: 0,  transition: { duration: 0.35, ease: 'easeOut' } },
                    exit:   { opacity: 0, x: 28, transition: { duration: 0.25, ease: 'easeIn' } },
                  } as const;
                  return (
                    <Button
                      size="lg"
                      onClick={openModal}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                      className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-lg transition-all hover:scale-105"
                    >
                      <span className="relative z-10">Solicita tu coche gratis</span>
                      <motion.span
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                        variants={arrowVariants}
                        initial="hidden"
                        animate={hover ? "enter" : "exit"}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </Button>
                  );
                })()
              }
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              Sin compromiso · Respuesta en 24h
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
