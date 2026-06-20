import { Pill } from "@/components/pill";
import { CtaLink } from "@/components/cta-link";
import { AnimatedReveal } from "@/components/animated-reveal";
import { HeroScene } from "@/components/hero-scene";
import { Spotlight } from "@/components/ui/spotlight";

const stats = [
  { value: "+15", label: "Proyectos entregados" },
  { value: "24 h", label: "Tiempo de respuesta" },
  { value: "100%", label: "Enfoque en resultados" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-center px-4 pt-28 pb-16">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-8">
        {/* Texto */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <AnimatedReveal distance={28}>
            <Pill className="mb-7">Ya cumplimos un año</Pill>
          </AnimatedReveal>

          <AnimatedReveal delay={0.06} distance={34}>
            <h1 className="font-sentient text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Desbloquea tu <br className="hidden sm:block" />
              <span className="text-gradient italic">máximo</span> crecimiento
            </h1>
          </AnimatedReveal>

          <AnimatedReveal delay={0.12} distance={34}>
            <p className="mx-auto mt-7 max-w-[560px] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
              Transformamos tu visión en realidad digital con desarrollo de
              software a medida y estrategias de marketing que impulsan
              resultados reales.
            </p>
          </AnimatedReveal>

          <AnimatedReveal
            delay={0.18}
            distance={34}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <CtaLink href="/#contacto" aria-label="Ir a contacto">
              Contáctanos
            </CtaLink>
            <CtaLink href="/#proyectos" variant="ghost" withArrow={false}>
              Ver proyectos
            </CtaLink>
          </AnimatedReveal>

          <AnimatedReveal delay={0.26} distance={30} className="mt-14">
            <dl className="mx-auto grid max-w-md grid-cols-3 gap-4 border-t border-border/60 pt-8 lg:mx-0">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1 lg:items-start"
                >
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
        </div>

        {/* Ave 3D de nodos */}
        <AnimatedReveal
          delay={0.1}
          distance={0}
          className="order-1 lg:order-2"
        >
          <div className="relative h-[340px] w-full overflow-hidden rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_70%)] sm:h-[440px] lg:h-[560px]">
            <Spotlight
              className="-top-40 left-0 md:-top-20 md:left-20"
              fill="#75eff0"
            />
            <HeroScene />
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.2em] text-primary/50">
              Interactivo · mueve el cursor
            </div>
          </div>
        </AnimatedReveal>
      </div>

      {/* Indicador de scroll */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border/70 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-primary/70" />
        </div>
      </div>
    </section>
  );
}
