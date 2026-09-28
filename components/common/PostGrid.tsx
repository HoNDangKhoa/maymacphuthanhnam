"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PillLink } from "@/components/common/PillLink";
import { newsCategories } from "@/lib/data";
import { cn } from "@/lib/utils";

export type PostCard = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  thumbnail: string;
};

export function PostGrid({
  posts,
  basePath,
}: {
  posts: PostCard[];
  basePath: string;
}) {
  const [active, setActive] = useState("Tất cả");
  const filtered = useMemo(
    () =>
      active === "Tất cả"
        ? posts
        : posts.filter((p) => p.category === active),
    [active, posts],
  );

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2">
        {newsCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              active === cat
                ? "bg-ink text-paper"
                : "bg-mist text-ink/70 hover:bg-ink/10",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <article key={post.slug} className="group flex flex-col">
            <Link
              href={`${basePath}/${post.slug}`}
              className="relative aspect-video overflow-hidden rounded-2xl bg-mist"
            >
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            </Link>
            <div className="mt-4 flex items-center gap-3 text-xs text-ink/50">
              <span className="rounded-full bg-mist px-2.5 py-1 font-medium text-ink/70">
                {post.category}
              </span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("vi-VN")}
              </time>
            </div>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">
              <Link href={`${basePath}/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">
              {post.summary}
            </p>
            <PillLink
              href={`${basePath}/${post.slug}`}
              variant="dark"
              size="sm"
              className="mt-5 self-start"
            >
              Xem chi tiết
            </PillLink>
          </article>
        ))}
      </div>
    </>
  );
}
