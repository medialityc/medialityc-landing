import { BenefitsSection } from "@/app/sections/landing/benefits";
import { ContactSection } from "@/app/sections/landing/contact";
import { Hero } from "@/app/sections/landing/hero";
import { TeamSection } from "@/app/sections/landing/team";
import { ProjectsSection } from "@/app/sections/landing/projects";
import { ServicesSection } from "@/app/sections/landing/services";
import { TestimonialsSection } from "@/app/sections/landing/testimonials";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesSection />
      <BenefitsSection />
      <ProjectsSection />
      <TeamSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
