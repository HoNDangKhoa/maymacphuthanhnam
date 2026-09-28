import type { Metadata } from "next";
import { PostGrid } from "@/components/common/PostGrid";
import { getPublishedPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Tin tức",
  description:
    "Tin hoạt động, xu hướng ngành may mặc và thông tin xuất khẩu từ Phú Thành Nam.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await getPublishedPosts("NEWS");

  return (
    <div className="bg-paper pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-sm font-semibold text-brass">
          Tin tức
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Cập nhật từ xưởng & thị trường
        </h1>
        <p className="mt-5 max-w-2xl text-base text-ink/65 md:text-lg">
          Hoạt động nhà máy, xu hướng vải và nhịp sourcing xuất khẩu.
        </p>
        <PostGrid posts={posts} basePath="/tin-tuc" />
      </div>
    </div>
  );
}
