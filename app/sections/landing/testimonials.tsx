"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { AnimatedReveal } from "@/components/animated-reveal";
import { BrandMark } from "../../../components/brand-mark";
import React, { useCallback, useEffect, useState } from "react";
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

export function TestimonialsSection() {
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  // Track selection for dots
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Autoplay (pause on hover / reduced motion)
  useEffect(() => {
    if (!api) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return; // respect user preference
    let raf: number | null = null;
    let lastTime = performance.now();
    const interval = 4500; // ms
    const tick = (now: number) => {
      if (!hovering && api) {
        if (now - lastTime >= interval) {
          api.scrollNext();
          lastTime = now;
        }
      } else {
        lastTime = now; // reset when paused
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [api, hovering]);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <section
      id="testimonios"
      className="py-24 md:py-36 relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-primary/5 to-background" />
      {/* Edge fade overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background via-background/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background via-background/70 to-transparent" />
      <div className="container px-4 md:px-6 relative">
        {/* Side emblem accent */}
        <div className="absolute -right-8 top-16 hidden xl:block opacity-[0.05]">
          <BrandMark variant="inline" className="w-44" alt="" />
        </div>
        <AnimatedReveal
          as="div"
          className="text-center space-y-4 mb-14 md:mb-20"
          distance={50}
        >
          <div className="flex items-center justify-center gap-2 text-primary/70">
            <Quote className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-wider">
              Testimonios
            </span>
          </div>
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance"
          >
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-[700px] mx-auto text-pretty">
            La satisfacción de nuestros clientes es nuestra mejor carta de
            presentación.
          </p>
        </AnimatedReveal>
        <div
          className="relative group"
          onMouseMove={handleMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "start", dragFree: false }}
            className="px-2"
          >
            <CarouselContent
              className="items-stretch"
              style={{
                background: `radial-gradient(circle at ${glowPos.x}px ${glowPos.y}px, hsl(var(--primary)/0.12), transparent 65%)`,
                transition: "background 0.15s",
                borderRadius: "1rem",
              }}
            >
              {testimonials.map((t, i) => (
                <CarouselItem
                  key={i}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/3"
                >
                  <AnimatedReveal
                    delay={0.05 + i * 0.05}
                    distance={38}
                    className="h-full"
                  >
                    <InteractiveTestimonialCard testimonial={t} />
                  </AnimatedReveal>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex bg-background/60 backdrop-blur border border-border/60 hover:bg-primary/10" />
            <CarouselNext className="hidden md:flex bg-background/60 backdrop-blur border border-border/60 hover:bg-primary/10" />
          </Carousel>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir al testimonio ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`size-2.5 rounded-full transition-all ${
                  selectedIndex === i
                    ? "bg-primary scale-110"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type T = (typeof testimonials)[number];

function InteractiveTestimonialCard({ testimonial }: { testimonial: T }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hover, setHover] = useState(false);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouse({ x, y });
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;
    setTilt({ rx: py * 5, ry: px * 5 });
  }, []);

  return (
    <Card
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative group border-muted/60 backdrop-blur-sm bg-background/70 transition-all duration-400"
      style={
        hover
          ? {
              transform: `translateY(-4px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
    >
      {/* Glow overlay inside card */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        style={{
          background: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px, hsl(var(--primary)/0.25), transparent 70%)`,
        }}
      />
      <CardContent className="p-6 space-y-5 relative">
        <div className="flex gap-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="h-5 w-5 fill-primary text-primary scale-90 group-hover:scale-100 transition-transform"
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
        <p className="text-base text-muted-foreground leading-relaxed relative">
          "{testimonial.content}"
        </p>
        <div className="pt-4 border-t">
          <p className="font-semibold tracking-tight">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </CardContent>
    </Card>
  );
}
