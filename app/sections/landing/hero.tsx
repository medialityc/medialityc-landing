import Link from "next/link";
import { Pill } from "../../../components/pill";
import { Button } from "../../../components/ui/button";
import { BrandMark } from "../../../components/brand-mark";

export function Hero() {
  return (
    <div className="flex flex-col h-svh justify-between relative">
      {/* Decorative emblem with subtle parallax */}
      <BrandMark
        variant="watermark"
        parallaxRatio={0.045}
        className="absolute inset-0 flex items-center justify-center"
      />
      <div className="pb-16 mt-auto text-center relative">
        <Pill className="mb-6">Ya cumplimos un año</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
          Desbloquea tu <br />
          <i className="font-light">máximo</i> crecimiento
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[640px] mx-auto">
          Transformamos tu visión en realidad digital con soluciones
          tecnológicas avanzadas y estrategias de marketing que impulsan
          resultados.
        </p>

        <Link
          className="contents max-sm:hidden"
          href="/#contact"
          aria-label="Ir a contacto"
        >
          <Button className="group relative mt-14 inline-flex items-center gap-2 rounded-full px-7 py-3 text-[12px] font-mono uppercase tracking-[0.18em] backdrop-blur-md bg-white/5 bg-linear-to-r from-primary/30 via-secondary/20 to-accent/10 border border-white/10 ring-1 ring-primary/30 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.6)] text-primary hover:from-primary/45 hover:via-secondary/30 hover:to-accent/20 hover:shadow-[0_8px_26px_-8px_rgba(0,0,0,0.65)] transition-all duration-500">
            <span className="relative z-10 flex items-center gap-3">
              <span className="font-semibold">Contactános</span>
              <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary/25 text-primary/90 backdrop-blur-sm transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </Button>
        </Link>
        <Link
          className="contents sm:hidden"
          href="/#contact"
          aria-label="Ir a contacto (móvil)"
        >
          <Button
            size="sm"
            className="group relative mt-14 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[11px] font-mono uppercase tracking-[0.2em] backdrop-blur-md bg-white/5 bg-linear-to-r from-primary/35 via-secondary/25 to-accent/15 border border-white/10 ring-1 ring-primary/30 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.55)] text-primary hover:from-primary/50 hover:via-secondary/35 hover:to-accent/25 hover:shadow-[0_6px_20px_-6px_rgba(0,0,0,0.6)] transition-all duration-500"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="font-semibold">Contactános</span>
              <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary/25 text-primary/90 backdrop-blur-sm transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
