"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function isInViewport(selector: string) {
  const el = document.getElementById(selector)
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 120
  )
}

export function StickyCarCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handle = () => {
      const heroInView = isInViewport('hero-section')
      const formInView = isInViewport('formulario')
      setShow(!heroInView && !formInView)
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle, { passive: true })
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const tgt = document.getElementById('formulario')
    if (tgt) {
      tgt.scrollIntoView({behavior: 'smooth'})
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="carcta"
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 120 }}
          transition={{ duration: 0.4, type: 'spring', bounce: 0.26 }}
          onClick={handleClick}
          aria-label="Ir al formulario para solicitar tu coche"
          className="fixed z-50 right-6 md:right-10 bottom-7 md:bottom-10 rounded-full bg-primary text-primary-foreground shadow-lg h-16 w-16 flex items-center justify-center hover:scale-105 hover:shadow-2xl hover:shadow-blue-300/60 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-primary/40 focus:z-50"
          tabIndex={0}
          type="button"
          style={{boxShadow: '0 2px 16px #3b82f677'}}
        >
          {/* SVG silueta ultra clara de coche frontal tipo Tesla */}
          <svg width="40" height="28" viewBox="0 0 40 28" fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
            <ellipse cx="10" cy="23" rx="2.6" ry="2.7"/>
            <ellipse cx="30" cy="23" rx="2.6" ry="2.7"/>
            <rect x="7" y="9.5" width="26" height="9" rx="4.7"/>
            <path d="M7 11 Q20 2 33 11"/>
            <rect x="15" y="17" width="10" height="3" rx="1.15"/>
            <ellipse cx="14.2" cy="11" rx="1.25" ry="1.7" fill="white" stroke="none" opacity=".6"/>
            <ellipse cx="25.8" cy="11" rx="1.25" ry="1.7" fill="white" stroke="none" opacity=".6"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
