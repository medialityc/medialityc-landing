"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { LOGO_MARK_PATHS, LOGO_VIEWBOX } from "./logo-paths";

/**
 * Ave de nodos basada en el isotipo real de Medialityc.
 * Rasteriza los paths del logo (con Path2D) en un canvas offscreen, muestrea
 * los píxeles de la silueta como nodos y los conecta a sus vecinos más cercanos
 * (KNN) para formar una "red". Así la forma coincide con el logo. Luego se
 * anima en 3D (ondas de profundidad), reacciona al puntero y al scroll
 * (dispersión + desvanecimiento).
 */

function buildFromLogo() {
  if (typeof document === "undefined") return null;

  const W = 300;
  const H = Math.round((W * LOGO_VIEWBOX.h) / LOGO_VIEWBOX.w);
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#fff";
  ctx.save();
  ctx.scale(W / LOGO_VIEWBOX.w, H / LOGO_VIEWBOX.h);
  for (const d of LOGO_MARK_PATHS) {
    try {
      ctx.fill(new Path2D(d));
    } catch {
      /* Path2D no soportado: se ignora */
    }
  }
  ctx.restore();

  const data = ctx.getImageData(0, 0, W, H).data;
  const raw: [number, number][] = [];
  const step = 2;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 50) raw.push([x, y]);
    }
  }
  if (raw.length < 20) return null;

  // Submuestreo uniforme hasta el número objetivo de nodos
  const TARGET = 360;
  let pts = raw;
  if (raw.length > TARGET) {
    pts = [];
    const stride = raw.length / TARGET;
    for (let i = 0; i < TARGET; i++) pts.push(raw[Math.floor(i * stride)]);
  }
  const n = pts.length;

  // Caja envolvente para centrar/normalizar a unidades de mundo
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const WORLD = 4.8;
  const s = WORLD / (maxX - minX);

  const cIndigo = new THREE.Color("#6b7cf0");
  const cTeal = new THREE.Color("#2dd4bf");
  const cAqua = new THREE.Color("#9af3ff");

  // Nodos en coordenadas de mundo (arrays dinámicos para poder añadir patas)
  const P: number[][] = [];
  const C: number[][] = [];
  const pushNode = (x: number, y: number, z: number, col: THREE.Color) => {
    P.push([x, y, z]);
    C.push([col.r, col.g, col.b]);
    return P.length - 1;
  };

  for (let i = 0; i < n; i++) {
    const [x, y] = pts[i];
    const t = (x - minX) / (maxX - minX);
    const col =
      t < 0.5
        ? cIndigo.clone().lerp(cTeal, t / 0.5)
        : cTeal.clone().lerp(cAqua, (t - 0.5) / 0.5);
    pushNode((x - cx) * s, -(y - cy) * s, (Math.random() - 0.5) * 0.25, col);
  }
  const logoCount = P.length;

  // Conexiones del cuerpo: cada nodo con sus K vecinos más cercanos
  const K = 3;
  const seen = new Set<number>();
  const idx: number[] = [];
  const addEdge = (a: number, b: number) => {
    if (a === b) return;
    const key = a < b ? a * 100000 + b : b * 100000 + a;
    if (seen.has(key)) return;
    seen.add(key);
    idx.push(a, b);
  };
  for (let i = 0; i < logoCount; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < logoCount; j++) {
      if (j === i) continue;
      const dx = P[i][0] - P[j][0];
      const dy = P[i][1] - P[j][1];
      dists.push({ j, d: dx * dx + dy * dy });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < K && k < dists.length; k++) addEdge(i, dists[k].j);
  }

  // ---- Patas (no existen en el logo: se añaden proceduralmente) ----
  let wMinY = Infinity,
    wMaxY = -Infinity,
    wMinX = Infinity,
    wMaxX = -Infinity;
  for (let i = 0; i < logoCount; i++) {
    const x = P[i][0];
    const y = P[i][1];
    if (y < wMinY) wMinY = y;
    if (y > wMaxY) wMaxY = y;
    if (x < wMinX) wMinX = x;
    if (x > wMaxX) wMaxX = x;
  }
  const cX = (wMinX + wMaxX) / 2;

  const nearestLogo = (x: number, y: number) => {
    let best = 0;
    let bd = Infinity;
    for (let i = 0; i < logoCount; i++) {
      const dx = P[i][0] - x;
      const dy = P[i][1] - y;
      const d = dx * dx + dy * dy;
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
    return best;
  };

  for (const side of [-1, 1]) {
    const baseX = cX + side * 0.4;
    const topY = wMinY + 0.55; // se ancla algo por encima del borde inferior
    // Cadena de la pata (muslo -> rodilla -> tobillo) hacia abajo
    const chain: [number, number][] = [
      [baseX, topY],
      [baseX + side * 0.06, topY - 0.7],
      [baseX + side * 0.14, topY - 1.35],
    ];
    let prev = -1;
    let first = -1;
    chain.forEach((c, i) => {
      const id = pushNode(c[0], c[1], (Math.random() - 0.5) * 0.12, cAqua);
      if (i === 0) first = id;
      if (prev !== -1) addEdge(prev, id);
      prev = id;
    });
    // Ancla la parte alta de la pata al cuerpo
    addEdge(first, nearestLogo(chain[0][0], chain[0][1]));

    // Dedos / garras desde el tobillo
    const ankle = chain[chain.length - 1];
    const toes: [number, number, number][] = [
      [side * 0.02, -0.16, 0.18],
      [side * 0.2, -0.18, 0],
      [side * -0.08, -0.16, -0.18],
    ];
    for (const [tx, ty, tz] of toes) {
      const id = pushNode(ankle[0] + tx, ankle[1] + ty, tz, cAqua);
      addEdge(prev, id);
    }
  }

  // Volcado a typed arrays
  const total = P.length;
  const positions = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  for (let i = 0; i < total; i++) {
    positions[i * 3] = P[i][0];
    positions[i * 3 + 1] = P[i][1];
    positions[i * 3 + 2] = P[i][2];
    colors[i * 3] = C[i][0];
    colors[i * 3 + 1] = C[i][1];
    colors[i * 3 + 2] = C[i][2];
  }

  return { positions, colors, index: new Uint16Array(idx), count: total };
}

