import { DownloadSimple } from "./icons";
import { MobileMenu } from "./MobileMenu";
import { NavObserver } from "./NavObserver";
import { ThemeToggle } from "./ThemeToggle";
import { links, person } from "@/lib/content";

const ITEMS = [
  { href: "#work", label: "Work", nav: "work" },
  { href: "#about", label: "About", nav: "about" },
  { href: "#contact", label: "Contact", nav: "contact" },
];

const RESUME = { href: links.resume, label: "Download resume" };

export function Nav() {
  return (
    <>
      {/* 1px marker at the very top of the document: the nav turns solid as soon as it scrolls away. */}
      <div id="top-sentinel" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />
      <header id="site-header" className="site-header" data-scrolled="false">
        <div className="container-x flex h-full items-center justify-between gap-4">
          <a
            href="#top"
            className="link-quiet whitespace-nowrap text-[clamp(12px,3.6vw,15px)] font-display font-bold uppercase tracking-[-0.005em] text-ink"
          >
            {person.name}
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            <ul className="flex items-center gap-6">
              {ITEMS.map((it) => (
                <li key={it.href}>
                  <a href={it.href} className="nav-link" data-nav={it.nav}>
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href={RESUME.href}
                download
                type="application/pdf"
                title={`Download the resume of ${person.name} (PDF)`}
                className="pill pill-secondary"
              >
                <DownloadSimple size={20} aria-hidden="true" />
                {RESUME.label}
              </a>
            </div>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileMenu items={ITEMS} resume={RESUME} />
          </div>
        </div>
        <NavObserver />
      </header>
    </>
  );
}
