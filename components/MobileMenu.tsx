"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { DownloadSimple, List, X } from "./icons";

type Item = { href: string; label: string; nav?: string };

/** Below md: a Menu pill that opens a full-width sheet under the bar. Escape closes, focus is trapped. */
export function MobileMenu({ items, resume }: { items: Item[]; resume: { href: string; label: string } }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const id = useId();

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) button.current?.focus();
  }, []);

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (header) header.dataset.menu = open ? "open" : "closed";
    if (!open) return;

    sheet.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab" || !sheet.current || !button.current) return;
      const focusables = [button.current, ...Array.from(sheet.current.querySelectorAll<HTMLElement>("a"))];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onWide = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={button}
        type="button"
        className="pill pill-secondary max-sm:w-11 max-sm:px-0"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
        <span className="max-sm:sr-only">Menu</span>
      </button>
      <div ref={sheet} id={id} className="menu-sheet" hidden={!open}>
        <nav aria-label="Menu" className="container-x pb-4">
          {items.map((it) => (
            <a key={it.href} href={it.href} data-nav={it.nav} onClick={() => close(false)}>
              {it.label}
            </a>
          ))}
          <a href={resume.href} download type="application/pdf" onClick={() => close(false)}>
            <DownloadSimple size={20} aria-hidden="true" />
            {resume.label}
          </a>
        </nav>
      </div>
    </>
  );
}
