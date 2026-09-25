import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description: "Dịch vụ gia công OMD và CMT tại Phú Thành Nam.",
};

export default async function ServicesPage() {
  const posts = await getPublishedPosts("SERVICE");

  return (
    <div className="bg-paper pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-brass uppercase">
          Dịch vụ
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          OMD & CMT
        </h1>
        <p className="mt-5 max-w-2xl text-ink/65">
          Hai mô hình gia công linh hoạt cho thương hiệu thời trang và đồng phục
          xuất khẩu.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {posts.map((s) => (
            <article
              key={s.slug}
              className="overflow-hidden border border-[var(--line)] bg-mist/30"
            >
              <div className="relative aspect-[16/10] bg-mist">
                <Image
                  src={s.thumbnail}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <p className="text-xs tracking-wider text-brass uppercase">
                  {s.category}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-ink">
                  {s.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  {s.summary}
                </p>
                <Link
                  href={`/dich-vu/${s.slug}`}
                  className="mt-8 inline-flex text-sm font-semibold text-accent hover:text-accent-hover"
                >
                  Xem chi tiết →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
