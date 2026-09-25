"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
};

export type HeroContent = {
  heading: string;
  subheading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1800&q=80";

export function HeroSection({
  slides = [],
  content,
}: {
  slides?: HeroSlide[];
  content: HeroContent;
}) {
  const images =
    slides.length > 0
      ? slides
      : [{ id: "fallback", title: "", link: "", imageUrl: FALLBACK_IMAGE }];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  const active = images[index] ?? images[0];
  const ctaHref = active.link || content.ctaHref;

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-ink md:min-h-[100svh]">
      {images.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
            i === index ? "opacity-100" : "opacity-0",
          )}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
          aria-hidden={i !== index}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />

      <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-center px-5 py-28 md:min-h-[100svh] md:px-8">
        <h1 className="animate-fade-up max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-tight text-paper uppercase sm:text-5xl md:text-6xl lg:text-7xl">
          {content.heading}
        </h1>
        <p className="animate-fade-up-delay mt-5 font-display text-xl font-semibold tracking-wide text-paper md:text-2xl lg:text-3xl">
          {content.subheading}
        </p>
        <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
          {content.description}
        </p>
        <div className="animate-fade-up-delay-2 mt-10">
          <Link
            href={ctaHref}
            className="inline-flex bg-accent px-7 py-3.5 text-sm font-semibold text-paper transition hover:bg-accent-hover"
          >
            {content.ctaLabel}
          </Link>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute top-1/2 right-4 z-10 flex -translate-y-1/2 flex-col gap-2 md:right-8">
          {images.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "h-6 w-1.5 rounded-full transition",
                i === index ? "bg-accent" : "bg-paper/35 hover:bg-paper/60",
              )}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
