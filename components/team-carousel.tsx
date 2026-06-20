"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeading } from "@/components/section-heading";
import { CtaLink } from "@/components/cta-link";
import { equipo, obtenerIniciales } from "@/lib/equipo";

const fallbackImg = "/team/fallback-avatar.svg";

export function TeamCarousel() {
  return (
    <section
      id="equipo"
      className="relative scroll-mt-24 py-28 md:py-36"
      aria-labelledby="team-heading"
    >
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Nuestro equipo"
            title={<span id="team-heading">Liderazgo y experiencia</span>}
            description="Las personas que impulsan nuestra visión. Desliza para conocer sus principales aportes."
          />
          <div className="hidden shrink-0 sm:block">
            <CtaLink
              href="/equipo"
              variant="ghost"
              aria-label="Ver todos los miembros del equipo"
            >
              Ver todo el equipo
            </CtaLink>
          </div>
        </div>

        <Carousel className="mt-14 w-full" opts={{ loop: true, align: "start" }}>
          <CarouselContent>
            {equipo.miembros.map((miembro) => (
              <CarouselItem
                key={miembro.id}
                className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <article className="group flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                      <AvatarImage
                        src={fallbackImg}
                        alt={`Foto de ${miembro.nombre}`}
                      />
                      <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                        {obtenerIniciales(miembro.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="truncate font-sentient text-lg leading-tight">
                        {miembro.nombre}
                      </h3>
                      <p className="truncate text-xs text-muted-foreground">
                        {miembro.cargo}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 border-t border-border/50 pt-4 text-xs text-muted-foreground md:text-sm">
                    {miembro.proyectos.slice(0, 2).map((p, idx) => (
                      <li key={idx} className="line-clamp-2">
                        <span className="font-medium text-foreground/80">
                          {p.nombre}:
                        </span>{" "}
                        {p.aportes}
                      </li>
                    ))}
                    {miembro.proyectos.length > 2 && (
                      <li className="text-[11px] text-primary/70">
                        + {miembro.proyectos.length - 2} proyectos adicionales
                      </li>
                    )}
                  </ul>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden border-border/70 bg-card/60 hover:border-primary/50 hover:text-primary md:flex" />
          <CarouselNext className="hidden border-border/70 bg-card/60 hover:border-primary/50 hover:text-primary md:flex" />
        </Carousel>

        <div className="mt-10 flex justify-center sm:hidden">
          <CtaLink
            href="/equipo"
            variant="ghost"
            aria-label="Ver todos los miembros del equipo"
          >
            Ver todo el equipo
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
