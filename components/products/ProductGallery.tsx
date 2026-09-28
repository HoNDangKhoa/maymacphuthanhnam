"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Xem ảnh ${i + 1}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-mist"
          >
            <Image
              src={src}
              alt={`${name} ${i + 1}`}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width:768px) 50vw, 25vw"
            />
            <span className="absolute inset-0 bg-ink/0 transition duration-500 group-hover:bg-ink/20" />
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
            className="relative h-[80svh] w-full max-w-4xl overflow-hidden rounded-2xl"
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
