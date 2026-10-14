import Image from "next/image";
import { Metric } from "./Metric";
import { Approach, CodeLink, Limits, ProjectHeader, Stack } from "./ProjectParts";
import { SignatureObserver } from "./SignatureObserver";
import { SourceLink } from "./SourceLink";
import { image, metric, project, signature as sig } from "@/lib/content";

const SCAN = { w: 1097, h: 1537 };

/** Regions of the scan in percent of the image, drawn from the asset and checked on screen. */
const BOXES = [
  { id: "stamp", left: 8.0, top: 2.5, width: 40.0, height: 2.0, band: false },
  { id: "textblock", left: 7.5, top: 2.3, width: 66.5, height: 29.0, band: false },
  { id: "invoiceId", left: 26.0, top: 7.1, width: 14.8, height: 2.0, band: false },
  { id: "gst", left: 7.6, top: 27.3, width: 23.5, height: 1.9, band: true },
  { id: "total", left: 7.6, top: 29.0, width: 31.4, height: 1.9, band: true },
] as const;

const px = (pct: number, total: number) => Number(((pct / 100) * total).toFixed(1));

/** One sizes value for every copy of the scan, so the browser resolves and caches a single URL. */
const CAMERA_SIZES = "(min-width: 1024px) 60vw, 140vw";

