import { Pill } from "@/components/pill";
import { CtaLink } from "@/components/cta-link";
import { AnimatedReveal } from "@/components/animated-reveal";

const stats = [
  { value: "+15", label: "Proyectos entregados" },
  { value: "24 h", label: "Tiempo de respuesta" },
  { value: "100%", label: "Enfoque en resultados" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-4 pt-28 pb-16 text-center">
      {/* Scrim suave para legibilidad del texto sobre el modelo 3D del fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[680px] w-[680px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--background) 78%, transparent) 0%, color-mix(in srgb, var(--background) 35%, transparent) 45%, transparent 70%)",
        }}
      />

      <AnimatedReveal distance={28}>
        <Pill className="mb-7">Ya cumplimos un año</Pill>
      </AnimatedReveal>

      <AnimatedReveal delay={0.06} distance={34}>
        <h1 className="font-sentient text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl">
          Desbloquea tu <br className="hidden sm:block" />
          <span className="text-gradient italic">máximo</span> crecimiento
        </h1>
      </AnimatedReveal>

      <AnimatedReveal delay={0.12} distance={34}>
        <p className="mx-auto mt-8 max-w-[620px] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Transformamos tu visión en realidad digital con desarrollo de software
          a medida y estrategias de marketing que impulsan resultados reales.
        </p>
      </AnimatedReveal>

      <AnimatedReveal
        delay={0.18}
        distance={34}
        className="mt-12 flex flex-wrap items-center justify-center gap-3"
      >
        <CtaLink href="/#contacto" aria-label="Ir a contacto">
          Contáctanos
        </CtaLink>
        <CtaLink href="/#proyectos" variant="ghost" withArrow={false}>
          Ver proyectos
        </CtaLink>
      </AnimatedReveal>

      {/* Métricas de confianza */}
      <AnimatedReveal delay={0.26} distance={30} className="mt-20 w-full max-w-2xl">
        <dl className="grid grid-cols-3 gap-4 border-t border-border/60 pt-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <dt className="font-sentient text-2xl text-foreground sm:text-3xl">
                {s.value}
              </dt>
              <dd className="text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </AnimatedReveal>

      {/* Indicador de scroll */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border/70 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-primary/70" />
        </div>
      </div>
    </section>
  );
}
