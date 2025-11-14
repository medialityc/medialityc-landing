"use client";

import { useState, useMemo } from "react";
import { equipo, obtenerIniciales } from "@/lib/equipo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GL } from "@/components/gl";

const fallbackImg = "/team/fallback-avatar.svg";

export default function EquipoPage() {
  const [query, setQuery] = useState("");
  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return equipo.miembros;
    return equipo.miembros.filter((m) => {
      const base = `${m.nombre} ${m.cargo}`.toLowerCase();
      const proyectos = m.proyectos
        .map((p) => `${p.nombre} ${p.aportes}`.toLowerCase())
        .join(" ");
      return base.includes(q) || proyectos.includes(q);
    });
  }, [query]);

  return (
    <>
      {/* Fondo WebGL detrás del contenido */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <GL />
      </div>

      <section className="relative z-10 py-24 md:py-32 container">
        <div className="flex flex-col gap-6 max-w-3xl mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Todo el equipo
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Explora a todas las personas que colaboran con nosotros. Usa el
            buscador para filtrar por nombre, cargo o proyectos.
          </p>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="buscar"
              className="text-xs uppercase tracking-wide font-mono text-primary"
            >
              Buscar
            </label>
            <Input
              id="buscar"
              placeholder="Ej: seguridad, CTO, microservicios..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-md"
              aria-label="Buscar miembros del equipo"
            />
            <p className="text-[11px] md:text-xs text-muted-foreground">
              Resultados: {filtrados.length} / {equipo.miembros.length}
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtrados.map((miembro) => (
            <Card
              key={miembro.id}
              className="group h-full border-border/60 bg-background/70 backdrop-blur-sm transition-colors hover:border-primary/40 hover:shadow-[0_4px_18px_-4px_hsl(var(--primary)/0.35)]"
            >
              <CardHeader className="flex-row items-center gap-4">
                <Avatar className="size-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                  <AvatarImage
                    src={fallbackImg}
                    alt={`Foto de ${miembro.nombre}`}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.dataset.fallbackApplied) {
                        target.src = fallbackImg;
                        target.dataset.fallbackApplied = "true";
                      }
                    }}
                  />
                  <AvatarFallback className="text-xs font-medium">
                    {obtenerIniciales(miembro.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-base md:text-lg font-semibold leading-tight">
                    {miembro.nombre}
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {miembro.cargo}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Accordion type="multiple" className="w-full">
                  {miembro.proyectos.map((proyecto, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`proyecto-${miembro.id}-${idx}`}
                    >
                      <AccordionTrigger className="text-xs md:text-sm">
                        {proyecto.nombre}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                        {proyecto.aportes}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
          {filtrados.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full">
              No se encontraron coincidencias.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
