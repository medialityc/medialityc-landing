"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useIntersection } from "@/hooks/use-intersection";

type AnimatedRevealProps<T extends React.ElementType = "div"> = {
  children: React.ReactNode;
  as?: T;
  className?: string;
  delay?: number; // seconds
  distance?: number; // px translateY
};

// Reusable reveal wrapper: fades & slides content upward when entering viewport.
// Uses inline style for translate to avoid Tailwind arbitrary class generation complexity.
export function AnimatedReveal<T extends React.ElementType = "div">({
  children,
  as,
  className,
  delay = 0,
  distance = 24,
}: AnimatedRevealProps<T>) {
  const { ref, inView } = useIntersection({ threshold: 0.15 });

  return (
    <div
      ref={ref as any}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none",
        inView ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        transitionDelay: `${delay}s`,
        transform: inView
          ? "translateY(0) scale(1)"
          : `translateY(${distance}px) scale(0.97)`,
        filter: inView ? "blur(0px)" : "blur(6px)",
      }}
    >
      {children}
    </div>
  );
}
