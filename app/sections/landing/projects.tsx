"use client";

import LaptopComponente from "@/components/gl/laptop-componente";
import { AnimatedReveal } from "@/components/animated-reveal";
import { SectionHeading } from "@/components/section-heading";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ProjectMeta {
  id: string;
  name: string;
  summary: string;
  tag: string;
  url: string;
}

const featuredProjects: ProjectMeta[] = [
  {
    id: "dconceptos",
    name: "Dconceptos",
    summary: "Tienda en línea de diseño de interiores y exteriores.",
    tag: "E-commerce",
    url: "https://dconceptos.com/",
  },
  {
    id: "wonderfitcuba",
    name: "Wonder Fit Cuba",
    summary: "Tienda en línea para equipos y accesorios de fitness.",
    tag: "E-commerce",
    url: "https://wonderfitcuba.com/",
  },
  {
    id: "zasbyjmc",
    name: "Zas By JMC",
    summary: "Sistema administrativo para agencia de paquetería.",
    tag: "Plataforma",
    url: "https://zasbyjmc.com/",
  },
  {
    id: "suntravelsonline",
    name: "Sun Travels Online",
    summary: "Agencia de viajes especializada en destinos soleados.",
    tag: "Sitio web",
    url: "https://www.suntravelsonline.com/",
  },
];

export function ProjectsSection() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const total = featuredProjects.length;
  const project = featuredProjects[current];

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const next = () => setCurrent((c) => (c + 1) % total);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);

  const screenWidth = isMobile ? 320 : 340;
  const screenHeight = isMobile ? 200 : 215;
  const scale = isMobile ? 1.08 : 1.22;

  return (
    <section
      id="proyectos"
      className="relative scroll-mt-24 py-28 md:py-36"
      aria-labelledby="projects-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Proyectos"
          title={<span id="projects-heading">Casos destacados</span>}
          description="Una selección de trabajos que muestran nuestro enfoque en producto, detalle y rendimiento."
        />

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          {/* Laptop 3D con vista en vivo */}
          <AnimatedReveal distance={40} className="order-1">
            <div className="relative mx-auto aspect-4/3 w-full max-w-[520px] lg:max-w-full">
              <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/60 px-2.5 py-1 text-[10px] font-mono tracking-[0.18em] text-primary/90 backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-primary animate-status-pulse" />
                EN VIVO
              </div>
              <LaptopComponente
                scale={scale}
                screenWidth={screenWidth}
                screenHeight={screenHeight}
                viewportWidth={1280}
                viewportHeight={800}
              >
                <iframe
                  src={project.url}
                  title={project.name}
                  className="absolute inset-0 h-full w-full bg-black"
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
                />
              </LaptopComponente>
            </div>
          </AnimatedReveal>

          {/* Panel de información + navegación */}
          <AnimatedReveal delay={0.1} distance={40} className="order-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full border border-border/70 bg-card/50 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-primary/80">
                  {project.tag}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(current + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
              </div>

              <div className="min-h-[110px]">
                <h3 className="font-sentient text-2xl tracking-tight md:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {project.summary}
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  aria-label={`Visitar sitio de ${project.name}`}
                >
                  Visitar sitio
                  <ArrowUpRight className="size-4" />
                </a>
              </div>

              {/* Selector de proyectos */}
              <div className="flex flex-col gap-1.5">
                {featuredProjects.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-current={i === current ? "true" : undefined}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                      i === current
                        ? "border-primary/40 bg-primary/8 text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-card/50"
                    }`}
                  >
                    <span className="font-mono text-xs opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium">{p.name}</span>
                  </button>
                ))}
              </div>

              {/* Controles prev / next */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Proyecto anterior"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/50 text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Proyecto siguiente"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-card/50 text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
