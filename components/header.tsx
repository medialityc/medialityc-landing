"use client";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import { useEffect, useRef, useState } from "react";
import { ColoredLogo } from "./colored-logo";

const sections = [
  { id: "sedes", label: "Sedes" },
  { id: "services", label: "Servicios" },
  { id: "beneficios", label: "Beneficios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "equipo", label: "Equipo" },
  { id: "testimonios", label: "Testimonios" },
  { id: "contacto", label: "Contacto" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const observersRef = useRef<IntersectionObserver[]>([]);
  const [bounceLogo, setBounceLogo] = useState(false);
  const prevScrolledRef = useRef(scrolled);
  const activeRef = useRef(active);
  activeRef.current = active;

  // Estado de scroll y progreso
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
      const firstSection = document.getElementById(sections[0].id);
      if (firstSection) {
        const heroBoundary = firstSection.offsetTop - 100;
        if (window.scrollY < heroBoundary && activeRef.current !== "") {
          setActive("");
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sección activa con IntersectionObserver
  useEffect(() => {
    observersRef.current.forEach((o) => o.disconnect());
    observersRef.current = [];
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(s.id);
          });
        },
        { root: null, threshold: 0.4 }
      );
      obs.observe(el);
      observersRef.current.push(obs);
    });
    return () => observersRef.current.forEach((o) => o.disconnect());
  }, []);

  // Rebote del logo al entrar en estado "scrolled"
  useEffect(() => {
    if (scrolled && !prevScrolledRef.current) {
      setBounceLogo(true);
      const t = setTimeout(() => setBounceLogo(false), 600);
      prevScrolledRef.current = scrolled;
      return () => clearTimeout(t);
    }
    prevScrolledRef.current = scrolled;
  }, [scrolled]);

  return (
    <div
      className={[
        "fixed left-0 top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 py-2 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-3.5",
      ].join(" ")}
    >
      {/* Barra de progreso de scroll */}
      <div className="absolute left-0 top-0 h-0.5 w-full overflow-hidden bg-white/5">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>

      <header className="container flex items-center justify-between">
        <Link
          href="/"
          aria-label="Ir al inicio"
          className={[
            "group relative inline-flex items-center",
            bounceLogo ? "animate-logo-bounce-in" : "",
          ].join(" ")}
        >
          <ColoredLogo
            className={[
              "w-auto transition-all duration-500 ease-out",
              scrolled ? "h-9 md:h-10" : "h-12 md:h-14",
            ].join(" ")}
          />
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-wider lg:flex">
          {sections.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={[
                  "relative py-1 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-foreground/50 hover:text-foreground",
                ].join(" ")}
                aria-current={isActive ? "true" : undefined}
              >
                {item.label}
                <span
                  className={[
                    "absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-primary transition-all duration-300",
                    isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="#contacto"
            aria-label="Ir a contacto"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Hablemos →
          </Link>
        </div>

        <MobileMenu />
      </header>
    </div>
  );
};
