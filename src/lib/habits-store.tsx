import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  STORAGE_KEY,
  makeHabit,
  makeSection,
  type Completions,
  type Habit,
  type Section,
} from "@/lib/habits";

export type HabitsState = { sections: Section[]; completions: Completions };

type HabitsStoreValue = HabitsState & {
  toggleCell: (habitId: string, key: string) => void;
  addHabit: (sectionId: string, name: string) => void;
  removeHabit: (sectionId: string, habitId: string) => void;
  renameHabit: (sectionId: string, habitId: string, name: string) => void;
  recolorHabit: (sectionId: string, habitId: string, color: Habit["color"]) => void;
  addSection: (name: string) => void;
  removeSection: (sectionId: string) => void;
  renameSection: (sectionId: string, name: string) => void;
  toggleSection: (sectionId: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  reorderHabits: (sectionId: string, activeId: string, overId: string) => void;
  moveHabit: (sourceId: string, destId: string, activeId: string, overId: string) => void;
};

const HabitsContext = createContext<HabitsStoreValue | null>(null);

function loadLocal(): HabitsState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as HabitsState;
      if (parsed.sections?.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function HabitsProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, isPro } = useAuth();
  const [state, setState] = useState<HabitsState>({ sections: [], completions: {} });
  const cloudReadyRef = useRef<string | null>(null);
  const lastSyncErrorRef = useRef<string | null>(null);

  const authResolved = !authLoading;

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
      const local = loadLocal();
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

        const remote = (data?.data ?? null) as Partial<HabitsState> | null;
        if (remote && Array.isArray(remote.sections)) {
          setState({ sections: remote.sections, completions: remote.completions ?? {} });
        } else {
          // First time on this device: seed cloud from localStorage if it has data.
          const local = loadLocal();
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

  const toggleCell = useCallback((habitId: string, key: string) => {
    setState((prev) => {
      const list = prev.completions[habitId] ?? [];
      const next = list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
      return { ...prev, completions: { ...prev.completions, [habitId]: next } };
    });
  }, []);

  const addHabit = useCallback((sectionId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              habits: [
                ...s.habits,
                makeHabit(trimmed, null, ((s.habits.length % 6) + 1) as Habit["color"]),
              ],
            }
          : s,
      ),
    }));
  }, []);

  const removeHabit = useCallback((sectionId: string, habitId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, habits: s.habits.filter((h) => h.id !== habitId) } : s,
      ),
    }));
  }, []);

  const renameHabit = useCallback((sectionId: string, habitId: string, name: string) => {
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
  }, []);

  const recolorHabit = useCallback(
    (sectionId: string, habitId: string, color: Habit["color"]) => {
      setState((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId
            ? { ...s, habits: s.habits.map((h) => (h.id === habitId ? { ...h, color } : h)) }
            : s,
        ),
      }));
    },
    [],
  );

  const addSection = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      sections: [...prev.sections, makeSection(trimmed)],
    }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  }, []);

  const renameSection = useCallback((sectionId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, name: trimmed } : s)),
    }));
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s,
      ),
    }));
  }, []);

  const reorderSections = useCallback((activeId: string, overId: string) => {
    setState((prev) => {
      const oldIndex = prev.sections.findIndex((s) => s.id === activeId);
      const newIndex = prev.sections.findIndex((s) => s.id === overId);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return { ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) };
    });
  }, []);

  const reorderHabits = useCallback((sectionId: string, activeId: string, overId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id !== sectionId) return s;
        const oldIndex = s.habits.findIndex((h) => h.id === activeId);
        const newIndex = s.habits.findIndex((h) => h.id === overId);
        if (oldIndex < 0 || newIndex < 0) return s;
        return { ...s, habits: arrayMove(s.habits, oldIndex, newIndex) };
      }),
    }));
  }, []);

  const moveHabit = useCallback(
    (sourceId: string, destId: string, activeId: string, overId: string) => {
      setState((prev) => {
        const source = prev.sections.find((s) => s.id === sourceId);
        const dest = prev.sections.find((s) => s.id === destId);
        if (!source || !dest) return prev;
        const activeHabit = source.habits.find((h) => h.id === activeId);
        if (!activeHabit) return prev;
        const overIndex = dest.habits.findIndex((h) => h.id === overId);
        return {
          ...prev,
          sections: prev.sections.map((s) => {
            if (s.id === sourceId) {
              return { ...s, habits: s.habits.filter((h) => h.id !== activeId) };
            }
            if (s.id === destId) {
              const newHabits = [...dest.habits];
              newHabits.splice(overIndex < 0 ? newHabits.length : overIndex, 0, activeHabit);
              return { ...s, habits: newHabits };
            }
            return s;
          }),
        };
      });
    },
    [],
  );

  const value = useMemo<HabitsStoreValue>(
    () => ({
      sections: state.sections,
      completions: state.completions,
      toggleCell,
      addHabit,
      removeHabit,
      renameHabit,
      recolorHabit,
      addSection,
      removeSection,
      renameSection,
      toggleSection,
      reorderSections,
      reorderHabits,
      moveHabit,
    }),
    [
      state,
      toggleCell,
      addHabit,
      removeHabit,
      renameHabit,
      recolorHabit,
      addSection,
      removeSection,
      renameSection,
      toggleSection,
      reorderSections,
      reorderHabits,
      moveHabit,
    ],
  );

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits(): HabitsStoreValue {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within a HabitsProvider");
  return ctx;
}
