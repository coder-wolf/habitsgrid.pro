import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronRight, ChevronDown, Share2, Download, Clipboard } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { SeoFooter } from "@/components/seo-footer";
import {
  cellKey,
  daysInMonth,
  habitColorClass,
  makeHabit,
  makeSection,
  monthKey,
  weekdayLabel,
  STORAGE_KEY,
  type Completions,
  type Habit,
  type Section,
} from "@/lib/habits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HabitsGrid — Spreadsheet-Style Habit Tracker" },
      {
        name: "description",
        content:
          "HabitsGrid is a free spreadsheet-style habit tracker. Organize habits in groups, tick daily cells, keep streaks and export your grid. Works offline, syncs to cloud on Pro.",
      },
      { property: "og:title", content: "HabitsGrid — Spreadsheet-Style Habit Tracker" },
      {
        property: "og:description",
        content:
          "Every habit is a row, every day is a column. Tick cells, build streaks, and export your monthly grid. Free & Pro cloud sync.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://habitsgrid.pro/" },
    ],
    links: [{ rel: "canonical", href: "https://habitsgrid.pro/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://habitsgrid.pro/#website",
              url: "https://habitsgrid.pro/",
              name: "HabitsGrid",
              description:
                "Spreadsheet-style habit tracker — every habit is a row, every day is a column.",
              inLanguage: "en",
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://habitsgrid.pro/#app",
              name: "HabitsGrid",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Web",
              url: "https://habitsgrid.pro/",
              description:
                "Track daily habits with a monthly grid. Tick cells, keep streaks, group habits, reorder by drag & drop, export to PNG, and sync to cloud on Pro.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free tier with local storage",
              },
              aggregateRating: undefined,
            },
            {
              "@type": "Organization",
              "@id": "https://habitsgrid.pro/#org",
              name: "HabitsGrid",
              url: "https://habitsgrid.pro/",
              logo: "https://habitsgrid.pro/icon-512.png",
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

type State = { sections: Section[]; completions: Completions };

function InlineEdit({
  value,
  onCommit,
  className,
  placeholder,
}: {
  value: string;
  onCommit: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (editing && mirrorRef.current) {
      setWidth(mirrorRef.current.offsetWidth);
      inputRef.current?.focus();
    }
  }, [editing]);

  if (!editing) {
    return (
      <span
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className={`${className ?? ""} cursor-text`}
      >
        {value}
      </span>
    );
  }

  return (
    <>
      <span
        ref={mirrorRef}
        className={`${className ?? ""} pointer-events-none absolute whitespace-pre opacity-0`}
        aria-hidden
      >
        {draft || placeholder || " "}
      </span>
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          requestAnimationFrame(() => {
            if (mirrorRef.current) setWidth(mirrorRef.current.offsetWidth);
          });
        }}
        onBlur={() => {
          onCommit(draft);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onCommit(draft);
            setEditing(false);
          }
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        placeholder={placeholder}
        style={{ width }}
        className={`${className ?? ""} bg-transparent border-none outline-none p-0 m-0`}
      />
    </>
  );
}

