"use client";

import { useEffect } from "react";

/**
 * Renders nothing. One IntersectionObserver over the five steps writes data-step on the
 * signature article and data-state on the stage; CSS does the rest. Also fits the zoom so the printed text block fills
 * about 90% of the stage. Without JS the server-rendered state 4 stays.
 */
export function SignatureObserver({ id }: { id: string }) {
  useEffect(() => {
    const root = document.getElementById(id);
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".stage");
    const camera = stage?.querySelector<HTMLElement>(".camera");
    const steps = Array.from(root.querySelectorAll<HTMLElement>(".sig-step"));
    const wide = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");

    // Text block region of the scan, as a fraction of the image (see Signature overlays).
    const TB_W = 0.665;
    const TB_H = 0.29;
    const TB_CY = 16.8;
    const fit = () => {
      if (!stage || !camera) return;
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      const cw = camera.offsetWidth;
      const ch = camera.offsetHeight;
      if (!cw || !ch) return;
      const s = Math.min((0.9 * sw) / (TB_W * cw), (0.9 * sh) / (TB_H * ch), 3);
      stage.style.setProperty("--s-zoom", s.toFixed(3));
      // Keep the top edge of the scan at or above the stage top, so no empty band shows above it.
      stage.style.setProperty("--cy-zoom", `${Math.max(TB_CY, 50 / s).toFixed(2)}%`);
    };

    const setStep = (n: string) => {
      if (root.dataset.step === n) return;
      root.dataset.step = n;
      if (stage) stage.dataset.state = n;
    };
    setStep("1");
    fit();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStep((e.target as HTMLElement).dataset.n ?? "1");
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((s) => io.observe(s));

    const inview = new IntersectionObserver(([e]) => {
      root.dataset.inview = String(e.isIntersecting && wide.matches);
    });
    inview.observe(root);

    const ro = stage ? new ResizeObserver(fit) : null;
    if (stage) ro?.observe(stage);

    return () => {
      io.disconnect();
      inview.disconnect();
      ro?.disconnect();
    };
  }, [id]);

  return null;
}
