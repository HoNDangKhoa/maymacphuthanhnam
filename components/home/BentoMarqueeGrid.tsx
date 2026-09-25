"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";

type GalleryItem = {
  id: string;
  title?: string;
  caption?: string;
  imageUrl: string;
};

export function BentoMarqueeGrid({ items }: { items: GalleryItem[] }) {
  const galleryItems = items;
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  if (!galleryItems.length) {
    return null;
  }

  const rowA = [...galleryItems, ...galleryItems];
  const rowB = [
    ...galleryItems.slice().reverse(),
    ...galleryItems.slice().reverse(),
  ];

  return (
    <section className="overflow-hidden bg-mist/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle
          eyebrow="Factory Gallery"
          title="Không gian xưởng & máy móc"
          description="Lưới ảnh bất đối xứng kết hợp marquee trôi — cảm nhận quy mô sản xuất Phú Thành Nam."
        />
      </div>

      <div className="mt-12 space-y-5">
        <div className="flex w-max gap-5 marquee-track">
          {rowA.map((item, i) => (
            <button
              key={`a-${item.id}-${i}`}
              type="button"
              onClick={() => setLightbox(item)}
              className="group relative h-56 w-80 shrink-0 overflow-hidden rounded-2xl md:h-64 md:w-96"
            >
              <Image
                src={item.imageUrl}
                alt={item.title ?? "Gallery"}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold text-paper">{item.title}</p>
                <p className="text-xs text-paper/70">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex w-max gap-5 marquee-track-reverse">
          {rowB.map((item, i) => (
            <button
              key={`b-${item.id}-${i}`}
              type="button"
              onClick={() => setLightbox(item)}
              className="group relative h-48 w-72 shrink-0 overflow-hidden rounded-2xl md:h-56 md:w-80"
            >
              <Image
                src={item.imageUrl}
                alt={item.title ?? "Gallery"}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition group-hover:opacity-100">
                <p className="text-sm font-semibold text-paper">{item.title}</p>
                <p className="text-xs text-paper/70">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Asymmetric bento */}
      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-2 gap-4 px-5 md:grid-cols-4 md:gap-5 md:px-8">
        {galleryItems.slice(0, 4).map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(item)}
            className={`group relative overflow-hidden rounded-2xl ${
              i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
            }`}
          >
            <Image
              src={item.imageUrl}
              alt={item.title ?? "Factory"}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          </button>
        ))}
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
            className="absolute top-5 right-5 text-paper"
            aria-label="Đóng"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <div
            className="relative aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-2xl"
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
