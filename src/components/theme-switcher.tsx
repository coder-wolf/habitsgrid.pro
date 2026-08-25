import {
  Sun,
  Cloud,
  Sunset,
  TreePine,
  Flower2,
  Orbit,
  Droplets,
  Disc,
  Cookie,
  Heart,
} from "lucide-react";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { THEMES, useTheme, type Theme } from "@/lib/theme";

const themeConfig: Record<Theme, { label: string; icon: typeof Sun }> = {
  light: { label: "Light", icon: Sun },
  midnight: { label: "Midnight", icon: Cloud },
  sunset: { label: "Sunset", icon: Sunset },
  forest: { label: "Forest", icon: TreePine },
  lavender: { label: "Lavender", icon: Flower2 },
  pink: { label: "Pink", icon: Heart },
  indigo: { label: "Indigo", icon: Orbit },
  teal: { label: "Teal", icon: Droplets },
  charcoal: { label: "Charcoal", icon: Disc },
  cocoa: { label: "Cocoa", icon: Cookie },
};

const darkThemes: Theme[] = ["midnight", "indigo", "teal", "charcoal", "cocoa"];
const lightThemes: Theme[] = ["light", "sunset", "forest", "lavender", "pink"];

function ThemeButton({
  t,
  current,
  onSelect,
}: {
  t: Theme;
  current: Theme;
  onSelect: (t: Theme) => void;
}) {
  const { label, icon: Icon } = themeConfig[t];
  return (
    <PopoverClose asChild>
      <button
        onClick={() => onSelect(t)}
        className={`flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${
          current === t
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        }`}
      >
        <Icon className="size-3.5" />
        {label}
      </button>
    </PopoverClose>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Change theme"
          className="rounded-md border border-border bg-surface p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {(() => {
            const Icon = themeConfig[theme].icon;
            return <Icon className="size-4" />;
          })()}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={4} className="w-auto p-1">
        <div className="flex gap-1">
          <div className="min-w-[120px]">
            <p className="px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Light
            </p>
            {lightThemes.map((t) => (
              <ThemeButton key={t} t={t} current={theme} onSelect={setTheme} />
            ))}
          </div>
          <div className="border-l border-border" />
          <div className="min-w-[120px]">
            <p className="px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Dark
            </p>
            {darkThemes.map((t) => (
              <ThemeButton key={t} t={t} current={theme} onSelect={setTheme} />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
