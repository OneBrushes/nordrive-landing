"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useEffect } from "react"

declare global {
  interface Window {
    Tally?: {
      loadEmbeds?: () => void
    }
  }
}

interface TallyFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TallyFormModal({ isOpen, onClose }: TallyFormModalProps) {
  // Bloquear scroll cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Cargar script de Tally si no está cargado
  useEffect(() => {
    if (isOpen) {
      const existingScript = document.querySelector('script[src="https://tally.so/widgets/embed.js"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://tally.so/widgets/embed.js'
        script.async = true
        script.onload = () => {
          // Forzar inicialización de Tally después de cargar el script
          if (window.Tally) {
            window.Tally.loadEmbeds()
          }
        }
        document.body.appendChild(script)
      } else {
        // Si ya existe, forzar reinicialización
        if (window.Tally) {
          window.Tally.loadEmbeds()
        }
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay de fondo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Contenedor del formulario */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-[101] flex items-center justify-center"
          >
            {/* Botón de cierre */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-[102] bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-colors group"
              aria-label="Cerrar formulario"
            >
              <X className="h-6 w-6 text-foreground group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Iframe del formulario Tally */}
            <div className="w-full h-full relative">
              <iframe
                data-tally-src="https://tally.so/r/nrN7dX?transparentBackground=1&formEventsForwarding=1"
                width="100%"
                height="100%"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Bienvenido al formulario oficial de NorDrive"
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none', display: 'block' }}
                allow="clipboard-read; clipboard-write"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

