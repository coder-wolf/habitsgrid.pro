export type Habit = {
  id: string;
  name: string;
  goal: number | null;
  color: 1 | 2 | 3 | 4 | 5 | 6;
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

export const makeHabit = (name: string, goal: number | null, color: Habit["color"]): Habit => ({
  id: uid(),
  name,
  goal,
  color,
});

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

export const habitColorClass: Record<Habit["color"], string> = {
  1: "bg-habit-1",
  2: "bg-habit-2",
  3: "bg-habit-3",
  4: "bg-habit-4",
  5: "bg-habit-5",
  6: "bg-habit-6",
};

export const habitTextClass: Record<Habit["color"], string> = {
  1: "text-habit-1",
  2: "text-habit-2",
  3: "text-habit-3",
  4: "text-habit-4",
  5: "text-habit-5",
  6: "text-habit-6",
};

export const weekdayLabel = (year: number, monthIndex: number, day: number) =>
  ["S", "M", "T", "W", "T", "F", "S"][new Date(year, monthIndex, day).getDay()];
