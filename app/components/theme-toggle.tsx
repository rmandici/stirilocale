"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const mounted = useMounted();
  const { theme, setTheme, systemTheme } = useTheme();

  if (!mounted) return null;

  const current = theme === "system" ? systemTheme : theme;

  return (
    <button
      type="button"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10 dark:hover:bg-white/10"
      aria-label="Comută tema"
      title="Comută tema"
    >
      {current === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
