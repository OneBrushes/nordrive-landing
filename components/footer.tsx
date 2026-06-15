import { Mail, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border py-8 text-center space-y-2">
      <p className="text-sm text-muted-foreground">
        © 2025 nordrive. Todos los derechos reservados.
      </p>
      <div className="text-xs">
        <Link href="/blog" className="text-muted-foreground/50 hover:text-primary transition-colors">
          Blog del motor
        </Link>
      </div>
    </footer>
  )
}
