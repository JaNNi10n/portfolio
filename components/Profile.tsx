import { CopyEmail } from "./CopyEmail";
import { DownloadSimple, GithubLogo, LinkedinLogo } from "./icons";
import { achievements, education, experience, links, person, site, skills } from "@/lib/content";

/** Multi-column dictionary. No chips, bars or percentages. */
export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-h" className="container-x py-12 md:py-20">
      <h2 id="skills-h" className="t-h2 text-ink">
        Skills
      </h2>
      <dl className="skills-dl mt-10">
        {skills.map((g) => (
          <div key={g.group}>
            <dt className="t-body font-[640] text-ink">{g.group}</dt>
            <dd className="t-body mt-1 text-ink-2">{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Lead paragraph over a 3-zone record. */
export function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="container-x py-12 md:py-20">
      <h2 id="about-h" className="t-h2 text-ink">
        About
      </h2>
      <div className="grid-12 mt-8">
        <div className="col-span-full lg:col-span-7">
          <p className="t-lead max-w-[40ch] text-ink">{person.bioShort}</p>
          <p className="t-small mt-3 text-ink-2">{person.location}</p>
        </div>
      </div>

      <div className="grid-12 mt-12 gap-y-12">
        <div className="col-span-full lg:col-span-6">
          <h3 className="t-body font-[640] text-ink">Education</h3>
          <ul className="mt-4 flex flex-col gap-6">
            {education.map((e) => (
              <li key={e.institution} className="border-t border-line pt-4">
                <p className="t-body font-[640] text-ink">{e.institution}</p>
                <p className="t-body text-ink-2">{e.program}</p>
                <p className="t-mono mt-1 text-ink-3">{e.dateLabel}</p>
                <p className="t-small tnum mt-1 text-ink-2">CGPA {e.cgpa}</p>
                {"coursework" in e && e.coursework ? (
                  <p className="t-small mt-2 text-ink-2">{e.coursework.join(", ")}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-full md:col-span-4 lg:col-span-3">
          <h3 className="t-body font-[640] text-ink">Experience</h3>
          <ul className="mt-4 flex flex-col gap-6">
            {experience.map((x) => (
              <li key={x.company} className="border-t border-line pt-4">
                <p className="t-body font-[640] text-ink">{x.company}</p>
                <p className="t-body text-ink-2">{x.role}</p>
                <p className="t-mono mt-1 text-ink-3">{x.durationLabel}</p>
                {x.bullets.map((b) => (
                  <p key={b} className="t-small mt-2 text-ink-2">
                    {b}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-full md:col-span-4 lg:col-span-3">
          <h3 className="t-body font-[640] text-ink">Outside work</h3>
          <ul className="mt-4 flex flex-col">
            {achievements.map((a) => (
              <li key={a.title} className="border-t border-line py-3">
                <p className="t-body font-[560] text-ink">{a.title}</p>
                <p className="t-small text-ink-2">{a.detail}</p>
                {a.dateLabel ? <p className="t-mono mt-0.5 text-ink-3">{a.dateLabel}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** The only full-width band. Email as the display link; no phone, no address, no form. */
export function Contact() {
  const roles = person.availability.replace(/^Open to /, "");
  // Each mode is kept whole so "on-site" never breaks at its hyphen.
  const modes = person.workModes.map((m) => (
    <span key={m} className="whitespace-nowrap">
      {m.toLowerCase()}
    </span>
  ));
  const modeText = modes.flatMap((m, i) => (i === 0 ? [m] : [i === modes.length - 1 ? " or " : ", ", m]));
  return (
    <section id="contact" aria-labelledby="contact-h" className="mt-12 border-t border-line bg-surface md:mt-16">
      <div className="container-x pb-16 pt-16 md:pb-20 md:pt-32">
        <h2 id="contact-h" className="t-h3 text-ink">
          Contact
        </h2>
        <p className="t-body mt-3 text-ink-2">
          Open to {roles}: {modeText}.
        </p>
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="email-wrap min-w-0 flex-1">
            <a href={links.emailHref} className="email-display text-ink">
              <span id="contact-email">{links.email}</span>
            </a>
          </div>
          <CopyEmail email={links.email} targetId="contact-email" />
        </div>
        <ul className="mt-10 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8">
          <li>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener"
              className="link-quiet inline-flex min-h-11 items-center gap-2 text-ink"
              aria-label={`LinkedIn: ${links.linkedinLabel}, opens in a new tab`}
            >
              <LinkedinLogo size={20} aria-hidden="true" />
              {links.linkedinLabel}
            </a>
          </li>
          <li>
            <a
              href={links.github}
              target="_blank"
              rel="noopener"
              className="link-quiet inline-flex min-h-11 items-center gap-2 text-ink"
              aria-label={`GitHub: ${links.githubLabel}, opens in a new tab`}
            >
              <GithubLogo size={20} aria-hidden="true" />
              {links.githubLabel}
            </a>
          </li>
          <li>
            <a
              href={links.resume}
              download
              type="application/pdf"
              title={`Download the resume of ${person.name} (PDF)`}
              className="link-quiet inline-flex min-h-11 items-center gap-2 text-ink"
            >
              <DownloadSimple size={20} aria-hidden="true" />
              Download resume
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

/** Full-bleed wordmark band: the page ends on the name. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="container-x wordmark-band pt-12">
        <p className="t-wordmark text-ink" aria-hidden="true">
          {person.name.split(" ").map((w, i) => (
            <span key={w}>
              {i > 0 ? " " : null}
              {w}
            </span>
          ))}
        </p>
      </div>
      <div className="border-t border-line">
        <div className="container-x t-small flex flex-col gap-2 py-6 text-ink-3 sm:flex-row sm:justify-between">
          <p>
            Built with Next.js and Tailwind CSS.{" "}
            <a href={site.repoUrl} target="_blank" rel="noopener" className="link">
              {site.repoLabel}
            </a>
          </p>
          <p>
            &copy; {year} {person.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
