"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, WarningCircle } from "./icons";

/** Copies the address. On failure, selects the address text and explains how to copy it. */
export function CopyEmail({ email, targetId }: { email: string; targetId: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const selectAddress = () => {
    const el = document.getElementById(targetId);
    const sel = window.getSelection();
    if (!el || !sel) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const copy = async () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), 2000);
    } catch {
      selectAddress();
      setState("failed");
    }
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <button type="button" className="pill pill-secondary pill-lg" onClick={copy}>
        <span className="swap-label inline-flex items-center gap-2" key={state === "copied" ? "c" : "i"}>
          {state === "copied" ? <Check size={20} aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
          {state === "copied" ? "Copied" : "Copy email"}
        </span>
      </button>
      <p aria-live="polite" className="t-small text-ink">
        {state === "copied" ? <span className="sr-only">Email copied</span> : null}
        {state === "failed" ? (
          <span className="inline-flex items-start gap-2">
            <WarningCircle size={20} aria-hidden="true" className="mt-px flex-none" />
            Could not copy. The address is selected, press Ctrl+C or Cmd+C.
          </span>
        ) : null}
      </p>
    </div>
  );
}
