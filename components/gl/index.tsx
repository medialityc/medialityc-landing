"use client";
import { Effects } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Particles } from "./particles";
import { VignetteShader } from "./shaders/vignetteShader";
import * as THREE from "three";
import { useEffect, useRef, useState, useCallback } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

export const GL = () => {
  /**
   * Requerimiento: El scroll SOLO debe afectar noiseIntensity de forma suave.
   * Eliminamos cualquier movimiento de cámara y cálculos costosos por frame.
   */

  // Controles mínimos (podemos extender si se requiere más adelante sin afectar performance)
  const scroll = useScrollProgress(true);
  const {
    noiseBase,
    noiseScale,
    scrollBoost,
    pointSize,
    opacity,
    planeScale,
    size,
    vignetteDarkness,
    vignetteOffset,
    scrollCamStrength,
    scrollCamDepth,
  } = useControls("Partículas", {
    noiseBase: { value: 1.1, min: 0, max: 2, step: 0.01 }, // Intensidad base
    noiseScale: { value: 0.6, min: 0.1, max: 5, step: 0.1 }, // Escala de ruido
    scrollBoost: { value: 0.8, min: 0, max: 3, step: 0.01 }, // Cuánto amplifica el scroll
    pointSize: { value: 15.0, min: 0.5, max: 15, step: 0.1 },
    opacity: { value: 0.85, min: 0, max: 1, step: 0.01 },
    planeScale: { value: 8.0, min: 0.5, max: 15, step: 0.1 },
    size: { value: 512, options: [256, 512, 1024] },
    vignetteDarkness: { value: 1.5, min: 0, max: 2, step: 0.1 },
    vignetteOffset: { value: 0.4, min: 0, max: 2, step: 0.1 },
    scrollCamStrength: { value: 0.5, min: 0, max: 2, step: 0.01 }, // Amplitud en eje Y
    scrollCamDepth: { value: 0.4, min: 0, max: 2, step: 0.01 }, // Amplitud en eje Z
  });

  // Scroll normalizado 0-1 (ref para evitar renders innecesarios)
  const targetScrollRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0); // valor suavizado expuesto a la escena

  // Lerp manual ligero evitando setState masivo
  const lerp = useCallback(
    (a: number, b: number, t: number) => a + (b - a) * t,
    []
  );

  // Loop de suavizado con RAF (un solo efecto)
  useEffect(() => {
    let raf: number;
    const smooth = () => {
      setScrollProgress((prev) => {
        const next = lerp(prev, targetScrollRef.current, 0.08); // factor suave
        // Evita renders si el cambio es ínfimo
        if (Math.abs(next - prev) < 0.0005) return prev;
        return next;
      });
      raf = requestAnimationFrame(smooth);
    };
    raf = requestAnimationFrame(smooth);
    return () => cancelAnimationFrame(raf);
  }, [lerp]);

  // Listener de scroll pasivo y ultra ligero
  useEffect(() => {
    const update = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const raw = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      // No clamp duro para permitir easing near edges; se limita en cálculo final
      targetScrollRef.current = Math.min(Math.max(raw, 0), 1);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Easing (smoothstep) para darle sensación de contracción/expansión suave
  const eased = (() => {
    const t = scrollProgress;
    return t * t * (3 - 2 * t); // classic smoothstep
  })();

  // Sólo se modifica noiseIntensity (base + boost por scroll). Sin tocar cámara ni otros parámetros.
  const noiseIntensity = noiseBase * (1 + eased * scrollBoost);

  // Valores fijos para otros parámetros que requiere el material DOF.
  const speed = 1.0; // velocidad base del tiempo interno
  const focus = 3.8; // profundidad de foco
  const aperture = 1.6; // blur/apertura
  const timeScale = 1.0;
  const useManualTime = false;
  const manualTime = 0;

  // Referencia a la cámara para actualizar su posición sin re-render del Canvas
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const baseCamPos = useRef<[number, number, number]>([1.26, 2.66, -1.82]);

  // Actualizamos posición de cámara sólo cuando cambia el scroll suavizado
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    // Centro en 0 usando (eased - 0.5) para que el movimiento sea bidireccional y suave
    const t = eased - 0.5;
    const [bx, by, bz] = baseCamPos.current;
    cam.position.y = by + t * scrollCamStrength; // Movimiento vertical ligero
    cam.position.z = bz + t * scrollCamDepth; // Movimiento de profundidad sutil
    cam.lookAt(0, 0, 0); // Mantener foco al centro de la escena
  }, [eased, scrollCamStrength, scrollCamDepth]);

  return (
    <div id="webgl">
      <Canvas
        camera={{
          position: baseCamPos.current,
          fov: 50,
          near: 0.01,
          far: 300,
        }}
        onCreated={({ camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
        }}
        gl={{ antialias: false }} // Menos coste en GPU, partículas ya son pequeñas
      >
        <color attach="background" args={["#25222e"]} />
        <Particles
          speed={speed}
          aperture={aperture}
          focus={focus}
          size={size}
          noiseScale={noiseScale}
          noiseIntensity={noiseIntensity}
          timeScale={timeScale}
          pointSize={pointSize}
          opacity={opacity}
          planeScale={planeScale}
          useManualTime={useManualTime}
          manualTime={manualTime}
          introspect={Boolean(scroll)}
          scrollProgress={scrollProgress}
        />
        <Effects multisamping={0} disableGamma>
          <shaderPass
            args={[VignetteShader]}
            uniforms-darkness-value={vignetteDarkness}
            uniforms-offset-value={vignetteOffset}
          />
        </Effects>
      </Canvas>
    </div>
  );
};
