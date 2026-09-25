import { SeoPageForm } from "@/components/admin/SeoPageForm";
import { parseBannerData } from "@/lib/branding";
import { prisma } from "@/lib/prisma";

export default async function SeoCapabilityPage() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "site_config" },
  });
  const banner = parseBannerData(settings?.bannerData);

  return (
    <SeoPageForm
      seoKey="capability"
      title="Thông tin SEO page - Năng lực sản xuất"
      hostHint="phuthanhnam.vn/nang-luc-san-xuat"
      initial={banner.pageSeo.capability}
    />
  );
}
