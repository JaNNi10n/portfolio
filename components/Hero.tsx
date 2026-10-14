import { ArrowDown, DownloadSimple } from "./icons";
import { Figure } from "./Figure";
import { hero, links, person } from "@/lib/content";

export function Hero() {
  const words = person.name.split(" ");
  const img = hero.heroImage;
  return (
    <section id="top" aria-labelledby="name-h" className="container-x pb-6 pt-6 md:pb-8 lg:pt-10">
      <div className="hero-name-wrap">
        <h1 id="name-h" className="t-name hero-name text-ink">
          {words.map((w, i) => (
            <span key={w}>
              <span className="w">
                <span style={{ "--i": i } as React.CSSProperties}>{w}</span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
      </div>

      <div className="grid-12 mt-6 gap-y-10 md:mt-8">
        <div className="col-span-full flex flex-col lg:col-span-5">
          <p className="t-lede hero-in text-ink" style={{ "--d": "220ms" } as React.CSSProperties}>
            {hero.headline}
          </p>
          <p
            className="t-lead hero-in mt-5 max-w-[38ch] text-ink-2"
            style={{ "--d": "300ms" } as React.CSSProperties}
          >
            {hero.subtext}
          </p>
          <div
            className="hero-in mt-7 flex flex-col gap-3 sm:flex-row"
            style={{ "--d": "360ms" } as React.CSSProperties}
          >
            <a href={hero.primaryCta.href} className="pill pill-primary pill-lg">
              {hero.primaryCta.label}
              <ArrowDown size={20} aria-hidden="true" />
            </a>
            <a
              href={links.resume}
              download
              type="application/pdf"
              title={`Download the resume of ${person.name} (PDF)`}
              className="pill pill-secondary pill-lg"
            >
              <DownloadSimple size={20} aria-hidden="true" />
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <Figure
          className="col-span-full lg:col-span-7 lg:col-start-6"
          img={img}
          sizes="(min-width: 1024px) 54vw, 100vw"
          priority
          caption={
            <>
              {img.caption}{" "}
              <a href="#yolo26-detector" className="link">
                See the project
              </a>
            </>
          }
        />
      </div>
      <div id="hero-sentinel" aria-hidden="true" className="h-px" />
    </section>
  );
}
