"use client";

import { useEffect, useRef } from "react";

/**
 * TechBackground
 * Fondo decorativo ligero y performante que reemplaza la simulación GPGPU de
 * ~262k partículas. Combina tres capas baratas para la GPU/CPU:
 *  1. Aurora: blobs de gradiente radial animados solo con `transform` (CSS).
 *  2. Grid: patrón de puntos con máscara de desvanecimiento (CSS puro, 0 coste runtime).
 *  3. Constelación: red de nodos en un canvas 2D, con número de nodos capado,
 *     DPR limitado, y pausa cuando la pestaña está oculta o el usuario pidió
 *     reducir el movimiento.
 */
export function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // DPR limitado: nitidez suficiente sin penalizar GPUs integradas.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];

    const ACCENT = { r: 117, g: 233, b: 240 }; // brand aqua (#75e9f0)
    const LINK_DIST = 140; // distancia máx. para dibujar enlaces
    const MOUSE_DIST = 170;
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      // Fallback a las dimensiones de la ventana si el layout aún no reporta
      // tamaño (p. ej. durante la hidratación).
      width = canvas!.clientWidth || window.innerWidth;
      height = canvas!.clientHeight || window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Densidad proporcional al área, con tope para mantener O(n^2) barato.
      const target = Math.min(90, Math.floor((width * height) / 16000));
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // Mover y dibujar nodos
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!prefersReduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }

        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0.55)`;
        ctx!.fill();
      }

      // Enlaces entre nodos cercanos
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.18;
            ctx!.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }

        // Enlace sutil hacia el cursor (interacción "tech")
        if (mouse.active) {
          const dx = a.x - mouse.x;
          const dy = a.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_DIST) {
            const alpha = (1 - dist / MOUSE_DIST) * 0.4;
            ctx!.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.stroke();
          }
        }
      }
    }

    let raf = 0;
    let running = true;
    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        loop();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onPointerLeave = () => {
      mouse.active = false;
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (prefersReduced) draw();
      }, 150);
    };

    // Medición inmediata (con fallback) + re-medición tras el layout + RO +
    // listener de resize. Cubre hidratación, StrictMode y cambios de viewport.
    resize();
    const rafResize = requestAnimationFrame(() => {
      resize();
      if (prefersReduced) draw();
    });
    const ro = new ResizeObserver(() => {
      resize();
      if (prefersReduced) draw();
    });
    ro.observe(canvas);
    window.addEventListener("resize", onResize);

    if (prefersReduced) {
      draw();
    } else {
      loop();
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerout", onPointerLeave, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafResize);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Capa 1 — Aurora (gradientes que derivan suavemente) */}
      <div className="tech-aurora absolute -inset-[20%]">
        <span className="tech-aurora__blob tech-aurora__blob--1" />
        <span className="tech-aurora__blob tech-aurora__blob--2" />
        <span className="tech-aurora__blob tech-aurora__blob--3" />
      </div>

      {/* Capa 2 — Grid de puntos con desvanecimiento radial */}
      <div className="tech-grid absolute inset-0" />

      {/* Capa 3 — Constelación en canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Viñeta para foco en el contenido */}
      <div className="tech-vignette absolute inset-0" />
    </div>
  );
}

export default TechBackground;
