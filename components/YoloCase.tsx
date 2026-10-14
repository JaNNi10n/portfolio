import { Figure } from "./Figure";
import { ArrowUpRight } from "./icons";
import { breakable } from "./SourceLink";
import { Approach, CodeLink, Limits, ProjectHeader, Stack } from "./ProjectParts";
import { image, project, repoOf } from "@/lib/content";

/** Figure-led spread with a hairline readout grid. */
export function YoloCase() {
  const p = project("yolo26-detector");
  const swagger = image(p, "/assets/yolo-swagger.webp");
  const demo = image(p, "/assets/yolo-demo-annotated.webp");
  const curves = image(p, "/assets/yolo-training-curves.webp");
  const matrix = image(p, "/assets/yolo-confusion-matrix.webp");

  return (
    <article id={p.slug} aria-labelledby="yolo-h" className="container-x py-12 md:py-24">
      <ProjectHeader project={p} headingId="yolo-h" />

      <div className="grid-12 mt-12 gap-y-10 md:mt-16">
        <Figure
          className="col-span-full lg:col-span-7"
          img={swagger}
          plateClassName="swagger-crop"
          sizes="(min-width: 1024px) 56vw, 100vw"
        />
        <Figure
          className="col-span-full max-w-[620px] lg:col-span-5"
          img={demo}
          sizes="(min-width: 1024px) 38vw, 100vw"
        />
      </div>

      <div className="grid-12 mt-16 gap-y-10">
        <p className="t-lead col-span-full text-ink lg:col-span-5">{p.problem}</p>
        <div className="readout col-span-full lg:col-span-7 lg:col-start-6">
          {p.metrics.map((m) => (
            <a
              key={m.label}
              href={m.sourceUrl}
              target="_blank"
              rel="noopener"
            >
              <span className="t-num-l text-ink">{m.value}</span>
              <span className="t-small font-semibold text-ink">{m.label}</span>
              <span className="t-small text-ink-2">{m.context}</span>
              <span className="readout-path source-link mt-auto min-w-0 self-start pt-2">
                <span>{breakable(m.source)}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </span>
              <span className="sr-only">, source file in {repoOf(m.sourceUrl)} on GitHub, opens in a new tab</span>
            </a>
          ))}
        </div>
      </div>

      <Figure className="mt-16" img={curves} sizes="(min-width: 1360px) 1248px, 100vw" />

      <div className="grid-12 mt-16 gap-y-12">
        <div className="col-span-full flex flex-col gap-12 lg:col-span-6">
          <Figure img={matrix} sizes="(min-width: 1024px) 48vw, 100vw" />
          <Approach items={p.approach} />
        </div>
        <div className="col-span-full flex flex-col gap-10 lg:col-span-5 lg:col-start-8">
          <Limits notes={p.honestNotes} />
          <Stack items={p.stack} />
          <CodeLink project={p} />
        </div>
      </div>
    </article>
  );
}
