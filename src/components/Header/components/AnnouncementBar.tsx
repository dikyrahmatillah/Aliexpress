"use client";
import { useState, useEffect } from "react";

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  const next = () =>
    setCurrent((next) => (next === announcements.length - 1 ? 0 : next + 1));

  if (announcements.length === 0) return null;

  return (
    <div className="bg-[var(--accent)] text-white py-3 text-sm flex items-center justify-center relative">
      <button
        className="absolute left-8 text-lg"
        onClick={prev}
        aria-label="Previous announcement"
      >
        &#60;
      </button>
      <p className="mx-12">{announcements[current]}</p>
      <button
        className="absolute right-8 text-lg"
        onClick={next}
        aria-label="Next announcement"
      >
        &#62;
      </button>
    </div>
  );
}
