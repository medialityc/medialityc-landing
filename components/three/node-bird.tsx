"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Ave tecnológica construida con nodos + conexiones (acorde a la identidad de
 * marca). Geometría generada proceduralmente: columna central, cabeza/pico,
 * cola y dos alas triangulares en malla. Se anima con un aleteo (los nodos de
 * las puntas se mueven más) y reacciona al puntero y al scroll (rotación,
 * dispersión y desvanecimiento al salir del hero).
 */

const COLOR_BODY = new THREE.Color("#2bd4d8");
const COLOR_TIP = new THREE.Color("#a6f7ff");

function buildBird() {
  const positions: number[] = [];
  const colors: number[] = [];
  const flaps: number[] = [];
  const idx: number[] = [];
  let count = 0;

  const add = (x: number, y: number, z: number, flap: number) => {
    const i = count++;
    positions.push(x, y, z);
    const c = COLOR_BODY.clone().lerp(COLOR_TIP, flap);
    colors.push(c.r, c.g, c.b);
    flaps.push(flap);
    return i;
  };
  const link = (a: number, b: number) => idx.push(a, b);

  // Columna central (cola -> cabeza)
  const SP = 7;
  const spine: number[] = [];
  for (let s = 0; s <= SP; s++) {
    const ty = s / SP;
    const y = -1.3 + ty * 2.4;
    const z = Math.sin(ty * Math.PI) * 0.14;
    const i = add(0, y, z, 0.05);
    spine.push(i);
    if (s > 0) link(spine[s - 1], spine[s]);
  }
  const head = spine[SP];
  const shoulder = spine[Math.round(SP * 0.62)];
  // Pico hacia adelante
  const beak = add(0, 1.18, 0.34, 0);
  link(head, beak);

  // Cola en abanico
  for (const side of [-1, 1]) {
    const t1 = add(side * 0.18, -1.55, 0, 0.18);
    const t2 = add(side * 0.34, -1.78, -0.06, 0.28);
    link(spine[0], t1);
    link(t1, t2);
  }

  // Alas (malla triangular que se eleva hacia afuera)
  const NS = 9; // segmentos a lo largo del ala
  const NF = 4; // profundidad de "plumas"
  for (const side of [-1, 1]) {
    const grid: number[][] = [];
    for (let i = 1; i <= NS; i++) {
      const sp = i / NS;
      grid[i] = [];
      for (let j = 0; j <= NF; j++) {
        const fd = j / NF;
        const x = side * (0.15 + sp * 2.35);
        const y = 0.55 + sp * 0.55 - fd * (0.25 + sp * 0.85);
        const z = Math.sin(sp * 2.0) * 0.2 - fd * 0.05;
        const flap = Math.min(1, sp * 1.0 + fd * 0.08);
        const id = add(x, y, z, flap);
        grid[i][j] = id;
        if (i > 1) link(grid[i - 1][j], grid[i][j]);
        if (j > 0) link(grid[i][j - 1], grid[i][j]);
      }
    }
    link(shoulder, grid[1][0]);
    link(spine[Math.round(SP * 0.5)], grid[1][1]);
    // Conexiones cruzadas para reforzar el aspecto de "red"
    for (let i = 2; i <= NS; i += 2) link(grid[i][0], grid[i - 1][Math.min(NF, 2)]);
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    flaps: new Float32Array(flaps),
    index: new Uint16Array(idx),
    count,
  };
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
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export function NodeBird() {
  const group = useRef<THREE.Group>(null);
  const pointsMat = useRef<THREE.PointsMaterial>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);

  const data = useMemo(() => buildBird(), []);
  const base = useMemo(() => data.positions.slice(), [data]);
  const sprite = useMemo(() => makeSprite(), []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
    g.setIndex(new THREE.BufferAttribute(data.index, 1));
    return g;
  }, [data]);

  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = geo.attributes.position.array as Float32Array;

    // Progreso de salida del hero (0 arriba, 1 tras un viewport de scroll)
    const scroll =
      typeof window !== "undefined"
        ? Math.min(window.scrollY / (window.innerHeight || 1), 1)
        : 0;

    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3;
      const fl = data.flaps[i];
      const bx = base[i3];
      const by = base[i3 + 1];
      const bz = base[i3 + 2];
      const flap = Math.sin(t * 2.2 + bx * 1.2) * 0.3 * fl;
      const spread = 1 + scroll * 0.7 * fl; // dispersión cinematográfica
      pos[i3] = bx * spread;
      pos[i3 + 1] = by + flap + Math.sin(t * 1.2) * 0.03;
      pos[i3 + 2] = bz + flap * 0.6;
    }
    geo.attributes.position.needsUpdate = true;

    if (group.current) {
      const p = state.pointer;
      // De frente (alas extendidas, forma de ave reconocible) con balanceo
      // suave + parallax de puntero. El scroll gira y echa atrás de forma
      // cinematográfica, sin perder la silueta.
      target.current.y = p.x * 0.45 + Math.sin(t * 0.25) * 0.22 + scroll * 0.9;
      target.current.x = 0.16 - p.y * 0.25 + scroll * 0.5;
      group.current.rotation.y +=
        (target.current.y - group.current.rotation.y) * 0.06;
      group.current.rotation.x +=
        (target.current.x - group.current.rotation.x) * 0.06;
      const sc = 0.72 * (1 + scroll * 0.3);
      group.current.scale.setScalar(sc);
      group.current.position.y = Math.sin(t * 0.8) * 0.05 - scroll * 0.6;
    }

    const op = Math.max(0, 1 - scroll * 1.1);
    if (pointsMat.current) pointsMat.current.opacity = 0.95 * op;
    if (lineMat.current) lineMat.current.opacity = 0.3 * op;
  });

  return (
    <group ref={group} rotation={[0.16, 0, 0]} scale={0.72}>
      {/* @ts-ignore intrinsics R3F */}
      <points geometry={geo}>
        {/* @ts-ignore */}
        <pointsMaterial
          ref={pointsMat}
          vertexColors
          size={0.08}
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
          opacity={0.3}
        />
      </lineSegments>
    </group>
  );
}

export default NodeBird;
