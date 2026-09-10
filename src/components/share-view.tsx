import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Clipboard, Shuffle } from "lucide-react";
import { useHabits } from "@/lib/habits-store";
import {
  COPY_STATUS_STYLES,
  COPY_STYLE_KEY,
  buildShareText,
  randomCopyStyle,
} from "@/lib/share-text";

export function ShareView() {
  const { sections, completions } = useHabits();
  const [today] = useState(() => new Date());
  const [shareDay, setShareDay] = useState<0 | 1>(0);
  // Copy-to-social mark style: a fixed style index or "shuffle" for random.
  // Loaded from localStorage after mount (SSR-safe) and persisted on change.
  const [copyStyle, setCopyStyle] = useState<number | "shuffle">("shuffle");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COPY_STYLE_KEY);
      if (raw === null || raw === "shuffle") return;
      const i = Number(raw);
      if (Number.isInteger(i) && i >= 0 && i < COPY_STATUS_STYLES.length) setCopyStyle(i);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(COPY_STYLE_KEY, String(copyStyle));
    } catch {
      /* ignore */
    }
  }, [copyStyle]);

  // Resolved style for the share preview: stable unless inputs change.
  const previewStyle = useMemo(
    () => (copyStyle === "shuffle" ? randomCopyStyle() : copyStyle),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [copyStyle, shareDay, sections, completions],
  );

  const allHabits = sections.flatMap((s) => s.habits);

  const handleCopy = async () => {
    const styleIndex = copyStyle === "shuffle" ? randomCopyStyle() : copyStyle;
    await navigator.clipboard.writeText(
      buildShareText(sections, completions, today, shareDay, styleIndex),
    );
    toast.success(shareDay === 0 ? "Today copied to clipboard!" : "Yesterday copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface p-1">
        {([0, 1] as const).map((d) => (
          <button
            key={d}
            onClick={() => setShareDay(d)}
            aria-pressed={shareDay === d}
            className={`rounded-lg py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${shareDay === d ? "bg-foreground text-background" : "text-muted-foreground"}`}
          >
            {d === 0 ? "Today" : "Yesterday"}
          </button>
        ))}
      </div>

      <button
        onClick={() => void handleCopy()}
        disabled={allHabits.length === 0}
        className="flex items-center justify-center gap-2 rounded-xl bg-foreground py-2 text-[15px] font-semibold text-background transition-all active:scale-[0.98] disabled:opacity-40"
      >
        <Clipboard className="size-4" />
        Copy {shareDay === 0 ? "today" : "yesterday"}&apos;s check-in
      </button>

      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Preview
        </p>
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
          {allHabits.length === 0
            ? "Nothing to share yet — add a habit first."
            : buildShareText(sections, completions, today, shareDay, previewStyle)}
        </p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Mark style
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setCopyStyle("shuffle")}
            aria-pressed={copyStyle === "shuffle"}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] transition-all active:scale-95 ${copyStyle === "shuffle" ? "border-foreground bg-foreground/[0.06]" : "border-border/60 bg-surface"}`}
          >
            <Shuffle className="size-3.5 text-muted-foreground" />
            <span>🔀 Shuffle</span>
            {copyStyle === "shuffle" && <Check className="ml-auto size-4" />}
          </button>
          {COPY_STATUS_STYLES.map(([doneMark, missMark, label], i) => (
            <button
              key={label}
              onClick={() => setCopyStyle(i)}
              aria-pressed={copyStyle === i}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] transition-all active:scale-95 ${copyStyle === i ? "border-foreground bg-foreground/[0.06]" : "border-border/60 bg-surface"}`}
            >
              <span>
                {doneMark}
                {missMark}
              </span>
              <span>{label}</span>
              {copyStyle === i && <Check className="ml-auto size-4" />}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Want the grid image? Rotate for Capture
        </p>
      </div>
    </div>
  );
}
