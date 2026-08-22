import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cellKey,
  daysInMonth,
  defaultSections,
  habitColorClass,
  habitTextClass,
  makeHabit,
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
      { title: "Habit Grid — Track Daily Habits Row by Row" },
      {
        name: "description",
        content:
          "A spreadsheet-style habit tracker: every habit is a row, every day a column. Tick cells, watch streak counts and monthly goal progress fill in.",
      },
      { property: "og:title", content: "Habit Grid — Track Daily Habits Row by Row" },
      {
        property: "og:description",
        content:
          "A spreadsheet-style habit tracker: every habit is a row, every day a column. Tick cells and watch your month fill in.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type State = { sections: Section[]; completions: Completions };

function Index() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [state, setState] = useState<State>({ sections: [], completions: {} });
  const [loaded, setLoaded] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        setState({ sections: parsed.sections ?? [], completions: parsed.completions ?? {} });
      } else {
        setState({ sections: defaultSections(), completions: {} });
      }
    } catch {
      setState({ sections: defaultSections(), completions: {} });
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

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

  const monthCount = (habit: Habit) =>
    (state.completions[habit.id] ?? []).filter((k) => k.startsWith(month)).length;

  const totalCount = (habit: Habit) => (state.completions[habit.id] ?? []).length;

  const addHabit = (sectionId: string) => {
    const name = draft.trim();
    if (!name) return;
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, habits: [...s.habits, makeHabit(name, null, ((s.habits.length % 6) + 1) as Habit["color"])] }
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

  const shiftMonth = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  const allHabits = state.sections.flatMap((s) => s.habits);
  const doneToday = isCurrentMonth
    ? allHabits.filter((h) => (state.completions[h.id] ?? []).includes(cellKey(month, today.getDate()))).length
    : 0;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Habit Grid
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {cursor.toLocaleString("en-US", { month: "long" })} {cursor.getFullYear()}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isCurrentMonth
                ? `${doneToday} of ${allHabits.length} habits ticked today`
                : `${allHabits.length} habits tracked`}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
            <button
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="rounded px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              ‹
            </button>
            <button
              onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="rounded px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Today
            </button>
            <button
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="rounded px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              ›
            </button>
          </div>
        </header>

        <div className="overflow-x-auto rounded-lg border border-grid-line bg-surface shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-grid-line">
                <th className="sticky left-0 z-20 min-w-[240px] bg-secondary px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Habit
                </th>
                <th className="w-14 bg-accent px-2 py-2 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
                  Goal
                </th>
                <th className="w-14 bg-accent px-2 py-2 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
                  Count
                </th>
                <th className="w-24 bg-accent px-2 py-2 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
                  Progress
                </th>
                {days.map((d) => {
                  const isToday = isCurrentMonth && d === today.getDate();
                  return (
                    <th
                      key={d}
                      className={`w-7 border-l border-grid-line px-0 py-2 text-center font-mono text-[10px] font-medium ${
                        isToday ? "bg-accent text-accent-foreground" : "text-muted-foreground"
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
              {state.sections.map((section) => (
                <SectionRows
                  key={section.id}
                  section={section}
                  days={days}
                  month={month}
                  today={today}
                  isCurrentMonth={isCurrentMonth}
                  completions={state.completions}
                  monthCount={monthCount}
                  totalCount={totalCount}
                  onToggle={toggle}
                  onRemove={removeHabit}
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
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Click any cell to tick a day · saved on this device
        </p>
      </div>
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
  monthCount: (h: Habit) => number;
  totalCount: (h: Habit) => number;
  onToggle: (habitId: string, day: number) => void;
  onRemove: (sectionId: string, habitId: string) => void;
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
  monthCount,
  totalCount,
  onToggle,
  onRemove,
  adding,
  draft,
  setDraft,
  onStartAdd,
  onCancelAdd,
  onCommitAdd,
}: SectionRowsProps) {
  const span = days.length + 4;

  return (
    <>
      <tr className="border-y border-grid-line bg-secondary">
        <td colSpan={span} className="px-4 py-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {section.name}
          </span>
        </td>
      </tr>

      {section.habits.map((habit) => {
        const done = completions[habit.id] ?? [];
        const count = monthCount(habit);
        const total = totalCount(habit);
        const pct = habit.goal ? Math.min(100, Math.round((total / habit.goal) * 100)) : null;

        return (
          <tr key={habit.id} className="group border-b border-grid-line last:border-b-0">
            <td className="sticky left-0 z-10 bg-surface px-4 py-1.5 group-hover:bg-secondary">
              <div className="flex items-center gap-2">
                <span className={`size-2 shrink-0 rounded-sm ${habitColorClass[habit.color]}`} />
                <span className="truncate text-[13px]">{habit.name}</span>
                <button
                  onClick={() => onRemove(section.id, habit.id)}
                  aria-label={`Delete ${habit.name}`}
                  className="ml-auto rounded px-1 font-mono text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            </td>
            <td className="border-l border-grid-line px-2 py-1.5 text-center font-mono text-[11px] text-muted-foreground">
              {habit.goal ?? "—"}
            </td>
            <td
              className={`border-l border-grid-line px-2 py-1.5 text-center font-mono text-[11px] font-medium ${habitTextClass[habit.color]}`}
            >
              {count}
            </td>
            <td className="border-l border-grid-line px-2 py-1.5">
              {pct === null ? (
                <span className="block text-center font-mono text-[11px] text-muted-foreground">—</span>
              ) : (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-cell">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${habitColorClass[habit.color]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </td>
            {days.map((d) => {
              const key = cellKey(month, d);
              const filled = done.includes(key);
              const isToday = isCurrentMonth && d === today.getDate();
              return (
                <td key={d} className="border-l border-grid-line p-0">
                  <button
                    onClick={() => onToggle(habit.id, d)}
                    aria-label={`${habit.name} day ${d}`}
                    aria-pressed={filled}
                    className={`block h-7 w-full transition-colors ${
                      filled
                        ? `${habitColorClass[habit.color]} hover:opacity-80`
                        : `${isToday ? "bg-accent/60" : "bg-cell/40"} hover:bg-accent`
                    }`}
                  />
                </td>
              );
            })}
          </tr>
        );
      })}

      <tr className="border-b border-grid-line">
        <td className="sticky left-0 z-10 bg-surface px-4 py-1.5">
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
              className="w-full rounded border border-input bg-background px-2 py-1 text-[13px] outline-none focus:border-ring"
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
        <td colSpan={days.length + 3} className="bg-cell/30" />
      </tr>
    </>
  );
}
