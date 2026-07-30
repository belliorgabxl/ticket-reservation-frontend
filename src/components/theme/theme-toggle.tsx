"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // Starts null so the server-rendered markup and the first client render
  // match (the real value lives in the DOM class the inline script in
  // layout.tsx already set, not in React state) — avoids a hydration
  // mismatch warning.
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:text-foreground"
    >
      {isDark === null ? null : isDark ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M12 3v1.5M12 19.5V21M4.5 12H3M21 12h-1.5M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3l-1.1 1.1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M20.5 14.5a8.5 8.5 0 1 1-9-13 7 7 0 0 0 9 13Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
