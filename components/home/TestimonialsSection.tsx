"use client";

import { SectionEyebrow } from "@/components/common/SectionEyebrow";
import type { HomeTestimonialsContent } from "@/lib/home-content";
import { toRichHtml } from "@/lib/rich-text";

export function TestimonialsSection({
  content,
}: {
  content: HomeTestimonialsContent;
}) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionEyebrow>{content.eyebrow}</SectionEyebrow>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {content.heading}
        </h2>
        <p className="mt-3 max-w-xl text-sm text-ink/55 md:text-base">
          {content.tagline}
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {content.items.map((t) => (
            <blockquote
              key={t.id}
              tabIndex={0}
              className="group relative flex min-h-[300px] cursor-default flex-col rounded-lg bg-[#f4f1ec] p-7 text-ink outline-none transition duration-300 hover:bg-[#1a1a1a] hover:text-white focus-visible:bg-[#1a1a1a] focus-visible:text-white md:min-h-[340px] md:p-8"
            >
              <span
                className="mb-5 block text-4xl leading-none font-semibold text-accent"
                aria-hidden
              >
                “
              </span>

              <div
                className="flex-1 space-y-3 text-[15px] leading-relaxed text-ink/80 transition group-hover:text-white/90 group-focus-visible:text-white/90 md:text-base [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: toRichHtml(t.quote) }}
              />

              <footer className="mt-8 flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white transition group-hover:bg-accent group-focus-visible:bg-accent ${
                    t.avatarTone === "accent" ? "bg-accent" : "bg-[#2a2a2a]"
                  }`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink transition group-hover:text-white group-focus-visible:text-white">
                    {t.author}
                  </p>
                  <p className="text-xs text-ink/50 transition group-hover:text-white/55 group-focus-visible:text-white/55">
                    {t.role}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
