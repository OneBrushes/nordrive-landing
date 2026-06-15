import { Navbar } from "@/components/navbar"
import { CarsSection } from "@/components/cars-section"
import { Footer } from "@/components/footer"
import { StickyCarCTA } from "@/components/sticky-car-cta"

export default function CochesPage() {
  return (
    <main className="min-h-screen pt-20 md:pt-24">
      <Navbar />
      <CarsSection />
      <Footer />
      <StickyCarCTA />
    </main>
  )
}
