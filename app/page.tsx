/*
  Design read: developer/ML-engineer portfolio for Bangalore recruiters and ML hiring managers,
  with an instrumented, evidence-first language and one stepped scroll story. Next.js App Router
  plus Tailwind v4 tokens, Archivo (variable width) plus Fragment Mono, one olive "verified"
  accent, real project figures as all imagery, CSS-only motion.
  Dials: DESIGN_VARIANCE 7, MOTION_INTENSITY 5, VISUAL_DENSITY 5.
  Aesthetic: custom build on Tailwind v4 tokens, no third-party design system.
*/
import { GateCase } from "@/components/GateCase";
import { Hero } from "@/components/Hero";
import { Ledger } from "@/components/Ledger";
import { MoreProjects } from "@/components/MoreProjects";
import { Nav } from "@/components/Nav";
import { About, Contact, Footer, Skills } from "@/components/Profile";
import { Signature } from "@/components/Signature";
import { YoloCase } from "@/components/YoloCase";
import { education, links, person } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

function JsonLd() {
  const vit = education.find((e) => e.institution.startsWith("Vellore"));
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    url: SITE_URL,
    email: links.emailHref,
    address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
    alumniOf: vit ? { "@type": "CollegeOrUniversity", name: vit.institution } : undefined,
    sameAs: [links.linkedin, links.github],
    knowsAbout: ["Computer Vision", "Retrieval-Augmented Generation", "Large Language Models", "MLOps"],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main id="content" tabIndex={-1} className="outline-none">
        <Hero />
        <Ledger />
        <section id="work" aria-labelledby="projects-h" className="pt-12 md:pt-24">
          <div className="container-x">
            <h2 id="projects-h" className="t-h2 text-ink">
              Projects
            </h2>
            <p className="t-body mt-4 max-w-[66ch] text-ink-2">
              Six projects, each with its code and result files public on GitHub. The first follows one real question
              through the pipeline.
            </p>
          </div>
          <Signature />
        </section>
        <YoloCase />
        <GateCase />
        <MoreProjects />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
