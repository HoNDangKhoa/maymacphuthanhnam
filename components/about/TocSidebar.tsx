"use client";

import { useEffect, useState } from "react";
import { aboutSections } from "@/lib/data";
import { cn } from "@/lib/utils";

export function TocSidebar() {
  const [active, setActive] = useState(aboutSections[0].id);

  useEffect(() => {
    const els = aboutSections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="sticky top-28 space-y-1">
      <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brass uppercase">
        Mục lục
      </p>
      {aboutSections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            "block border-l-2 py-2 pl-4 text-sm transition",
            active === section.id
              ? "border-brass font-semibold text-ink"
              : "border-transparent text-ink/50 hover:text-ink",
          )}
        >
          {section.title}
        </a>
      ))}
    </nav>
  );
}
