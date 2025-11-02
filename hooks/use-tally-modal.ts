"use client"

import { useState, useCallback } from "react"

export function useTallyModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return { isOpen, open, close }
}

