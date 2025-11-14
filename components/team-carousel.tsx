"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { equipo, obtenerIniciales } from "@/lib/equipo";

const fallbackImg = "/team/fallback-avatar.svg";

export function TeamCarousel() {
  return (
    <section id="equipo" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container relative flex flex-col gap-10">
        <header className="flex flex-col items-start gap-6 max-w-3xl">
          <span className="text-primary font-mono text-xs uppercase tracking-wider">
            Nuestro equipo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Liderazgo y experiencia
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Personas que impulsan nuestra visión. Desliza para conocer sus
            principales aportes y haz clic en "Ver más" para explorar todo el
            equipo.
          </p>
        </header>
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {equipo.miembros.map((miembro) => (
              <CarouselItem
                key={miembro.id}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Card className="h-full border-border/60 bg-background/70 backdrop-blur-sm transition-colors hover:border-primary/40 hover:shadow-[0_4px_18px_-4px_hsl(var(--primary)/0.35)]">
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
                    <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
                      {miembro.proyectos.slice(0, 2).map((p, idx) => (
                        <li key={idx} className="line-clamp-2">
                          <span className="font-medium text-foreground/80">
                            {p.nombre}:
                          </span>{" "}
                          {p.aportes}
                        </li>
                      ))}
                      {miembro.proyectos.length > 2 && (
                        <li className="text-[11px] md:text-xs opacity-70">
                          + {miembro.proyectos.length - 2} proyectos adicionales
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex justify-end">
          <Button
            asChild
            className="group relative inline-flex items-center gap-2 rounded-full px-7 py-3 text-[12px] font-mono uppercase tracking-[0.18em] backdrop-blur-md bg-white/5 bg-linear-to-r from-primary/30 via-secondary/20 to-accent/10 border border-white/10 ring-1 ring-primary/30 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.6)] text-primary hover:from-primary/45 hover:via-secondary/30 hover:to-accent/20 hover:shadow-[0_8px_26px_-8px_rgba(0,0,0,0.65)] transition-all duration-500"
          >
            <Link href="/equipo" aria-label="Ver todos los miembros del equipo">
              <span className="relative z-10 flex items-center gap-3">
                <span className="font-semibold">Ver más</span>
                <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary/25 text-primary/90 backdrop-blur-sm transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
