"use client";

import LaptopComponente from "@/components/gl/laptop-componente";
import { AnimatedReveal } from "@/components/animated-reveal";
import { BrandMark } from "@/components/brand-mark";
import React, { useEffect, useState } from "react";

interface ProjectMeta {
  id: string;
  name: string;
  summary: string;
  url: string; // URL de despliegue para iframe
  screenshot?: string; // opcional si luego se usa captura
}

// Placeholder: el contenido real lo agregará el usuario
const featuredProjects: ProjectMeta[] = [
  {
    id: "dconceptos",
    name: "Dconceptos",
    summary: "Tienda en linea de diseño de interiores y exteriores.",
    url: "https://dconceptos.com/",
  },
  {
    id: "wonderfitcuba",
    name: "Wonder Fit Cuba",
    summary: "Tienda en línea para equipos y accesorios de fitness.",
    url: "https://wonderfitcuba.com/",
  },
  {
    id: "zasbyjmc",
    name: "Zas By JMC",
    summary: "Sistema administrativo para agencia de paquetería",
    url: "https://zasbyjmc.com/",
  },
  {
    id: "suntravelsonline",
    name: "Sun Travels Online",
    summary: "Agencia de viajes especializada en destinos soleados.",
    url: "https://www.suntravelsonline.com/",
  },
];

export function ProjectsSection() {
  const [current, setCurrent] = useState(0);
  const total = featuredProjects.length;
  const next = () => setCurrent((c) => (c + 1) % total);
  const nextName = featuredProjects[(current + 1) % total]?.name ?? "Siguiente";
  return (
    <section id="proyectos" className="py-28 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-primary/5 to-background" />
      <div className="container relative">
        <AnimatedReveal className="max-w-3xl mb-14 space-y-6" distance={44}>
          <span className="font-mono text-xs uppercase tracking-wider text-primary">
            Proyectos
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Casos Destacados
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Una selección de trabajos relevantes que muestran nuestro enfoque en
            producto, detalle y rendimiento.
          </p>
        </AnimatedReveal>
        <AnimatedReveal delay={0.1} distance={40} className="flex">
          <ProjectItem
            meta={featuredProjects[current]}
            index={current}
            onNext={next}
            nextName={nextName}
            total={total}
          />
        </AnimatedReveal>
      </div>
    </section>
  );
}

function ProjectItem({
  meta,
  index,
  onNext,
  nextName,
  total,
}: {
  meta: ProjectMeta;
  index: number;
  onNext: () => void;
  nextName: string;
  total: number;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640); // breakpoint sm
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Responsive sizes: smaller physical screen for mobile but keep desktop viewport to force desktop layout inside iframe
  const screenWidth = isMobile ? 320 : 340;
  const screenHeight = isMobile ? 200 : 215;
  const scale = isMobile ? 1.08 : 1.22;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="relative w-full mx-auto aspect-4/3 lg:max-w-full sm:max-w-[460px]">
        {/* Indicador de elemento 3D interactivo */}
        <div
          className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-mono tracking-[0.18em] backdrop-blur-md bg-white/5 bg-linear-to-r from-primary/40 via-secondary/30 to-accent/20 border border-white/10 ring-1 ring-primary/30 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.55)] text-primary/90 pointer-events-none select-none"
          aria-label="Vista 3D interactiva"
        >
          <svg
            className="size-3.5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 3 4.5 7v10L12 21l7.5-4V7L12 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M12 3v18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4.5 7 12 13.5 19.5 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold">3D</span>
        </div>
        <LaptopComponente
          scale={scale}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          viewportWidth={1280}
          viewportHeight={800}
        >
          <iframe
            src={meta.url}
            title={meta.name}
            className="absolute inset-0 w-full h-full bg-black"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
          />
        </LaptopComponente>
        {/* Botón flotante al lado de la laptop (derecha). En mobile, se muestra en la esquina inferior derecha. */}
        <button
          type="button"
          onClick={onNext}
          className="group absolute z-10 right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[11px] font-mono tracking-[0.18em] font-semibold text-primary backdrop-blur-md bg-white/5 bg-linear-to-r from-primary/35 via-secondary/25 to-accent/15 border border-white/10 ring-1 ring-primary/30 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.65)] hover:from-primary/50 hover:via-secondary/35 hover:to-accent/25 hover:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.7)] transition-all duration-500"
          aria-label={`Siguiente proyecto: ${nextName}`}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
            <span className="absolute -left-full top-0 h-full w-1/3 bg-white/25 blur-xl opacity-0 group-hover:opacity-70 group-hover:translate-x-[300%] transition-all duration-1000 ease-out" />
            <span className="absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-white/20 transition-colors" />
          </span>
          <span className="relative z-10 flex items-center gap-2">
            <span className="opacity-80">Siguiente:</span>
            <span className="truncate max-w-[120px] font-semibold">
              {nextName}
            </span>
            <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary/25 text-primary/90 backdrop-blur-sm transition-transform group-hover:translate-x-1">
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h12M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="group absolute z-10 bottom-2 right-2 sm:hidden inline-flex items-center justify-center rounded-full px-3.5 py-2 text-[10px] font-mono tracking-[0.22em] font-semibold text-primary backdrop-blur-md bg-white/5 bg-linear-to-r from-primary/40 via-secondary/30 to-accent/20 border border-white/10 ring-1 ring-primary/30 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.6)] hover:from-primary/55 hover:via-secondary/40 hover:to-accent/30 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.65)] transition-all duration-500"
          aria-label={`Siguiente proyecto: ${nextName}`}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
            <span className="absolute -left-full top-0 h-full w-1/3 bg-white/30 blur-lg opacity-0 group-hover:opacity-70 group-hover:translate-x-[300%] transition-all duration-1000 ease-out" />
            <span className="absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-white/20 transition-colors" />
          </span>
          <span className="relative z-10 flex items-center gap-1.5">
            <span className="opacity-80">Next</span>
            <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary/25 text-primary/90 backdrop-blur-sm transition-transform group-hover:translate-x-1">
              <svg
                className="size-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h12M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>
        </button>
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-base font-semibold tracking-tight">{meta.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {meta.summary}
        </p>
        <a
          href={meta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
          aria-label={`Visitar sitio de ${meta.name}`}
        >
          Visitar sitio ↗
        </a>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-primary/70">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          {index + 1 < 10 ? `0${index + 1}` : index + 1}
          <span className="ml-1 opacity-70">/ {total}</span>
        </span>
      </div>
    </div>
  );
}
