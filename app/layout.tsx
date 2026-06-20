import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { TechBackground } from "@/components/tech-background";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO & Social metadata derived from user-provided <head> snippet
export const metadata: Metadata = {
  title: {
    default: "Medialityc - Marketing, Publicidad y Desarrollo de Software",
    template: "%s | Medialityc",
  },
  description:
    "Medialityc ofrece soluciones integrales de marketing, publicidad y desarrollo de software. Descubre nuestro enfoque innovador y creativo.",
  applicationName: "Medialityc",
  keywords: [
    "Medialityc",
    "Marketing",
    "Publicidad",
    "Desarrollo de Software",
    "Innovación",
    "Creatividad",
  ],
  authors: [{ name: "Medialityc" }],
  creator: "Medialityc",
  publisher: "Medialityc",
  metadataBase: new URL("https://mdialityc.com"), // siguiendo URL solicitada
  alternates: {
    canonical: "https://mdialityc.com",
  },
  openGraph: {
    title: "Medialityc - Marketing, Publicidad y Desarrollo de Software",
    description:
      "Medialityc ofrece soluciones integrales de marketing, publicidad y desarrollo de software.",
    url: "https://mdialityc.com",
    siteName: "Medialityc",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/brand/og-image.png", // PNG placeholder 1200x630 (reemplazar con versión optimizada real)
        width: 1200,
        height: 630,
        alt: "Medialityc - Marketing, Publicidad y Software",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Medialityc - Marketing, Publicidad y Desarrollo de Software",
    description:
      "Medialityc ofrece soluciones integrales de marketing, publicidad y desarrollo de software.",
    images: ["/brand/og-image.png"], // PNG placeholder
    creator: "@medialityc", // ajustar si existe cuenta oficial
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" }, // fallback
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
    shortcut: "/favicon.ico",
  },
  category: "marketing",
  generator: "nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <TechBackground />
        <Header />
        {children}
      </body>
    </html>
  );
}
