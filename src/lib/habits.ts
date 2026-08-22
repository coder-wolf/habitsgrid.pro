export type Habit = {
  id: string;
  name: string;
  goal: number | null;
  color: string;
};

export type Section = {
  id: string;
  name: string;
  habits: Habit[];
  collapsed: boolean;
};

export type Completions = Record<string, string[]>;

export const STORAGE_KEY = "habit-tracker-v1";

const uid = () => Math.random().toString(36).slice(2, 9);

export const makeHabit = (name: string, goal: number | null, color: string): Habit => ({
  id: uid(),
  name,
  goal,
  color,
});

export const defaultSections = (): Section[] => [
  {
    id: uid(),
    name: "Work Habits",
    habits: [
      makeHabit("Deep work block", 300, "#3b82f6"),
      makeHabit("Web dev", null, "#f97316"),
      makeHabit("Startup work", 100, "#84cc16"),
      makeHabit("Read & research", 100, "#6b7280"),
    ],
    collapsed: false,
  },
  {
    id: uid(),
    name: "Personal Habits",
    habits: [
      makeHabit("Wake up early", null, "#22c55e"),
      makeHabit("Workout", 30, "#a855f7"),
      makeHabit("Jogging", 30, "#22c55e"),
      makeHabit("Write", 100, "#6b7280"),
    ],
    collapsed: false,
  },
];

export const makeSection = (name: string): Section => ({
  id: uid(),
  name,
  habits: [],
  collapsed: false,
});

export const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

export const cellKey = (month: string, day: number) => `${month}-${String(day).padStart(2, "0")}`;

export const weekdayLabel = (year: number, monthIndex: number, day: number) =>
  ["S", "M", "T", "W", "T", "F", "S"][new Date(year, monthIndex, day).getDay()];
