import type { Metadata } from "next";
import { PostGrid } from "@/components/common/PostGrid";
import { getPublishedPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Năng lực sản xuất",
  description:
    "Dây chuyền, máy móc, phòng mẫu và hệ thống kiểm định chất lượng tại Phú Thành Nam.",
};

export const dynamic = "force-dynamic";

export default async function CapabilityPage() {
  const posts = await getPublishedPosts("CAPABILITY");

  return (
    <div className="bg-paper pt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-brass uppercase">
          Năng lực sản xuất
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Công nghệ dây chuyền & hệ thống chất lượng
        </h1>
        <p className="mt-5 max-w-2xl text-base text-ink/65 md:text-lg">
          Khám phá máy móc, phòng mẫu, KCS và năng lực đáp ứng đơn hàng xuất khẩu.
        </p>
        <PostGrid posts={posts} basePath="/nang-luc-san-xuat" />
      </div>
    </div>
  );
}
