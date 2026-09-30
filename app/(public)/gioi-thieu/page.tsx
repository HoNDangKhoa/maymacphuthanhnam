import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries";
import { PageArticleView } from "@/components/common/PageArticleView";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Về Phú Thành Nam",
    description: `Giới thiệu ${settings.fullName} — lịch sử, tầm nhìn, giá trị và chứng chỉ.`,
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <PageArticleView
      article={settings.aboutArticle}
      eyebrow="Về PTN"
      fallbackTitle="May Mặc Phú Thành Nam"
      intro={`${settings.slogan}. Doanh nghiệp gia công may mặc định hướng chuẩn quốc tế — chính xác trong form, quy mô trong sản xuất, chất lượng trong từng lô hàng.`}
    />
  );
}
