import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const THEMES = [
  "light",
  "sunset",
  "forest",
  "lavender",
  "pink",
  "midnight",
  "indigo",
  "teal",
  "charcoal",
  "cocoa",
] as const;
export type Theme = (typeof THEMES)[number];

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "habit-tracker-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && THEMES.includes(stored as Theme)) return stored as Theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "midnight" : "light";
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => void;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    for (const t of THEMES) {
      root.classList.remove(t);
    }
    root.classList.add(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Apple-style fluid crossfade between themes (falls back to instant swap).
  const setTheme = useMemo<ThemeContextValue["setTheme"]>(
    () => (next: Theme) => {
      if (typeof window === "undefined") {
        setThemeState(next);
        return;
      }
      const doc = document as DocumentWithViewTransition;
      if (doc.startViewTransition) {
        doc.startViewTransition(() => setThemeState(next));
      } else {
        setThemeState(next);
      }
    },
    [],
  );

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
