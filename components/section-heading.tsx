import { cn } from "@/lib/utils";
import { AnimatedReveal } from "@/components/animated-reveal";
import { Parallax } from "@/components/parallax";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Velocidad de parallax al hacer scroll (0 = desactivado). */
  parallax?: number;
};

/**
 * Encabezado de sección consistente: etiqueta "eyebrow", título y descripción.
 * Unifica la jerarquía tipográfica en toda la landing.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  parallax = 0,
}: SectionHeadingProps) {
  const inner = (
    <AnimatedReveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
      distance={36}
    >
      <span className={cn("eyebrow", align === "center" && "justify-center")}>
        <span className="size-1.5 rounded-full bg-primary animate-status-pulse" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-sentient text-3xl leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
      )}
    </AnimatedReveal>
  );

  if (parallax) {
    return (
      <Parallax speed={parallax} className={align === "center" ? "" : "w-full"}>
        {inner}
      </Parallax>
    );
  }
  return inner;
}
