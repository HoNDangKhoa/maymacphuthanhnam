"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Step = {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
};

export function StickyWorkflow({
  steps,
  eyebrow = "Quy trình làm việc",
  title = "Từ tiếp nhận đến xuất xưởng",
  description = "Cuộn để xem từng công đoạn — sticky stacking theo chuẩn vận hành PTN.",
}: {
  steps: Step[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const workflowSteps = steps;

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll("[data-step]");
    if (!cards?.length) return;

    const observers: IntersectionObserver[] = [];
    cards.forEach((card, index) => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(index);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      io.observe(card);
      observers.push(io);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section ref={containerRef} className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12 md:gap-16 md:px-8 md:py-28">
        <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
          <p className="text-xs font-semibold tracking-[0.22em] text-brass-bright uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/60 md:text-base">
            {description}
          </p>
          <ol className="mt-10 space-y-3">
            {workflowSteps.map((step, i) => (
              <li
                key={step.stepNumber}
                className={cn(
                  "flex items-center gap-4 font-display text-2xl font-semibold transition md:text-3xl",
                  active === i ? "text-brass-bright" : "text-paper/25",
                )}
              >
                <span className="tabular-nums">{step.stepNumber}</span>
                <span className="text-base md:text-lg">{step.title}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6 md:col-span-7 md:space-y-8">
          {workflowSteps.map((step, i) => (
            <article
              key={step.stepNumber}
              data-step={step.stepNumber}
              className={cn(
                "sticky overflow-hidden rounded-2xl border border-paper/10 bg-ink-soft shadow-[0_-12px_40px_rgba(0,0,0,0.35)] transition",
                "top-24",
              )}
              style={{ zIndex: i + 1 }}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={step.imageUrl}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              </div>
              <div className="p-6 md:p-8">
                <p className="text-xs tracking-[0.2em] text-brass-bright uppercase">
                  Bước {step.stepNumber} · {step.subtitle}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/65 md:text-base">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
