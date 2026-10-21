"use client"

// Campo de solo lectura con botón "Copiar" (p. ej. la dirección del feed RSS)
import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("Copia la dirección:", value)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        readOnly
        value={value}
        aria-label={label}
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 font-mono text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
      />
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copied ? "¡Copiado!" : "Copiar"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Dirección copiada" : ""}
      </span>
    </div>
  )
}
