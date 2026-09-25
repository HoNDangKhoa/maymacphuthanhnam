"use client";

import { useState } from "react";
import { testimonials } from "@/lib/data";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#c5a04d] uppercase">
          Client Stories
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink uppercase md:text-4xl">
          Đánh giá từ khách hàng
        </h2>
        <p className="mt-3 max-w-xl text-sm font-semibold text-ink/55 md:text-base">
          Don&apos;t just take our word for it. Hear from the brands we&apos;ve
          helped grow.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {testimonials.map((t, index) => {
            const featured = index === 1;
            const selected = active === index;

            return (
              <blockquote
                key={t.author}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                tabIndex={0}
                className={cn(
                  "relative flex min-h-[300px] cursor-default flex-col rounded-lg p-7 outline-none transition md:min-h-[340px] md:p-8",
                  featured
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[#f4f1ec] text-ink",
                  selected && "ring-2 ring-[#5dade2]",
                )}
              >
                <span
                  className="mb-5 block text-4xl leading-none font-semibold text-accent"
                  aria-hidden
                >
                  “
                </span>

                <p
                  className={cn(
                    "flex-1 text-[15px] leading-relaxed font-semibold md:text-base",
                    featured ? "text-white/90" : "text-ink/80",
                  )}
                >
                  “{t.quote}”
                </p>

                <footer className="mt-8 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                      t.avatarTone === "accent" ? "bg-accent" : "bg-[#2a2a2a]",
                    )}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        featured ? "text-white" : "text-ink",
                      )}
                    >
                      {t.author}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-semibold",
                        featured ? "text-white/55" : "text-ink/50",
                      )}
                    >
                      {t.role}
                    </p>
                  </div>
                </footer>
              </blockquote>
            );
          })}
        </div>
      </div>
    </section>
  );
}
