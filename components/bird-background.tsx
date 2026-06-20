"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { NodeBird } from "@/components/three/node-bird";

/**
 * Capa de fondo 3D persistente: el ave de nodos vive detrás de todo el
 * contenido (no solo del hero) y desciende con el scroll. Lienzo fijo a pantalla
 * completa, sin capturar eventos. Monta solo en cliente, pausa cuando la pestaña
 * está oculta y respeta prefers-reduced-motion.
 */
export function BirdBackground() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-[5]">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced || hidden ? "demand" : "always"}
      >
        <NodeBird />
      </Canvas>
    </div>
  );
}

export default BirdBackground;
