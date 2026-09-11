import { useEffect, useState } from "react";

const KEY = "habitsgrid-simple-home";

export function useSimpleHome() {
  // Simple is the default: only an explicit "0" opts into full mode.
  const [simple, setSimple] = useState(true);

  useEffect(() => {
    try {
      setSimple(localStorage.getItem(KEY) !== "0");
    } catch {
      /* ignore */
    }
  }, []);

  const set = (v: boolean) => {
    setSimple(v);
    try {
      localStorage.setItem(KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  return [simple, set] as const;
}
