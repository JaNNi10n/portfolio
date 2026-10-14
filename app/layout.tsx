import type { Metadata, Viewport } from "next";
import { Archivo, Fragment_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Lightbox } from "@/components/Lightbox";
import { person, seo } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Archivo (weight axis only) for all reading text. The width axis doubled the file and competed with the hero image.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

// Archivo Expanded Bold, subset to capitals (about 2 KB), for the nameplate, nav and footer wordmark only.
const archivoExpanded = localFont({
  src: "./fonts/archivo-expanded-bold-caps.woff2",
  weight: "700",
  variable: "--font-expanded",
  display: "swap",
  fallback: ["Archivo", "system-ui", "sans-serif"],
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

// Before first paint: marks JS as available (CSS gates the sticky walkthrough on it) and applies a saved theme;
// otherwise CSS follows prefers-color-scheme.
const THEME_SCRIPT = `document.documentElement.dataset.js="";try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${archivoExpanded.variable} ${fragmentMono.variable}`} suppressHydrationWarning>
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
