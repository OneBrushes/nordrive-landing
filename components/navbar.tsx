"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTallyModal } from "@/contexts/tally-modal-context"
import { withBasePath } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { openModal } = useTallyModal()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFormClick = () => {
    openModal()
    setIsMobileMenuOpen(false)
  }

  // Variants para animación suave del menú móvil
  const panelVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.35, ease: 'easeInOut' as const } },
    open:   { opacity: 1, height: "auto", transition: { duration: 0.45, ease: 'easeInOut' as const } }
  }
  const listVariants = {
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open:   { transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
  }
  const itemVariants = {
    closed: { opacity: 0, y: 8, transition: { duration: 0.25 } },
    open:   { opacity: 1, y: 0, transition: { duration: 0.35 } }
  }

  const showGlass = isScrolled || isMobileMenuOpen

  return (
    <>
      {/* Overlay móvil al abrir menú */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 md:hidden bg-background/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav
        className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out
          ${showGlass
            ? "top-3 md:top-4 w-[calc(100vw-24px)] md:w-full md:max-w-[1200px] rounded-2xl shadow-lg border border-primary/12 backdrop-blur-2xl"
            : "top-0 w-full max-w-full rounded-none shadow-none border-transparent backdrop-blur-0"
          }`}
        style={{
          WebkitBackdropFilter: showGlass ? 'blur(32px)' : undefined,
          transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
          opacity: showGlass ? 1 : 0.97
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div
            className={`flex items-center justify-between transition-all duration-700 ease-in-out ${showGlass ? "h-16" : "h-20"}`}
          >
            <div className="flex items-center gap-3">
              <img
                src={withBasePath("/Logo.png")}
                alt="nordrive Logo"
                className={`w-auto object-contain transition-all duration-700 ease-in-out ${showGlass ? "h-8" : "h-12"}`}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#beneficios" className="text-foreground hover:text-primary transition-colors">
                Beneficios
              </a>
              <a href="#proceso" className="text-foreground hover:text-primary transition-colors">
                Proceso
              </a>
              <a href="#testimonios" className="text-foreground hover:text-primary transition-colors">
                Testimonios
              </a>
              <Button onClick={handleFormClick} className="bg-primary hover:bg-primary/90">
                Empezar ahora
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-foreground z-50">
              {isMobileMenuOpen ? <X className="h-6 w-6 transition-all" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - mismo fondo (transparente+blur), sin fondo distinto */}
        <AnimatePresence initial={false}>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-panel"
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden bg-transparent backdrop-blur-2xl mx-2 mt-2 overflow-hidden z-50"
              style={{ WebkitBackdropFilter: 'blur(32px)' }}
            >
              <motion.div
                className="container mx-auto px-4 py-6 space-y-4"
                variants={listVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.a variants={itemVariants}
                  href="#beneficios"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-foreground hover:text-primary transition-colors py-2"
                >
                  Beneficios
                </motion.a>
                <motion.a variants={itemVariants}
                  href="#proceso"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-foreground hover:text-primary transition-colors py-2"
                >
                  Proceso
                </motion.a>
                <motion.a variants={itemVariants}
                  href="#testimonios"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-foreground hover:text-primary transition-colors py-2"
                >
                  Testimonios
                </motion.a>
                <motion.div variants={itemVariants}>
                  <Button onClick={handleFormClick} className="w-full bg-primary hover:bg-primary/90">
                    Empezar ahora
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
