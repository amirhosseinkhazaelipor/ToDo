import { useEffect } from "react";

import { useThemeStore, type ThemeMode } from "@/stores/theme-store";

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

/** Resolves the theme and applies/removes the `dark` class on <html>. */
export function useTheme(): {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
} {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const resolvedTheme: "light" | "dark" =
    theme === "system"
      ? window.matchMedia(MEDIA_QUERY).matches
        ? "dark"
        : "light"
      : theme;

  useEffect(() => {
    const root = document.documentElement;

    const apply = (dark: boolean): void => {
      root.classList.toggle("dark", dark);
    };

    if (theme === "system") {
      const media = window.matchMedia(MEDIA_QUERY);
      apply(media.matches);

      const listener = (event: MediaQueryListEvent): void => apply(event.matches);
      media.addEventListener("change", listener);

      return () => media.removeEventListener("change", listener);
    }

    apply(theme === "dark");
  }, [theme]);

  return { theme, resolvedTheme, setTheme };
}
