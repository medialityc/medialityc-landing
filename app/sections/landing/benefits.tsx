import { Check } from "lucide-react";
import { AnimatedReveal } from "@/components/animated-reveal";
import { CtaLink } from "@/components/cta-link";

const benefits = [
  "Equipo experto con años de experiencia en tecnología y marketing",
  "Metodologías ágiles para entregas rápidas y eficientes",
  "Soporte continuo y mantenimiento post-lanzamiento",
  "Soluciones escalables que crecen con tu negocio",
  "Enfoque en ROI y resultados medibles",
  "Comunicación transparente en cada etapa del proyecto",
];

export function BenefitsSection() {
  return (
    <section
      id="beneficios"
      className="relative scroll-mt-24 py-28 md:py-36"
      aria-labelledby="benefits-heading"
    >
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimatedReveal className="space-y-7" distance={42}>
            <span className="eyebrow">
              <span className="size-1.5 rounded-full bg-primary animate-status-pulse" />
              Ventajas clave
            </span>
            <h2
              id="benefits-heading"
              className="font-sentient text-3xl leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-5xl"
            >
              ¿Por qué elegir <span className="text-gradient">Medialityc</span>?
            </h2>
            <p className="max-w-prose text-pretty text-base leading-relaxed text-muted-foreground">
              Somos tu socio estratégico en transformación digital. Combinamos
              experiencia técnica con creatividad para entregar soluciones que
              realmente impulsan tu negocio.
            </p>
            <CtaLink href="/#contacto" aria-label="Ir a contacto">
              Empezar ahora
            </CtaLink>
          </AnimatedReveal>

          <ul className="grid gap-3">
            {benefits.map((benefit, index) => (
              <AnimatedReveal key={index} delay={0.06 * index} distance={28}>
                <li className="group flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/70">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
                    {benefit}
                  </p>
                </li>
              </AnimatedReveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
