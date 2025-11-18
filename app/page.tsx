"use client";
import { BenefitsSection } from "@/app/sections/landing/benefits";
import { ContactSection } from "@/app/sections/landing/contact";
import { GL } from "@/components/gl";
import { Hero } from "@/app/sections/landing/hero";
import { TeamSection } from "@/app/sections/landing/team";
import { ProjectsSection } from "@/app/sections/landing/projects";
import { ServicesSection } from "@/app/sections/landing/services";
import { TestimonialsSection } from "@/app/sections/landing/testimonials";
import { Leva } from "leva";

export default function Home() {
  return (
    <>
      <GL />
      <Hero />
      <ServicesSection />
      <BenefitsSection />
      <ProjectsSection />
      <TeamSection />
      <TestimonialsSection />
      <ContactSection />
      <Leva collapsed />
    </>
  );
}
