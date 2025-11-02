"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { TallyFormModal } from "@/components/tally-form-modal"

interface TallyModalContextType {
  openModal: () => void
  closeModal: () => void
}

const TallyModalContext = createContext<TallyModalContextType | undefined>(undefined)

export function TallyModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <TallyModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <TallyFormModal isOpen={isOpen} onClose={closeModal} />
    </TallyModalContext.Provider>
  )
}

export function useTallyModal() {
  const context = useContext(TallyModalContext)
  if (!context) {
    throw new Error("useTallyModal must be used within TallyModalProvider")
  }
  return context
}

