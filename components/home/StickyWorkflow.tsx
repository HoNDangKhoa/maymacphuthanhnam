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
  description = "",
}: {
  steps: Step[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items?.length) return;

    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const passed = entry.boundingClientRect.top < 0;
          if (!entry.isIntersecting && !passed) return;
          const index = Number(entry.target.getAttribute("data-step"));
          setRevealed((prev) => {
            if (prev.has(index)) return prev;
            const next = new Set(prev);
            for (let i = 0; i <= index; i++) next.add(i);
            return next;
          });
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 },
    );

    const activeIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.getAttribute("data-step")));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    items.forEach((item) => {
      revealIo.observe(item);
      activeIo.observe(item);
    });

    return () => {
      revealIo.disconnect();
      activeIo.disconnect();
    };
  }, [steps.length]);

  if (!steps.length) return null;

  return (
    <section className="bg-[#1c1c1c] text-paper">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 md:grid-cols-12 md:gap-10 md:px-8 md:py-32">
        <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
          <p className="flex items-center gap-3 font-mono text-sm tracking-wide text-paper/80">
            <span className="h-3 w-3 rounded-[3px] bg-accent" aria-hidden />
            {eyebrow}
          </p>
          <h2 className="mt-6 max-w-md font-display text-4xl leading-[1.08] font-medium tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-6 max-w-sm text-base leading-relaxed text-paper/55">
              {description}
            </p>
          ) : null}
        </div>

        <ol ref={listRef} className="relative md:col-span-7">
          <span
            aria-hidden
            className="absolute top-7 bottom-7 left-7 border-l border-dashed border-paper/20"
          />
          {steps.map((step, i) => {
            const isRevealed = revealed.has(i);
            const isActive = active === i;
            return (
              <li
                key={`${step.stepNumber}-${i}`}
                data-step={i}
                className={cn(
                  "relative flex gap-6 md:gap-10",
                  i < steps.length - 1 && "pb-20 md:pb-32",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-[#1c1c1c] text-base tabular-nums transition-colors duration-500",
                    isActive
                      ? "border-accent bg-accent text-white"
                      : "border-paper/25 text-paper/80",
                  )}
                >
                  {step.stepNumber}
                </span>

                <article
                  className={cn(
                    "min-w-0 flex-1 transition duration-700 ease-out",
                    isRevealed
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0",
                  )}
                >
                  {step.imageUrl ? (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-paper/5">
                      <Image
                        src={step.imageUrl}
                        alt={step.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 45vw"
                      />
                    </div>
                  ) : null}
                  {step.subtitle ? (
                    <p className="mt-8 text-sm text-paper/45">{step.subtitle}</p>
                  ) : null}
                  <h3
                    className={cn(
                      "font-display text-2xl font-medium md:text-[1.75rem]",
                      step.subtitle ? "mt-2" : "mt-8",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-base leading-relaxed text-paper/60">
                    {step.description}
                  </p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
