import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PillLink } from "@/components/common/PillLink";
import { notFound } from "next/navigation";
import { getPostBySlugFromDb, getPublishedPosts } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugFromDb(slug);
  if (!post) return { title: "Không tìm thấy" };
  return { title: post.title, description: post.summary };
}

export default async function CapabilityDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlugFromDb(slug);
  if (!post || post.type !== "CAPABILITY") notFound();

  const related = (await getPublishedPosts("CAPABILITY"))
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="bg-paper pt-32 md:pt-40 pb-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <Link
            href="/nang-luc-san-xuat"
            className="text-sm text-ink/50 hover:text-ink"
          >
            ← Năng lực sản xuất
          </Link>
          <p className="mt-6 text-sm text-brass">
            {post.category}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            {post.title}
          </h1>
          <time className="mt-4 block text-sm text-ink/50" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("vi-VN")}
          </time>
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl bg-mist">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="800px"
            />
          </div>
          <div
            className="prose-ptn mt-10"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        <aside className="space-y-8 lg:col-span-4">
          <div className="rounded-2xl border border-[var(--line)] bg-mist/40 p-6">
            <p className="font-display text-lg font-semibold text-ink">
              Cần tư vấn nhanh?
            </p>
            <p className="mt-2 text-sm text-ink/60">
              Đội ngũ kỹ thuật PTN sẵn sàng hỗ trợ techpack và báo giá.
            </p>
            <PillLink href="/lien-he" variant="dark" size="sm" className="mt-5">
              Liên hệ ngay
            </PillLink>
          </div>
          <div>
            <p className="text-sm font-semibold text-brass">
              Bài liên quan
            </p>
            <ul className="mt-4 space-y-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/nang-luc-san-xuat/${r.slug}`}
                    className="text-sm font-medium text-ink hover:text-brass"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
