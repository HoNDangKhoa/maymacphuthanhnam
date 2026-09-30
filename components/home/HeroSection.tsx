"use client";

import { useEffect, useRef, useState } from "react";
import { PillLink } from "@/components/common/PillLink";
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

const isVideo = (url: string) => /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1800&q=80";

export function HeroSection({
  slides = [],
  videoUrl = "",
  content,
}: {
  slides?: HeroSlide[];
  videoUrl?: string;
  content: HeroContent;
}) {
  const images = videoUrl
    ? [{ id: "video", title: "", link: "", imageUrl: videoUrl }]
    : slides.length > 0
      ? slides
      : [{ id: "fallback", title: "", link: "", imageUrl: FALLBACK_IMAGE }];
  const [index, setIndex] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [images.length, index]);

  const active = images[index] ?? images[0];
  const ctaHref = active.link || content.ctaHref;

  return (
    <section
      className="relative min-h-[92svh] overflow-hidden bg-ink md:min-h-[100svh]"
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start || images.length < 2) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
        setIndex((i) => (i + (dx < 0 ? 1 : -1) + images.length) % images.length);
      }}
    >
      {images.map((slide, i) =>
        isVideo(slide.imageUrl) ? (
          <video
            key={slide.id}
            src={slide.imageUrl}
            autoPlay
            muted
            loop
            playsInline
            poster={videoUrl ? slides[0]?.imageUrl : undefined}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
              i === index ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          />
        ) : (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
              i === index ? "opacity-100" : "opacity-0",
            )}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
            aria-hidden={i !== index}
          />
        ),
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />

      <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-center px-5 py-28 md:min-h-[100svh] md:px-8">
        <h1 className="animate-fade-up max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-tight text-paper sm:text-5xl md:text-6xl lg:text-7xl">
          {content.heading}
        </h1>
        <p className="animate-fade-up-delay mt-5 font-display text-xl font-semibold tracking-wide text-paper md:text-2xl lg:text-3xl">
          {content.subheading}
        </p>
        <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
          {content.description}
        </p>
        <div className="animate-fade-up-delay-2 mt-10">
          <PillLink href={ctaHref}>{content.ctaLabel}</PillLink>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute top-1/2 right-1 z-10 flex -translate-y-1/2 flex-col md:right-5">
          {images.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === index}
              className="group flex h-8 w-9 items-center justify-center"
              onClick={() => setIndex(i)}
            >
              <span
                className={cn(
                  "h-6 w-1.5 rounded-full transition",
                  i === index ? "bg-accent" : "bg-paper/35 group-hover:bg-paper/60",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
