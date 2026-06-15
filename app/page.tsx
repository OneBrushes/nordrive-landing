import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { ProcessSection } from "@/components/process-section"
import { ComparadorSection } from "@/components/comparador-section"
// import { SuccessStoriesSection } from "@/components/success-stories-section"
import { LeadFormSection } from "@/components/lead-form-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { TeamSection } from "@/components/team-section"
// import { PartnersSection } from "@/components/partners-section"
import { Footer } from "@/components/footer"
import { StickyCarCTA } from "@/components/sticky-car-cta"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <ProcessSection />
      <ComparadorSection />
      {/* <SuccessStoriesSection /> */}
      <LeadFormSection />
      <TestimonialsSection />
      <TeamSection />
      {/* <PartnersSection /> */}
      <Footer />
      <StickyCarCTA />
    </main>
  )
}
