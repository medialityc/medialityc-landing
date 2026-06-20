"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: React.ReactNode;
  /** Px de desplazamiento por px de scroll relativo al centro del viewport. */
  speed?: number;
  className?: string;
};

/**
 * Parallax ligero ligado al scroll. Cachea la posición del elemento (solo la
 * recalcula al redimensionar) para evitar lecturas de layout en cada frame.
 * Respeta prefers-reduced-motion.
 */
export function Parallax({ children, speed = 0.08, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let centerAbs = 0;
    let raf = 0;
    let ticking = false;

    const measure = () => {
      const prev = el.style.transform;
      el.style.transform = "";
      const r = el.getBoundingClientRect();
      centerAbs = r.top + window.scrollY + r.height / 2;
      el.style.transform = prev;
    };

    const apply = () => {
      const off = window.scrollY + window.innerHeight / 2 - centerAbs;
      el.style.transform = `translate3d(0, ${(off * speed).toFixed(2)}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(apply);
      }
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn(className)} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
