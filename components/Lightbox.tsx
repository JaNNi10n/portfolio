"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "./icons";

type Shot = { src: string; alt: string; caption: string; width: number; height: number };

/**
 * One shared native <dialog>. Figure plates are links to their image files (works without JS);
 * a delegated click handler upgrades them to this dialog. Focus goes to Close first and
 * returns to the trigger on close.
 */
export function Lightbox() {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-lightbox]");
      if (!el || !dialog.current) return;
      e.preventDefault();
      const d = el.dataset;
      trigger.current = el;
      setShot({
        src: d.src ?? "",
        alt: d.alt ?? "",
        caption: d.caption ?? "",
        width: Number(d.width) || 0,
        height: Number(d.height) || 0,
      });
      dialog.current.showModal();
      closeBtn.current?.focus();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      trigger.current?.focus();
    };
    const onBackdrop = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener("close", onClose);
    d.addEventListener("click", onBackdrop);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("click", onBackdrop);
    };
  }, []);

  return (
    <dialog ref={dialog} className="lightbox" aria-label={shot ? shot.alt : "Image viewer"}>
      <div className="flex h-14 items-center justify-between gap-4 border-b border-line pl-4 pr-1.5">
        <p className="t-small min-w-0 truncate text-ink-2">{shot?.caption}</p>
        <button
          ref={closeBtn}
          type="button"
          className="pill pill-secondary pill-icon flex-none"
          aria-label="Close"
          onClick={() => dialog.current?.close()}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="lightbox-scroll">
        {shot ? (
          // eslint-disable-next-line @next/next/no-img-element -- natural-size, pannable view of a static file
          <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} decoding="async" />
        ) : null}
      </div>
    </dialog>
  );
}
