"use client";

import Image from "next/image";
import { useState } from "react";
import { productCategories, products } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ProductLookbook() {
  const [active, setActive] = useState("BLAZER");
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="bg-[#1a1a1a] py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-sm font-semibold text-accent">
          Sản phẩm của chúng tôi
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-tight">
          Các dòng sản phẩm đang gia công
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed font-semibold text-white/55 md:text-base">
          Sản phẩm chính của chúng tôi là áo blazer, áo jacket, áo khoác và quần
          dành cho các thương hiệu thời trang toàn cầu.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {productCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full bg-[#d9d9d9] px-6 py-2.5 text-xs font-semibold tracking-wide text-black uppercase transition hover:bg-[#e8e8e8]",
                active === cat && "ring-2 ring-white/40",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
          {products.map((item) => {
            const isHighlighted =
              hovered === item.id ||
              (hovered === null && item.category === active);

            return (
              <article
                key={item.id}
                className="group"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setActive(item.category)}
              >
                <div
                  className={cn(
                    "relative aspect-[3/4] overflow-hidden rounded-[18px] bg-[#111] transition duration-300",
                    isHighlighted && "ring-2 ring-[#5dade2]",
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />

                  <div
                    className={cn(
                      "absolute inset-x-0 bottom-6 flex justify-center px-6 transition duration-300",
                      isHighlighted
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0",
                    )}
                  >
                    <div className="rounded-md bg-white/55 px-8 py-3 backdrop-blur-md">
                      <p className="text-center text-sm font-semibold tracking-[0.12em] text-accent uppercase">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
