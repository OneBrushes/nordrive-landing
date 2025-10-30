"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out
        ${isScrolled
          ? "top-4 w-full max-w-[1200px] rounded-2xl shadow-lg border border-primary/12 backdrop-blur-2xl"
          : "top-0 w-full max-w-full rounded-none shadow-none border-transparent backdrop-blur-0"
        }`}
      style={{
        WebkitBackdropFilter: isScrolled ? 'blur(32px)' : undefined,
        transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
        opacity: isScrolled ? 1 : 0.97
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`flex items-center justify-between transition-all duration-700 ease-in-out ${isScrolled ? "h-16" : "h-20"}`}
        >
          <div className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt="nordrive Logo"
              className={`w-auto object-contain transition-all duration-700 ease-in-out ${isScrolled ? "h-8" : "h-12"}`}
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
            <Button onClick={scrollToForm} className="bg-primary hover:bg-primary/90">
              Empezar ahora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-foreground">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-transparent backdrop-blur-2xl border-t border-primary/10 rounded-2xl shadow-lg mx-2 mt-2"
            style={{ WebkitBackdropFilter: 'blur(32px)', transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.7s cubic-bezier(0.4,0,0.2,1)' }}
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <a
                href="#beneficios"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-foreground hover:text-primary transition-colors py-2"
              >
                Beneficios
              </a>
              <a
                href="#proceso"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-foreground hover:text-primary transition-colors py-2"
              >
                Proceso
              </a>
              <a
                href="#testimonios"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-foreground hover:text-primary transition-colors py-2"
              >
                Testimonios
              </a>
              <Button onClick={scrollToForm} className="w-full bg-primary hover:bg-primary/90">
                Empezar ahora
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
