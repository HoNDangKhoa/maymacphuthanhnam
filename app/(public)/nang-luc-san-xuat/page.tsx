import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries";
import { PageArticleView } from "@/components/common/PageArticleView";

export const metadata: Metadata = {
  title: "Năng lực sản xuất",
  description:
    "Dây chuyền, máy móc, phòng mẫu và hệ thống kiểm định chất lượng tại Phú Thành Nam.",
};

export const dynamic = "force-dynamic";

export default async function CapabilityPage() {
  const settings = await getSiteSettings();
  return (
    <PageArticleView
      article={settings.capabilityArticle}
      eyebrow="Năng lực sản xuất"
      fallbackTitle="Công nghệ dây chuyền & hệ thống chất lượng"
      intro="Khám phá máy móc, phòng mẫu, KCS và năng lực đáp ứng đơn hàng xuất khẩu."
    />
  );
}
