import type { Metadata, Viewport } from "next";
import { Archivo, Fragment_Mono } from "next/font/google";
import { Lightbox } from "@/components/Lightbox";
import { person, seo } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Archivo variable with its width axis: expanded caps for the nameplate, normal width for reading.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Fragment Mono only where the text literally is a path, endpoint or machine output.
const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: seo.title,
  description: seo.description,
  alternates: { canonical: "/" },
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    firstName: person.firstName,
    lastName: person.lastName,
    locale: "en_IN",
    siteName: person.name,
    title: seo.title,
    description: seo.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0D" },
  ],
};

// Applies a saved theme before first paint; otherwise CSS follows prefers-color-scheme.
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${fragmentMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        {children}
        <Lightbox />
      </body>
    </html>
  );
}
