"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "./icons";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * 44x44 pill icon button. Follows the system until the visitor picks a theme.
 * Until mounted the label is neutral ("Toggle theme"); the server cannot know the applied theme.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(currentTheme());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const apply = () => {
    const root = document.documentElement;
    // Read the applied theme at click time, so a click before hydration settles still flips correctly.
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
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
      aria-label={theme === null ? "Toggle theme" : theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {/* Both icons render; CSS shows the one for the applied theme, so it is right before hydration. */}
      <Sun size={20} aria-hidden="true" className="theme-icon-sun" />
      <Moon size={20} aria-hidden="true" className="theme-icon-moon" />
    </button>
  );
}
