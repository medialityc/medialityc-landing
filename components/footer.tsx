import Link from "next/link";
import { ColoredLogo } from "@/components/colored-logo";

const navLinks = [
  { id: "services", label: "Servicios" },
  { id: "beneficios", label: "Beneficios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "equipo", label: "Equipo" },
  { id: "testimonios", label: "Testimonios" },
  { id: "contacto", label: "Contacto" },
];

export function Footer() {
  const year = 2026;
  return (
    <footer className="relative border-t border-border/60">
      <div className="container py-14">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-sm space-y-4">
            <Link href="/" aria-label="Ir al inicio" className="inline-flex">
              <ColoredLogo className="w-[150px]" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Desarrollo de software, marketing y diseño para impulsar el
              crecimiento digital de tu empresa.
            </p>
          </div>

          <nav
            aria-label="Navegación del pie de página"
            className="grid grid-cols-2 gap-x-12 gap-y-3 font-mono text-xs uppercase tracking-wider sm:grid-cols-3"
          >
            {navLinks.map((l) => (
              <Link
                key={l.id}
                href={`#${l.id}`}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} Medialityc. Todos los derechos reservados.</p>
          <a
            href="mailto:contacto@medialityc.com"
            className="transition-colors hover:text-primary"
          >
            contacto@medialityc.com
          </a>
        </div>
      </div>
    </footer>
  );
}
