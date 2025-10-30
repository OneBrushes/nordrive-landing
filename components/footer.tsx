import { Mail, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border py-8 text-center">
      <p className="text-sm text-muted-foreground">
        © 2025 nordrive. Todos los derechos reservados.
      </p>
    </footer>
  )
}
