"use client";
import { Sparkles, ArrowRight } from "lucide-react";
import { AnimatedReveal } from "@/components/animated-reveal";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "../../../components/brand-mark";

const benefits = [
  "Equipo experto con años de experiencia en tecnología y marketing",
  "Metodologías ágiles para entregas rápidas y eficientes",
  "Soporte continuo y mantenimiento post-lanzamiento",
  "Soluciones escalables que crecen con tu negocio",
  "Enfoque en ROI y resultados medibles",
  "Comunicación transparente en cada etapa del proyecto",
];

export function BenefitsSection() {
  // Mouse glow for list area
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  return (
    <section
      id="beneficios"
      className="py-24 md:py-32 relative overflow-hidden"
      aria-labelledby="benefits-heading"
    >
      {/* Layered background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-radial from-primary/15 via-primary/0 to-transparent blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(120deg,hsl(var(--primary)/0.25)_0%,transparent_55%)] mix-blend-overlay" />
      </div>
      <div className="container px-4 md:px-6 relative">
        {/* Emblem watermark behind heading */}
        <BrandMark
          variant="watermark"
          parallaxRatio={0.02}
          className="absolute inset-0 flex items-start justify-end pt-10 pr-4"
        />
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-center">
          <AnimatedReveal className="space-y-7" delay={0} distance={46}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-primary/80 bg-primary/10 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> Ventajas Clave
            </div>
            <h2
              id="benefits-heading"
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance"
            >
              ¿Por Qué Elegir
              <span className="relative inline-block mx-2">
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent font-extrabold">
                  Medialityc
                </span>
                <span className="absolute -inset-1 rounded-xl opacity-20 blur-md bg-radial from-primary/60 via-primary/30 to-transparent" />
              </span>
              ?
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-prose">
              Somos tu socio estratégico en transformación digital. Combinamos
              experiencia técnica con creatividad para entregar soluciones que
              realmente impulsan tu negocio.
            </p>
            <Button
              asChild
              className="group relative mt-6 inline-flex items-center gap-3 rounded-full px-7 py-3 text-[12px] font-mono uppercase tracking-[0.18em] backdrop-blur-md bg-white/5 bg-linear-to-r from-primary/35 via-secondary/25 to-accent/15 border border-white/10 ring-1 ring-primary/30 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.55)] text-primary hover:from-primary/50 hover:via-secondary/35 hover:to-accent/25 hover:shadow-[0_8px_26px_-8px_rgba(0,0,0,0.6)] transition-all duration-500"
            >
              <a
                href="#contacto"
                aria-label="Ir a sección de contacto"
                className="relative flex items-center gap-3"
              >
                <span className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
                  <span className="absolute -left-full top-0 h-full w-1/3 bg-white/25 blur-xl opacity-0 group-hover:opacity-70 group-hover:translate-x-[300%] transition-all duration-1000 ease-out" />
                  <span className="absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-white/20 transition-colors" />
                </span>
                <span className="relative z-10 font-semibold">
                  Empezar Ahora
                </span>
                <span className="relative z-10 inline-flex items-center justify-center size-6 rounded-full bg-primary/25 text-primary/90 backdrop-blur-sm transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </Button>
          </AnimatedReveal>
          <div
            className="relative group rounded-xl p-2 md:p-4 before:absolute before:inset-0 before:rounded-xl before:border before:border-primary/20 before:pointer-events-none"
            onMouseMove={handleMove}
            style={{
              background: reduceMotion
                ? "hsl(var(--background)/0.6)"
                : `radial-gradient(circle at ${pos.x}px ${pos.y}px, hsl(var(--primary)/0.18), transparent 60%)`,
              transition: "background 0.25s",
            }}
          >
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <AnimatedReveal
                  key={index}
                  className="group/item rounded-lg px-3 py-2 md:px-4 md:py-3 transition-all duration-500 hover:bg-primary/10 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.4)] hover:-translate-y-0.5"
                  delay={0.12 + index * 0.07}
                  distance={34}
                >
                  <li className="flex items-start gap-4 w-full">
                    <div className="relative shrink-0 mt-0.5">
                      <BrandMark
                        variant="bullet"
                        className="h-7 w-7 transition-transform group-hover/item:scale-110"
                      />
                      <span className="sr-only">Beneficio {index + 1}</span>
                    </div>
                    <p className="text-base md:text-lg leading-relaxed flex-1">
                      {benefit}
                    </p>
                  </li>
                </AnimatedReveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
