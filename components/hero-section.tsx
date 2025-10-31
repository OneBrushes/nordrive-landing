"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export function HeroSection() {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" })
  }

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
          let step = Math.max(0.01, 0.5 * Math.pow(remaining / 30, 1.8));
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
          src="/luxury-german-cars-bmw-mercedes-audi-showroom.jpg"
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
            <span className="sm:inline block">Tu coche hasta</span>
            <br className="block sm:hidden" />
            <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
              <motion.span 
                ref={percentRef}
                initial={{ y: 30, opacity: 0 }}
                animate={started ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.45, type: 'spring' }}
                className="inline-block text-primary"
              >
                {percent}%
              </motion.span>
              <span>menos que en España</span>
            </span>
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
              <Button
                size="lg"
                onClick={scrollToForm}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-lg transition-all hover:scale-105"
              >
                Solicita tu coche gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
