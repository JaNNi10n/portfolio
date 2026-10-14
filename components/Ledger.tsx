import { SourceLink } from "./SourceLink";
import { ledgerRows, sharedHardware } from "@/lib/content";

/** One headline result per project, each in a sentence-like row with its context and source file. */
export function Ledger() {
  const rows = ledgerRows();
  return (
    <section aria-labelledby="results-h" className="container-x py-12 md:py-16">
      <h2 id="results-h" className="sr-only">
        Key results
      </h2>
      <ul>
        {rows.map(({ project, metric }) => (
          <li key={project.slug} className="ledger-row">
            <div className="grid-12 items-baseline gap-y-2 px-0 py-5 md:py-6">
              <a
                href={`#${project.slug}`}
                className="link-quiet t-small col-span-full py-1 font-semibold text-ink md:col-span-4 lg:col-span-3"
              >
                {project.title}
              </a>
              <p className="t-num-xl col-span-full text-ink md:col-span-4 lg:col-span-3">{metric.value}</p>
              <div className="col-span-full md:col-span-5 lg:col-span-6 xl:col-span-3">
                <p className="t-small font-semibold text-ink">{metric.label}</p>
                <p className="t-small text-ink-2">{metric.context}</p>
              </div>
              {/* 1024-1279: the path sits under its label so it never breaks mid-filename. */}
              <div className="col-span-full md:col-span-3 md:text-right lg:col-span-6 lg:col-start-7 lg:text-left xl:col-span-3 xl:col-start-auto xl:text-right">
                <SourceLink source={metric.source} sourceUrl={metric.sourceUrl} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="t-small mt-2 text-ink-3">{sharedHardware}</p>
    </section>
  );
}
