import { Figure } from "./Figure";
import { HourglassMedium, Plus } from "./icons";
import { Metric } from "./Metric";
import { Approach, CodeLink, Limits } from "./ProjectParts";
import { image, metric, project, type MetricData, type Project } from "@/lib/content";

type Row = {
  project: Project;
  key: MetricData | null;
  panelMetrics: MetricData[];
  figures: React.ReactNode;
};

function Panel({ row }: { row: Row }) {
  const p = row.project;
  return (
    <div className="grid-12 gap-y-10 bg-surface p-6">
      <div className="col-span-full flex flex-col gap-8 lg:col-span-6">
        <p className="t-body text-ink">{p.problem}</p>
        <Approach items={p.approach} />
        {row.panelMetrics.length ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {row.panelMetrics.map((m) => (
              <Metric key={m.label} metric={m} />
            ))}
          </div>
        ) : null}
        <Limits notes={p.honestNotes} />
      </div>
      <div className="col-span-full flex flex-col gap-8 lg:col-span-6">{row.figures}</div>
      <div className="col-span-full">
        <CodeLink project={p} />
      </div>
    </div>
  );
}

/** Disclosure index: native <details> rows. */
export function MoreProjects() {
  const sql = project("text2sql-agent");
  const hin = project("hinglish-sentiment");
  const credit = project("credit-risk");

  const hinMatrices = image(hin, "/assets/hinglish-confusion-matrices.webp");

  const rows: Row[] = [
    {
      project: sql,
      key: metric(sql, "Best 1.5B execution accuracy"),
      panelMetrics: sql.metrics,
      figures: <Figure img={image(sql, "/assets/text2sql-ex-by-arm.webp")} sizes="(min-width: 1024px) 46vw, 100vw" />,
    },
    {
      project: hin,
      key: metric(hin, "MuRIL weighted-F1"),
      panelMetrics: hin.metrics,
      figures: (
        <>
          <Figure img={image(hin, "/assets/hinglish-f1-by-cmi.webp")} sizes="(min-width: 1024px) 46vw, 100vw" />
          <Figure className="hidden lg:block" img={hinMatrices} sizes="46vw" />
          <p className="lg:hidden">
            <a
              href={hinMatrices.src}
              className="link t-body"
              aria-haspopup="dialog"
              data-lightbox=""
              data-src={hinMatrices.src}
              data-alt={hinMatrices.alt}
              data-caption={hinMatrices.caption}
              data-width={hinMatrices.width}
              data-height={hinMatrices.height}
            >
              View confusion matrices
            </a>
          </p>
        </>
      ),
    },
    {
      project: credit,
      key: null,
      panelMetrics: credit.facts ?? [],
      figures: (
        <Figure
          img={image(credit, "/assets/credit-mlflow-runs-synthetic.webp")}
          sizes="(min-width: 1024px) 46vw, 100vw"
        />
      ),
    },
  ];

  return (
    <section id="more" aria-labelledby="more-h" className="container-x py-12 md:py-20">
      <h2 id="more-h" className="t-h2 text-ink">
        More projects
      </h2>
      <div className="mt-10">
        {rows.map((row) => (
          <details key={row.project.slug} id={row.project.slug} className="disclosure">
            <summary>
              <div className="grid-12 items-center gap-y-2">
                <h3 className="col-span-3 text-[1.0625rem] font-[640] leading-snug text-ink [font-stretch:112%] md:col-span-4 lg:col-span-4">
                  {row.project.title}
                </h3>
                <p className="t-small hidden text-ink-2 lg:col-span-3 lg:block">{row.project.tagline}</p>
                <div className="order-3 col-span-3 md:order-none md:col-span-2 lg:col-span-3">
                  {row.key ? (
                    <p className="flex flex-col">
                      <span className="tnum text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink">
                        {row.key.value}
                      </span>
                      <span className="t-small text-ink-2">{row.key.label}</span>
                    </p>
                  ) : (
                    <span className="status-label">
                      <HourglassMedium size={16} aria-hidden="true" />
                      {row.project.statusLabel}
                    </span>
                  )}
                </div>
                <p className="t-mono order-4 col-span-1 text-ink-3 md:order-none md:col-span-1 md:text-right lg:text-left">
                  {row.project.dateLabel}
                </p>
                <span className="plus order-2 col-span-1 justify-self-end md:order-none" aria-hidden="true">
                  <Plus size={20} />
                </span>
              </div>
            </summary>
            <div className="pb-8">
              <Panel row={row} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
