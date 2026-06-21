"use client";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { ColoredLogo } from "./colored-logo";

const sections = [
  { id: "services", label: "Servicios" },
  { id: "beneficios", label: "Beneficios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "sedes", label: "Sedes" },
  { id: "equipo", label: "Equipo" },
  { id: "testimonios", label: "Testimonios" },
  { id: "contacto", label: "Contacto" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [progress, setProgress] = useState(0); // scroll progress 0-1
  const observersRef = useRef<IntersectionObserver[]>([]);
  const [bounceLogo, setBounceLogo] = useState(false);
  const prevScrolledRef = useRef(scrolled);

  // Scroll states & progress
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
      // While still in hero (before first content section), clear active highlight
      const firstSection = document.getElementById(sections[0].id);
      if (firstSection) {
        // Offset margin so user has to cross some portion before highlighting
        const heroBoundary = firstSection.offsetTop - 100; // 100px buffer
        if (window.scrollY < heroBoundary) {
          // Avoid redundant state updates
          if (active !== "") setActive("");
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined") return;
    observersRef.current.forEach((o) => o.disconnect());
    observersRef.current = [];

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(s.id);
            }
          });
        },
        { root: null, threshold: 0.4 }
      );
      obs.observe(el);
      observersRef.current.push(obs);
    });
    return () => observersRef.current.forEach((o) => o.disconnect());
  }, []);

  // Ajustes de transform del logo y padding del header según scroll
  const logoTransform = scrolled
    ? "scale-[0.50] translate-y-7"
    : "scale-[0.85] ";
  // Trigger one-time bounce animation when first entering scrolled state
  useEffect(() => {
    if (scrolled && !prevScrolledRef.current) {
      setBounceLogo(true);
      const t = setTimeout(() => setBounceLogo(false), 600);
      return () => clearTimeout(t);
    }
    prevScrolledRef.current = scrolled;
  }, [scrolled]);
  const logoWidth = scrolled
    ? "w-[110px] md:w-[130px]"
    : "w-[150px] md:w-[170px]";
  const logoWrapperHeight = scrolled ? "h-10" : "h-14"; // reduce vertical footprint
  const wrapperPadding = scrolled ? "py-3 md:py-4" : "py-6 md:py-7";

  return (
    <div
      className={[
        "fixed top-0 left-0 w-full z-50",
        wrapperPadding,
        "transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)]"
          : "bg-transparent",
      ].join(" ")}
      data-scrolled={scrolled ? "true" : "false"}
    >
      {/* Scroll progress bar */}
      <div className="absolute left-0 top-0 h-0.5 w-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
      <header
        className={[
          "flex items-center justify-between container relative",
          scrolled ? "min-h-11" : "min-h-16",
          "transition-[min-height] duration-300 ease-out",
        ].join(" ")}
      >
        <Link
          href="/"
          aria-label="Ir al inicio"
          className={[
            "relative inline-flex items-center",
            logoWrapperHeight,
            "group",
            bounceLogo ? "animate-logo-bounce-in" : "",
          ].join(" ")}
        >
          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-r from-primary/60 via-primary/25 to-transparent opacity-40 blur-lg group-hover:opacity-60 transition-opacity" />
          <ColoredLogo
            className={[
              "origin-top-left drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out will-change-transform",
              logoWidth,
              logoTransform,
            ].join(" ")}
          />
        </Link>
        <nav className="hidden lg:flex items-center gap-8 font-mono text-xs uppercase tracking-wider">
          {sections.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={[
                  "relative px-1 py-1 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-foreground/50 hover:text-foreground",
                ].join(" ")}
                aria-current={isActive ? "true" : undefined}
              >
                {item.label}
                <span
                  className={[
                    "absolute left-0 -bottom-0.5 h-0.5 w-full rounded-full bg-primary/70 transition-all duration-300",
                    isActive
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="#contacto"
            aria-label="Ir a la sección de contacto"
            className="group relative inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[11px] font-mono uppercase tracking-wider backdrop-blur-md bg-white/5 bg-linear-to-r from-primary/30 via-secondary/20 to-accent/10 border border-white/10 ring-1 ring-primary/30 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5)] text-primary hover:from-primary/40 hover:via-secondary/30 hover:to-accent/20 hover:shadow-[0_6px_18px_-4px_rgba(0,0,0,0.6)] transition-all duration-300"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
              {/* Soft sheen band */}
              <span className="absolute -left-full top-0 h-full w-1/3 bg-white/25 blur-xl opacity-0 group-hover:opacity-70 group-hover:translate-x-[300%] transition-all duration-1000 ease-out" />
              {/* Subtle inner glow */}
              <span className="absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-white/20 transition-colors" />
            </span>
            <span className="relative z-10 flex items-center gap-2">
              <span className="font-semibold tracking-[0.15em]">Hablemos</span>
              <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary/20 text-primary/90 backdrop-blur-sm transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </div>
        <MobileMenu />
      </header>
    </div>
  );
};
