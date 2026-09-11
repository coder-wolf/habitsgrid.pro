import { useEffect, useState } from "react";

const KEY = "habitsgrid-simple-home";

export function useSimpleHome() {
  const [simple, setSimple] = useState(false);

  useEffect(() => {
    try {
      setSimple(localStorage.getItem(KEY) === "1");
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
