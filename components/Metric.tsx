import { SourceLink } from "./SourceLink";
import { repoOf, type MetricData } from "@/lib/content";

type BlockProps = {
  metric: MetricData;
  /** "block": value, label, context, source stacked. "inline": the value as a link inside a sentence. */
  variant?: "block" | "inline";
  /** Inline only: visible text, when the sentence shows a part of the value. */
  text?: string;
  /** Inline only: what the shown value is, when it is not the metric's own label. */
  what?: string;
};

/**
 * Renders every number on the page. `source` and `sourceUrl` are required by the type and
 * re-checked at build time (lib/content.ts, scripts/check-content.mjs).
 */
export function Metric({ metric, variant = "block", text, what }: BlockProps) {
  if (!metric.source || !metric.sourceUrl) {
    throw new Error(`Metric "${metric.label}" has no source`);
  }

  if (variant === "inline") {
    return (
      <a
        href={metric.sourceUrl}
        target="_blank"
        rel="noopener"
        className="inline-num"
        aria-label={`${text ?? metric.value}, ${what ?? metric.label}. Source ${metric.source} in ${repoOf(metric.sourceUrl)} on GitHub, opens in a new tab`}
      >
        {text ?? metric.value}
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 border-t border-line pt-4">
      <p className="t-num-l text-ink">{metric.value}</p>
      <p className="t-small font-semibold text-ink">{metric.label}</p>
      <p className="t-small text-ink-2">{metric.context}</p>
      <p className="mt-1">
        <SourceLink source={metric.source} sourceUrl={metric.sourceUrl} />
      </p>
    </div>
  );
}
