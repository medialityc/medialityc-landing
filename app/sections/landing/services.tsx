"use client";

import { useState, useCallback } from "react";
import { AnimatedReveal } from "@/components/animated-reveal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BrandMark } from "../../../components/brand-mark";
import { cn } from "@/lib/utils";
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
      "Data-driven insights para mejorar el rendimiento de tus campañas digitales.",
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

function ServiceCard({ service }: { service: Service }) {
  const { icon: Icon, title, description } = service;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    // Calculate tilt (-6deg..6deg range) based on relative mouse position
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * 6, ry: px * 6 });
  }, []);

  return (
    <Card
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "group relative cursor-pointer transition-all duration-300 border-muted bg-linear-to-br from-background to-background/80",
        "hover:shadow-lg hover:border-primary/40",
        "will-change-transform"
      )}
      style={
        hover
          ? {
              transform: `translateY(-4px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      aria-label={title}
    >
      {/* Radial highlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient( circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary)/0.25), transparent 70%)`,
        }}
      />
      <CardHeader className="space-y-4">
        <div
          className={cn(
            "size-12 rounded-xl flex items-center justify-center",
            "bg-linear-to-br from-primary/80 to-primary text-primary-foreground",
            "shadow-sm group-hover:shadow-md group-hover:scale-105 transition-transform"
          )}
        >
          <Icon className="size-6" />
        </div>
        <CardTitle className="font-sentient text-xl tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Activo
          </span>
          <span>•</span>
          <span className="opacity-70">Explora más al contactarnos</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative mx-auto max-w-6xl px-4 py-32 md:py-40 overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* Parallax-ish decorative gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08),transparent_70%)]" />
      <AnimatedReveal
        as="div"
        className="mx-auto mb-14 max-w-2xl text-center"
        distance={40}
      >
        <p className="font-mono text-xs uppercase tracking-wider text-primary/80 mb-4">
          Lo que hacemos
        </p>
        <h2
          id="services-heading"
          className="text-4xl md:text-5xl font-sentient leading-tight"
        >
          Servicios diseñados para tu crecimiento
        </h2>
        <p className="text-muted-foreground mt-6 text-sm md:text-base">
          Combinamos tecnología, creatividad y análisis para impulsar tu marca.
        </p>
      </AnimatedReveal>
      {/* Divider emblem accent */}
      <BrandMark variant="divider" />
      <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <AnimatedReveal key={s.title} delay={0.1 + i * 0.07} distance={50}>
            <ServiceCard service={s} />
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}
