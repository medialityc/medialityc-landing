"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Plus, Minus, Maximize2 } from "lucide-react";
import { AnimatedReveal } from "@/components/animated-reveal";
import { SectionHeading } from "@/components/section-heading";
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

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

type Transform = { scale: number; tx: number; ty: number };

export function LocationsSection() {
  const [active, setActive] = useState<string | null>(null);
  const [t, setT] = useState<Transform>({ scale: 1, tx: 0, ty: 0 });
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const tRef = useRef(t);
  tRef.current = t;

  // Pointer drag bookkeeping
  const down = useRef(false);
  const moved = useRef(false);
  const start = useRef({ x: 0, y: 0, tx: 0, ty: 0, w: 1, h: 1, pointerId: 0 });

  // Zoom toward an anchor point (in container px), clamping pan to keep edges in view.
  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number, w: number, h: number) => {
      setT((prev) => {
        const ns = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE);
        const contentX = (cx - prev.tx) / prev.scale;
        const contentY = (cy - prev.ty) / prev.scale;
        const tx = clamp(cx - contentX * ns, w * (1 - ns), 0);
        const ty = clamp(cy - contentY * ns, h * (1 - ns), 0);
        return { scale: ns, tx, ty };
      });
    },
    []
  );

  // Non-passive wheel listener so we can preventDefault (page won't scroll while zooming).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      zoomAt(factor, e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    down.current = true;
    moved.current = false;
    start.current = {
      x: e.clientX,
      y: e.clientY,
      tx: tRef.current.tx,
      ty: tRef.current.ty,
      w: rect.width,
      h: rect.height,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!down.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (!moved.current && Math.hypot(dx, dy) > 4) {
      moved.current = true;
      setDragging(true);
      containerRef.current?.setPointerCapture(start.current.pointerId);
    }
    if (!moved.current) return;
    const { w, h } = start.current;
    setT((prev) => ({
      scale: prev.scale,
      tx: clamp(start.current.tx + dx, w * (1 - prev.scale), 0),
      ty: clamp(start.current.ty + dy, h * (1 - prev.scale), 0),
    }));
  };

  const endDrag = () => {
    if (!down.current) return;
    down.current = false;
    setDragging(false);
    try {
      containerRef.current?.releasePointerCapture(start.current.pointerId);
    } catch {}
  };

  const zoomButton = (factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAt(factor, rect.width / 2, rect.height / 2, rect.width, rect.height);
  };

  const reset = () => setT({ scale: 1, tx: 0, ty: 0 });
  const inv = 1 / t.scale; // counter-scale for markers so they keep a constant size

  return (
    <section
      id="sedes"
      className="relative scroll-mt-24 py-28 md:py-36"
      aria-labelledby="locations-heading"
    >
      <div className="container">
        <SectionHeading
          parallax={0.05}
          eyebrow="Presencia global"
          title={<span id="locations-heading">Nuestras sedes en el mundo</span>}
          description="Conectamos talento y tecnología a través de continentes. Arrastra para moverte, usa la rueda o los botones para hacer zoom, y toca cada punto para ver dónde estamos."
        />

        {/* Mapa */}
        <AnimatedReveal distance={50} className="mt-14">
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className={cn(
            "relative w-full aspect-[16/10] md:aspect-[2/1] rounded-2xl border border-border/70 bg-card/40 backdrop-blur-sm overflow-hidden touch-none select-none",
            dragging ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          {/* Transformed layer: map + markers move/zoom together */}
          <div
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${t.tx}px, ${t.ty}px) scale(${t.scale})`,
              transition: dragging ? "none" : "transform 0.18s ease-out",
            }}
          >
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
                vectorEffect="non-scaling-stroke"
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
                  onClick={() => {
                    if (moved.current) return; // ignore click that ended a drag
                    setActive(loc.id);
                  }}
                  aria-label={`${loc.city}, ${loc.country}`}
                >
                  {/* Counter-scale wrapper keeps marker visuals a constant screen size */}
                  <span
                    className="relative block"
                    style={{ transform: `scale(${inv})`, transformOrigin: "center" }}
                  >
                    {/* Pulsing halo */}
                    <span
                      className={cn(
                        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 size-3 animate-ping",
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
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                      )}
                    >
                      <span className="mr-1">{loc.flag}</span>
                      <span className="font-semibold">{loc.city}</span>
                      <span className="text-muted-foreground">, {loc.country}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Zoom controls (outside the transformed layer) */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => zoomButton(1.4)}
              aria-label="Acercar"
              className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-foreground backdrop-blur-md transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              <Plus className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => zoomButton(1 / 1.4)}
              aria-label="Alejar"
              className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-foreground backdrop-blur-md transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              <Minus className="size-4" />
            </button>
            <button
              type="button"
              onClick={reset}
              aria-label="Restablecer vista"
              className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-foreground backdrop-blur-md transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>

          {/* Hint */}
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-background/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
            Arrastra · rueda para zoom
          </div>
        </div>
      </AnimatedReveal>

      {/* Legend / list */}
      <AnimatedReveal distance={50} delay={0.1}>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {locations.map((loc) => {
            const isActive = active === loc.id;
            return (
              <li key={loc.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(loc.id)}
                  onMouseLeave={() => setActive((c) => (c === loc.id ? null : c))}
                  onClick={() => setActive(loc.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-300",
                    isActive
                      ? "border-primary/50 bg-primary/10 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)]"
                      : "border-border/70 bg-card/40 hover:border-primary/40 hover:bg-card/70"
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
