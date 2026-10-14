import { Figure } from "./Figure";
import { Metric } from "./Metric";
import { Approach, CodeLink, Limits, ProjectHeader, Stack } from "./ProjectParts";
import { SourceLink } from "./SourceLink";
import { image, metric, project } from "@/lib/content";

/** The verbatim failing line from results/gate_demo_truncate128/gate.log (line 17). */
const GATE_FAIL_LINE = "FAIL dense: ndcg@10 0.6803 vs baseline 0.7127 (delta -0.0324, tol 0.02)";

/** Typographic statement, revealed log figure, chart plus side column. */
export function GateCase() {
  const p = project("rag-retrieval-eval-gate");
  const ndcg = metric(p, "Hybrid nDCG@10");
  const recall = metric(p, "Hybrid Recall@100");
  const sig = metric(p, "Significance vs BM25");
  const caught = metric(p, "Regression caught by the gate");
  const tests = metric(p, "Tests and coverage");
  const gate = image(p, "/assets/ragbench-gate-demo.webp");
  const results = image(p, "/assets/ragbench-results.webp");

  const bm25 = ndcg.context.match(/vs ([\d.]+) for BM25/)?.[1] ?? "";
  const queries = ndcg.context.match(/(\d+) SciFact test queries/)?.[1] ?? "";
  const tol = caught.context.match(/tolerance ([\d.]+)/)?.[1] ?? "";

  return (
    <article id={p.slug} aria-labelledby="gate-h" className="container-x py-12 md:py-24">
      <ProjectHeader project={p} headingId="gate-h" />

      <div className="grid-12 mt-12 md:mt-16">
        <p className="t-lede col-span-full text-ink lg:col-span-10">
          On {queries} SciFact test queries, hybrid search reached nDCG@10 <Metric metric={ndcg} variant="inline" />{" "}
          against{" "}
          <Metric metric={ndcg} variant="inline" what="BM25 nDCG@10" text={bm25} />{" "}
          for BM25 (<Metric metric={sig} variant="inline" />
          ). A regression gate fails the build when any arm drops more than {tol} nDCG@10 below the committed
          baseline.
        </p>
      </div>

      <div className="mt-12 md:mt-16">
        <Figure
          img={gate}
          plateTone="dark"
          plateClassName="gate-reveal"
          sizes="(min-width: 1360px) 1248px, 100vw"
        />
        <div className="mt-3 flex flex-col items-start gap-1">
          <p className="t-mono text-ink-2">{GATE_FAIL_LINE}</p>
          <SourceLink source={caught.source} sourceUrl={caught.sourceUrl} />
        </div>
      </div>

      <div className="grid-12 mt-16 gap-y-12">
        <div className="col-span-full flex flex-col gap-12 lg:col-span-8">
          <Figure img={results} sizes="(min-width: 1024px) 64vw, 100vw" />
          <div className="max-w-[66ch]">
            <Approach items={p.approach} />
          </div>
        </div>
        <div className="col-span-full flex flex-col gap-8 lg:col-span-4">
          <Limits notes={p.honestNotes} />
          <Metric metric={recall} />
          <Metric metric={caught} />
          <Metric metric={tests} />
          <Stack items={p.stack} />
          <CodeLink project={p} />
        </div>
      </div>
    </article>
  );
}
