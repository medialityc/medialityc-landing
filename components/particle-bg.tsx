"use client";

import { GL } from "@/components/gl";
import { Leva } from "leva";

/**
 * Fondo de partículas original (sistema WebGL GPGPU) + panel de Leva visible
 * para ajustar las partículas en vivo.
 */
export function ParticleBg() {
  return (
    <>
      <GL />
      <Leva />
    </>
  );
}

export default ParticleBg;
