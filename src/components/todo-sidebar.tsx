import { useState, useRef, useEffect } from "react";
import { ListTodo, X, Plus, Check } from "lucide-react";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "habitsgrid-todos";

function loadTodos(): Todo[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

type TodoSidebarProps = {
  open: boolean;
  onToggle: () => void;
};

export function TodoSidebar({ open, onToggle }: TodoSidebarProps) {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const addTodo = () => {
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
    setDraft("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 flex size-10 items-center justify-center rounded-full border border-border bg-surface shadow-md transition-colors hover:bg-secondary lg:bottom-auto lg:top-20 lg:right-6"
        aria-label={open ? "Close todo list" : "Open todo list"}
      >
        {open ? <X className="size-4" /> : <ListTodo className="size-4" />}
      </button>

      {/* Sidebar panel — desktop only */}
      {open && (
        <div className="hidden lg:flex fixed top-14 right-0 z-30 h-[calc(100vh-56px)] w-72 flex-col border-l border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
              Todo List
            </h3>
            <button
              onClick={onToggle}
              className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
              placeholder="Add a task…"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={addTodo}
              disabled={!draft.trim()}
              className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            {todos.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">
                No tasks yet
              </p>
            )}
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center gap-2 py-1.5"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    todo.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-transparent hover:border-muted-foreground"
                  }`}
                >
                  {todo.done && <Check className="size-3" />}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    todo.done ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
