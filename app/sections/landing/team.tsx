"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { equipo, obtenerIniciales } from "@/lib/equipo";

// Imagen de respaldo para miembros sin fotografía
const fallbackImg = "/team/fallback-avatar.svg";

// Mantener la exportación para compatibilidad pero ahora delega al carrusel.
import { TeamCarousel } from "../../../components/team-carousel";

export const TeamSection = () => {
  return <TeamCarousel />;
};
