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
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronRight, ChevronDown, Share2, Download, Clipboard, Shuffle, Check } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Navbar } from "@/components/navbar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { useHideOnScrollDown } from "@/hooks/use-hide-on-scroll";
import { useAuth } from "@/lib/auth";
import { useHabits } from "@/lib/habits-store";
import {
  COPY_STATUS_STYLES,
  COPY_STYLE_KEY,
  buildShareText,
  randomCopyStyle,
} from "@/lib/share-text";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { SeoFooter } from "@/components/seo-footer";
import {
  cellKey,
  daysInMonth,
  habitColorClass,
  monthKey,
  weekdayLabel,
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
  const h = useHabits();
  const [adding, setAdding] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
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

  const month = monthKey(cursor);
  const dayCount = daysInMonth(cursor);
  const days = useMemo(() => Array.from({ length: dayCount }, (_, i) => i + 1), [dayCount]);
  const isCurrentMonth = month === monthKey(today);

  // Mobile checklist targets the selected day (defaults to today).
  // Tapping a ring in the 7-day strip switches the checklist to that day.
  const [dayOffset, setDayOffset] = useState(0);
  const hideBars = useHideOnScrollDown();
  const selectedDay = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - dayOffset);
    return d;
  }, [today, dayOffset]);
  const selectedKey = cellKey(monthKey(selectedDay), selectedDay.getDate());

  const toggle = useCallback(
    (habitId: string, day: number) => {
      h.toggleCell(habitId, cellKey(month, day));
    },
    [h, month],
  );

  const toggleSelected = useCallback(
    (habitId: string) => {
      h.toggleCell(habitId, selectedKey);
    },
    [h, selectedKey],
  );

  const commitDraftAdd = (sectionId: string) => {
    h.addHabit(sectionId, draft);
    setDraft("");
    setAdding(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const dragId = active.id as string;
    const overId = over.id as string;

    const activeIsSection = h.sections.some((s) => s.id === dragId);
    const overIsSection = h.sections.some((s) => s.id === overId);

    if (activeIsSection && overIsSection) {
      h.reorderSections(dragId, overId);
      return;
    }

    if (activeIsSection || overIsSection) return;

    const sourceSection = h.sections.find((s) => s.habits.some((hh) => hh.id === dragId));
    const destSection = h.sections.find((s) => s.habits.some((hh) => hh.id === overId));

    if (!sourceSection || !destSection) return;

    if (sourceSection.id === destSection.id) {
      h.reorderHabits(sourceSection.id, dragId, overId);
    } else {
      h.moveHabit(sourceSection.id, destSection.id, dragId, overId);
    }
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

  const handleCopyText = async (dayOffset: 0 | 1 = 0) => {
    // Random status-mark style per copy so shares feel fresh.
    // A saved picker choice overrides the shuffle.
    const styleIndex = copyStyle === "shuffle" ? randomCopyStyle() : copyStyle;
    await navigator.clipboard.writeText(
      buildShareText(h.sections, h.completions, today, dayOffset, styleIndex),
    );
    toast.success(dayOffset === 0 ? "Today copied to clipboard!" : "Yesterday copied to clipboard!");
  };

  const allHabits = h.sections.flatMap((s) => s.habits);
  const doneToday = isCurrentMonth
    ? allHabits.filter((habit) =>
        (h.completions[habit.id] ?? []).includes(cellKey(month, today.getDate())),
      ).length
    : 0;

  const activeSection = activeId ? h.sections.find((s) => s.id === activeId) : null;
  const activeHabit = activeId
    ? h.sections.flatMap((s) => s.habits).find((h) => h.id === activeId) ?? null
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground max-md:portrait:pb-32">
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
            onToday={() => {
              setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
              setDayOffset(0);
            }}
          />
          <MobileTabBar />
          <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8 max-md:portrait:py-0">
            <div className="mb-4 flex items-center justify-between max-md:portrait:hidden">
              <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground landscape:block md:block">
                {monthLabel} {yearLabel}
              </p>
              <div className="ml-auto flex items-center gap-1">
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mr-1 sm:inline">
                  Share on socials →
                </span>
                <button
                  onClick={handleShare}
                  disabled={sharing || allHabits.length === 0}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                >
                  {sharing ? (
                    <Download className="size-3 animate-pulse" />
                  ) : (
                    <Share2 className="size-3" />
                  )}
                  {sharing ? "Exporting..." : "Capture"}
                </button>
                <span className="inline-flex">
                  <button
                    onClick={() => void handleCopyText(0)}
                    disabled={allHabits.length === 0}
                    title={
                      copyStyle === "shuffle"
                        ? "Copy today's check-in (shuffles emoji style)"
                        : `Copy today's check-in (${COPY_STATUS_STYLES[copyStyle]?.[2] ?? "Classic"} style)`
                    }
                    className="inline-flex items-center gap-1 rounded-md rounded-r-none border border-border bg-surface px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                  >
                    <Clipboard className="size-3" />
                    Today
                  </button>
                  <button
                    onClick={() => void handleCopyText(1)}
                    disabled={allHabits.length === 0}
                    title="Copy yesterday's check-in"
                    className="inline-flex items-center rounded-md rounded-none -ml-px border border-border bg-surface px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                  >
                    Yesterday
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        aria-label="Choose copy text style"
                        disabled={allHabits.length === 0}
                        className="inline-flex items-center rounded-md rounded-l-none -ml-px border border-border bg-surface px-2 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                      >
                        <ChevronDown className="size-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        Copy style
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => setCopyStyle("shuffle")}
                        className="flex items-center gap-2 text-[13px]"
                      >
                        <Shuffle className="size-3.5 text-muted-foreground" />
                        <span>🔀 Shuffle</span>
                        {copyStyle === "shuffle" && <Check className="ml-auto size-3.5" />}
                      </DropdownMenuItem>
                      {COPY_STATUS_STYLES.map(([done, miss, label], i) => (
                        <DropdownMenuItem
                          key={label}
                          onSelect={() => setCopyStyle(i)}
                          className="flex items-center gap-2 text-[13px]"
                        >
                          <span>
                            {done} {miss}
                          </span>
                          <span>{label}</span>
                          {copyStyle === i && <Check className="ml-auto size-3.5" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              </div>
            </div>
            {/* Full month grid: tablets/desktops, plus phones in landscape */}
            <div className="hidden landscape:block md:block">
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
                      items={h.sections.map((s) => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {h.sections.map((section) => (
                        <SectionRows
                          key={section.id}
                          section={section}
                          days={days}
                          month={month}
                          today={today}
                          isCurrentMonth={isCurrentMonth}
                          completions={h.completions}
                          onToggle={toggle}
                          onRemove={h.removeHabit}
                          onRename={h.renameHabit}
                          onRecolor={h.recolorHabit}
                          onToggleSection={h.toggleSection}
                          onRenameSection={h.renameSection}
                          onRemoveSection={h.removeSection}
                          adding={adding === section.id}
                          draft={draft}
                          setDraft={setDraft}
                          onStartAdd={() => {
                            setAdding(section.id);
                            setDraft("");
                          }}
                          onCancelAdd={() => setAdding(null)}
                          onCommitAdd={() => commitDraftAdd(section.id)}
                        />
                      ))}
                    </SortableContext>
                    <AddGroupRow onAdd={h.addSection} />
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
                              <span className="break-words text-[13px] line-clamp-2">{activeHabit.name}</span>
                            </div>
                          </td>
                          {days.map((d) => {
                            const filled = (h.completions[activeHabit.id] ?? []).includes(
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
            </div>

            {/* Phone portrait only: today's checklist (no month grid) */}
            <div className="landscape:hidden md:hidden">
                <div className={`sticky top-0 z-10 -mx-4 mb-4 border-b border-foreground/10 bg-background/90 bg-gradient-to-b from-foreground/[0.06] to-transparent px-4 pb-2 pt-2 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform duration-300 ${hideBars ? "-translate-y-[110%]" : ""}`}>
                  <div className="mb-1.5 flex items-center justify-between px-1">
                    <p className="text-[15px] font-bold tracking-tight">
                      {selectedDay.toLocaleDateString("en-US", { month: "long" })}{" "}
                      <span className="font-normal text-muted-foreground">
                        {selectedDay.getFullYear()}
                      </span>
                    </p>
                    <p
                      className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${dayOffset === 0 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}
                    >
                      {dayOffset === 0
                        ? "Today"
                        : selectedDay.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                    </p>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 7 }, (_, i) => {
                      const d = new Date(today);
                      d.setDate(d.getDate() - (6 - i));
                      const key = cellKey(monthKey(d), d.getDate());
                      const done = allHabits.filter(
                        (habit) => (h.completions[habit.id] ?? []).includes(key),
                      ).length;
                      const total = allHabits.length;
                      const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                      const isTodayDot = i === 6;
                      const isSelected = dayOffset === 6 - i;
                      return (
                        <button
                          key={key}
                          onClick={() => setDayOffset(dayOffset === 6 - i ? 0 : 6 - i)}
                          aria-pressed={isSelected}
                          aria-label={`${d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}: ${done} of ${total} done`}
                          className={`flex flex-col items-center gap-0.5 rounded-2xl border py-1.5 transition-all active:scale-95 ${isTodayDot
                            ? "border-foreground bg-foreground text-background shadow-lg shadow-black/20"
                            : isSelected
                              ? "border-foreground/30 bg-foreground/[0.06] text-foreground"
                              : "border-foreground/10 bg-surface text-foreground"
                            }`}
                        >
                          <span
                            className={`font-mono text-[9px] font-medium uppercase tracking-wider ${isTodayDot ? "text-background/60" : "text-muted-foreground"}`}
                          >
                            {d.toLocaleDateString("en-US", { weekday: "narrow" })}
                          </span>
                          <span className="text-[14px] font-bold leading-none tabular-nums">
                            {d.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              {h.sections.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center">
                  <p className="text-sm font-medium">No habits yet</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Add a group below, then add your first habit to start today's checklist.
                  </p>
                </div>
              ) : (
                <>
                {allHabits.length === 0 && (
                  <p className="mb-3 text-center text-[13px] text-muted-foreground">
                    Tap + Add habit under a group to start your checklist.
                  </p>
                )}
                <div key={selectedKey} className="animate-day-switch flex flex-col gap-4">
                  {h.sections.map((section) => {
                    return (
                      <section
                        key={section.id}
                        className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
                      >
                        <header className="flex items-center gap-1 border-b border-grid-line bg-secondary px-3 py-2">
                          <button
                            onClick={() => h.toggleSection(section.id)}
                            className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={section.collapsed ? `Expand ${section.name}` : `Collapse ${section.name}`}
                          >
                            {section.collapsed ? (
                              <ChevronRight className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </button>
                          <h2 className="flex-1 truncate font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {section.name}
                          </h2>
                        </header>
                        {!section.collapsed && (
                          <ul className="divide-y divide-grid-line">
                            {section.habits.map((habit) => {
                              const done = (h.completions[habit.id] ?? []).includes(selectedKey);
                              return (
                                <li key={habit.id}>
                                  <button
                                    onClick={() => toggleSelected(habit.id)}
                                    aria-pressed={done}
                                    aria-label={`${habit.name} ${done ? "done" : "not done"} on ${selectedDay.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                                    className="flex min-h-[44px] w-full items-center gap-2.5 px-3 py-2 text-left transition-colors active:bg-secondary"
                                  >
                                    <span
                                      className={`flex size-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${done
                                        ? `${habitColorClass[habit.color]} border-transparent text-white`
                                        : "bg-background text-transparent"
                                        }`}
                                      style={done ? undefined : { borderColor: `var(--habit-${habit.color})` }}
                                    >
                                      <Check className="size-4" strokeWidth={3} />
                                    </span>
                                    <span
                                      className={`flex-1 text-[15px] ${done ? "text-muted-foreground line-through" : ""}`}
                                    >
                                      {habit.name}
                                    </span>
                                    <span
                                      className="flex shrink-0 items-center gap-1"
                                      aria-label="Last 5 days"
                                    >
                                      {Array.from({ length: 5 }, (_, i) => {
                                        const d = new Date(today);
                                        d.setDate(d.getDate() - (4 - i));
                                        const key = cellKey(monthKey(d), d.getDate());
                                        const hit = (h.completions[habit.id] ?? []).includes(
                                          key,
                                        );
                                        const isTodayDot = i === 4;
                                        return (
                                          <span
                                            key={key}
                                            title={d.toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                            })}
                                            className={`size-2 rounded-full ${hit
                                              ? habitColorClass[habit.color]
                                              : "bg-border"
                                              } ${isTodayDot ? "ring-1 ring-foreground/40 ring-offset-1 ring-offset-surface" : ""}`}
                                          />
                                        );
                                      })}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        {!section.collapsed && (
                          <div className="border-t border-grid-line px-3 py-2">
                            {adding === section.id ? (
                              <input
                                autoFocus
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onBlur={() => commitDraftAdd(section.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitDraftAdd(section.id);
                                  if (e.key === "Escape") {
                                    setAdding(null);
                                    setDraft("");
                                  }
                                }}
                                placeholder="Habit name…"
                                className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
                              />
                            ) : (
                              <button
                                onClick={() => {
                                  setAdding(section.id);
                                  setDraft("");
                                }}
                                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                              >
                                + Add habit
                              </button>
                            )}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
                </>
              )}

              <div className="mt-4">
                <MobileAddGroupRow onAdd={h.addSection} />
              </div>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Tap to tick · Rotate for grid
              </p>
            </div>

            {!isPro && (
              <Alert className="mt-4 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <AlertTitle>Demo Mode</AlertTitle>
                <AlertDescription>
                  Your data is stored locally and will be lost when you close the browser or upgrade
                  to a Pro account.
                </AlertDescription>
              </Alert>
            )}

            <p className="mt-4 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground landscape:block md:block">
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

function MobileAddGroupRow({ onAdd }: { onAdd: (name: string) => void }) {
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

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="w-full rounded-lg border border-dashed border-border bg-surface px-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground"
      >
        + Add group
      </button>
    );
  }

  return (
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
      className="w-full rounded-lg border border-border bg-surface px-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] outline-none placeholder:text-muted-foreground"
    />
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
            className="break-words text-[13px] line-clamp-2"
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
