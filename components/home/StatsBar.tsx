"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  Handshake,
  Package,
  Users,
  type LucideIcon,
} from "lucide-react";
import { stats } from "@/lib/data";

const ICONS: LucideIcon[] = [Award, Package, Handshake, Users];

function formatStat(value: number) {
  return value.toLocaleString("vi-VN");
}

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setValue(target);
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
  caption,
  icon: Icon,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  caption: string;
  icon: LucideIcon;
  active: boolean;
}) {
  const count = useCountUp(value, active);

  return (
    <div className="flex flex-col items-center gap-3 px-2 text-center md:items-start md:px-4 md:text-left">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Icon size={20} strokeWidth={2.25} aria-hidden />
      </span>
      <div>
        <p className="font-display text-3xl font-bold tracking-tight text-paper md:text-4xl lg:text-[2.75rem]">
          {formatStat(count)}
          {suffix}
        </p>
        <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-paper uppercase md:text-sm">
          {label}
        </p>
        <p className="mt-1.5 max-w-[16rem] text-xs leading-relaxed text-paper/55 md:text-[13px]">
          {caption}
        </p>
      </div>
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
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative z-[1] -mt-px bg-[#222] py-10 md:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 md:grid-cols-4 md:gap-6 md:px-8">
        {stats.map((stat, i) => (
          <StatItem
            key={stat.label}
            {...stat}
            icon={ICONS[i % ICONS.length]!}
            active={active}
          />
        ))}
      </div>
    </section>
  );
}
