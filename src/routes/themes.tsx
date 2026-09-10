import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { TabPage } from "@/components/tab-page";
import { THEMES, useTheme, type Theme } from "@/lib/theme";

const THEME_SWATCHES: Record<Theme, { bg: string; primary: string; accent: string }> = {
  light: { bg: "oklch(0.985 0.004 90)", primary: "oklch(0.28 0.02 265)", accent: "oklch(0.94 0.02 85)" },
  sunset: { bg: "oklch(0.97 0.01 60)", primary: "oklch(0.55 0.18 30)", accent: "oklch(0.92 0.04 50)" },
  forest: { bg: "oklch(0.97 0.01 145)", primary: "oklch(0.45 0.14 155)", accent: "oklch(0.93 0.03 140)" },
  lavender: { bg: "oklch(0.97 0.008 290)", primary: "oklch(0.55 0.15 280)", accent: "oklch(0.93 0.03 280)" },
  pink: { bg: "oklch(0.97 0.01 340)", primary: "oklch(0.6 0.18 345)", accent: "oklch(0.93 0.035 338)" },
  midnight: { bg: "oklch(0.11 0.035 270)", primary: "oklch(0.7 0.12 250)", accent: "oklch(0.25 0.06 260)" },
  indigo: { bg: "oklch(0.13 0.04 280)", primary: "oklch(0.65 0.18 270)", accent: "oklch(0.26 0.06 270)" },
  teal: { bg: "oklch(0.13 0.035 185)", primary: "oklch(0.7 0.15 180)", accent: "oklch(0.26 0.05 178)" },
  charcoal: { bg: "oklch(0.14 0.005 50)", primary: "oklch(0.72 0.01 50)", accent: "oklch(0.26 0.008 46)" },
  cocoa: { bg: "oklch(0.14 0.025 55)", primary: "oklch(0.7 0.1 50)", accent: "oklch(0.26 0.04 48)" },
};

const THEME_BLURBS: Record<Theme, string> = {
  light: "Clean paper white",
  sunset: "Warm golden hour",
  forest: "Deep moss greens",
  lavender: "Soft purple haze",
  pink: "Playful rose",
  midnight: "True dark blue-black",
  indigo: "Electric violet night",
  teal: "Cool ocean depth",
  charcoal: "Neutral graphite",
  cocoa: "Rich warm brown",
};

function ThemesPage() {
  const { theme, setTheme } = useTheme();

  return (
    <TabPage title="Theme" subtitle="Applies instantly across the whole app.">
      <div className="flex flex-col gap-1.5">
        {THEMES.map((t) => {
          const selected = theme === t;
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              aria-pressed={selected}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all active:scale-[0.99] ${selected ? "border-foreground bg-foreground/[0.06]" : "border-border/60 bg-surface"}`}
            >
              <span
                aria-hidden
                className="size-8 shrink-0 rounded-full ring-1 ring-inset ring-foreground/20"
                style={{
                  background: `conic-gradient(from 45deg, ${THEME_SWATCHES[t].bg} 0 50%, ${THEME_SWATCHES[t].primary} 50% 75%, ${THEME_SWATCHES[t].accent} 75% 100%)`,
                }}
              />
              <span className="flex-1">
                <span className="block text-[15px] font-semibold capitalize">{t}</span>
                <span className="block text-[13px] text-muted-foreground">
                  {THEME_BLURBS[t]}
                </span>
              </span>
              {selected && <Check className="size-4 shrink-0" />}
            </button>
          );
        })}
      </div>
    </TabPage>
  );
}

export const Route = createFileRoute("/themes")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Theme — HabitsGrid" },
    ],
    links: [{ rel: "canonical", href: "https://habitsgrid.pro/themes" }],
  }),
  component: ThemesPage,
});
