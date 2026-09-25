"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/data";

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

function StatItem({
  value,
  suffix,
  label,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(value, active);
  const display =
    value >= 1000
      ? `${Math.floor(count / 1000)}.000${suffix}`
      : `${count}${suffix}`;

  return (
    <div className="text-center md:text-left">
      <p className="font-display text-3xl font-bold tracking-tight text-paper md:text-4xl lg:text-5xl">
        {display}
      </p>
      <p className="mt-2 text-sm text-paper/60">{label}</p>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-ink py-12 md:py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 md:grid-cols-4 md:px-8">
        {stats.map((stat) => (
          <StatItem key={stat.label} {...stat} active={active} />
        ))}
      </div>
    </section>
  );
}
