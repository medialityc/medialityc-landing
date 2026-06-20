import { AnimatedReveal } from "@/components/animated-reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  Code2,
  Layers,
  Share2,
  BarChart3,
  Smartphone,
  Cloud,
} from "lucide-react";

type Service = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: Code2,
    title: "Desarrollo de Software",
    description:
      "Soluciones personalizadas con las últimas tecnologías para impulsar tu negocio digital.",
  },
  {
    icon: Layers,
    title: "Integración de Plataformas",
    description:
      "Conectamos tus sistemas y herramientas para optimizar procesos empresariales.",
  },
  {
    icon: Share2,
    title: "Marketing en Redes Sociales",
    description:
      "Estrategias efectivas para aumentar tu presencia y engagement en redes sociales.",
  },
  {
    icon: BarChart3,
    title: "Análisis y Optimización",
    description:
      "Insights basados en datos para mejorar el rendimiento de tus campañas digitales.",
  },
  {
    icon: Smartphone,
    title: "Aplicaciones Móviles",
    description:
      "Apps nativas y multiplataforma diseñadas para una experiencia excepcional.",
  },
  {
    icon: Cloud,
    title: "Soluciones Cloud",
    description:
      "Arquitectura escalable y segura en la nube para tu infraestructura digital.",
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const { icon: Icon, title, description } = service;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
      {/* Glow al hover (CSS, sin coste por re-render) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at 50% 0%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
          <Icon className="size-6" />
        </div>
        <span className="font-mono text-xs text-muted-foreground/60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="relative mt-5 font-sentient text-xl tracking-tight">
        {title}
      </h3>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="relative mt-5 flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-primary/70">
        <span className="size-1.5 rounded-full bg-primary animate-status-pulse" />
        Disponible
      </div>
    </article>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 py-28 md:py-36"
      aria-labelledby="services-heading"
    >
      <div className="container">
        <SectionHeading
          parallax={0.05}
          eyebrow="Lo que hacemos"
          title={
            <span id="services-heading">
              Servicios diseñados para tu crecimiento
            </span>
          }
          description="Combinamos tecnología, creatividad y análisis de datos para impulsar tu marca de principio a fin."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <AnimatedReveal key={s.title} delay={0.06 * i} distance={40}>
              <ServiceCard service={s} index={i} />
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
