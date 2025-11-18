"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin, Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { AnimatedReveal } from "@/components/animated-reveal";
import { BrandMark } from "../../../components/brand-mark";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulated async send (replace with real endpoint / action)
    await new Promise((r) => setTimeout(r, 900));
    console.log("[contact] Form submitted:", formData);
    setSending(false);
    setSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000); // auto hide message
  };

  return (
    <section
      id="contacto"
      className="py-24 md:py-32 relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Decorative background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -inset-[20%] opacity-40 bg-radial from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/10 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[780px] h-[780px] bg-radial from-primary/15 via-primary/0 to-transparent blur-3xl" />
      </div>
      <div className="container px-4 md:px-6 relative">
        {/* Corner emblem accent */}
        <div className="absolute -left-10 top-10 opacity-[0.05] hidden lg:block">
          <BrandMark variant="inline" className="w-40" alt="" />
        </div>
        <AnimatedReveal
          className="text-center space-y-6 mb-14 md:mb-20"
          delay={0}
        >
          <h2
            id="contact-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance"
          >
            Hablemos de tu <span className="text-primary">Proyecto</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-[720px] mx-auto text-pretty">
            ¿Listo para transformar tu negocio? Completa el formulario o usa un
            canal directo. Nos comprometemos a responder en menos de 24 horas.
          </p>
        </AnimatedReveal>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr,0.85fr] max-w-6xl mx-auto">
          <AnimatedReveal className="relative group" delay={0.05} distance={42}>
            <Card className="backdrop-blur-sm bg-background/80 border border-border/60 shadow-sm group">
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Envíanos un
                  mensaje
                </CardTitle>
                <CardDescription>
                  Nos encantará conocer tus objetivos y retos.
                </CardDescription>
                <div className="absolute right-4 top-4 text-xs font-mono text-primary/70">
                  #ContactForm
                </div>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  aria-describedby={sent ? "form-success" : undefined}
                >
                  <div className="space-y-2">
                    <Input
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      aria-label="Nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Tu email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      aria-label="Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Cuéntanos sobre tu proyecto..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="min-h-40"
                      required
                      aria-label="Mensaje"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full relative"
                  >
                    <span className={sending ? "opacity-0" : ""}>
                      Enviar Mensaje
                    </span>
                    {sending && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Send className="h-5 w-5 animate-pulse" />
                      </span>
                    )}
                  </Button>
                  {sent && (
                    <div
                      id="form-success"
                      className="text-sm text-primary flex items-center gap-2 animate-in fade-in slide-in-from-top-2"
                      role="status"
                    >
                      <Sparkles className="h-4 w-4" /> ¡Mensaje enviado! Te
                      responderemos pronto.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </AnimatedReveal>
          <div className="space-y-6">
            <AnimatedReveal delay={0.1} distance={40}>
              <Card className="transition group hover:border-primary/50 hover:shadow-[0_0_0_1px_hsl(var(--primary))]">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground select-all">
                      contacto@medialityc.com
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedReveal>
            <AnimatedReveal delay={0.18} distance={40}>
              <Card className="transition group hover:border-primary/50 hover:shadow-[0_0_0_1px_hsl(var(--primary))]">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Teléfono</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedReveal>
            <AnimatedReveal delay={0.26} distance={40}>
              <Card className="transition group hover:border-primary/50 hover:shadow-[0_0_0_1px_hsl(var(--primary))]">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ubicación</h3>
                    <p className="text-muted-foreground">Ciudad, País</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
