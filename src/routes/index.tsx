import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
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
  const { user, loading: authLoading, signOut } = useAuth();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [state, setState] = useState<State>({ sections: [], completions: {} });
  const [adding, setAdding] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  const stateRef = useRef<State>({ sections: [], completions: {} });
  const cloudReadyRef = useRef<string | null>(null);
  const lastSyncErrorRef = useRef<string | null>(null);

  const authResolved = !authLoading;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Cloud-first lifecycle: fetch on login, clear on logout.
  useEffect(() => {
    if (!authResolved) return;

    if (!user) {
      setState({ sections: [], completions: {} });
      cloudReadyRef.current = null;
      localStorage.removeItem(STORAGE_KEY);
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
  }, [user, authResolved]);

  // Cache state to localStorage while signed in.
  useEffect(() => {
    if (!authResolved || !user) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, authResolved, user]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Debounced push of local changes to the cloud.
  useEffect(() => {
    const client = supabase;
    if (!client || !user || !authResolved) return;
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
  }, [state, user, authResolved]);

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

  const allHabits = state.sections.flatMap((s) => s.habits);
  const doneToday = isCurrentMonth
    ? allHabits.filter((h) =>
        (state.completions[h.id] ?? []).includes(cellKey(month, today.getDate())),
      ).length
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
          <div className="flex items-center gap-3">
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
            {user ? (
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5">
                <span
                  title={user.email}
                  className="max-w-[160px] truncate font-mono text-[11px] text-muted-foreground"
                >
                  {user.email}
                </span>
                <button
                  onClick={() => {
                    void signOut().then(() =>
                      toast.success("Signed out — your habits are safely in the cloud."),
                    );
                  }}
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                disabled={!isSupabaseConfigured}
                title={isSupabaseConfigured ? undefined : "Cloud sync is not configured"}
                className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sign in
              </button>
            )}
          </div>
        </header>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto rounded-lg border border-grid-line bg-surface shadow-sm">
            <table className="table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-grid-line">
                  <th className="sticky left-0 z-20 w-[240px] bg-secondary pl-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Habit
                  </th>
                  {days.map((d) => {
                    const isToday = isCurrentMonth && d === today.getDate();
                    return (
                      <th
                        key={d}
                        className={`${isToday ? "w-[60px]" : "w-6"} border-l border-grid-line px-0 py-2 text-center font-mono text-[10px] font-medium ${
                          isToday
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
        </DndContext>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {user
            ? "Drag to reorder · Click cells to tick · Synced to your account"
            : "Drag to reorder · Click cells to tick · Sign in to sync"}
        </p>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
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
        <td className="sticky left-0 z-10 w-[240px] bg-secondary pl-4 py-2">
          <div className="flex items-center gap-1">
            <button
              {...sectionAttributes}
              {...sectionListeners}
              className="shrink-0 rounded p-0.5 text-muted-foreground/50 hover:text-foreground active:cursor-grabbing"
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
        <tr className="border-b border-grid-line">
          <td className="sticky left-0 z-10 bg-surface pl-4 py-1.5">
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
    <tr className="border-t border-grid-line">
      <td className="sticky left-0 z-10 w-[240px] bg-surface pl-4 py-1.5">
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
      <td className="sticky left-0 z-10 bg-surface pl-4 py-1.5 group-hover:bg-secondary">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 rounded p-0.5 text-muted-foreground/50 hover:text-foreground active:cursor-grabbing"
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
                      className={`size-4 rounded-sm ${habitColorClass[c]} ${
                        c === habit.color
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
              className={`block h-7 ${isToday ? "w-[60px]" : "w-8"} transition-colors ${
                filled
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
