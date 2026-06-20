"use client";

import { Star, Quote } from "lucide-react";
import { AnimatedReveal } from "@/components/animated-reveal";
import { SectionHeading } from "@/components/section-heading";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "CEO, TechStart",
    content:
      "Medialityc transformó completamente nuestra presencia digital. El equipo es profesional, creativo y siempre entrega a tiempo.",
    rating: 5,
  },
  {
    name: "María González",
    role: "Directora de Marketing, Innovate Co.",
    content:
      "Las estrategias de redes sociales que desarrollaron aumentaron nuestro engagement en un 300%. Altamente recomendados.",
    rating: 5,
  },
  {
    name: "Roberto Silva",
    role: "Fundador, Digital Solutions",
    content:
      "La calidad del software que desarrollaron superó nuestras expectativas. Son verdaderos expertos en su campo.",
    rating: 5,
  },
];

type T = (typeof testimonials)[number];

function TestimonialCard({ testimonial }: { testimonial: T }) {
  return (
    <article className="relative flex h-full flex-col gap-5 rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40">
      <Quote className="size-8 text-primary/30" />
      <div className="flex gap-1" aria-label={`${testimonial.rating} de 5 estrellas`}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="size-4 fill-primary text-primary" />
        ))}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-foreground/80 md:text-base">
        "{testimonial.content}"
      </p>
      <div className="border-t border-border/50 pt-4">
        <p className="font-medium tracking-tight">{testimonial.name}</p>
        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
      </div>
    </article>
  );
}

export function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Autoplay con respeto a prefers-reduced-motion y pausa en hover
  useEffect(() => {
    if (!api) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!hovering) api.scrollNext();
    }, 4500);
    return () => window.clearInterval(id);
  }, [api, hovering]);

  return (
    <section
      id="testimonios"
      className="relative scroll-mt-24 py-28 md:py-36"
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        <SectionHeading
          parallax={0.05}
          eyebrow="Testimonios"
          title={
            <span id="testimonials-heading">Lo que dicen nuestros clientes</span>
          }
          description="La satisfacción de nuestros clientes es nuestra mejor carta de presentación."
        />

        <div
          className="relative mt-14"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "start" }}
            className="px-1"
          >
            <CarouselContent className="items-stretch">
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <AnimatedReveal
                    delay={0.06 * i}
                    distance={36}
                    className="h-full"
                  >
                    <TestimonialCard testimonial={t} />
                  </AnimatedReveal>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden border-border/70 bg-card/60 hover:border-primary/50 hover:text-primary md:flex" />
            <CarouselNext className="hidden border-border/70 bg-card/60 hover:border-primary/50 hover:text-primary md:flex" />
          </Carousel>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir al testimonio ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  selectedIndex === i
                    ? "w-6 bg-primary"
                    : "w-2 bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
