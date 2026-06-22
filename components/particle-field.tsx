"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Campo de partículas denso y performante.
 * Recrea el look de "nube/humo" del fondo original (miles de partículas finas
 * en movimiento orgánico) pero TODO el movimiento se calcula en el vertex
 * shader con curl-noise a partir de uTime — sin simulación GPGPU/FBO ni trabajo
 * por-frame en CPU. Soporta decenas de miles de puntos a 60fps.
 */

const VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uScroll;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec3 vColor;
  varying float vAlpha;

  // Simplex noise 3D (Ashima / Stefan Gustavson)
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main(){
    vec3 p = position;
    float tt = uTime * 0.12;
    // Flujo orgánico barato: un único ruido modula un campo sin/cos.
    float n = snoise(p * 0.14 + vec3(0.0, 0.0, uTime * 0.04));
    vec3 flow = vec3(
      sin(p.y * 0.55 + tt + n * 3.1),
      cos(p.x * 0.5 + tt * 0.9 + n * 3.1),
      sin(p.z * 0.7 + tt * 0.8 + n * 2.0)
    );
    float intensity = 0.45 + uScroll * 0.8;
    p += flow * intensity;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.5 + aSeed * 1.1);
    gl_PointSize = clamp(size * uPixelRatio * (1.0 / -mv.z), 1.0, 60.0);

    vec3 c = mix(uColorA, uColorB, aSeed);
    c = mix(c, uColorC, smoothstep(0.78, 1.0, aSeed));
    vColor = c;

    // Profundidad de campo aproximada: las partículas lejos del plano de foco
    // se atenúan, dando sensación de bokeh.
    float focus = 6.0;
    float blur = clamp(abs(-mv.z - focus) / 7.0, 0.0, 1.0);
    vAlpha = 1.0 - blur * 0.65;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
  }
`;

export function ParticleField({ count = 26000 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);

  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 13; // ancho
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8.5; // alto
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6; // profundidad
      seeds[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [count]);

  const mat = useMemo(() => {
    const dpr =
      typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1;
    return new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uSize: { value: 26 },
        uPixelRatio: { value: dpr },
        uOpacity: { value: 0.9 },
        uColorA: { value: new THREE.Color("#2bd4d8") },
        uColorB: { value: new THREE.Color("#75eff0") },
        uColorC: { value: new THREE.Color("#d6fbff") },
      },
    });
  }, []);

  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    const sp =
      typeof window !== "undefined"
        ? (() => {
            const max =
              document.documentElement.scrollHeight - window.innerHeight;
            return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
          })()
        : 0;
    mat.uniforms.uScroll.value = sp;
    document.documentElement.style.setProperty("--sp", sp.toFixed(3));
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <group ref={group}>
      {/* @ts-ignore intrinsics R3F */}
      <points geometry={geo} material={mat} />
    </group>
  );
}

export default ParticleField;
