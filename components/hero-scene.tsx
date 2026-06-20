"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { NodeBird } from "@/components/three/node-bird";

/**
 * Lienzo R3F del hero. Monta solo en cliente, pausa el render cuando sale del
 * viewport (ahorro de batería/GPU) y respeta prefers-reduced-motion.
 */
export function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {mounted && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          frameloop={reduced ? "demand" : visible ? "always" : "never"}
        >
          <NodeBird />
        </Canvas>
      )}
    </div>
  );
}

export default HeroScene;
