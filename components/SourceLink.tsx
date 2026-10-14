import { Fragment } from "react";
import { ArrowUpRight } from "./icons";
import { repoOf } from "@/lib/content";

type Props = {
  source: string;
  sourceUrl: string;
  /** Visible text when it should differ from the path, e.g. "README.md (How it works)". */
  label?: string;
  className?: string;
};

/** Allows line breaks after "/" and "_" so long paths wrap at sensible points on phones. */
export function breakable(text: string) {
  const parts = text.split(/(?<=[/_])/);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? <wbr /> : null}
    </Fragment>
  ));
}

/** Evidence link: the repo-relative path of the file that produced a result. */
export function SourceLink({ source, sourceUrl, label, className = "" }: Props) {
  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener"
      className={`source-link ${className}`}
      aria-label={`Source file ${label ?? source} in ${repoOf(sourceUrl)} on GitHub, opens in a new tab`}
    >
      <span>{breakable(label ?? source)}</span>
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}