function Camera({ label }: { label?: string }) {
  const p = project(sig.projectSlug);
  const scan = image(p, "/assets/mmrag-sample-invoice.webp");
  return (
    <div className="camera" {...(label ? { role: "img", "aria-label": label } : {})}>
      <Image src={scan.src} alt="" width={scan.width} height={scan.height} sizes={CAMERA_SIZES} quality={80} loading="lazy" />
      <svg className="overlays" viewBox={`0 0 ${SCAN.w} ${SCAN.h}`} aria-hidden="true" focusable="false">
        {BOXES.map((b) => {
          const r = {
            x: px(b.left, SCAN.w),
            y: px(b.top, SCAN.h),
            width: px(b.width, SCAN.w),
            height: px(b.height, SCAN.h),
          };
          return (
            <g key={b.id} className="ov" data-o={b.id}>
              {b.band ? <rect className="ov-band" {...r} /> : null}
              <rect className="ov-stroke" pathLength={1} {...r} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Chart({ sizes }: { sizes: string }) {
  const p = project(sig.projectSlug);
  const chart = image(p, "/assets/mmrag-retrieval-hit-at-k.webp");
  return (
    <Image src={chart.src} alt={chart.alt} width={chart.width} height={chart.height} sizes={sizes} quality={80} loading="lazy" />
  );
}

/** Static frame for one step, used below 1024px (or on short desktops) instead of the sticky stage. */
function Frame({ n }: { n: number }) {
  const p = project(sig.projectSlug);
  const chart = image(p, "/assets/mmrag-retrieval-hit-at-k.webp");
  if (n === 5) {
    return (
      <figure className="sig-frame mb-6">
        <div className="frame" data-state="5">
          <div className="stage-chart" style={{ opacity: 1 }}>
            <Chart sizes="100vw" />
          </div>
        </div>
        <figcaption className="caption">{chart.caption}</figcaption>
      </figure>
    );
  }
  return (
    <div className="sig-frame mb-6" aria-hidden="true">
      <div className="frame" data-state={n}>
        <Camera />
      </div>
    </div>
  );
}

function Evidence({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex flex-col items-start gap-2">{children}</div>;
}

export function Signature() {
  const p = project(sig.projectSlug);
  const e2e = metric(p, "End-to-end answer accuracy");
  const hit1 = metric(p, "BM25 page hit@1 on OCR'd scans");
  const reader = metric(p, "Reader accuracy when the right page was retrieved");
  const vram = metric(p, "Peak VRAM");
  const chart = image(p, "/assets/mmrag-retrieval-hit-at-k.webp");

  const invoiceId = sig.question.match(/INV-[\d-]+\d/)?.[0] ?? "";
  const ocrGst = sig.ocrExcerpt.match(/GST[^:]*/)?.[0] ?? "";
  const tokens = sig.ocrTokens;
  const tokenList = `${tokens.slice(0, -1).join(", ")} and ${tokens[tokens.length - 1]}`;
  const e2eCount = e2e.context.match(/^(\d+) of (\d+)/);
  const readerRight = reader.value.split(" / ")[0];
  const misses = sig.questions - Number(readerRight);
  const imageOnly = sig.imageOnlyCorrect.replace(" / ", " of ");

  const S = sig.sources;

  return (
    <article id={p.slug} className="sig mt-16 md:mt-24" data-step="4" aria-labelledby="mmrag-h">
      <div className="container-x">
        <ProjectHeader project={p} headingId="mmrag-h" />

        <div className="grid-12 mt-12 md:mt-16">
          <div className="sig-stage-col lg:col-span-6">
            <div className="sig-sticky">
              {/* Only the scan is role="img"; the chart below keeps its own alt text for screen readers. */}
              <div className="stage" data-state="4">
                <Camera label="Synthetic invoice scan used in the walkthrough. Highlights follow each step." />
                <div className="stage-chart">
                  <Chart sizes="(min-width: 1024px) 46vw, 100vw" />
                </div>
              </div>
              <p className="stage-caption caption">{chart.caption}</p>
            </div>
          </div>

          <div className="col-span-full lg:col-span-5 lg:col-start-8">
            <section className="sig-step py-10" data-n="1" aria-labelledby="sig-1">
              <Frame n={1} />
              <h4 id="sig-1" className="t-h3 text-ink">
                A scan with no text layer
              </h4>
              <p className="t-body mt-3 text-ink-2">
                The evaluation set has {sig.documents} synthetic one-page documents, rendered as degraded scans. A
                scan has no text layer, so there is nothing to search until OCR runs.
              </p>
              <Evidence>
                <p className="t-mono text-ink">{sig.stamp}</p>
                <SourceLink source={S.data.source} sourceUrl={S.data.sourceUrl} label="README.md (Results)" />
              </Evidence>
            </section>

            <section className="sig-step py-10" data-n="2" aria-labelledby="sig-2">
              <Frame n={2} />
              <h4 id="sig-2" className="t-h3 text-ink">
                OCR turns pixels into words
              </h4>
              <p className="t-body mt-3 text-ink-2">
                RapidOCR reads the page on the CPU. The text is close but not clean: the printed &ldquo;GST
                (18%)&rdquo; comes back as &ldquo;{ocrGst}&rdquo;.
              </p>
              <Evidence>
                <p className="ocr-block t-mono w-full text-ink">{sig.ocrExcerpt}</p>
                <p className="t-small text-ink-2">
                  Local OCR output (the index is not committed). Regenerate it with{" "}
                  <code className="t-mono text-ink">{sig.ocrReproduce}</code>.
                </p>
                <SourceLink source={S.ocr.source} sourceUrl={S.ocr.sourceUrl} label="mmrag/ingest.py (RapidOCR step)" />
              </Evidence>
            </section>

            <section className="sig-step py-10" data-n="3" aria-labelledby="sig-3">
              <Frame n={3} />
              <h4 id="sig-3" className="t-h3 text-ink">
                BM25 finds the page
              </h4>
              <blockquote className="t-lead mt-4 text-ink">&ldquo;{sig.question}&rdquo;</blockquote>
              <p className="t-body mt-3 text-ink-2">
                The tokenizer splits {invoiceId} into {tokenList}, so the identifier still matches when OCR drops or
                changes the hyphens.
              </p>
              <Evidence>
                <p className="t-mono text-ink">{sig.retrievedJson}</p>
                <SourceLink source={S.prediction.source} sourceUrl={S.prediction.sourceUrl} />
              </Evidence>
            </section>

            <section className="sig-step py-10" data-n="4" aria-labelledby="sig-4">
              <Frame n={4} />
              <h4 id="sig-4" className="t-h3 text-ink">
                The reader answers from the page
              </h4>
              <p className="t-body mt-3 text-ink-2">
                Qwen2.5-VL-3B in 4-bit gets the page image, the page&rsquo;s OCR text and the question. It fits a 4 GB
                laptop GPU at {vram.value} peak VRAM.
              </p>
              <Evidence>
                <p className="t-num-l font-mono text-ink">{sig.answer}</p>
                <p className="t-mono text-ink-3">gold: {sig.gold}</p>
                <SourceLink source={S.prediction.source} sourceUrl={S.prediction.sourceUrl} />
                <p className="t-small mt-2 text-ink-2">
                  With the page image alone, it also answered {imageOnly}.
                </p>
                <SourceLink source={S.data.source} sourceUrl={S.data.sourceUrl} label="README.md (Results)" />
              </Evidence>
            </section>

            <section className="sig-step py-10" data-n="5" aria-labelledby="sig-5">
              <Frame n={5} />
              <h4 id="sig-5" className="t-h3 text-ink">
                Across all {sig.questions} questions
              </h4>
              <p className="t-body mt-3 text-ink-2">
                <Metric metric={e2e} variant="inline" /> answered correctly ({e2eCount?.[1]} of {e2eCount?.[2]}). BM25
                page{" "}
                <Metric metric={hit1} variant="inline" text={`hit@1 ${hit1.value}`} />
                . On the{" "}
                <Metric metric={reader} variant="inline" text={readerRight} />{" "}
                questions where retrieval found the right page, the reader was right every time.
              </p>
              <Evidence>
                <p className="t-small text-ink-2">
                  All {misses} misses were retrieval misses: OCR had merged the field words, as in &ldquo;
                  {sig.mergedFieldExample}&rdquo;.
                </p>
                <SourceLink
                  source={S.limitations.source}
                  sourceUrl={S.limitations.sourceUrl}
                  label="README.md (Limitations)"
                />
              </Evidence>
            </section>
          </div>
        </div>

        <div className="grid-12 mt-16 gap-y-12">
          <div className="col-span-full flex flex-col gap-10 lg:col-span-7">
            <Limits notes={p.honestNotes} />
            <Approach items={p.approach} />
          </div>
          <div className="col-span-full flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
            <Metric metric={vram} />
            <Stack items={p.stack} />
            <CodeLink project={p} />
          </div>
        </div>
      </div>
      <SignatureObserver id={p.slug} />
    </article>
  );
}
