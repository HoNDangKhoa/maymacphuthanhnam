import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlugFromDb(slug);
  if (!post || post.type !== "NEWS") notFound();

  const related = (await getPublishedPosts("NEWS"))
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="bg-paper pt-28 pb-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <Link href="/tin-tuc" className="text-sm text-ink/50 hover:text-ink">
            ← Tin tức
          </Link>
          <p className="mt-6 text-xs tracking-wider text-brass uppercase">
            {post.category}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            {post.title}
          </h1>
          <time className="mt-4 block text-sm text-ink/50" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("vi-VN")}
          </time>
          <div className="relative mt-8 aspect-video overflow-hidden bg-mist">
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
          <div className="mt-10 flex flex-wrap gap-3 text-sm">
            <span className="text-ink/50">Chia sẻ:</span>
            <button type="button" className="font-medium text-ink">
              Facebook
            </button>
            <button type="button" className="font-medium text-ink">
              LinkedIn
            </button>
          </div>
        </article>

        <aside className="space-y-8 lg:col-span-4">
          <div className="border border-[var(--line)] bg-mist/40 p-6">
            <p className="font-display text-lg font-semibold text-ink">
              Gọi tư vấn nhanh
            </p>
            <p className="mt-2 text-sm text-ink/60">
              Hotline kinh doanh sẵn sàng hỗ trợ báo giá OEM/ODM & CMT.
            </p>
            <Link
              href="/lien-he"
              className="mt-5 inline-flex bg-brass px-4 py-2.5 text-sm font-semibold text-ink"
            >
              Liên hệ
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
              Bài mới nhất
            </p>
            <ul className="mt-4 space-y-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/tin-tuc/${r.slug}`}
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
