import { useEffect, useState } from "react";

/** True while the user is scrolling down (past a small offset), false otherwise. */
export function useHideOnScrollDown(threshold = 8, minY = 120) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - last;
        if (Math.abs(dy) > threshold) {
          setHidden(dy > 0 && y > minY);
          last = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, minY]);

  return hidden;
}
