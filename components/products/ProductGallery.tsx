"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function Watermark({ logoUrl }: { logoUrl?: string }) {
  if (logoUrl) {
    return (
      <span className="pointer-events-none absolute top-4 left-4 z-10 block h-12 w-28 md:top-6 md:left-6 md:h-16 md:w-36">
        <Image
          src={logoUrl}
          alt=""
          fill
          className="object-contain object-left-top"
          sizes="144px"
        />
      </span>
    );
  }
  return (
    <span className="pointer-events-none absolute top-4 left-4 z-10 flex flex-col leading-none md:top-6 md:left-6">
      <span className="font-display text-3xl font-bold tracking-tight text-[#e8c52a] [text-shadow:0_0_1px_#c8102e,0_0_1px_#c8102e] md:text-4xl">
        PTN
      </span>
      <span
        className="mt-0.5 text-base font-semibold text-accent italic md:text-lg"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        Apparel
      </span>
    </span>
  );
}

export function ProductGallery({
  images,
  name,
  logoUrl,
}: {
  images: string[];
  name: string;
  logoUrl?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) =>
      setOpen((i) =>
        i === null ? i : (i + delta + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Xem ảnh ${i + 1}`}
            className="group relative aspect-[4/5] max-h-[calc(100svh-7rem)] w-full overflow-hidden bg-white"
          >
            {i % 2 === 0 ? <Watermark logoUrl={logoUrl} /> : null}
            <Image
              src={src}
              alt={`${name} ${i + 1}`}
              fill
              className="object-contain transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width:640px) 100vw, 50vw"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-5"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-paper"
            aria-label="Đóng"
            onClick={() => setOpen(null)}
          >
            <X size={28} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Ảnh trước"
                className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper/20"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                aria-label="Ảnh tiếp"
                className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper/20"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <div
            className="relative h-[80svh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[open]!}
              alt={`${name} ${open + 1}`}
              fill
              className="object-contain"
              sizes="900px"
            />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-paper/70 tabular-nums">
            {open + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
