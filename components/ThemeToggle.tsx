"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "./icons";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** 44x44 pill icon button. Follows the system until the visitor picks a theme. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(currentTheme());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  const apply = () => {
    const root = document.documentElement;
    const commit = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* storage blocked: the choice lasts for this page view */
      }
      setTheme(next);
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (!reduce && typeof doc.startViewTransition === "function") doc.startViewTransition(commit);
    else commit();
  };

  return (
    <button
      type="button"
      onClick={apply}
      className="pill pill-secondary pill-icon"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  );
}
