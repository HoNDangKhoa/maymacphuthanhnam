import { SeoPageForm } from "@/components/admin/SeoPageForm";
import { parseBannerData } from "@/lib/branding";
import { prisma } from "@/lib/prisma";

export default async function SeoServicePage() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "site_config" },
  });
  const banner = parseBannerData(settings?.bannerData);

  return (
    <SeoPageForm
      seoKey="service"
      title="Thông tin SEO page - Dịch vụ"
      hostHint="phuthanhnam.vn/dich-vu"
      initial={banner.pageSeo.service}
    />
  );
}
