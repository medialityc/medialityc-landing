import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  "aria-label"?: string;
  withArrow?: boolean;
};

/**
 * Botón-enlace de marca, reutilizable y consistente.
 * - primary: relleno aqua, alto contraste (CTA principal).
 * - ghost: contorno sutil sobre el fondo oscuro (acción secundaria).
 */
export function CtaLink({
  href,
  children,
  variant = "primary",
  className,
  withArrow = true,
  ...props
}: CtaLinkProps) {
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-[0_8px_30px_-8px_color-mix(in_srgb,var(--primary)_60%,transparent)] hover:shadow-[0_10px_38px_-8px_color-mix(in_srgb,var(--primary)_75%,transparent)] hover:brightness-110",
    ghost:
      "border border-border bg-white/[0.03] text-foreground backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
  };

  return (
    <Link
      href={href}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
}
