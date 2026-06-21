"use client";

import { useState } from "react";
import { MapPin, Globe2 } from "lucide-react";
import { AnimatedReveal } from "@/components/animated-reveal";
import { BrandMark } from "../../../components/brand-mark";
import { cn } from "@/lib/utils";
import { WORLD_PATH, WORLD_VIEWBOX, project } from "@/lib/world-map-data";

type Location = {
  id: string;
  country: string;
  city: string;
  flag: string;
  lat: number;
  lon: number;
};

// Sedes de Medialityc
const locations: Location[] = [
  { id: "ni", country: "Nicaragua", city: "Managua", flag: "🇳🇮", lat: 12.13, lon: -86.27 },
  { id: "cu", country: "Cuba", city: "La Habana", flag: "🇨🇺", lat: 23.13, lon: -82.38 },
  { id: "us", country: "Estados Unidos", city: "Miami", flag: "🇺🇸", lat: 25.76, lon: -80.19 },
  { id: "es", country: "España", city: "Madrid", flag: "🇪🇸", lat: 40.42, lon: -3.7 },
  { id: "it", country: "Italia", city: "Roma", flag: "🇮🇹", lat: 41.9, lon: 12.5 },
];

function pct(lon: number, lat: number) {
  const { x, y } = project(lon, lat);
  return {
    left: `${(x / WORLD_VIEWBOX.width) * 100}%`,
    top: `${(y / WORLD_VIEWBOX.height) * 100}%`,
  };
}

export function LocationsSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      id="sedes"
      className="relative mx-auto max-w-6xl px-4 py-28 md:py-36 overflow-hidden"
      aria-labelledby="locations-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.07),transparent_70%)]" />

      <AnimatedReveal
        as="div"
        className="mx-auto mb-12 max-w-2xl text-center"
        distance={40}
      >
        <div className="flex items-center justify-center gap-2 text-primary/80 mb-4">
          <Globe2 className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">
            Presencia global
          </span>
        </div>
        <h2
          id="locations-heading"
          className="text-4xl md:text-5xl font-sentient leading-tight"
        >
          Nuestras sedes en el mundo
        </h2>
        <p className="text-muted-foreground mt-6 text-sm md:text-base">
          Conectamos talento y tecnología a través de continentes. Pasa el
          cursor o toca cada punto para conocer dónde estamos.
        </p>
      </AnimatedReveal>

      <BrandMark variant="divider" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] items-center">
        {/* Map */}
        <AnimatedReveal distance={50}>
          <div className="relative w-full aspect-[2/1] rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm overflow-hidden">
            <svg
              viewBox={`0 0 ${WORLD_VIEWBOX.width} ${WORLD_VIEWBOX.height}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
            >
              <path
                d={WORLD_PATH}
                className="fill-primary/[0.06] stroke-primary/25"
                strokeWidth={0.6}
                strokeLinejoin="round"
              />
            </svg>

            {/* Markers overlay */}
            {locations.map((loc) => {
              const pos = pct(loc.lon, loc.lat);
              const isActive = active === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                  style={pos}
                  onMouseEnter={() => setActive(loc.id)}
                  onMouseLeave={() => setActive((c) => (c === loc.id ? null : c))}
                  onFocus={() => setActive(loc.id)}
                  onBlur={() => setActive((c) => (c === loc.id ? null : c))}
                  onClick={() => setActive(loc.id)}
                  aria-label={`${loc.city}, ${loc.country}`}
                >
                  {/* Pulsing halo */}
                  <span
                    className={cn(
                      "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40",
                      "size-3 animate-ping",
                      isActive ? "opacity-90" : "opacity-60"
                    )}
                  />
                  {/* Dot */}
                  <span
                    className={cn(
                      "relative block rounded-full bg-primary shadow-[0_0_10px_2px_color-mix(in_oklab,var(--primary)_70%,transparent)] transition-transform",
                      isActive ? "size-3.5 scale-110" : "size-2.5 group-hover:scale-125"
                    )}
                  />
                  {/* Tooltip */}
                  <span
                    role="tooltip"
                    className={cn(
                      "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border/60 bg-background/90 px-3 py-1.5 text-xs backdrop-blur-md transition-all duration-200",
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-1"
                    )}
                  >
                    <span className="mr-1">{loc.flag}</span>
                    <span className="font-semibold">{loc.city}</span>
                    <span className="text-muted-foreground">, {loc.country}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </AnimatedReveal>

        {/* Legend / list */}
        <AnimatedReveal distance={50} delay={0.1}>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {locations.map((loc) => {
              const isActive = active === loc.id;
              return (
                <li key={loc.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(loc.id)}
                    onMouseLeave={() =>
                      setActive((c) => (c === loc.id ? null : c))
                    }
                    onClick={() => setActive(loc.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-300",
                      isActive
                        ? "border-primary/50 bg-primary/10 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)]"
                        : "border-border/50 bg-background/40 hover:border-primary/30 hover:bg-primary/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg text-base transition-colors",
                        isActive ? "bg-primary/20" : "bg-muted/40"
                      )}
                    >
                      <MapPin
                        className={cn(
                          "size-4 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold tracking-tight">
                        {loc.flag} {loc.country}
                      </span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {loc.city}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </AnimatedReveal>
      </div>
    </section>
  );
}