function Index() {
  const today = useMemo(() => new Date(), []);
  const { user, loading: authLoading, isPro } = useAuth();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [state, setState] = useState<State>({ sections: [], completions: {} });
  const [adding, setAdding] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const stateRef = useRef<State>({ sections: [], completions: {} });
  const cloudReadyRef = useRef<string | null>(null);
  const lastSyncErrorRef = useRef<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const authResolved = !authLoading;

  // Onboarding is the default for non-Pro users.
  // demoMode lets free users dismiss it to see the homepage.
  // Resets on sign-out so fresh visitors always see onboarding.
  const [demoMode, setDemoMode] = useState(false);
  const showOnboarding = authResolved && !isPro && !demoMode;

  useEffect(() => {
    if (authResolved && !user) setDemoMode(false);
  }, [authResolved, user]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    // Long-press to drag on touch so scrolling and cell taps still work.
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Cloud-first lifecycle: fetch on login, clear on logout. Requires Pro subscription.
  useEffect(() => {
    if (!authResolved) return;

    if (!user) {
      setState({ sections: [], completions: {} });
      cloudReadyRef.current = null;
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    // Free users stay on localStorage only
    if (!isPro) {
      cloudReadyRef.current = null;
      // Load from localStorage for free users
      const local = (() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as State;
            if (parsed.sections?.length) return parsed;
          }
        } catch {
          /* ignore */
        }
        return null;
      })();
      if (local) setState(local);
      return;
    }

    const client = supabase;
    if (!client) return;

    const uid = user.id;
    let cancelled = false;
    cloudReadyRef.current = null;

    (async () => {
      try {
        const { data, error } = await client
          .from("user_state")
          .select("data")
          .eq("user_id", uid)
          .maybeSingle();
        if (cancelled) return;
        if (error) throw error;

        const remote = (data?.data ?? null) as Partial<State> | null;
        if (remote && Array.isArray(remote.sections)) {
          setState({ sections: remote.sections, completions: remote.completions ?? {} });
        } else {
          // First time on this device: seed cloud from localStorage if it has data.
          const local = (() => {
            try {
              const raw = localStorage.getItem(STORAGE_KEY);
              if (raw) {
                const parsed = JSON.parse(raw) as State;
                if (parsed.sections?.length) return parsed;
              }
            } catch {
              /* ignore */
            }
            return null;
          })();

          if (local) {
            setState(local);
            const seeded = await client.from("user_state").upsert({ user_id: uid, data: local });
            if (seeded.error) throw seeded.error;
          }
        }
        cloudReadyRef.current = uid;
      } catch (err) {
        console.error(err);
        if (!cancelled) toast.error("Could not load your synced habits.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authResolved, isPro]);

  // Cache state to localStorage while signed in.
  useEffect(() => {
    if (!authResolved || !user) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, authResolved, user]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Debounced push of local changes to the cloud (Pro only).
  useEffect(() => {
    const client = supabase;
    if (!client || !user || !authResolved || !isPro) return;
    if (cloudReadyRef.current !== user.id) return;
    const t = setTimeout(() => {
      void client
        .from("user_state")
        .upsert({ user_id: user.id, data: state })
        .then(({ error }) => {
          if (!error) {
            lastSyncErrorRef.current = null;
            return;
          }
          console.error("Cloud sync failed:", error.message);
          if (lastSyncErrorRef.current !== error.message) {
            lastSyncErrorRef.current = error.message;
            toast.error(`Cloud sync failed: ${error.message}`);
          }
        });
    }, 800);
    return () => clearTimeout(t);
  }, [state, user, authResolved, isPro]);

  const month = monthKey(cursor);
  const dayCount = daysInMonth(cursor);
  const days = useMemo(() => Array.from({ length: dayCount }, (_, i) => i + 1), [dayCount]);
  const isCurrentMonth = month === monthKey(today);

  const toggle = useCallback(
    (habitId: string, day: number) => {
      const key = cellKey(month, day);
      setState((prev) => {
        const list = prev.completions[habitId] ?? [];
        const next = list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
        return { ...prev, completions: { ...prev.completions, [habitId]: next } };
      });
    },
    [month],
  );

  const addHabit = (sectionId: string) => {
    const name = draft.trim();
    if (!name) return;
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
            ...s,
            habits: [
              ...s.habits,
              makeHabit(name, null, ((s.habits.length % 6) + 1) as Habit["color"]),
            ],
          }
          : s,
      ),
    }));
    setDraft("");
    setAdding(null);
  };

  const removeHabit = (sectionId: string, habitId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, habits: s.habits.filter((h) => h.id !== habitId) } : s,
      ),
    }));
  };

  const renameHabit = (sectionId: string, habitId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, habits: s.habits.map((h) => (h.id === habitId ? { ...h, name: trimmed } : h)) }
          : s,
      ),
    }));
  };

  const recolorHabit = (sectionId: string, habitId: string, color: Habit["color"]) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, habits: s.habits.map((h) => (h.id === habitId ? { ...h, color } : h)) }
          : s,
      ),
    }));
  };

  const addSection = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      sections: [...prev.sections, makeSection(trimmed)],
    }));
  };

  const removeSection = (sectionId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  };

  const renameSection = (sectionId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, name: trimmed } : s)),
    }));
  };

  const toggleSection = (sectionId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s,
      ),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeIsSection = state.sections.some((s) => s.id === activeId);
    const overIsSection = state.sections.some((s) => s.id === overId);

    if (activeIsSection && overIsSection) {
      setState((prev) => {
        const oldIndex = prev.sections.findIndex((s) => s.id === activeId);
        const newIndex = prev.sections.findIndex((s) => s.id === overId);
        return { ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) };
      });
      return;
    }

    if (activeIsSection || overIsSection) return;

    const sourceSection = state.sections.find((s) => s.habits.some((h) => h.id === activeId));
    const destSection = state.sections.find((s) => s.habits.some((h) => h.id === overId));

    if (!sourceSection || !destSection) return;

    setState((prev) => {
      if (sourceSection.id === destSection.id) {
        return {
          ...prev,
          sections: prev.sections.map((s) => {
            if (s.id !== sourceSection.id) return s;
            const oldIndex = s.habits.findIndex((h) => h.id === activeId);
            const newIndex = s.habits.findIndex((h) => h.id === overId);
            return { ...s, habits: arrayMove(s.habits, oldIndex, newIndex) };
          }),
        };
      }

      const source = prev.sections.find((s) => s.id === sourceSection.id)!;
      const dest = prev.sections.find((s) => s.id === destSection.id)!;
      const activeHabit = source.habits.find((h) => h.id === activeId)!;
      const overIndex = dest.habits.findIndex((h) => h.id === overId);

      return {
        ...prev,
        sections: prev.sections.map((s) => {
          if (s.id === sourceSection.id) {
            return { ...s, habits: s.habits.filter((h) => h.id !== activeId) };
          }
          if (s.id === destSection.id) {
            const newHabits = [...dest.habits];
            newHabits.splice(overIndex, 0, activeHabit);
            return { ...s, habits: newHabits };
          }
          return s;
        }),
      };
    });
  };

  const shiftMonth = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  const monthLabel = cursor.toLocaleString("en-US", { month: "long" });
  const yearLabel = cursor.getFullYear();

  const handleShare = async () => {
    if (!gridRef.current || sharing) return;
    setSharing(true);

    try {
      // Hide interactive elements during capture
      const grid = gridRef.current;
      grid.classList.add("exporting");

      // Create a wrapper with branded header
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        background: ${getComputedStyle(document.documentElement).getPropertyValue("--background").trim()};
        padding: 24px;
        border-radius: 12px;
        display: inline-block;
      `;

      // Add branded header
      const header = document.createElement("div");
      header.style.cssText = `
        font-family: 'Inter', system-ui, sans-serif;
        margin-bottom: 16px;
        color: ${getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim()};
      `;
      header.innerHTML = `
        <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">HabitsGrid.pro</div>
        <div style="font-size: 13px; opacity: 0.6; margin-top: 2px;">${monthLabel} ${yearLabel}</div>
      `;
      wrapper.appendChild(header);

      // Clone the grid and append
      const gridClone = grid.cloneNode(true) as HTMLElement;
      gridClone.classList.remove("exporting");
      gridClone.style.overflow = "visible";
      wrapper.appendChild(gridClone);

      document.body.appendChild(wrapper);

      const dataUrl = await toPng(wrapper, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background").trim(),
      });

      document.body.removeChild(wrapper);
      grid.classList.remove("exporting");

      // Always download the file
      const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `habitsgrid-${dateStr}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded!");
    } catch (err) {
      console.error("Share failed:", err);
      toast.error("Failed to export image.");
      gridRef.current?.classList.remove("exporting");
    } finally {
      setSharing(false);
    }
  };

  const handleCopyText = async () => {
    const todayKey = cellKey(month, today.getDate());
    const rows: string[] = [];
    let total = 0;
    let doneCount = 0;

    // Random status-mark style per copy so shares feel fresh.
    const STATUS_STYLES: Array<[string, string]> = [
      ["✅", "❌"],
      ["🟩", "⬜"],
      ["🟢", "⚪"],
      ["🔥", "😴"],
      ["✔️", "✖️"],
    ];
    const [doneMark, missMark] =
      STATUS_STYLES[Math.floor(Math.random() * STATUS_STYLES.length)];
    // Random generic header emoji (habit-tracking vibe, not score-related).
    const HEADER_EMOJIS = ["📊", "📋", "🗓️", "📌"];
    const headerEmoji = HEADER_EMOJIS[Math.floor(Math.random() * HEADER_EMOJIS.length)];

    for (const section of state.sections) {
      if (section.habits.length === 0 || section.collapsed) continue;
      rows.push(`**${section.name.toUpperCase()}**`);
      for (const habit of section.habits) {
        const done = (state.completions[habit.id] ?? []).includes(todayKey);
        total += 1;
        if (done) doneCount += 1;
        rows.push(`${done ? doneMark : missMark} ${habit.name}`);
      }
      rows.push("");
    }

    const pct = total === 0 ? 0 : doneCount / total;
    const pctNum = Math.round(pct * 100);
    const tagline =
      total > 0 && doneCount === total
        ? "🔥 100% done — flawless! Absolutely unstoppable! 🔥"
        : pct >= 0.8
          ? `⚡ ${pctNum}% done — so close to perfect, finish strong! 💪`
          : pct >= 0.5
            ? `💪 ${pctNum}% done — past halfway, keep the streak alive! 🔥`
            : doneCount > 0
              ? `🌱 ${pctNum}% done — every tick counts, momentum is building! 🌟`
              : "☕ 0% done — blank slate, tomorrow we attack! ✨";

    const lines: string[] = [
      `${headerEmoji} Today's Habit Check-in — ${monthLabel} ${today.getDate()}, ${yearLabel}`,
      `${tagline}\n`,
      ...rows,
      `—`,
      `${doneCount}/${total} done today`,
      `Track your habits free at https://habitsgrid.pro`,
    ];

    await navigator.clipboard.writeText(lines.join("\n").trim());
    toast.success("Copied to clipboard!");
  };

  const allHabits = state.sections.flatMap((s) => s.habits);
  const doneToday = isCurrentMonth
    ? allHabits.filter((h) =>
      (state.completions[h.id] ?? []).includes(cellKey(month, today.getDate())),
    ).length
    : 0;

  const activeSection = activeId ? state.sections.find((s) => s.id === activeId) : null;
  const activeHabit = activeId
    ? state.sections.flatMap((s) => s.habits).find((h) => h.id === activeId) ?? null
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* SEO: crawlable H1 — app is client-rendered, so bots need static heading */}
      <h1 className="sr-only">
        HabitsGrid — Spreadsheet-Style Daily Habit Tracker
      </h1>
      {showOnboarding ? (
        <>
          <div className="flex flex-1 items-center justify-center">
            <OnboardingFlow onDemo={() => setDemoMode(true)} embedded />
          </div>
        </>
      ) : (
        <>
          <Navbar
            cursor={cursor}
            today={today}
            isCurrentMonth={isCurrentMonth}
            habitCount={allHabits.length}
            doneToday={doneToday}
            onShiftMonth={shiftMonth}
            onToday={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
          />
          <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {monthLabel} {yearLabel}
              </p>
              <div className="flex items-center gap-1">
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mr-1 sm:inline">
                  Share on socials →
                </span>
                <button
                  onClick={handleShare}
                  disabled={sharing || allHabits.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                >
                  {sharing ? (
                    <Download className="size-3 animate-pulse" />
                  ) : (
                    <Share2 className="size-3" />
                  )}
                  {sharing ? "Exporting..." : "Capture"}
                </button>
                <button
                  onClick={handleCopyText}
                  disabled={allHabits.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                >
                  <Clipboard className="size-3" />
                  Copy
                </button>
              </div>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(event: DragStartEvent) => setActiveId(event.active.id as string)}
              onDragCancel={() => setActiveId(null)}
              onDragEnd={handleDragEnd}
            >
              <div
                ref={gridRef}
                id="habit-grid"
                className="overflow-x-auto rounded-lg border border-grid-line bg-surface shadow-sm"
              >
                <table className="w-max table-fixed border-separate border-spacing-0 text-left">
                  <thead>
                    <tr className="border-b border-grid-line">
                      <th className="sticky left-0 z-20 w-[240px] min-w-[240px] bg-secondary pl-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Habit
                      </th>
                      {days.map((d) => {
                        const isToday = isCurrentMonth && d === today.getDate();
                        return (
                          <th
                            key={d}
                            className={`${isToday ? "w-[60px] min-w-[60px]" : "w-8 min-w-8"} border-l border-grid-line px-0 py-2 text-center font-mono text-[10px] font-medium ${isToday
                                ? "bg-accent text-accent-foreground border-l-accent border-r-accent"
                                : "text-muted-foreground"
                              }`}
                          >
                            <span className="block leading-tight">{d}</span>
                            <span className="block text-[9px] opacity-50">
                              {weekdayLabel(cursor.getFullYear(), cursor.getMonth(), d)}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <SortableContext
                      items={state.sections.map((s) => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {state.sections.map((section) => (
                        <SectionRows
                          key={section.id}
                          section={section}
                          days={days}
                          month={month}
                          today={today}
                          isCurrentMonth={isCurrentMonth}
                          completions={state.completions}
                          onToggle={toggle}
                          onRemove={removeHabit}
                          onRename={renameHabit}
                          onRecolor={recolorHabit}
                          onToggleSection={toggleSection}
                          onRenameSection={renameSection}
                          onRemoveSection={removeSection}
                          adding={adding === section.id}
                          draft={draft}
                          setDraft={setDraft}
                          onStartAdd={() => {
                            setAdding(section.id);
                            setDraft("");
                          }}
                          onCancelAdd={() => setAdding(null)}
                          onCommitAdd={() => addHabit(section.id)}
                        />
                      ))}
                    </SortableContext>
                    <AddGroupRow onAdd={addSection} />
                  </tbody>
                </table>
              </div>
              <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
                {activeSection ? (
                  <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium shadow-lg cursor-grabbing">
                    <GripVertical className="size-3.5 text-muted-foreground" />
                    <span className="font-mono uppercase tracking-[0.2em] text-muted-foreground">
                      {activeSection.name}
                    </span>
                  </div>
                ) : activeHabit ? (
                  <div className="max-w-[90vw] overflow-hidden rounded-md border border-border bg-surface shadow-xl cursor-grabbing">
                    <table className="w-max table-fixed border-separate border-spacing-0 text-left">
                      <tbody>
                        <tr>
                          <td className="w-[240px] min-w-[240px] bg-surface pl-4 py-1.5">
                            <div className="flex items-center gap-2">
                              <GripVertical className="size-3.5 text-muted-foreground" />
                              <span
                                className={`size-2 shrink-0 rounded-sm ${habitColorClass[activeHabit.color]}`}
                              />
                              <span className="truncate text-[13px]">{activeHabit.name}</span>
                            </div>
                          </td>
                          {days.map((d) => {
                            const filled = (state.completions[activeHabit.id] ?? []).includes(
                              cellKey(month, d),
                            );
                            const isToday = isCurrentMonth && d === today.getDate();
                            return (
                              <td
                                key={d}
                                className={`border-l p-0 ${isToday ? "border-l-accent" : "border-grid-line"}`}
                              >
                                <span
                                  className={`block h-7 ${isToday ? "w-[60px]" : "w-8"} ${filled
                                      ? habitColorClass[activeHabit.color]
                                      : isToday
                                        ? "bg-accent/50"
                                        : "bg-cell/40"
                                    }`}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {!isPro && (
              <Alert className="mt-4 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <AlertTitle>Demo Mode</AlertTitle>
                <AlertDescription>
                  Your data is stored locally and will be lost when you close the browser or upgrade
                  to a Pro account.
                </AlertDescription>
              </Alert>
            )}

            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {user
                ? isPro
                  ? "Drag to reorder · Click cells to tick · Synced to your account"
                  : "Drag to reorder · Click cells to tick · "
                : "Drag to reorder · Click cells to tick · Upgrade to Pro to sync"}
              {user && !isPro && (
                <button
                  onClick={() => setUpgradeOpen(true)}
                  className="ml-1 text-primary transition-colors hover:underline"
                >
                  Upgrade for $0.99/mo
                </button>
              )}
            </p>
          </div>
          <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
        </>
      )}
      <SeoFooter />
    </div>
  );
}

type SectionRowsProps = {
  section: Section;
  days: number[];
  month: string;
  today: Date;
  isCurrentMonth: boolean;
  completions: Completions;
  onToggle: (habitId: string, day: number) => void;
  onRemove: (sectionId: string, habitId: string) => void;
  onRename: (sectionId: string, habitId: string, name: string) => void;
  onRecolor: (sectionId: string, habitId: string, color: Habit["color"]) => void;
  onToggleSection: (sectionId: string) => void;
  onRenameSection: (sectionId: string, name: string) => void;
  onRemoveSection: (sectionId: string) => void;
  adding: boolean;
  draft: string;
  setDraft: (v: string) => void;
  onStartAdd: () => void;
  onCancelAdd: () => void;
  onCommitAdd: () => void;
};

function SectionRows({
  section,
  days,
  month,
  today,
  isCurrentMonth,
  completions,
  onToggle,
  onRemove,
  onRename,
  onRecolor,
  onToggleSection,
  onRenameSection,
  onRemoveSection,
  adding,
  draft,
  setDraft,
  onStartAdd,
  onCancelAdd,
  onCommitAdd,
}: SectionRowsProps) {
  const span = days.length + 1;
  const habitIds = section.habits.map((h) => h.id);

  const {
    attributes: sectionAttributes,
    listeners: sectionListeners,
    setNodeRef: setSectionNodeRef,
    transform: sectionTransform,
    transition: sectionTransition,
    isDragging: sectionDragging,
  } = useSortable({ id: section.id });

  const sectionStyle = {
    transform: CSS.Transform.toString(sectionTransform),
    transition: sectionTransition,
    opacity: sectionDragging ? 0.4 : undefined,
  };

  return (
    <>
      <tr
        ref={setSectionNodeRef}
        style={sectionStyle}
        className={`border-y border-grid-line bg-secondary group/section ${sectionDragging ? "relative z-50" : ""}`}
      >
        <td className="sticky left-0 z-10 w-[240px] min-w-[240px] bg-secondary pl-4 py-2">
          <div className="flex items-center gap-1">
            <button
              {...sectionAttributes}
              {...sectionListeners}
              className="shrink-0 touch-none rounded p-2 -m-1 select-none text-muted-foreground/50 hover:text-foreground active:cursor-grabbing sm:p-0.5 sm:m-0"
              aria-label={`Drag group ${section.name}`}
            >
              <GripVertical className="size-3.5" />
            </button>
            <button
              onClick={() => onToggleSection(section.id)}
              className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={section.collapsed ? `Expand ${section.name}` : `Collapse ${section.name}`}
            >
              {section.collapsed ? (
                <ChevronRight className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
            <InlineEdit
              value={section.name}
              onCommit={(v) => onRenameSection(section.id, v)}
              className="flex-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            />
            <span className="font-mono text-[10px] text-muted-foreground/60">
              {section.habits.length}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  aria-label={`Delete group ${section.name}`}
                  className="ml-1 rounded px-1 font-mono text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/section:opacity-100"
                >
                  ×
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" side="bottom" sideOffset={4} className="w-auto p-3">
                <p className="text-xs text-foreground">Delete group "{section.name}"?</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {section.habits.length} habit{section.habits.length !== 1 ? "s" : ""} will be
                  removed
                </p>
                <div className="mt-2 flex gap-1">
                  <button
                    onClick={() => onRemoveSection(section.id)}
                    className="rounded bg-destructive px-2 py-0.5 text-[11px] font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                  >
                    Delete
                  </button>
                  <PopoverClose asChild>
                    <button className="rounded px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-secondary">
                      Cancel
                    </button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </td>
        <td colSpan={span - 1} className="bg-secondary" />
      </tr>

      {!section.collapsed && (
        <SortableContext items={habitIds} strategy={verticalListSortingStrategy}>
          {section.habits.map((habit) => (
            <SortableHabitRow
              key={habit.id}
              habit={habit}
              sectionId={section.id}
              days={days}
              month={month}
              today={today}
              isCurrentMonth={isCurrentMonth}
              completions={completions}
              onToggle={onToggle}
              onRemove={onRemove}
              onRename={onRename}
              onRecolor={onRecolor}
            />
          ))}
        </SortableContext>
      )}

      {!section.collapsed && (
        <tr className="add-habit-row border-b border-grid-line">
          <td className="sticky left-0 z-10 w-[240px] min-w-[240px] bg-surface pl-4 py-1.5">
            {adding ? (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={onCommitAdd}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onCommitAdd();
                  if (e.key === "Escape") onCancelAdd();
                }}
                placeholder="Habit name…"
                className="bg-transparent border-none outline-none p-0 m-0 text-[13px] text-muted-foreground"
              />
            ) : (
              <button
                onClick={onStartAdd}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                + Add habit
              </button>
            )}
          </td>
          <td colSpan={days.length} className="bg-cell/30" />
        </tr>
      )}
    </>
  );
}

function AddGroupRow({ onAdd }: { onAdd: (name: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const commit = () => {
    onAdd(draft);
    setDraft("");
    setAdding(false);
  };

  return (
    <tr className="add-group-row border-t border-grid-line">
      <td className="sticky left-0 z-10 w-[240px] min-w-[240px] bg-surface pl-4 py-1.5">
        {adding ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft("");
                setAdding(false);
              }
            }}
            placeholder="Group name…"
            className="bg-transparent border-none outline-none p-0 m-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="rounded border border-dashed border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground"
          >
            + Add group
          </button>
        )}
      </td>
      <td colSpan={100} className="bg-cell/30" />
    </tr>
  );
}

type SortableHabitRowProps = {
  habit: Habit;
  sectionId: string;
  days: number[];
  month: string;
  today: Date;
  isCurrentMonth: boolean;
  completions: Completions;
  onToggle: (habitId: string, day: number) => void;
  onRemove: (sectionId: string, habitId: string) => void;
  onRename: (sectionId: string, habitId: string, name: string) => void;
  onRecolor: (sectionId: string, habitId: string, color: Habit["color"]) => void;
};

function SortableHabitRow({
  habit,
  sectionId,
  days,
  month,
  today,
  isCurrentMonth,
  completions,
  onToggle,
  onRemove,
  onRename,
  onRecolor,
}: SortableHabitRowProps) {
  const [openColor, setOpenColor] = useState(false);
  const [colorPos, setColorPos] = useState({ x: 0, y: 0 });
  const colorBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!openColor) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-color-picker]")) setOpenColor(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openColor]);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: habit.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  const done = completions[habit.id] ?? [];

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group border-b border-grid-line last:border-b-0 ${isDragging ? "relative z-50" : ""}`}
    >
      <td className="sticky left-0 z-10 w-[240px] min-w-[240px] bg-surface pl-4 py-1.5 group-hover:bg-secondary">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 touch-none rounded p-2 -m-1 select-none text-muted-foreground/50 hover:text-foreground active:cursor-grabbing sm:p-0.5 sm:m-0"
            aria-label={`Drag ${habit.name}`}
          >
            <GripVertical className="size-3.5" />
          </button>
          <div className="relative">
            <button
              ref={colorBtnRef}
              onClick={() => {
                if (!openColor && colorBtnRef.current) {
                  const r = colorBtnRef.current.getBoundingClientRect();
                  setColorPos({ x: r.left, y: r.bottom + 4 });
                }
                setOpenColor(!openColor);
              }}
              className={`size-2 shrink-0 rounded-sm ${habitColorClass[habit.color]} cursor-pointer ring-1 ring-transparent transition-shadow hover:ring-foreground/30`}
              aria-label={`Change color for ${habit.name}`}
            />
            {openColor &&
              createPortal(
                <div
                  data-color-picker
                  className="fixed z-[9999] flex gap-1 rounded-md border border-border bg-popover p-1.5 shadow-md"
                  style={{ left: colorPos.x, top: colorPos.y }}
                >
                  {([1, 2, 3, 4, 5, 6] as Habit["color"][]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onRecolor(sectionId, habit.id, c);
                        setOpenColor(false);
                      }}
                      className={`size-4 rounded-sm ${habitColorClass[c]} ${c === habit.color
                          ? "ring-2 ring-foreground ring-offset-1 ring-offset-popover"
                          : "hover:scale-125"
                        } transition-transform`}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>,
                document.body,
              )}
          </div>
          <InlineEdit
            value={habit.name}
            onCommit={(v) => onRename(sectionId, habit.id, v)}
            className="truncate text-[13px]"
          />
          <Popover>
            <PopoverTrigger asChild>
              <button
                aria-label={`Delete ${habit.name}`}
                className="ml-auto rounded px-1 font-mono text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                ×
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" side="right" sideOffset={8} className="w-auto p-3">
              <p className="text-xs text-foreground">Delete "{habit.name}"?</p>
              <div className="mt-2 flex gap-1">
                <button
                  onClick={() => onRemove(sectionId, habit.id)}
                  className="rounded bg-destructive px-2 py-0.5 text-[11px] font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                >
                  Delete
                </button>
                <PopoverClose asChild>
                  <button className="rounded px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-secondary">
                    Cancel
                  </button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </td>
      {days.map((d) => {
        const key = cellKey(month, d);
        const filled = done.includes(key);
        const isToday = isCurrentMonth && d === today.getDate();
        return (
          <td
            key={d}
            className={`border-l p-0 ${isToday ? "border-l-accent" : "border-grid-line"}`}
          >
            <button
              onClick={() => onToggle(habit.id, d)}
              aria-label={`${habit.name} day ${d}`}
              aria-pressed={filled}
              className={`block h-7 ${isToday ? "w-[60px]" : "w-8"} transition-colors ${filled
                  ? `${habitColorClass[habit.color]} hover:opacity-80`
                  : `${isToday ? "bg-accent/50" : "bg-cell/40"} hover:bg-accent`
                }`}
            />
          </td>
        );
      })}
    </tr>
  );
}
