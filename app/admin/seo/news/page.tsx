import { SeoPageForm } from "@/components/admin/SeoPageForm";
import { parseBannerData } from "@/lib/branding";
import { prisma } from "@/lib/prisma";

export default async function SeoNewsPage() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "site_config" },
  });
  const banner = parseBannerData(settings?.bannerData);

  return (
    <SeoPageForm
      seoKey="news"
      title="Thông tin SEO page - Tin tức"
      hostHint="phuthanhnam.vn/tin-tuc"
      initial={banner.pageSeo.news}
    />
  );
}