function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.85)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function NodeBird() {
  const group = useRef<THREE.Group>(null);
  const pointsMat = useRef<THREE.PointsMaterial>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);

  const data = useMemo(() => buildFromLogo(), []);
  const base = useMemo(() => (data ? data.positions.slice() : null), [data]);
  const sprite = useMemo(() => makeSprite(), []);

  const geo = useMemo(() => {
    if (!data) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
    g.setIndex(new THREE.BufferAttribute(data.index, 1));
    return g;
  }, [data]);

  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!geo || !data || !base) return;
    const t = state.clock.elapsedTime;
    const pos = geo.attributes.position.array as Float32Array;

    // Progreso de scroll de TODA la página (0..1): el ave acompaña el scroll.
    const sp =
      typeof window !== "undefined"
        ? (() => {
            const max =
              document.documentElement.scrollHeight - window.innerHeight;
            return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
          })()
        : 0;

    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3;
      const bx = base[i3];
      const by = base[i3 + 1];
      const bz = base[i3 + 2];
      const spread = 1 + sp * 0.35;
      pos[i3] = bx * spread;
      pos[i3 + 1] = by * spread;
      pos[i3 + 2] = bz + Math.sin(t * 1.5 + bx * 0.7 + by * 0.5) * 0.18;
    }
    geo.attributes.position.needsUpdate = true;

    if (group.current) {
      const p = state.pointer;
      // Tilt suave (silueta del logo legible) + giro lento ligado al scroll
      target.current.y = p.x * 0.3 + Math.sin(t * 0.3) * 0.12 + sp * 1.1;
      target.current.x = 0.04 - p.y * 0.18 + sp * 0.25;
      group.current.rotation.y +=
        (target.current.y - group.current.rotation.y) * 0.05;
      group.current.rotation.x +=
        (target.current.x - group.current.rotation.x) * 0.05;
      // Desciende a lo largo de la página y deriva suavemente
      group.current.position.y = 0.6 + Math.sin(t * 0.7) * 0.05 - sp * 7.5;
      group.current.position.x = Math.sin(sp * Math.PI) * 0.8;
    }

    // Permanece visible toda la página (se atenúa solo un poco hacia el final)
    const op = 1 - sp * 0.35;
    if (pointsMat.current) pointsMat.current.opacity = 0.9 * op;
    if (lineMat.current) lineMat.current.opacity = 0.22 * op;
  });

  if (!geo) return null;

  return (
    <group ref={group} scale={0.82}>
      {/* @ts-ignore intrinsics R3F */}
      <points geometry={geo}>
        {/* @ts-ignore */}
        <pointsMaterial
          ref={pointsMat}
          vertexColors
          size={0.06}
          sizeAttenuation
          map={sprite}
          alphaTest={0.01}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.95}
        />
      </points>
      {/* @ts-ignore */}
      <lineSegments geometry={geo}>
        {/* @ts-ignore */}
        <lineBasicMaterial
          ref={lineMat}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.22}
        />
      </lineSegments>
    </group>
  );
}

export default NodeBird;
