"use client";

import { useEffect } from "react";

const SECTIONS = ["work", "about", "contact"] as const;

/**
 * Renders nothing. Sets data-scrolled on the header once the hero sentinel leaves the viewport,
 * and aria-current on the nav link of the section crossing the middle of the viewport.
 */
export function NavObserver() {
  useEffect(() => {
    const header = document.getElementById("site-header");
    const sentinel = document.getElementById("hero-sentinel");
    const observers: IntersectionObserver[] = [];

    if (header && sentinel) {
      const io = new IntersectionObserver(([entry]) => {
        header.dataset.scrolled = String(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
      io.observe(sentinel);
      observers.push(io);
    }

    // Each nav target covers the region up to the next one: Work spans every project section.
    const regions: { id: string; el: Element }[] = [];
    const map: Record<string, string> = {
      work: "work",
      "yolo26-detector": "work",
      "rag-retrieval-eval-gate": "work",
      more: "work",
      skills: "about",
      about: "about",
      contact: "contact",
    };
    Object.keys(map).forEach((id) => {
      const el = document.getElementById(id);
      if (el) regions.push({ id, el });
    });
    const links = SECTIONS.map((id) =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>(`[data-nav="${id}"]`)),
    );
    const visible = new Set<string>();
    const update = () => {
      const active = regions.find((r) => visible.has(r.id));
      const target = active ? map[active.id] : null;
      SECTIONS.forEach((id, i) =>
        links[i].forEach((a) => {
          if (id === target) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        }),
      );
    };
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        update();
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    regions.forEach((r) => io2.observe(r.el));
    observers.push(io2);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return null;
}
