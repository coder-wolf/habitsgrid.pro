import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { TabPage } from "@/components/tab-page";
import { THEMES, useTheme, type Theme } from "@/lib/theme";

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
