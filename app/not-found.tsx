import type { Metadata } from "next";
import { person } from "@/lib/content";

export const metadata: Metadata = {
  title: `Page not found | ${person.name}`,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="content" className="container-x flex min-h-[100dvh] flex-col justify-center py-16">
      <p className="t-mono text-ink-3">404</p>
      <h1 className="t-h2 mt-3 text-ink">This page does not exist.</h1>
      <p className="mt-8">
        <a href="/" className="pill pill-primary pill-lg">
          Back to the homepage
        </a>
      </p>
    </main>
  );
}
