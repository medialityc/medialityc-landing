"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { ParticleField } from "@/components/particle-field";

/**
 * Fondo global: campo de partículas denso (estilo "nube" del fondo original)
 * renderizado en GPU vía R3F, performante. Lienzo fijo a pantalla completa,
 * detrás de todo el contenido. Monta solo en cliente, pausa cuando la pestaña
 * está oculta y respeta prefers-reduced-motion.
 */
export function TechBackground() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {mounted && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: false, alpha: true }}
          frameloop={reduced || hidden ? "demand" : "always"}
        >
          <ParticleField count={isMobile ? 11000 : 26000} />
        </Canvas>
      )}

      {/* Viñeta para enfocar el contenido (se intensifica con el scroll vía --sp) */}
      <div className="tech-vignette absolute inset-0" />
    </div>
  );
}

export default TechBackground;
