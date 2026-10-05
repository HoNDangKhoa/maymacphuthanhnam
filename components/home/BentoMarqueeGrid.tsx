"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useOverlay } from "@/components/common/useOverlay";

type GalleryItem = {
  id: string;
  title?: string;
  caption?: string;
  imageUrl: string;
};

function MarqueeRow({
  items,
  direction,
  onOpen,
}: {
  items: GalleryItem[];
  direction: "ltr" | "rtl";
  onOpen: (item: GalleryItem) => void;
}) {
  const loop = [...items, ...items];
  const dims = "h-48 w-72 md:h-56 md:w-[22rem]";

  return (
    <div
      className={`flex w-max gap-4 ${
        direction === "ltr" ? "marquee-track" : "marquee-track-reverse"
      }`}
    >
      {loop.map((item, i) => (
        <button
          key={`${direction}-${item.id}-${i}`}
          type="button"
          onClick={() => onOpen(item)}
          className={`group relative shrink-0 overflow-hidden rounded-3xl ${dims}`}
        >
          <Image
            src={item.imageUrl}
            alt={item.title ?? "Gallery"}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="360px"
          />
          <div className="absolute inset-0 bg-ink/0 transition duration-300 group-hover:bg-ink/55" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 transition [@media(hover:hover)]:bg-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
            <p className="text-left text-sm font-semibold text-paper">
              {item.title}
            </p>
            <p className="text-left text-xs text-paper/70">{item.caption}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export function BentoMarqueeGrid({
  items,
  eyebrow = "Không gian sản xuất",
  title = "Không gian xưởng & máy móc",
  description = "Lưới ảnh bất đối xứng kết hợp marquee trôi — cảm nhận quy mô sản xuất Phú Thành Nam.",
}: {
  items: GalleryItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const galleryItems = items;
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  useOverlay(!!lightbox, () => setLightbox(null));

  if (!galleryItems.length) return null;

  const rowA = galleryItems;
  const rowB = galleryItems.slice().reverse();
  const rowC = [...galleryItems.slice(2), ...galleryItems.slice(0, 2)];

  return (
    <section className="overflow-hidden bg-[#141414] pt-20 pb-8 md:pt-28 md:pb-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          description={description}
          light
        />
      </div>

      <div className="marquee-pause-on-hover mt-12 space-y-4">
        <MarqueeRow items={rowA} direction="ltr" onOpen={setLightbox} />
        <MarqueeRow items={rowB} direction="rtl" onOpen={setLightbox} />
        <MarqueeRow items={rowC} direction="ltr" onOpen={setLightbox} />
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-5"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center text-paper"
            aria-label="Đóng"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <div
            className="relative aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.title ?? "Lightbox"}
              fill
              className="object-cover"
              sizes="900px"
            />
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-paper">
            <p className="font-display text-lg font-semibold">{lightbox.title}</p>
            <p className="text-sm text-paper/70">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
