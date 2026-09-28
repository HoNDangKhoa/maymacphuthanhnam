"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { HomeLookbookContent } from "@/lib/home-content";
import { cn } from "@/lib/utils";

const ALL = "__all__";

export function ProductLookbook({ content }: { content: HomeLookbookContent }) {
  const categories = content.categories;
  const products = content.products;
  const [active, setActive] = useState(ALL);

  if (!products.length) return null;

  const visible =
    active === ALL ? products : products.filter((p) => p.category === active);
  const chips = [{ key: ALL, label: "Tất cả" }].concat(
    categories.map((c) => ({ key: c, label: c })),
  );

  return (
    <section
      id="san-pham"
      className="scroll-mt-24 bg-[#1a1a1a] py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-sm font-semibold text-accent">{content.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-tight">
          {content.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
          {content.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3" role="tablist">
          {chips.map((chip) => {
            const selected = active === chip.key;
            const count =
              chip.key === ALL
                ? products.length
                : products.filter((p) => p.category === chip.key).length;
            return (
              <button
                key={chip.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(chip.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition duration-300",
                  selected
                    ? "bg-accent text-white"
                    : "bg-[#d9d9d9] text-black hover:bg-white",
                )}
              >
                {chip.label}
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    selected ? "text-white/70" : "text-black/45",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {visible.length ? (
          <div
            key={active}
            className="lookbook-fade mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6"
          >
            {visible.map((item) => (
              <Link
                key={item.id}
                href={`/san-pham/${encodeURIComponent(item.id)}`}
                className="group block scroll-mt-28"
              >
                <div className="relative aspect-[3/4] max-h-[calc(100svh-9rem)] w-full overflow-hidden rounded-[18px] bg-[#111] ring-[#5dade2] transition duration-500 group-hover:ring-2">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  ) : null}

                  <div className="absolute inset-x-0 bottom-6 flex justify-center px-6">
                    <div className="rounded-md bg-white/55 px-8 py-3 backdrop-blur-md transition duration-500 group-hover:bg-white/80">
                      <p className="text-center text-sm font-semibold text-accent">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-sm text-white/50">
            Chưa có sản phẩm trong danh mục này.
          </p>
        )}
      </div>
    </section>
  );
}
