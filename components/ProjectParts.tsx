import { GithubLogo } from "./icons";
import type { Project } from "@/lib/content";

/** Stacked project header: title (h3 styled as h2), tagline, release and date in mono. */
export function ProjectHeader({ project, headingId }: { project: Project; headingId: string }) {
  return (
    <header className="max-w-[60rem]">
      <h3 id={headingId} className="t-h2 text-ink">
        {project.title}
      </h3>
      <p className="t-lead mt-3 max-w-[56ch] text-ink-2">{project.tagline}</p>
      <p className="t-mono mt-3 text-ink-3">
        {project.release}, {project.dateLabel}
      </p>
    </header>
  );
}

/** The only boxed text block: caveats printed next to the results. */
export function Limits({ notes }: { notes: string[] }) {
  return (
    <div className="limits">
      <h4 className="t-h4 text-ink">Limits</h4>
      <ul className="mt-3 flex flex-col gap-3">
        {notes.map((n) => (
          <li key={n} className="t-body text-ink-2">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Approach({ items }: { items: string[] }) {
  return (
    <div>
      <h4 className="t-h4 text-ink">Approach</h4>
      <ol className="approach t-body mt-3 text-ink-2">
        {items.map((a) => (
          <li key={a}>
            <span>{a}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Stack({ items }: { items: string[] }) {
  return (
    <div>
      <h4 className="t-h4 text-ink">Stack</h4>
      <p className="t-body mt-2 text-ink-2">{items.join(", ")}</p>
    </div>
  );
}

export function CodeLink({ project }: { project: Project }) {
  return (
    <a
      href={project.repoUrl}
      target="_blank"
      rel="noopener"
      className="pill pill-secondary self-start"
      aria-label={`Code on GitHub: ${project.repo}, opens in a new tab`}
    >
      <GithubLogo size={20} aria-hidden="true" />
      Code on GitHub
    </a>
  );
}
