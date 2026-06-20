"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedReveal } from "@/components/animated-reveal";
import { SectionHeading } from "@/components/section-heading";

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "contacto@medialityc.com",
    href: "mailto:contacto@medialityc.com",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Ciudad, País",
  },
];

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Envío simulado (reemplazar por endpoint / server action real)
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section
      id="contacto"
      className="relative scroll-mt-24 py-28 md:py-36"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Contacto"
          title={
            <span id="contact-heading">
              Hablemos de tu <span className="text-gradient">proyecto</span>
            </span>
          }
          description="¿Listo para transformar tu negocio? Completa el formulario o usa un canal directo. Respondemos en menos de 24 horas."
        />

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Formulario */}
          <AnimatedReveal distance={40}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-sm md:p-8"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground/90"
                  >
                    Nombre <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground/90"
                  >
                    Email <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-foreground/90"
                  >
                    Mensaje <span className="text-primary">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Cuéntanos sobre tu proyecto..."
                    className="min-h-36"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {sending ? (
                    <Send className="size-4 animate-pulse" />
                  ) : (
                    <>
                      Enviar mensaje
                      <Send className="size-4" />
                    </>
                  )}
                </button>

                <div aria-live="polite" className="min-h-5">
                  {sent && (
                    <p className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle2 className="size-4" />
                      ¡Mensaje enviado! Te responderemos pronto.
                    </p>
                  )}
                </div>
              </div>
            </form>
          </AnimatedReveal>

          {/* Canales directos */}
          <AnimatedReveal delay={0.1} distance={40}>
            <div className="flex h-full flex-col gap-4">
              {channels.map((c) => {
                const Icon = c.icon;
                const inner = (
                  <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/70">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-medium">{c.label}</h3>
                      <p className="text-sm text-muted-foreground">{c.value}</p>
                    </div>
                  </div>
                );
                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={c.label}>{inner}</div>
                );
              })}

              <div className="mt-auto rounded-2xl border border-primary/20 bg-primary/[0.06] p-5">
                <p className="text-sm leading-relaxed text-foreground/80">
                  Trabajamos con empresas de cualquier tamaño. Cuéntanos tu reto
                  y diseñamos la solución a tu medida.
                </p>
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
