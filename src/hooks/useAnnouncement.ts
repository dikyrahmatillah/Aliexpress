import { useCallback, useEffect, useRef, useState } from "react";

export function useAnnouncement(announcements: string[], interval = 5000) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<number | null>(null);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? announcements.length - 1 : c - 1));
  }, [announcements.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === announcements.length - 1 ? 0 : c + 1));
  }, [announcements.length]);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setCurrent((c) => (c === announcements.length - 1 ? 0 : c + 1));
    }, interval);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [current, announcements.length, interval]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return { current, text: announcements[current], prev, next, setCurrent };
}
